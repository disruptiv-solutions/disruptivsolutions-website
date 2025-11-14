import { NextRequest, NextResponse } from 'next/server';

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
        model: 'openai/gpt-5.1',
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
      }),
    });

    if (!promptResponse.ok) {
      const errorText = await promptResponse.text();
      console.error('[AI:image-prompt] OpenRouter error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate image prompt' },
        { status: 500 }
      );
    }

    const promptData = await promptResponse.json();
    const imagePrompt = promptData.choices?.[0]?.message?.content?.trim();

    if (!imagePrompt) {
      return NextResponse.json(
        { error: 'Image prompt generation returned empty content' },
        { status: 500 }
      );
    }

    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-1-mini',
        prompt: imagePrompt,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
    });

    if (!imageResponse.ok) {
      const errorText = await imageResponse.text();
      console.error('[AI:image-generation] OpenAI error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate image with OpenAI' },
        { status: 500 }
      );
    }

    const imageJson = await imageResponse.json();
    const base64Image = imageJson.data?.[0]?.b64_json;

    if (!base64Image) {
      return NextResponse.json(
        { error: 'Image generation did not return any data' },
        { status: 500 }
      );
    }

    const imageUrl = `data:image/png;base64,${base64Image}`;

    return NextResponse.json({
      success: true,
      imagePrompt,
      imageUrl,
    });
  } catch (error) {
    console.error('[AI:generate-resource-image] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate resource image' },
      { status: 500 }
    );
  }
}

