import { NextRequest, NextResponse } from 'next/server';
import { jsonrepair } from 'jsonrepair';

export const dynamic = 'force-dynamic';

interface OpenRouterRequest {
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature: number;
  max_tokens: number;
  response_format: {
    type: 'json_schema';
    json_schema: {
      name: string;
      strict: boolean;
      schema: Record<string, unknown>;
    };
  };
}

interface AIContent {
  title: string;
  description: string;
  icon: string;
  tldr?: string;
  sections: Array<{
    heading: string;
    text?: string;
    items?: string[];
    code?: string;
    note?: string;
  }>;
}

interface FormattedSection {
  heading: string;
  text?: string;
  items?: string[];
  code?: string;
  note?: string;
}

// Clean citation markers and artifacts from AI-generated content
const cleanCitationMarkers = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  
  return text
    // Remove Unicode private use area characters (weird boxes like E000-EFFF)
    .replace(/[\uE000-\uF8FF]/g, '')
    // Remove citation markers in various formats
    .replace(/cite turn\d+[a-z]+\d+/gi, '') // "cite turn0news27", "cite turn0search12"
    .replace(/cite turn\d+search\d+/gi, '') // "cite turn0search20"
    .replace(/cite turn\d+news\d+/gi, '') // "cite turn0news15"
    // Remove citation markers that might be wrapped in brackets or parentheses
    .replace(/\[cite[^\]]*\]/gi, '')
    .replace(/\(cite[^)]*\)/gi, '')
    // Remove standalone citation patterns with word boundaries
    .replace(/\bcite\s+turn\d+[a-z]+\d+\b/gi, '')
    // Remove any remaining citation-like patterns
    .replace(/turn\d+[a-z]+\d+/gi, '')
    // Clean up any double spaces that might have been left
    .replace(/  +/g, ' ')
    // Remove spaces before punctuation that citation markers might have left
    .replace(/\s+([.,;:!?])/g, '$1')
    // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

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

    // Use OpenRouter API
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Determine model - use :online variant for web research
    const model = includeWebResearch ? 'openai/gpt-5.1:online' : 'openai/gpt-5.1';
    
    // Map length percentage (0-100) to max_tokens (500-16000)
    // 0% = 500 tokens (very short), 10% = 1000 tokens (short), 50% = 4000 tokens (medium), 100% = 16000 tokens (very long)
    let maxTokens = Math.round(500 + (length / 100) * 15500);
    
    // Reasoning models (like gpt-5.1, o1) use tokens for reasoning before generating content
    // We need to increase max_tokens significantly to account for reasoning tokens
    const isReasoningModel = model.includes('gpt-5.1') || model.includes('o1') || model.includes('reasoning');
    if (isReasoningModel) {
      // For reasoning models, multiply max_tokens by 4-5x to ensure content generation
      // Reasoning can use 50-80% of tokens, especially for complex tasks, so we need significant headroom
      // For very short content, reasoning might take proportionally more tokens
      if (length <= 10) {
        // Very short content needs more headroom since reasoning takes proportionally more
        maxTokens = Math.max(maxTokens * 5, 4000); // Minimum 4000 tokens for very short reasoning content
      } else {
        maxTokens = Math.max(maxTokens * 4, 3000); // Minimum 3000 tokens for other reasoning content
      }
      console.log(`[AI:generate-resource] Reasoning model detected (${model}), adjusted max_tokens to ${maxTokens} (original: ${Math.round(500 + (length / 100) * 15500)})`);
    }
    
    // Also calculate approximate sections based on length
    const sectionsCount = length <= 10 ? '2-3' : length <= 25 ? '3-5' : length <= 50 ? '5-8' : length <= 75 ? '8-12' : '12+';
    const lengthDescription = length <= 10 ? 'very brief' : length <= 25 ? 'brief' : length <= 50 ? 'standard' : length <= 75 ? 'detailed' : 'extensive';

    const typeInstructions: Record<string, string> = {
      article: 'Write a comprehensive, well-researched article with multiple sections covering the topic in detail. Include introduction, main content sections, and conclusion.',
      'ad-landing': 'Create a compelling landing page/ad copy with hero section, features, benefits, social proof, and strong call-to-action. Focus on conversion and persuasion.',
      blog: 'Write an engaging blog post with a hook, clear structure, personal insights, and actionable takeaways. Make it conversational and relatable.',
      prompts: 'Create a collection of useful, practical prompts organized by category. Include examples and use cases for each prompt.',
      tool: 'Write a comprehensive guide explaining how to use a tool, including setup instructions, features overview, best practices, and troubleshooting tips.',
      guide: 'Create a detailed step-by-step guide with clear instructions, examples, and helpful tips. Make it easy to follow for beginners.',
      video: 'Write a script/outline for a video tutorial with engaging sections, talking points, and visual cues. Include introduction, main content, and conclusion.',
    };
    
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
        tldr: {
          type: 'string',
          description: 'TLDR (Too Long; Didn\'t Read) - A concise 2-3 sentence summary of the key takeaways from this resource. Should be punchy and highlight the most important points.',
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
      required: ['title', 'description', 'icon', 'sections', 'tldr'],
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
- ALWAYS include a TLDR field: A concise 2-3 sentence summary that captures the key takeaways. Make it punchy and highlight what readers will learn or gain from this resource.
- Use clear, engaging headings that draw readers in
- Include practical examples and actionable advice
- Add code blocks where relevant (for technical content)
- Include helpful notes and tips throughout
- Make content beginner-friendly but thorough
- Format code properly with syntax
- Use bullet points for lists of features, steps, or tips
- Write in a conversational, engaging tone
- ${includeWebResearch ? 'When using web research, incorporate information naturally into the content. DO NOT include citation markers like "cite turn0search12" or similar references. If you need to reference sources, do so naturally in the text (e.g., "According to recent research..." or "As reported by...") without using citation codes.' : ''}
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
    const requestBody: OpenRouterRequest = {
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
          schema: jsonSchema as Record<string, unknown>,
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

    const data = await response.json() as {
      choices: Array<{
        message: { content: string | AIContent };
        finish_reason?: string;
      }>;
      usage?: {
        total_tokens?: number;
        completion_tokens_details?: {
          reasoning_tokens?: number;
        };
      };
    };
    
    // Validate response structure
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('[AI:generate-resource] Invalid response structure:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: 'Invalid response from AI service. No choices returned.' },
        { status: 500 }
      );
    }

    const contentText: string | AIContent = data.choices[0]?.message?.content;
    const finishReason = data.choices[0]?.finish_reason;
    const reasoningTokens = data.usage?.completion_tokens_details?.reasoning_tokens;
    
    // Check if content exists
    if (!contentText || (typeof contentText === 'string' && contentText.trim().length === 0)) {
      // Check if it's a token limit issue with reasoning models
      if (finishReason === 'length' && reasoningTokens) {
        console.error('[AI:generate-resource] Token limit hit - all tokens used for reasoning:', {
          finishReason,
          reasoningTokens,
          totalTokens: data.usage?.total_tokens,
          maxTokens,
        });
        return NextResponse.json(
          { 
            error: `Token limit reached. The model used all ${reasoningTokens} tokens for reasoning and couldn't generate content. Try reducing the content length or using a non-reasoning model.`,
            details: {
              finishReason,
              reasoningTokens,
              totalTokens: data.usage?.total_tokens,
              suggestion: 'Try selecting a shorter content length or use a different model'
            }
          },
          { status: 500 }
        );
      }
      
      console.error('[AI:generate-resource] Empty content received:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { 
          error: 'AI service returned empty content. The model may have hit token limits or encountered an error.',
          details: {
            finishReason,
            reasoningTokens,
            suggestion: finishReason === 'length' ? 'Try reducing content length or increasing max_tokens' : 'Please try again'
          }
        },
        { status: 500 }
      );
    }

    let aiContent: AIContent | undefined = undefined;

    // With structured outputs (json_schema), OpenRouter returns valid JSON
    // According to OpenRouter docs, content should be directly parseable JSON string
    try {
      // Handle case where content might be a string or already parsed object
      if (typeof contentText === 'string') {
        const textContent = contentText.trim();
        
        // Check if string is empty after trimming
        if (!textContent) {
          throw new Error('Content string is empty after trimming');
        }
        
        // Strategy 1: Direct JSON parse (most common with structured outputs)
        // OpenRouter with json_schema should return valid JSON directly
        try {
          aiContent = JSON.parse(textContent) as AIContent;
        } catch (directParseError) {
          // Strategy 2: Extract JSON from markdown code blocks (fallback for some models)
          let jsonText = textContent;
          const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
          if (jsonMatch && jsonMatch[1]) {
            jsonText = jsonMatch[1].trim();
            try {
              aiContent = JSON.parse(jsonText) as AIContent;
            } catch {
              // Continue to next strategy
            }
          }
          
          // Strategy 3: Extract JSON object boundaries (find first { to last })
          if (!aiContent) {
            const firstBrace = jsonText.indexOf('{');
            const lastBrace = jsonText.lastIndexOf('}');
            
            if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
              const extractedJson = jsonText.substring(firstBrace, lastBrace + 1);
              try {
                aiContent = JSON.parse(extractedJson) as AIContent;
              } catch {
                // Continue to repair strategy
              }
            }
          }
          
          // Strategy 4: Try JSON repair library (for malformed but fixable JSON)
          if (!aiContent) {
            try {
              const repaired = jsonrepair(textContent);
              aiContent = JSON.parse(repaired) as AIContent;
            } catch (repairError) {
              // All strategies failed
              throw new Error(`Failed to parse JSON after all strategies. Direct parse error: ${directParseError instanceof Error ? directParseError.message : 'unknown'}`);
            }
          }
        }
      } else if (typeof contentText === 'object' && contentText !== null) {
        // Content is already an object (shouldn't happen with structured outputs, but handle it)
        aiContent = contentText as AIContent;
      } else {
        throw new Error(`Unexpected content type: ${typeof contentText}`);
      }
    } catch (parseError: unknown) {
      console.error('[AI:generate-resource] JSON parse error:', parseError);
      console.error('[AI:generate-resource] Content text type:', typeof contentText);
      console.error('[AI:generate-resource] Content text value:', 
        typeof contentText === 'string' 
          ? (contentText.length > 0 ? contentText.substring(0, 1000) : '(empty string)')
          : JSON.stringify(contentText, null, 2));
      console.error('[AI:generate-resource] Full response data:', JSON.stringify(data, null, 2));
      
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
      
      return NextResponse.json(
        { 
          error: 'Failed to parse AI response as JSON. The structured output may have failed.',
          details: errorMessage
        },
        { status: 500 }
      );
    }

    // Ensure aiContent was successfully parsed
    if (!aiContent) {
      return NextResponse.json(
        { error: 'Failed to parse AI response content' },
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
    // Also clean citation markers from all text fields
    const formattedSections: FormattedSection[] = aiContent.sections.map((section) => {
      const formatted: FormattedSection = {
        heading: cleanCitationMarkers(section.heading || ''),
      };
      
      // Only include non-empty fields, and clean citation markers
      if (section.text && section.text.trim()) {
        formatted.text = cleanCitationMarkers(section.text);
      }
      
      if (Array.isArray(section.items) && section.items.length > 0) {
        formatted.items = section.items
          .filter((item: string) => item && item.trim())
          .map((item: string) => cleanCitationMarkers(item));
      }
      
      if (section.code && section.code.trim()) {
        formatted.code = cleanCitationMarkers(section.code);
      }
      
      if (section.note && section.note.trim()) {
        formatted.note = cleanCitationMarkers(section.note);
      }
      
      return formatted;
    });

    return NextResponse.json({
      success: true,
      title: cleanCitationMarkers(aiContent.title || topic),
      description: cleanCitationMarkers(aiContent.description || `Learn about ${topic}`),
      tldr: cleanCitationMarkers(aiContent.tldr || ''),
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

