import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, title, location, bio, website, company, industry } = body;

    if (!name || !title || !location || !bio) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if OpenRouter API key is configured
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Create the prompt for AI
    const systemPrompt = `You are a professional bio writer specializing in creating compelling, concise professional bios for digital business cards. Your bios should be:
- Professional yet personable
- 2-3 short paragraphs
- Highlight the company and services/products offered
- Emphasize value proposition and what makes them unique
- Include relevant background information
- Optimized for professional networking and digital presence
- Engaging and memorable`;

    const userPrompt = `Please optimize and enhance the following professional bio. Make it more compelling, professional, and effective while maintaining the person's authentic voice and key information. Focus on highlighting their company, services/products, and value proposition.

Name: ${name}
Title: ${title}
Location: ${location}
${website ? `Website: ${website}\n` : ''}${company ? `Company: ${company}\n` : ''}${industry ? `Industry: ${industry}\n` : ''}
Current Bio:
${bio}

Please return ONLY the enhanced bio text (2-3 paragraphs), without any additional commentary or explanations.`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
        'X-Title': 'Digital Business Card Bio Enhancer',
      },
      body: JSON.stringify({
        model: 'openai/gpt-5-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 15000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to enhance bio. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const enhancedBio = data.choices?.[0]?.message?.content?.trim();

    if (!enhancedBio) {
      return NextResponse.json(
        { error: 'No response from AI. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ enhancedBio }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

