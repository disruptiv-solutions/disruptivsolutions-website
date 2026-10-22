import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkBotId } from 'botid/server';
import { isAutomatedName } from '@/lib/inquiry-spam';

export const dynamic = 'force-dynamic';

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? '';
const RESEND_FROM = process.env.RESEND_FROM ?? 'Ian McDonald <ian@ianmcdonald.ai>';
const ALERT_TO = process.env.ALERT_EMAIL ?? 'ian@ianmcdonald.ai';
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const INTEREST_LABELS = {
  'ai-training': 'AI training',
  workflow: 'A workflow',
  automation: 'An automation',
  'social-media-content': 'Social media content',
} as const;

type ProjectInquiry = {
  name: string;
  email: string;
  interest: keyof typeof INTEREST_LABELS;
  note: string;
};

function validate(body: unknown): ProjectInquiry | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const b = body as Record<string, unknown>;
  if (typeof b.name !== 'string' || typeof b.email !== 'string' || typeof b.interest !== 'string') return null;
  if (b.note !== undefined && typeof b.note !== 'string') return null;

  const name = b.name.trim();
  const email = b.email.trim();
  const interest = b.interest.trim();
  const note = typeof b.note === 'string' ? b.note.trim() : '';

  if (!name || name.length > 200) return null;
  if (/[\r\n]/.test(b.email) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  if (!Object.prototype.hasOwnProperty.call(INTEREST_LABELS, interest)) return null;
  if (note.length > 5000) return null;

  return { name, email, interest: interest as ProjectInquiry['interest'], note };
}

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Please send this form from the Ian McDonald website.' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({ error: 'Please use the inquiry form.' }, { status: 415 });
  }

  try {
    const verification = await checkBotId({ advancedOptions: { checkLevel: 'basic' } });
    if (verification.isBot) {
      return NextResponse.json({ error: 'We couldn’t verify your browser. Refresh and try again, or email ian@ianmcdonald.ai.' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'We couldn’t verify your browser. Please try again, or email ian@ianmcdonald.ai.' }, { status: 503 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: 'Please use the inquiry form and try again.' }, { status: 400 });
  }

  const inquiry = validate(raw);
  if (!inquiry) {
    return NextResponse.json({ error: 'Please enter your name, a valid email, and what you would like help with. Keep your project details under 5,000 characters.' }, { status: 400 });
  }
  if (isAutomatedName(inquiry.name)) {
    return NextResponse.json({ error: 'Please enter your name with normal spacing and capitalization, or email ian@ianmcdonald.ai.' }, { status: 400 });
  }
  if (!resend) {
    console.error('[project-inquiry] RESEND_API_KEY not configured');
    return NextResponse.json({ error: 'Submission temporarily unavailable. Email ian@ianmcdonald.ai directly.' }, { status: 503 });
  }

  const interestLabel = INTEREST_LABELS[inquiry.interest];
  const safeName = inquiry.name.replace(/[\r\n]+/g, ' ').trim();
  try {
    const notification = await resend.emails.send({
      from: RESEND_FROM,
      to: ALERT_TO,
      replyTo: inquiry.email,
      subject: `New project inquiry: ${safeName} — ${interestLabel}`,
      text: `New project inquiry\n\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nInterested in: ${interestLabel}\n\nProject details:\n${inquiry.note || 'No additional details.'}\n\nSource: Find Leads resource page\nhttps://www.ianmcdonald.ai/learn/find-leads`,
      html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:620px;color:#16181d;line-height:1.6">
        <p style="color:#e10510;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase">New project inquiry</p>
        <h1 style="font-size:28px;line-height:1.15">${esc(inquiry.name)}</h1>
        <p><strong>Email:</strong> <a href="mailto:${esc(inquiry.email)}">${esc(inquiry.email)}</a></p>
        <p><strong>Interested in:</strong> ${esc(interestLabel)}</p>
        <div style="padding:18px;border-left:3px solid #e10510;background:#f4efe6"><strong>Project details</strong><br>${inquiry.note ? esc(inquiry.note).replace(/\n/g, '<br>') : 'No additional details.'}</div>
        <p style="color:#6b7280;font-size:12px">Source: <a href="https://www.ianmcdonald.ai/learn/find-leads">Find Leads resource page</a></p>
      </div>`,
    });

    if (notification.error || !notification.data?.id) {
      console.error('[project-inquiry] Notification email was not accepted');
      return NextResponse.json({ error: 'Your inquiry could not be sent. Please try again, or email ian@ianmcdonald.ai directly.' }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    console.error('[project-inquiry] Email delivery request failed');
    return NextResponse.json({ error: 'Your inquiry could not be sent. Please try again, or email ian@ianmcdonald.ai directly.' }, { status: 502 });
  }
}
