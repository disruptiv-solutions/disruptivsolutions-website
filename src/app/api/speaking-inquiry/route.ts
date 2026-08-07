import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Ian McDonald <ian@ianmcdonald.ai>';
const ALERT_TO = process.env.ALERT_EMAIL ?? 'ian@ianmcdonald.ai';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const ALLOWED_INTERESTS = [
  'speaking-event',
  'corporate-workshop',
  'live-build',
  'panel',
  'community-partnership',
  'community-activation',
  'podcast-interview',
  'general-chat',
  'other',
] as const;

type SpeakingInquiry = {
  name: string;
  email: string;
  interest: (typeof ALLOWED_INTERESTS)[number];
  note: string;
};

const INTEREST_LABELS: Record<SpeakingInquiry['interest'], string> = {
  'speaking-event': 'Keynote',
  'corporate-workshop': 'Workshop / training',
  'live-build': 'Live build session',
  panel: 'Panel or fireside chat',
  'community-partnership': 'Community partnership',
  'community-activation': 'Community activation partnership',
  'podcast-interview': 'Podcast interview',
  'general-chat': 'General conversation',
  other: 'Something else',
};

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function notificationEmail(inquiry: SpeakingInquiry): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;color:#16181d;line-height:1.6">
    <p style="margin:0 0 8px;color:#e10510;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase">New speaking inquiry</p>
    <h1 style="margin:0 0 22px;font-size:28px;line-height:1.15">${esc(inquiry.name)}</h1>
    <p style="margin:0 0 8px"><strong>Email:</strong> <a href="mailto:${esc(inquiry.email)}" style="color:#b4000a">${esc(inquiry.email)}</a></p>
    <p style="margin:0 0 18px"><strong>Interested in:</strong> ${esc(INTEREST_LABELS[inquiry.interest])}</p>
    <div style="padding:18px;border-left:3px solid #e10510;background:#f4efe6">
      <strong>Notes</strong><br>
      ${inquiry.note ? esc(inquiry.note).replace(/\n/g, '<br>') : '<span style="color:#6b7280">No additional notes.</span>'}
    </div>
    <p style="margin:18px 0 0;color:#6b7280;font-size:12px">Submitted through ianmcdonald.ai</p>
  </div>`;
}

function confirmationEmail(inquiry: SpeakingInquiry): string {
  return `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;color:#16181d;line-height:1.65">
    <p style="margin:0 0 16px">Hi ${esc(inquiry.name)},</p>
    <p style="margin:0 0 16px">Thanks for reaching out about ${esc(INTEREST_LABELS[inquiry.interest].toLowerCase())}. I have your inquiry and will review the details personally.</p>
    <p style="margin:0 0 22px">I’ll get back to you soon. If there is anything time-sensitive, reply directly to this email.</p>
    <p style="margin:0">Talk soon,<br><strong>Ian</strong></p>
    <p style="margin:16px 0 0;color:#6b7280;font-size:12px">Ian McDonald · Disruptiv Solutions</p>
  </div>`;
}

function validate(body: unknown): SpeakingInquiry | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const interest = typeof b.interest === 'string' ? b.interest.trim() : '';
  const note = typeof b.note === 'string' ? b.note.trim() : '';

  if (name.length < 1 || name.length > 200) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!(ALLOWED_INTERESTS as readonly string[]).includes(interest)) return null;
  if (note.length > 5000) return null;

  return {
    name,
    email,
    interest: interest as SpeakingInquiry['interest'],
    note,
  };
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const inquiry = validate(raw);

    if (!inquiry) {
      return NextResponse.json(
        { error: 'Please fill in your name, a valid email, and pick what you are interested in.' },
        { status: 400 },
      );
    }

    if (!resend) {
      console.error('[speaking-inquiry] RESEND_API_KEY not configured');
      return NextResponse.json(
        { error: 'Submission temporarily unavailable. Email ian@ianmcdonald.ai directly.' },
        { status: 503 },
      );
    }

    const safeName = inquiry.name.replace(/[\r\n]+/g, ' ').trim();
    const notification = await resend.emails.send({
      from: RESEND_FROM,
      to: ALERT_TO,
      replyTo: inquiry.email,
      subject: `New speaking inquiry: ${safeName} — ${INTEREST_LABELS[inquiry.interest]}`,
      html: notificationEmail(inquiry),
    });

    if (notification.error) {
      throw new Error(`Notification email failed: ${notification.error.message}`);
    }

    const confirmation = await resend.emails.send({
      from: RESEND_FROM,
      to: inquiry.email,
      replyTo: ALERT_TO,
      subject: `Got your inquiry, ${safeName}`,
      html: confirmationEmail(inquiry),
    });

    if (confirmation.error) {
      throw new Error(`Confirmation email failed: ${confirmation.error.message}`);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[speaking-inquiry] route error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Email ian@ianmcdonald.ai directly.' },
      { status: 500 },
    );
  }
}
