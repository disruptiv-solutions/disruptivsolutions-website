import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Ian McDonald <ian@ianmcdonald.ai>';
const ALERT_TO = process.env.ALERT_EMAIL ?? 'ian@ianmcdonald.ai';
const BOOKING_URL = 'https://calendar.app.google/okpHPUV8TA85GBaA6';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const INTAKE_FIELDS: { key: string; label: string }[] = [
  { key: 'doing', label: 'What they do / who they serve' },
  { key: 'timeDrain', label: 'Biggest time-drain / what runs through them' },
  { key: 'target', label: 'Who or what they want to win in 90 days' },
  { key: 'tried', label: 'What they have tried / where it falls short' },
  { key: 'outcome', label: 'The one outcome that would make it worth it' },
  { key: 'tools', label: 'Tools they use / where their info lives' },
  { key: 'sensitive', label: 'Keep out of AI tools' },
];

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function validEmail(e: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

type Intake = {
  contact: { firstName: string; email: string; org: string };
  answers: Record<string, string>;
  source: string;
};

function validate(body: unknown): Intake | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const c = (b.contact ?? {}) as Record<string, unknown>;
  const firstName = typeof c.firstName === 'string' ? c.firstName.trim() : '';
  const email = typeof c.email === 'string' ? c.email.trim() : '';
  if (!firstName || firstName.length > 200 || !validEmail(email)) return null;

  const rawA = (b.answers ?? {}) as Record<string, unknown>;
  const answers: Record<string, string> = {};
  for (const { key } of INTAKE_FIELDS) {
    answers[key] = typeof rawA[key] === 'string' ? (rawA[key] as string).trim().slice(0, 4000) : '';
  }

  return {
    contact: {
      firstName,
      email,
      org: typeof c.org === 'string' ? c.org.trim().slice(0, 200) : '',
    },
    answers,
    source: typeof b.source === 'string' ? b.source.slice(0, 200) : 'ianmcdonald.ai/intake',
  };
}

function alertEmail(i: Intake): string {
  const rows = INTAKE_FIELDS.filter((f) => i.answers[f.key])
    .map(
      (f) =>
        `<p style="margin:0 0 10px"><strong>${f.label}:</strong><br>${esc(i.answers[f.key]).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:620px">
    <p style="color:#dc2626;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px">New intake</p>
    <h2 style="margin:0 0 12px">${esc(i.contact.firstName)}${i.contact.org ? ` — ${esc(i.contact.org)}` : ''}</h2>
    <p style="margin:0 0 12px"><strong>Email:</strong> ${esc(i.contact.email)}</p>
    ${rows || '<p style="color:#6b7280">(no answers filled in)</p>'}
    <p style="margin:14px 0 0;color:#6b7280">Source: ${esc(i.source)}</p>
  </div>`;
}

function confirmEmail(i: Intake): string {
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px">
    <p style="margin:0 0 14px">Hi ${esc(i.contact.firstName)},</p>
    <p style="margin:0 0 14px">Thanks, I have your answers. I will review them before we talk so our time together is all building, not catching up.</p>
    <p style="margin:0 0 20px">If you have not grabbed a time yet, you can here: <a href="${BOOKING_URL}" style="color:#dc2626">${BOOKING_URL}</a></p>
    <p style="margin:0">Talk soon,<br>Ian</p>
    <p style="margin:16px 0 0;color:#6b7280">Ian McDonald &middot; Disruptiv Solutions</p>
  </div>`;
}

export async function POST(request: NextRequest) {
  try {
    const data = validate(await request.json());
    if (!data) {
      return NextResponse.json(
        { error: 'Please include your name and a valid email.' },
        { status: 400 },
      );
    }

    const record = {
      ...data,
      submittedAtIso: new Date().toISOString(),
      submittedAt: new Date(),
      type: 'consulting_intake',
    };

    const { adminDb, error: adminError } = initFirebaseAdmin();
    if (adminDb) {
      try {
        await adminDb.collection('consulting_intake').add(record);
      } catch (err) {
        console.error('[intake] Firestore write failed:', err);
      }
    } else {
      console.error('[intake] Firebase admin unavailable:', adminError);
    }

    if (resend) {
      try {
        await resend.emails.send({
          from: RESEND_FROM,
          to: ALERT_TO,
          replyTo: data.contact.email,
          subject: `New intake: ${data.contact.firstName}${data.contact.org ? ` (${data.contact.org})` : ''}`,
          html: alertEmail(data),
        });
      } catch (err) {
        console.error('[intake] alert email failed:', err);
      }
      try {
        await resend.emails.send({
          from: RESEND_FROM,
          to: data.contact.email,
          replyTo: ALERT_TO,
          subject: `Got it, ${data.contact.firstName}`,
          html: confirmEmail(data),
        });
      } catch (err) {
        console.error('[intake] confirmation email failed:', err);
      }
    } else {
      console.error('[intake] RESEND_API_KEY not configured; skipping emails');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[intake] route error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
