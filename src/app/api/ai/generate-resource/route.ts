import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface GenerateResourceRequest {
  resourceType: 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video';
  topic: string;
  includeWebResearch: boolean;
  deepResearch: boolean;
  length: number; // 0-100 percentage
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { resourceType, topic, includeWebResearch, deepResearch, length = 50 } = body;

    if (!resourceType || !topic) {
      return NextResponse.json(
        { error: 'Missing required fields: resourceType, topic' },
        { status: 400 }
      );
    }

    // Map length percentage (0-100) to max_tokens (1000-16000)
    // 0% = 1000 tokens (short), 50% = 4000 tokens (medium), 100% = 16000 tokens (very long)
    const maxTokens = Math.round(1000 + (length / 100) * 15000);
    
    // Also calculate approximate sections based on length
    const sectionsCount = length <= 25 ? '3-5' : length <= 50 ? '5-8' : length <= 75 ? '8-12' : '12+';
    const lengthDescription = length <= 25 ? 'brief' : length <= 50 ? 'standard' : length <= 75 ? 'detailed' : 'extensive';

    // Use OpenRouter API
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    const typeInstructions: Record<string, string> = {
      article: 'Write a comprehensive, well-researched article with multiple sections covering the topic in detail. Include introduction, main content sections, and conclusion.',
      'ad-landing': 'Create a compelling landing page/ad copy with hero section, features, benefits, social proof, and strong call-to-action. Focus on conversion and persuasion.',
      blog: 'Write an engaging blog post with a hook, clear structure, personal insights, and actionable takeaways. Make it conversational and relatable.',
      prompts: 'Create a collection of useful, practical prompts organized by category. Include examples and use cases for each prompt.',
      tool: 'Write a comprehensive guide explaining how to use a tool, including setup instructions, features overview, best practices, and troubleshooting tips.',
      guide: 'Create a detailed step-by-step guide with clear instructions, examples, and helpful tips. Make it easy to follow for beginners.',
      video: 'Write a script/outline for a video tutorial with engaging sections, talking points, and visual cues. Include introduction, main content, and conclusion.',
    };

    // Determine model - use :online variant for web research
    let model = includeWebResearch ? 'openai/gpt-5.1:online' : 'openai/gpt-5.1';
    
    // Define JSON Schema for structured output
    // Note: With strict mode, nested objects must have a 'required' array
    // that includes all properties. We'll make optional fields not required.
    const jsonSchema = {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Engaging title for the resource',
        },
        description: {
          type: 'string',
          description: 'Brief description (1-2 sentences)',
        },
        icon: {
          type: 'string',
          description: 'Relevant emoji icon',
        },
        sections: {
          type: 'array',
          description: 'Array of content sections',
          items: {
            type: 'object',
            properties: {
              heading: {
                type: 'string',
                description: 'Section heading/title',
              },
              text: {
                type: 'string',
                description: 'Paragraph text explaining concepts',
              },
              items: {
                type: 'array',
                description: 'Array of bullet points',
                items: {
                  type: 'string',
                },
              },
              code: {
                type: 'string',
                description: 'Code examples if relevant',
              },
              note: {
                type: 'string',
                description: 'Important note or tip',
              },
            },
            // Include all properties in required array for strict mode compliance
            // Fields can still be empty strings or empty arrays if not used
            required: ['heading', 'text', 'items', 'code', 'note'],
            additionalProperties: false,
          },
        },
      },
      required: ['title', 'description', 'icon', 'sections'],
      additionalProperties: false,
    };

    const systemPrompt = `You are an expert content writer specializing in creating high-quality ${resourceType} content. 
Generate well-structured, engaging content based on the user's topic.

IMPORTANT: All section fields are required in the JSON schema. For fields you don't use:
- Set 'text' to empty string "" if not needed
- Set 'items' to empty array [] if no bullet points
- Set 'code' to empty string "" if no code examples
- Set 'note' to empty string "" if no notes

Guidelines:
- Create ${sectionsCount} sections covering the topic ${lengthDescription === 'brief' ? 'concisely' : lengthDescription === 'standard' ? 'thoroughly' : lengthDescription === 'detailed' ? 'in detail' : 'comprehensively'}
- Target length: ${lengthDescription} content (approximately ${length <= 25 ? '500-1,000' : length <= 50 ? '1,000-2,000' : length <= 75 ? '2,000-4,000' : '4,000+'} words)
- Use clear, engaging headings that draw readers in
- Include practical examples and actionable advice
- Add code blocks where relevant (for technical content)
- Include helpful notes and tips throughout
- Make content beginner-friendly but thorough
- Format code properly with syntax
- Use bullet points for lists of features, steps, or tips
- Write in a conversational, engaging tone
- ${includeWebResearch ? 'Cite web sources when using research data. Include URLs in notes or text where relevant.' : ''}
- ${length <= 25 ? 'Keep sections concise and focused. Avoid unnecessary elaboration.' : length >= 75 ? 'Provide comprehensive coverage with detailed explanations and examples.' : ''}`;

    const userPrompt = `Create content for a ${resourceType} resource about:

Topic: ${topic}

${typeInstructions[resourceType]}

${includeWebResearch 
  ? deepResearch 
    ? 'Conduct thorough research on this topic using web search. Gather information from multiple authoritative sources and synthesize it into comprehensive content.'
    : 'Use web search to find current, relevant information about this topic and incorporate it into the content.'
  : 'Generate content based on your knowledge of this topic.'}

Generate comprehensive, well-structured content following the JSON schema provided.`;

    // Build request body with structured outputs
    const requestBody: any = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: maxTokens, // Set max output tokens based on length preference
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'resource_content',
          strict: true, // Enforce strict schema compliance
          schema: jsonSchema,
        },
      },
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Disruptiv Solutions Resource Generator',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[AI:generate-resource] OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate content with AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    let contentText = data.choices[0].message.content;
    let aiContent: any;

    // With structured outputs, content should be valid JSON string
    // But we still need to parse it
    try {
      // Handle case where content might be a string or already parsed
      if (typeof contentText === 'string') {
        contentText = contentText.trim();
        
        // Try to extract JSON from markdown code blocks if present (fallback)
        const jsonMatch = contentText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
          contentText = jsonMatch[1];
        } else {
          // Find JSON object boundaries
          const firstBrace = contentText.indexOf('{');
          const lastBrace = contentText.lastIndexOf('}');
          
          if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            contentText = contentText.substring(firstBrace, lastBrace + 1);
          }
        }
        
        aiContent = JSON.parse(contentText);
      } else {
        // Content is already an object
        aiContent = contentText;
      }
    } catch (parseError: any) {
      console.error('[AI:generate-resource] JSON parse error:', parseError);
      console.error('[AI:generate-resource] Content text (first 500 chars):', 
        typeof contentText === 'string' ? contentText.substring(0, 500) : 'Not a string');
      console.error('[AI:generate-resource] Content text (last 500 chars):', 
        typeof contentText === 'string' && contentText.length > 500 
          ? contentText.substring(Math.max(0, contentText.length - 500)) 
          : 'N/A');
      
      return NextResponse.json(
        { error: 'Failed to parse AI response as JSON. The structured output may have failed.' },
        { status: 500 }
      );
    }

    // Validate and format the response
    if (!aiContent.sections || !Array.isArray(aiContent.sections)) {
      return NextResponse.json(
        { error: 'Invalid content structure from AI. Missing sections array.' },
        { status: 500 }
      );
    }

    // Format sections to match our structure
    // Filter out empty values (empty strings/arrays) since schema requires all fields
    const formattedSections = aiContent.sections.map((section: any) => {
      const formatted: any = {
        heading: section.heading || '',
      };
      
      // Only include non-empty fields
      if (section.text && section.text.trim()) {
        formatted.text = section.text;
      }
      
      if (Array.isArray(section.items) && section.items.length > 0) {
        formatted.items = section.items.filter((item: string) => item && item.trim());
      }
      
      if (section.code && section.code.trim()) {
        formatted.code = section.code;
      }
      
      if (section.note && section.note.trim()) {
        formatted.note = section.note;
      }
      
      return formatted;
    });

    return NextResponse.json({
      success: true,
      title: aiContent.title || topic,
      description: aiContent.description || `Learn about ${topic}`,
      icon: aiContent.icon || '📄',
      content: {
        sections: formattedSections,
      },
    });
  } catch (error) {
    console.error('[AI:generate-resource] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

