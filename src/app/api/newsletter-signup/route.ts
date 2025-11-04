import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookUrl = 'https://hook.us1.make.com/5o4aabhh59mh7qy9k4t0ppv6q8aaqfgf';
  
  try {
    const body = await request.json();
    console.log('[API:newsletter-signup] Received request:', JSON.stringify(body, null, 2));

    // Forward the request to the Make.com webhook
    console.log('[API:newsletter-signup] Sending to webhook:', webhookUrl);
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const responseText = await response.text();
    console.log('[API:newsletter-signup] Webhook response status:', response.status);
    console.log('[API:newsletter-signup] Webhook response:', responseText.substring(0, 200));

    if (!response.ok) {
      console.error('[API:newsletter-signup] Webhook error:', response.status, responseText);
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: response.status }
      );
    }

    console.log('[API:newsletter-signup] Webhook success');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API:newsletter-signup] API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

