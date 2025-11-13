import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type WebhookPayloadValue =
  | string
  | {
      filename: string;
      contentType: string;
      size: number;
      data: string;
    };

export async function POST(request: NextRequest) {
  const webhookUrl = 'https://hook.us1.make.com/p8ayph9uua1j3axvrjzpt3bvfywb98h8';
  
  try {
    const formData = await request.formData();
    console.log('[API:class-registration] Received form data');

    // Extract form fields
    const name = formData.get('name') as string;
    const title = formData.get('title') as string;
    const location = formData.get('location') as string;
    const bio = formData.get('bio') as string;
    const email = formData.get('contact.email') as string;
    const profileImageUrl = formData.get('images.profileImageUrl') as string | null;
    const profileImageFile = formData.get('images.profileImageFile') as File | null;
    const timestamp = formData.get('timestamp') as string;
    const session = formData.get('session') as string;

    // Prepare webhook payload
    const webhookData: Record<string, WebhookPayloadValue> = {
      name,
      title,
      location,
      bio,
      'contact.email': email,
      timestamp,
      session,
    };

    // Handle image - if file uploaded, convert to base64 or send file info
    // If URL provided, include it
    if (profileImageFile) {
      // For file uploads, we'll send file metadata and optionally convert to base64
      // Note: Large files might need to be handled differently (e.g., upload to storage first)
      const fileBuffer = await profileImageFile.arrayBuffer();
      const base64 = Buffer.from(fileBuffer).toString('base64');
      webhookData['images.profileImageFile'] = {
        filename: profileImageFile.name,
        contentType: profileImageFile.type,
        size: profileImageFile.size,
        data: base64, // Base64 encoded file data
      };
    } else if (profileImageUrl) {
      webhookData['images.profileImageUrl'] = profileImageUrl;
    }

    console.log('[API:class-registration] Sending to webhook:', webhookUrl);
    console.log('[API:class-registration] Payload keys:', Object.keys(webhookData));

    // Forward the request to the Make.com webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    const responseText = await response.text();
    console.log('[API:class-registration] Webhook response status:', response.status);
    console.log('[API:class-registration] Webhook response:', responseText.substring(0, 200));

    if (!response.ok) {
      console.error('[API:class-registration] Webhook error:', response.status, responseText);
      return NextResponse.json(
        { error: 'Failed to submit registration. Please try again.' },
        { status: response.status }
      );
    }

    console.log('[API:class-registration] Webhook success');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[API:class-registration] API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}





