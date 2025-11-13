import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const WEBHOOK_URL = 'https://hook.us1.make.com/gchrhv7pxont0b5c6cdcjl1owmsnxnp6';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('[API:feedback] Received request:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.rating || typeof body.rating !== 'number' || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Valid rating is required' },
        { status: 400 }
      );
    }

    // Prepare data for webhook
    const webhookPayload = {
      timestamp: body.timestamp || new Date().toISOString(),
      rating: body.rating,
      valuable_part: body.valuable_part || '',
      improvements: body.improvements || '',
      next_topics: body.next_topics || [],
      next_topic_other: body.next_topic_other || '',
      cohort_interest: body.cohort_interest || '',
      site_url: body.site_url || '',
      review_permission: body.review_permission || false,
    };

    // Forward the request to the Make.com webhook
    console.log('[API:feedback] Sending to webhook:', WEBHOOK_URL);
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    const responseText = await response.text();
    console.log('[API:feedback] Webhook response status:', response.status);
    console.log('[API:feedback] Webhook response:', responseText.substring(0, 200));

    if (!response.ok) {
      console.error('[API:feedback] Webhook error:', response.status, responseText);
      return NextResponse.json(
        { error: 'Failed to submit feedback. Please try again.' },
        { status: response.status }
      );
    }

    console.log('[API:feedback] Webhook success');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API:feedback] API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

