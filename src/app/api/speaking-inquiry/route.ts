import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// TODO(Ian): replace with the Make.com webhook URL for the speaking-inquiry scenario.
// Set up a Make scenario triggered by a custom webhook with two email modules:
//   1) Email to ian@ianmcdonald.ai with the inquiry details
//   2) Email to {{1.email}} confirming receipt
const MAKE_WEBHOOK_URL =
  process.env.MAKE_SPEAKING_INQUIRY_WEBHOOK_URL ?? '';

const ALLOWED_INTERESTS = [
  'speaking-event',
  'corporate-workshop',
  'community-partnership',
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

    if (!MAKE_WEBHOOK_URL) {
      console.error('[speaking-inquiry] MAKE_SPEAKING_INQUIRY_WEBHOOK_URL not configured');
      return NextResponse.json(
        { error: 'Submission temporarily unavailable. Email ian@ianmcdonald.ai directly.' },
        { status: 503 },
      );
    }

    const payload = {
      ...inquiry,
      submittedAt: new Date().toISOString(),
      source: 'disruptiv.solutions/speaking',
    };

    const response = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[speaking-inquiry] Webhook error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Could not submit inquiry. Please try again or email ian@ianmcdonald.ai directly.' },
        { status: 502 },
      );
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
