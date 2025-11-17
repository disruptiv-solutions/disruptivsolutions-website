import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { initFirebaseAdmin } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const summarizeSections = (sections: Array<{ heading?: string; text?: string; items?: string[]; note?: string }> = []) => {
  return sections
    .map((section) => {
      const heading = section.heading ? `## ${section.heading}` : '';
      const text = section.text ? section.text : '';
      const items = section.items && section.items.length > 0 ? `- ${section.items.join('\n- ')}` : '';
      const note = section.note ? `Note: ${section.note}` : '';
      return [heading, text, items, note].filter(Boolean).join('\n');
    })
    .filter(Boolean)
    .join('\n\n');
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, content } = body;

    if (!title || !description || !type || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: title, description, type, content' },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;

    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment.' },
        { status: 500 }
      );
    }

    if (!openAiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment.' },
        { status: 500 }
      );
    }

    const sectionsSummary = summarizeSections(content.sections);
    const promptResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Disruptiv Solutions Resource Image Generator',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Use non-reasoning model for prompt generation
        messages: [
          {
            role: 'system',
            content:
              'You write concise, descriptive prompts for AI image generation. Your prompts are less than 120 words, specify setting, lighting, color palette, subject, and style, and avoid mentioning text or UI elements.',
          },
          {
            role: 'user',
            content: `Create an image prompt for a featured image for the following resource.

Title: ${title}
Type: ${type}
Description: ${description}

Key sections:
${sectionsSummary}`,
          },
        ],
        max_tokens: 200, // Short prompt generation doesn't need many tokens
      }),
    });

    if (!promptResponse.ok) {
      const errorText = await promptResponse.text();
      console.error('[AI:image-prompt] OpenRouter error:', errorText);
      let errorMessage = 'Failed to generate image prompt';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error?.message || errorJson.error || errorMessage;
      } catch {
        // If parsing fails, use default message
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    const promptData = await promptResponse.json();
    const imagePrompt = promptData.choices?.[0]?.message?.content?.trim();

    if (!imagePrompt) {
      console.error('[AI:image-prompt] Empty prompt received:', JSON.stringify(promptData, null, 2));
      return NextResponse.json(
        { error: 'Image prompt generation returned empty content. Please try again.' },
        { status: 500 }
      );
    }

    // Use OpenAI SDK for image generation
    const openai = new OpenAI({ apiKey: openAiApiKey });

    try {
      const imageResponse = await openai.images.generate({
        model: 'gpt-image-1',
        prompt: imagePrompt,
        size: '1024x1024',
      });

      // The response contains data array with b64_json field
      const base64Image = imageResponse.data?.[0]?.b64_json;

      if (!base64Image) {
        console.error('[AI:image-generation] No image data received:', JSON.stringify(imageResponse, null, 2));
        return NextResponse.json(
          { error: 'Image generation did not return any image data. The model might not support the requested format.' },
          { status: 500 }
        );
      }

      // Initialize Firebase Admin for Storage upload
      const { adminStorage, error: firebaseError } = initFirebaseAdmin();
      
      if (!adminStorage || firebaseError) {
        console.error('[AI:image-generation] Firebase Admin initialization error:', firebaseError);
        return NextResponse.json(
          { error: 'Firebase Storage not configured. Please configure FIREBASE_SERVICE_ACCOUNT_KEY.' },
          { status: 500 }
        );
      }

      try {
        // Convert base64 to Buffer
        const imageBuffer = Buffer.from(base64Image, 'base64');
        
        // Generate unique filename
        const timestamp = Date.now();
        const sanitizedTitle = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .substring(0, 50); // Limit length
        const fileName = `resource-images/${timestamp}-${sanitizedTitle}.png`;
        
        // Upload to Firebase Storage
        const file = adminStorage.file(fileName);
        await file.save(imageBuffer, {
          metadata: {
            contentType: 'image/png',
            cacheControl: 'public, max-age=31536000', // Cache for 1 year
          },
        });
        
        // Make the file publicly accessible
        await file.makePublic();
        
        // Get the public URL
        const imageUrl = `https://storage.googleapis.com/${adminStorage.name}/${fileName}`;

        return NextResponse.json({
          success: true,
          imagePrompt,
          imageUrl,
        });
      } catch (storageError: unknown) {
        console.error('[AI:image-generation] Firebase Storage upload error:', storageError);
        const storageErrorMessage = storageError instanceof Error 
          ? storageError.message 
          : 'Failed to upload image to Firebase Storage';
        return NextResponse.json(
          { error: `Image generated but failed to save: ${storageErrorMessage}` },
          { status: 500 }
        );
      }
    } catch (imageError: unknown) {
      console.error('[AI:image-generation] OpenAI SDK error:', imageError);
      let errorMessage = 'Failed to generate image with OpenAI';
      if (imageError instanceof Error) {
        errorMessage = imageError.message || errorMessage;
      }
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[AI:generate-resource-image] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resource image' },
      { status: 500 }
    );
  }
}

