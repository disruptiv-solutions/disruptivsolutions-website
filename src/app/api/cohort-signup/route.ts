import { NextRequest, NextResponse } from 'next/server';

const WEBHOOK_URL = process.env.COHORT_WEBHOOK_URL || process.env.WEBHOOK_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, type } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    if (!WEBHOOK_URL) {
      console.error('[CohortSignup] WEBHOOK_URL is not configured');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const webhookPayload = {
      name,
      email,
      phone: phone || 'N/A',
      type: type || 'cohort',
      timestamp: new Date().toISOString(),
      source: 'cohort_signup'
    };

    console.log('[CohortSignup] Sending webhook:', webhookPayload);

    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!webhookResponse.ok) {
      console.error('[CohortSignup] Webhook failed:', webhookResponse.status);
      return NextResponse.json(
        { error: 'Failed to process signup' },
        { status: 500 }
      );
    }

    console.log('[CohortSignup] Webhook success');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[CohortSignup] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

