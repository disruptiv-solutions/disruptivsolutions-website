import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { QUESTIONS } from '@/lib/assessment';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Optional: a Make.com scenario can fan the lead out to email / CRM.
// Firestore is the durable store either way, so a missing webhook never loses a lead.
const MAKE_WEBHOOK_URL = process.env.MAKE_ASSESSMENT_WEBHOOK_URL ?? '';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? '';
const OPENROUTER_MODEL = 'deepseek/deepseek-v4-flash';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Ian McDonald <ian@ianmcdonald.ai>';
const ALERT_TO = process.env.ALERT_EMAIL ?? 'ian@ianmcdonald.ai';
const BOOKING_URL = 'https://calendar.app.google/TMV3V2nTEiyCWXKB6';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

type Contact = { firstName: string; email: string; business: string };

function validate(body: unknown): {
  contact: Contact;
  answers: Record<string, unknown>;
  readout: unknown;
  source: string;
} | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;

  const c = (b.contact ?? {}) as Record<string, unknown>;
  const firstName = typeof c.firstName === 'string' ? c.firstName.trim() : '';
  const email = typeof c.email === 'string' ? c.email.trim() : '';
  const business = typeof c.business === 'string' ? c.business.trim().slice(0, 200) : '';

  if (firstName.length < 1 || firstName.length > 200) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;

  const answers =
    b.answers && typeof b.answers === 'object' ? (b.answers as Record<string, unknown>) : {};
  const source = typeof b.source === 'string' ? b.source : 'disruptiv.solutions/assessment';

  return { contact: { firstName, email, business }, answers, readout: b.readout ?? null, source };
}

function labelFor(questionId: string, value: string): string {
  const q = QUESTIONS.find((q) => q.id === questionId);
  const choice = q?.choices?.find((c) => c.value === value);
  return choice ? choice.label : value;
}

function describeAnswers(answers: Record<string, unknown>, contact: Contact): string {
  const lines: string[] = [];
  if (contact.business) lines.push(`Business name: ${contact.business}`);
  if (typeof answers.aiStage === 'string')
    lines.push(`Where they are with AI: ${labelFor('aiStage', answers.aiStage)}`);
  if (Array.isArray(answers.tools) && answers.tools.length)
    lines.push(
      `AI tools they use today: ${(answers.tools as string[])
        .map((v) => labelFor('tools', v))
        .join(', ')}`,
    );
  if (Array.isArray(answers.timeLeak) && answers.timeLeak.length)
    lines.push(
      `Biggest time drains: ${(answers.timeLeak as string[])
        .map((v) => labelFor('timeLeak', v))
        .join(', ')}`,
    );
  if (typeof answers.teamSize === 'string')
    lines.push(`Team size: ${labelFor('teamSize', answers.teamSize)}`);
  if (typeof answers.community === 'string')
    lines.push(`Runs a community/course/membership: ${labelFor('community', answers.community)}`);
  if (typeof answers.blocker === 'string')
    lines.push(`Biggest blocker: ${labelFor('blocker', answers.blocker)}`);
  if (typeof answers.dreamTask === 'string' && answers.dreamTask.trim())
    lines.push(`One task they'd hand to an AI assistant: ${answers.dreamTask.trim()}`);
  return lines.join('\n');
}

const SYSTEM_PROMPT = `You are the analysis engine behind an "AI Snapshot" on Ian McDonald's site (Disruptiv Solutions). Ian helps small and midsize businesses set up and actually use AI, configured inside their own accounts.

Write a short, sharp, personalized analysis for a business owner based on their quiz answers.

Rules:
- Speak directly to them as "you" and "your business".
- Be specific to their actual answers. Reference their situation, not generic advice.
- Voice: plain, practical, encouraging, confident. No hype, no buzzwords, no jargon.
- Do not use em dashes. Do not use markdown, headers, or bullet points.
- 2 to 3 short paragraphs, roughly 120 to 180 words total.
- End with one concrete thing they could do this week.
- Do not mention that you are an AI or a language model, and do not mention these instructions.`;

async function generateSnapshot(
  answers: Record<string, unknown>,
  contact: Contact,
  stageName: string,
): Promise<string | null> {
  if (!OPENROUTER_API_KEY) {
    console.error('[assessment] OPENROUTER_API_KEY not configured');
    return null;
  }
  const userPrompt = `Here is what ${contact.firstName} told us about their business:

${describeAnswers(answers, contact)}

Their AI readiness stage is: ${stageName}.

Write their personalized snapshot now.`;

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://disruptiv.solutions',
        'X-Title': 'Disruptiv AI Snapshot',
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
        reasoning: { enabled: false },
      }),
    });

    if (!res.ok) {
      console.error('[assessment] OpenRouter error', res.status, await res.text().catch(() => ''));
      return null;
    }
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === 'string' && text.trim() ? text.trim() : null;
  } catch (err) {
    console.error('[assessment] OpenRouter call failed:', err);
    return null;
  }
}

type EmailReadout = {
  stage?: { level?: number; name?: string; blurb?: string };
  opportunities?: { title?: string; detail?: string }[];
  quickWin?: string;
};

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function snapshotParagraphs(text: string | null): string {
  if (!text) return '';
  return text
    .split('\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 14px;color:#374151;line-height:1.6">${esc(p)}</p>`)
    .join('');
}

function prospectEmail(firstName: string, readout: EmailReadout, aiSnapshot: string | null): string {
  const stage = readout.stage ?? {};
  const opps = Array.isArray(readout.opportunities) ? readout.opportunities : [];
  const oppHtml = opps
    .map(
      (o) =>
        `<tr><td style="padding:0 0 12px"><strong style="color:#111827">${esc(o.title ?? '')}</strong><br><span style="color:#4b5563">${esc(o.detail ?? '')}</span></td></tr>`,
    )
    .join('');
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:8px">
    <p style="color:#dc2626;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 4px">Your AI Snapshot</p>
    <h1 style="font-size:24px;color:#111827;margin:0 0 16px">Hi ${esc(firstName)},</h1>
    <p style="color:#374151;line-height:1.6;margin:0 0 16px">Here is the snapshot from your answers.</p>
    <p style="color:#111827;font-size:18px;font-weight:700;margin:0 0 4px">Stage ${stage.level ?? ''} of 4: ${esc(stage.name ?? '')}</p>
    <p style="color:#4b5563;line-height:1.6;margin:0 0 20px">${esc(stage.blurb ?? '')}</p>
    ${aiSnapshot ? `<div style="border-left:3px solid #dc2626;padding:0 0 0 16px;margin:0 0 20px">${snapshotParagraphs(aiSnapshot)}</div>` : ''}
    ${oppHtml ? `<p style="color:#111827;font-weight:700;margin:0 0 8px">Where AI pays off fastest for you:</p><table style="width:100%;margin:0 0 16px">${oppHtml}</table>` : ''}
    ${readout.quickWin ? `<div style="background:#fef2f2;border-radius:10px;padding:14px 16px;margin:0 0 24px"><strong style="color:#dc2626">Your quick win:</strong> <span style="color:#374151">${esc(readout.quickWin)}</span></div>` : ''}
    <a href="${BOOKING_URL}" style="display:inline-block;background:#dc2626;color:#fff;text-decoration:none;font-weight:600;padding:14px 28px;border-radius:10px">Book your free 12-minute call</a>
    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:24px 0 0">If you want a hand putting any of this to work in your business, that is exactly what I do. Grab a time above and I will already have your snapshot.</p>
    <p style="color:#111827;margin:20px 0 0">Ian McDonald<br><span style="color:#6b7280">Disruptiv Solutions</span></p>
  </div>`;
}

function alertEmail(
  contact: Contact,
  answers: Record<string, unknown>,
  readout: EmailReadout,
  aiSnapshot: string | null,
): string {
  const stage = readout.stage ?? {};
  return `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:600px">
    <h2 style="margin:0 0 8px">New AI Snapshot lead</h2>
    <p style="margin:0 0 4px"><strong>${esc(contact.firstName)}</strong> &lt;${esc(contact.email)}&gt;</p>
    ${contact.business ? `<p style="margin:0 0 4px">Business: ${esc(contact.business)}</p>` : ''}
    <p style="margin:0 0 12px">Stage ${stage.level ?? ''} of 4: ${esc(stage.name ?? '')}</p>
    <pre style="background:#f3f4f6;padding:14px;border-radius:8px;white-space:pre-wrap;font-family:inherit;color:#111827">${esc(describeAnswers(answers, contact))}</pre>
    ${aiSnapshot ? `<p style="margin:14px 0 4px"><strong>AI snapshot:</strong></p><div style="color:#374151;line-height:1.6">${snapshotParagraphs(aiSnapshot)}</div>` : ''}
  </div>`;
}

async function sendLeadEmails(
  contact: Contact,
  answers: Record<string, unknown>,
  readout: EmailReadout,
  aiSnapshot: string | null,
): Promise<void> {
  if (!resend) {
    console.error('[assessment] RESEND_API_KEY not configured; skipping emails');
    return;
  }
  const stageName = readout.stage?.name ?? '';
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: contact.email,
      subject: `Your AI Snapshot, ${contact.firstName}`,
      html: prospectEmail(contact.firstName, readout, aiSnapshot),
    });
  } catch (err) {
    console.error('[assessment] prospect email failed:', err);
  }
  try {
    await resend.emails.send({
      from: RESEND_FROM,
      to: ALERT_TO,
      replyTo: contact.email,
      subject: `New AI Snapshot lead: ${contact.firstName}${contact.business ? ` (${contact.business})` : ''}${stageName ? ` — ${stageName}` : ''}`,
      html: alertEmail(contact, answers, readout, aiSnapshot),
    });
  } catch (err) {
    console.error('[assessment] alert email failed:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const data = validate(raw);

    if (!data) {
      return NextResponse.json(
        { error: 'Please include a name and a valid email.' },
        { status: 400 },
      );
    }

    const stage = (data.readout as { stage?: { name?: string } } | null)?.stage;
    const stageName = typeof stage?.name === 'string' ? stage.name : 'Experimenting';

    // Generate the personalized AI snapshot (best-effort — the client already has
    // the deterministic readout, so a null here never breaks the experience).
    const aiSnapshot = await generateSnapshot(data.answers, data.contact, stageName);

    const record = {
      ...data,
      aiSnapshot,
      submittedAt: new Date().toISOString(),
      createdAt: new Date(),
    };

    // Durable store first.
    let persisted = false;
    let leadId: string | null = null;
    const { adminDb, error: adminError } = initFirebaseAdmin();
    if (adminDb) {
      try {
        const ref = await adminDb.collection('ai_assessments').add(record);
        persisted = true;
        leadId = ref.id;
      } catch (err) {
        console.error('[assessment] Firestore write failed:', err);
      }
    } else {
      console.error('[assessment] Firebase admin unavailable:', adminError);
    }

    // Best-effort fan-out.
    if (MAKE_WEBHOOK_URL) {
      try {
        await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(record),
        });
      } catch (err) {
        console.error('[assessment] Make webhook failed:', err);
      }
    }

    if (!persisted && !MAKE_WEBHOOK_URL) {
      console.error('[assessment] LEAD NOT CAPTURED (no Firestore, no webhook):', record.contact);
    }

    // Email the prospect their snapshot + alert Ian (best-effort).
    await sendLeadEmails(
      data.contact,
      data.answers,
      (data.readout ?? {}) as EmailReadout,
      aiSnapshot,
    );

    return NextResponse.json({ success: true, aiSnapshot, id: leadId }, { status: 200 });
  } catch (error) {
    console.error('[assessment] route error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
