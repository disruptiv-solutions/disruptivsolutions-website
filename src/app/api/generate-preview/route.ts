import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Missing prompt' },
        { status: 400 }
      );
    }

    // Check if OpenRouter API key is configured
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      console.error('[OpenRouter] API key not configured');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are an expert web developer. Your task is to generate a complete, self-contained HTML page based on the user's prompt.

REQUIREMENTS:
1. Generate a COMPLETE HTML document with <!DOCTYPE html>, <html>, <head>, and <body> tags
2. Include ALL CSS inline within a <style> tag in the <head>
3. Use modern, beautiful design with:
   - Clean typography (use Google Fonts - Inter or similar)
   - Smooth gradients and shadows
   - Responsive design (mobile-first)
   - Subtle animations/transitions
   - Professional color scheme based on the prompt
4. Include realistic placeholder content based on the business/project type
5. Include multiple sections: hero, about/features, services/products, contact/CTA
6. Make it look like a real, professional website
7. Use placeholder images from https://picsum.photos/[width]/[height] or https://placehold.co/[width]x[height]
8. NO JavaScript - only HTML and CSS
9. NO external CSS files - everything must be inline in <style> tags
10. NO comments in the code

The output should be ONLY the HTML code, nothing else. No explanations, no markdown code blocks, just pure HTML starting with <!DOCTYPE html>.`;

    const userPrompt = `Create a beautiful, professional website preview based on this prompt:

${prompt}

Remember: Output ONLY the complete HTML code starting with <!DOCTYPE html>. No explanations or markdown.`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3002',
        'X-Title': 'Website Preview Generator',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-4.5-sonnet', // Using Claude for better HTML generation
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 8000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate preview. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    let html = data.choices?.[0]?.message?.content?.trim();

    if (!html) {
      return NextResponse.json(
        { error: 'No response from AI. Please try again.' },
        { status: 500 }
      );
    }

    // Clean up the HTML if it has markdown code blocks
    if (html.startsWith('```html')) {
      html = html.slice(7);
    }
    if (html.startsWith('```')) {
      html = html.slice(3);
    }
    if (html.endsWith('```')) {
      html = html.slice(0, -3);
    }
    html = html.trim();

    // Ensure it starts with DOCTYPE
    if (!html.toLowerCase().startsWith('<!doctype')) {
      html = '<!DOCTYPE html>\n' + html;
    }

    return NextResponse.json({ html }, { status: 200 });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

