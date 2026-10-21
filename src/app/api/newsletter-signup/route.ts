import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { subscribeToNewsletter } from '@/lib/mailchimp-preferences';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: 'Please submit through the website.' }, { status: 403 });
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
    const result = await subscribeToNewsletter(name, email, phone);
    if (result.newSignup && process.env.RESEND_API_KEY) {
      try {
        const welcome = await new Resend(process.env.RESEND_API_KEY).emails.send({
          from: process.env.RESEND_FROM || 'Ian McDonald <ian@ianmcdonald.ai>',
          to: email,
          replyTo: 'ian@ianmcdonald.ai',
          subject: 'You’re subscribed — Ian McDonald',
          text: 'Thanks for joining my newsletter. You’ll receive practical AI builds, founder notes, and workshop updates.\n\nYou can choose your topics or unsubscribe using the links in each newsletter.\n\nTalk soon,\nIan\nhttps://www.ianmcdonald.ai',
        });
        if (welcome.error) console.error('[newsletter-signup] Welcome email not delivered');
      } catch { console.error('[newsletter-signup] Welcome email unavailable'); }
    }
    return NextResponse.json({ success: true, ...result });
  } catch {
    console.error('[newsletter-signup] Audience could not confirm subscription');
    return NextResponse.json({ error: 'We could not confirm your subscription. Please try again.' }, { status: 502 });
  }
}
