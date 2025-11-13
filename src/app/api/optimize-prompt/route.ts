import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      title,
      location,
      bio,
      email,
      phone,
      website,
      company,
      industry,
      socialLinks,
      primaryColor,
      secondaryColor,
      tertiaryColor,
      textColor,
      profileImageUrl,
    } = body;

    if (!name || !title || !location || !bio || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if OpenRouter API key is configured
    const openRouterApiKey = process.env.OPENROUTER_API_KEY || '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';
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Build the base prompt from form data
    let imageReference = '';
    if (profileImageUrl) {
      imageReference = profileImageUrl;
    } else if (body.profileImageFile) {
      imageReference = '[Profile image file uploaded - use this image for the headshot]';
    }

    const basePrompt = `Build a modern, professional AI-powered digital business card web application using Next.js, TypeScript, and Tailwind CSS.

CORE FEATURES:

1. HERO SECTION (Top of Page):
- Professional headshot photo (circular, centered)
  ${imageReference ? `  Image URL: ${imageReference}` : '  [Use a professional headshot photo]'}
- Full name (large, bold typography)
  Name: ${name}
- Title/role (subtitle below name)
  Title: ${title}
- Brief tagline or value proposition (1-2 sentences)
  Location: ${location}
${socialLinks && socialLinks.length > 0 ? `- Social media icon links - USE THESE EXACT LINKS PROVIDED BY THE USER:\n${socialLinks.map((s: { platform: string; url: string }) => `  - ${s.platform}: ${s.url}`).join('\n')}` : '- No social media links provided - do not include social media icons'}
${website ? `- Website: ${website}` : ''}
${phone ? `- Phone: ${phone}` : ''}
${company ? `- Company: ${company}` : ''}
${industry ? `- Industry: ${industry}` : ''}
- Primary CTA button: "Chat with My AI Assistant"

2. ABOUT SECTION:
- Short bio (2-3 paragraphs)
  Bio:
${bio.split('\n').map((line: string) => `  ${line}`).join('\n')}
- Key expertise areas or skills (displayed as badges or pills)
- Professional background highlights

3. AI CHAT COMPONENT:
- Floating chat button (bottom right, stays visible on scroll)
- When clicked, opens chat modal/drawer
- Chat interface with:
  - Message history display
  - Input field for questions
  - Send button
  - Typing indicator while AI responds
- AI assistant should be pre-loaded with context about the person (bio, expertise, background)
- Should answer questions about:
  - Professional experience
  - Services offered
  - How to contact/work with them
  - Expertise and skills
  - Availability and rates (if applicable)

AI System Prompt Context:
Name: ${name}
Title: ${title}
Location: ${location}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}${website ? `Website: ${website}\n` : ''}${company ? `Company: ${company}\n` : ''}${industry ? `Industry: ${industry}\n` : ''}${socialLinks && socialLinks.length > 0 ? `Social Media Links (USE THESE EXACT LINKS):\n${socialLinks.map((s: { platform: string; url: string }) => `  - ${s.platform}: ${s.url}`).join('\n')}\n` : ''}Bio: ${bio}

4. CONTACT SECTION:
- Email address (clickable mailto: link)
  Email: ${email}
${phone ? `- Phone number (clickable tel: link)\n  Phone: ${phone}` : '- Phone number (optional, clickable tel: link)'}
- Location/timezone
  Location: ${location}
${website ? `- Website: ${website}` : ''}
- "Book a Call" button linking to calendar
- Contact form as alternative

5. WORK/PORTFOLIO SECTION (Optional):
- Recent projects or case studies
- Testimonials or social proof
- Media/press mentions
- Speaking engagements

TECHNICAL REQUIREMENTS:

- Use Next.js 14+ with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Responsive design (mobile-first)
- Fast page load (optimized images)
- SEO meta tags configured
- Open Graph tags for social sharing

**[OPTIMIZATION] React & Next.js Best Practices:**

// React & Next.js Best Practices:
// - Use Server Actions for form submissions.
// - When managing form state with Server Actions, use the useActionState hook (imported directly from 'react').
//   Do NOT use the deprecated useFormState hook from 'react-dom'.
// - Organize your UI as reusable, well-defined React components for each main section (such as Hero, About, Contact, etc.).

- Use a modern AI SDK for chat functionality (e.g., Genkit).
- System prompt should include:
  - Person's full bio and background
  - Professional expertise
  - Services offered
  - Personality/tone to match their brand
  - Boundaries (what not to discuss)
- Conversation history maintained during session
- Rate limiting to prevent abuse
- Error handling for API failures

DESIGN AESTHETIC:

- Clean, modern, professional
- High contrast for readability
- Smooth animations/transitions
- Consistent color scheme (customizable)
  Color Palette:
  - Primary Color: ${primaryColor}
  - Secondary Color: ${secondaryColor}
  - Tertiary Color: ${tertiaryColor}
  - Text Color: ${textColor}
- Professional typography (Inter or similar)
- Subtle hover effects on interactive elements
- Card/section-based layout with proper spacing

DEPLOYMENT:

- Should be deployable to a modern hosting platform (e.g., Firebase App Hosting, Vercel)
- Environment variables for API keys
- Custom domain support
- Fast global CDN delivery

Create this as a single-page application with smooth scroll navigation between sections.

Make it easy to customize by keeping all personal information (name, bio, links, etc.) in a central configuration file or environment variables.

The AI chat should feel natural and helpful, not robotic. It should represent the person professionally while being conversational and friendly.`;

    // Create the system prompt for optimization
    const systemPrompt = `You are an expert prompt engineer specializing in creating optimized, detailed prompts for AI web development projects. Your task is to take a base prompt for building a digital business card website and enhance it to be:

1. More specific and actionable
2. Better structured and organized
3. Include best practices for Next.js, React, and TypeScript
4. Add technical details that ensure high-quality implementation
5. Include accessibility considerations
6. Optimize for performance and SEO
7. Make it comprehensive yet clear
8. Ensure all requirements are clearly specified

IMPORTANT INSTRUCTIONS:
- Use the bio text EXACTLY as provided - do not modify, enhance, or rewrite it. The user may have already enhanced their bio using the AI enhancement feature, or they may have written it themselves. In either case, use the bio text verbatim in the prompt.
- Use ONLY the social media links that are explicitly provided by the user. If social media links are listed, use those EXACT URLs. If no social media links are provided, do NOT include any social media icons or links in the website. Do not generate placeholder links or assume any social media presence.

Return ONLY the optimized prompt without any additional commentary, explanations, or markdown formatting (just the raw prompt text).`;

    const userPrompt = `Please optimize and enhance the following prompt for building a digital business card website. Make it more detailed, specific, and actionable while maintaining all the original requirements and information.

CRITICAL REQUIREMENTS:
1. Use the bio text EXACTLY as provided in the base prompt below. Do NOT modify, enhance, rewrite, or improve the bio text - use it verbatim. The bio may have already been enhanced by the user or written by them, so preserve it exactly as shown.

2. Use ONLY the social media links that are explicitly listed in the base prompt. If social media links are provided, use those EXACT URLs and platforms. If the base prompt says "No social media links provided", then do NOT include any social media icons or links in the website design. Do not create placeholder links or assume social media presence.

Base Prompt:
${basePrompt}

Return the fully optimized prompt that an AI developer can use to build a high-quality digital business card website. Ensure:
- The bio section uses the exact bio text from the base prompt without any changes
- Only the social media links explicitly provided are used (if any)
- No placeholder or assumed social media links are included`;

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
        'X-Title': 'Digital Business Card Prompt Optimizer',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 16000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to optimize prompt. Please try again.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const optimizedPrompt = data.choices?.[0]?.message?.content?.trim();

    if (!optimizedPrompt) {
      return NextResponse.json(
        { error: 'No response from AI. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ optimizedPrompt }, { status: 200 });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'An error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

