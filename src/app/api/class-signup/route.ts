import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookUrl = 'https://hook.us1.make.com/p8ayph9uua1j3axvrjzpt3bvfywb98h8';
  
  try {
    const body = await request.json();
    console.log('[API:class-signup] Received request:', JSON.stringify(body, null, 2));

    // Forward the request to the Make.com webhook
    console.log('[API:class-signup] Sending to webhook:', webhookUrl);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('[API:class-signup] Webhook response status:', response.status);
    console.log('[API:class-signup] Webhook response:', responseText.substring(0, 200));

    if (!response.ok) {
      console.error('[API:class-signup] Webhook error:', response.status, responseText);
      return NextResponse.json(
        { error: 'Failed to submit signup. Please try again.' },
        { status: response.status }
      );
    }

    console.log('[API:class-signup] Webhook success');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API:class-signup] API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

