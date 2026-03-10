import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type SectionType = 'context' | 'instructions' | 'content' | 'format';

const sectionPrompts: Record<SectionType, { system: string; guidance: string }> = {
  context: {
    system: `You are an expert prompt engineer helping users improve the CONTEXT section of their AI prompts. The context section should clearly define WHO the project is for and WHAT the primary goal is.`,
    guidance: `Improve this CONTEXT section by:
- Clarifying the target audience (demographics, pain points, needs)
- Making the goal more specific and measurable
- Adding relevant background that helps AI understand the project
- Keeping it concise but comprehensive

Return ONLY the improved context text, nothing else. Do not include labels like "CONTEXT:" - just return the enhanced text.`
  },
  instructions: {
    system: `You are an expert prompt engineer helping users improve the INSTRUCTIONS section of their AI prompts. The instructions section should clearly specify WHAT features and sections to build.`,
    guidance: `Improve this INSTRUCTIONS section by:
- Breaking down the request into clear, actionable items
- Suggesting a phased approach (Phase 1: Core structure, Phase 2: Content, Phase 3: Features, Phase 4: Polish)
- Being specific about each section/feature needed
- Prioritizing the most important elements first

Return ONLY the improved instructions text, nothing else. Do not include labels like "INSTRUCTIONS:" - just return the enhanced text.`
  },
  content: {
    system: `You are an expert prompt engineer helping users improve the CONTENT section of their AI prompts. The content section should provide the ACTUAL DETAILS and information to use.`,
    guidance: `Improve this CONTENT section by:
- Suggesting additional specific details that would be helpful (pricing, hours, contact info, etc.)
- Organizing the information more clearly
- Identifying any missing key information that should be added
- Making placeholder suggestions for content the user might want to add

Return ONLY the improved content text, nothing else. Do not include labels like "CONTENT:" - just return the enhanced text.`
  },
  format: {
    system: `You are an expert prompt engineer helping users improve the FORMAT section of their AI prompts. The format section should specify HOW the final result should look and behave.`,
    guidance: `Improve this FORMAT section by:
- Suggesting specific color hex codes instead of vague color names
- Recommending font families (Inter, Montserrat, etc.)
- Specifying layout approach (mobile-first, grid vs flex, etc.)
- Adding animation/interaction suggestions
- Including accessibility considerations

Return ONLY the improved format text, nothing else. Do not include labels like "FORMAT:" - just return the enhanced text.`
  }
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, input } = body;

    // Validate input
    if (!section || !input) {
      return NextResponse.json(
        { error: 'Missing required fields: section and input' },
        { status: 400 }
      );
    }

    // Validate section type
    if (!['context', 'instructions', 'content', 'format'].includes(section)) {
      return NextResponse.json(
        { error: 'Invalid section type. Must be: context, instructions, content, or format' },
        { status: 400 }
      );
    }

    const sectionType = section as SectionType;

    // Check if OpenRouter API key is configured
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      console.error('[OpenRouter] API key not configured');
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    const { system, guidance } = sectionPrompts[sectionType];

    const systemPrompt = `${system}

You are helping a student in a class about AI prompting learn how to write better prompts. Be educational and show them how their input can be improved.

Important: 
- Start by acknowledging their input is good, then enhance it
- Keep their original intent and information intact
- Add improvements as suggestions or expansions, not replacements
- Format the output cleanly with their original text first, then improvements marked with "→"`;

    const userPrompt = `Here is the user's ${section.toUpperCase()} section that needs improvement:

"${input}"

${guidance}`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
        'X-Title': 'Class 2 Prompt Improver',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Using mini for faster, cheaper responses
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to improve prompt section. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const improvedText = data.choices?.[0]?.message?.content?.trim();

    if (!improvedText) {
      return NextResponse.json(
        { error: 'No response from AI. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      improved: improvedText,
      section: sectionType 
    }, { status: 200 });

  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}







