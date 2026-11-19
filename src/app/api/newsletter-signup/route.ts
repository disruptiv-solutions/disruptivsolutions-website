import { NextRequest, NextResponse } from 'next/server';
import { checkBotId } from 'botid/server';
import { subscribeToNewsletter } from '@/lib/mailchimp-preferences';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Please submit through the website.' }, { status: 403 });
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({ error: 'Please use the newsletter form.' }, { status: 415 });
  }
  try {
    const verification = await checkBotId({ advancedOptions: { checkLevel: 'basic' } });
    if (verification.isBot) {
      return NextResponse.json({ error: 'We could not verify your browser. Refresh and try again.' }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: 'Browser verification is temporarily unavailable. Please try again later.' }, { status: 503 });
  }
  let body;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: 'Please enter your name and email.' }, { status: 400 });
  }
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const phone = typeof body?.phone === 'string' && body.phone !== 'N/A' ? body.phone.trim() : '';
  if (!name || name.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || phone.length > 50) {
    return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 });
  }
  try {
    await subscribeToNewsletter(name, email, phone);
    // Same response for pending, already subscribed and suppressed contacts.
    // No Resend welcome: Mailchimp owns confirmation, not this public route.
    return NextResponse.json({ success: true });
  } catch {
    console.error('[newsletter-signup] Signup request unavailable');
    return NextResponse.json({ error: 'We could not process your request. Please try again later.' }, { status: 502 });
  }
}
