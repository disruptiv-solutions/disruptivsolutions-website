'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ResourceContent {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video';
  icon: string;
  lastUpdated?: string;
  createdAt?: string;
  content: {
    sections: Array<{
      heading?: string;
      text?: string;
      items?: string[];
      code?: string;
      note?: string;
    }>;
  };
  published: boolean;
}

// Fallback resources for backwards compatibility (can be removed later)
const fallbackResources: Record<string, ResourceContent> = {
  'ai-prompts-library': {
    id: 'ai-prompts-library',
    title: 'AI Prompts Library',
    description: 'A curated collection of powerful prompts for building apps, websites, and tools with AI.',
    type: 'prompts',
    icon: '✨',
    lastUpdated: 'November 2024',
    published: true,
    content: {
      sections: [
        {
          heading: 'Website & Landing Page Prompts',
          items: [
            'Build a modern landing page for [business type] with hero section, features grid, testimonials, and contact form. Use [color scheme] and make it mobile-responsive.',
            'Create a personal portfolio website showcasing [profession] work. Include about section, project gallery with filtering, skills list, and contact form.',
            'Design a SaaS product landing page with pricing tiers, feature comparison table, FAQ section, and email signup. Modern dark theme with smooth animations.',
          ],
        },
        {
          heading: 'Business Card & Profile Prompts',
          items: [
            'Create a digital business card for [name], [title] at [company]. Include photo, contact info, social links, and a brief bio. Modern, professional design.',
            'Build an interactive resume website for [profession] with timeline of experience, skills visualization, project showcase, and downloadable PDF resume.',
            'Design a personal brand page for [creator type] with bio, services offered, testimonials, booking calendar integration, and social proof.',
          ],
        },
        {
          heading: 'Tool & Calculator Prompts',
          items: [
            'Build a [calculation type] calculator that takes [inputs] and outputs [results]. Include input validation, clear results display, and save/share functionality.',
            'Create a project management dashboard with task lists, progress tracking, team member assignments, and deadline reminders. Clean, intuitive interface.',
            'Design a form builder tool that lets users create custom forms with drag-and-drop fields, conditional logic, and export responses to CSV.',
          ],
        },
        {
          heading: 'Dashboard & Data Visualization Prompts',
          items: [
            'Build an analytics dashboard showing [metrics] with charts, graphs, and key performance indicators. Real-time updates and date range filtering.',
            'Create a CRM dashboard for tracking leads, deals, and customer interactions. Include pipeline view, activity feed, and search functionality.',
            'Design a content calendar dashboard for [platform] with drag-and-drop scheduling, post preview, analytics integration, and team collaboration.',
          ],
        },
        {
          heading: 'E-commerce & Booking Prompts',
          items: [
            'Build a product showcase page for [product type] with image gallery, specifications, reviews, add to cart, and related products section.',
            'Create a booking system for [service type] with calendar availability, time slot selection, customer info form, and confirmation email.',
            'Design a subscription management page with plan selection, billing history, payment method update, and cancellation flow.',
          ],
        },
        {
          text: 'Pro Tip: Always be specific about your design preferences (colors, layout, style) and functionality requirements. The more detail you provide, the better the AI can build what you envision.',
          note: 'These prompts are starting points. Customize them with your specific needs, brand colors, and unique features.',
        },
      ],
    },
  },
  'getting-started-guide': {
    id: 'getting-started-guide',
    title: 'Getting Started with AI Development',
    description: 'Complete beginner\'s guide to building your first AI-powered application from scratch.',
    type: 'guide',
    icon: '🚀',
    lastUpdated: 'November 2024',
    published: true,
    content: {
      sections: [
        {
          heading: 'Step 1: Understand What AI Development Really Means',
          text: 'AI development isn\'t about writing complex code anymore. It\'s about communicating clearly with AI tools to build what you need. Think of it as having a conversation with a highly skilled developer who can instantly build what you describe.',
        },
        {
          heading: 'Step 2: Choose Your AI Building Platform',
          text: 'There are several platforms designed for building with AI:',
          items: [
            'Lovable - Best for web apps and websites (what we use in workshops)',
            'Cursor - AI-powered code editor for developers',
            'v0 by Vercel - Great for UI components',
            'Replit - Full development environment with AI assistance',
          ],
        },
        {
          heading: 'Step 3: Start with a Simple Project',
          text: 'Don\'t try to build the next Facebook on day one. Start small:',
          items: [
            'Personal website or digital business card',
            'Simple calculator or tool',
            'Landing page for an idea',
            'Portfolio to showcase your work',
          ],
        },
        {
          heading: 'Step 4: Write Your First Prompt',
          text: 'A good prompt includes:',
          items: [
            'What you want to build (be specific)',
            'Key features and functionality',
            'Design preferences (colors, style, layout)',
            'Any specific requirements or constraints',
          ],
          code: 'Example Prompt:\n\n"Build a personal portfolio website for a freelance graphic designer. Include:\n- Hero section with name, title, and brief intro\n- Project gallery with 6 projects in a grid\n- About section with bio and skills\n- Contact form with name, email, and message fields\n- Modern, clean design with purple and white color scheme\n- Mobile responsive"',
        },
        {
          heading: 'Step 5: Iterate and Refine',
          text: 'Your first build won\'t be perfect. That\'s okay! The power of AI development is how quickly you can make changes:',
          items: [
            'Ask for specific changes: "Make the header sticky"',
            'Request new features: "Add a dark mode toggle"',
            'Fix issues: "The contact form isn\'t centered on mobile"',
            'Improve design: "Make the colors more vibrant"',
          ],
        },
        {
          heading: 'Step 6: Deploy Your App',
          text: 'Most AI platforms have one-click deployment. Your app goes from idea to live on the internet in minutes, not months.',
        },
        {
          heading: 'Common Beginner Mistakes to Avoid',
          items: [
            'Being too vague in prompts - specificity is your friend',
            'Trying to build everything at once - start small, add features',
            'Not testing on mobile - always check responsive design',
            'Giving up after first try - iteration is part of the process',
            'Comparing yourself to experienced developers - you\'re learning a new skill',
          ],
        },
        {
          heading: 'Next Steps',
          text: 'Once you\'ve built your first app:',
          items: [
            'Build something for a friend or family member',
            'Join communities of AI builders (like our Facebook group)',
            'Take on a small paid project to build confidence',
            'Learn about databases and more complex features',
            'Keep building - consistency beats perfection',
          ],
        },
        {
          note: 'Remember: 18 months ago, I knew nothing about building apps. Today I serve 2,000+ users. The only difference between then and now is that I started and didn\'t quit. You can do this.',
        },
      ],
    },
  },
  'lovable-tutorial': {
    id: 'lovable-tutorial',
    title: 'Lovable Platform Tutorial',
    description: 'Step-by-step walkthrough of using Lovable to build and deploy your applications.',
    type: 'video',
    icon: '🎥',
    lastUpdated: 'November 2024',
    content: {
      sections: [
        {
          heading: 'What is Lovable?',
          text: 'Lovable is an AI-powered platform that lets you build full-stack web applications using natural language. You describe what you want, and Lovable builds it for you in real-time.',
        },
        {
          heading: 'Getting Started',
          items: [
            'Go to lovable.dev and sign up for a free account',
            'Click "New Project" to start building',
            'You\'ll see a chat interface on the left and a preview on the right',
          ],
        },
        {
          heading: 'Building Your First App',
          text: 'In the chat interface, describe what you want to build. Be specific about:',
          items: [
            'The type of app (website, tool, dashboard, etc.)',
            'Key features and pages',
            'Design preferences (colors, layout, style)',
            'Any specific functionality',
          ],
          code: 'Example First Prompt:\n\n"Build a personal website for a fitness coach. Include:\n- Hero section with photo and tagline\n- Services section with 3 service cards\n- Testimonials slider\n- Contact form\n- Use energetic colors like orange and blue\n- Modern, clean design"',
        },
        {
          heading: 'Making Changes',
          text: 'After Lovable builds your initial app, you can request changes:',
          items: [
            '"Make the header sticky when scrolling"',
            '"Change the orange to a darker shade"',
            '"Add a pricing section with 3 tiers"',
            '"Make the testimonials auto-scroll every 5 seconds"',
          ],
        },
        {
          heading: 'Understanding the Interface',
          items: [
            'Left Panel: Chat with AI to make changes',
            'Center: Live preview of your app',
            'Right Panel: Code view (optional - you don\'t need to touch this)',
            'Top Bar: Save, deploy, and settings',
          ],
        },
        {
          heading: 'Deploying Your App',
          text: 'When you\'re ready to go live:',
          items: [
            'Click the "Deploy" button in the top right',
            'Lovable will generate a live URL for your app',
            'Share this URL with anyone - your app is now live!',
            'You can update anytime and redeploy',
          ],
        },
        {
          heading: 'Pro Tips',
          items: [
            'Save your project frequently',
            'Test on mobile by resizing the preview window',
            'Use the "Undo" button if you don\'t like a change',
            'Ask for one change at a time for best results',
            'Be specific about what you want changed',
          ],
        },
        {
          heading: 'Common Issues & Solutions',
          items: [
            'App not looking right on mobile? Ask: "Make this fully responsive for mobile devices"',
            'Colors not matching your brand? Provide hex codes: "Use #FF5733 for the primary color"',
            'Feature not working? Be specific: "The contact form submit button isn\'t working"',
            'Want to start over? Click "New Project" and begin fresh',
          ],
        },
        {
          note: 'Video Tutorial: A full video walkthrough is coming soon. Subscribe to the newsletter to be notified when it\'s ready!',
        },
      ],
    },
  },
  'business-card-templates': {
    id: 'business-card-templates',
    title: 'Digital Business Card Templates',
    description: 'Ready-to-use templates and prompts for creating professional digital business cards.',
    type: 'prompts',
    icon: '💼',
    lastUpdated: 'November 2024',
    content: {
      sections: [
        {
          heading: 'Classic Professional Template',
          code: 'Build a digital business card for [Your Name], [Your Title] at [Company].\n\nInclude:\n- Professional headshot (centered at top)\n- Name and title (large, bold)\n- Company name and logo\n- Contact information: email, phone, location\n- Social media links (LinkedIn, Twitter, etc.)\n- Brief bio (2-3 sentences)\n- "Download vCard" button\n- "Schedule Meeting" button linking to [calendar tool]\n\nDesign: Clean, professional, corporate. Use [company colors] or navy blue and white. Mobile-responsive.',
        },
        {
          heading: 'Creative/Designer Template',
          code: 'Build a digital business card for [Your Name], [Creative Title].\n\nInclude:\n- Bold, artistic header with name\n- Tagline or specialty\n- Portfolio preview (3-4 project thumbnails)\n- Contact info with icons\n- Social links (Instagram, Behance, Dribbble)\n- "View Full Portfolio" button\n- Animated hover effects\n\nDesign: Modern, bold, creative. Use vibrant colors [specify]. Showcase personality. Mobile-responsive.',
        },
        {
          heading: 'Entrepreneur/Founder Template',
          code: 'Build a digital business card for [Your Name], Founder of [Company].\n\nInclude:\n- Hero section with photo and company logo\n- Elevator pitch (what your company does)\n- Key achievements or metrics\n- Contact information\n- "Book a Call" CTA button\n- Links to company website and social media\n- Recent press or features section\n\nDesign: Professional but approachable. Use [brand colors]. Show credibility and success. Mobile-responsive.',
        },
        {
          heading: 'Coach/Consultant Template',
          code: 'Build a digital business card for [Your Name], [Type] Coach/Consultant.\n\nInclude:\n- Welcoming photo and headline\n- "I help [target audience] achieve [outcome]" statement\n- Services offered (3-4 cards)\n- Testimonial or results\n- Contact form for inquiries\n- "Schedule Free Consultation" button\n- Social proof (certifications, client count)\n\nDesign: Warm, trustworthy, professional. Use calming colors. Build trust. Mobile-responsive.',
        },
        {
          heading: 'Real Estate Agent Template',
          code: 'Build a digital business card for [Your Name], Real Estate Agent.\n\nInclude:\n- Professional photo and branding\n- Areas served\n- Specialties (buyer\'s agent, luxury homes, etc.)\n- Recent sales or testimonials\n- Contact info with "Text Me" button\n- "Search Listings" link\n- "Free Home Valuation" CTA\n- Social media links\n\nDesign: Professional, trustworthy. Use gold/blue or brand colors. Show success. Mobile-responsive.',
        },
        {
          heading: 'Freelancer/Contractor Template',
          code: 'Build a digital business card for [Your Name], Freelance [Profession].\n\nInclude:\n- Name, title, and specialty\n- "Available for hire" status indicator\n- Services offered with pricing (optional)\n- Skills and tools used\n- Client testimonials (2-3)\n- Contact form\n- "View Portfolio" and "Hire Me" buttons\n- Response time indicator\n\nDesign: Professional, modern. Show availability and expertise. Use [preferred colors]. Mobile-responsive.',
        },
        {
          heading: 'Customization Tips',
          items: [
            'Replace [bracketed items] with your specific information',
            'Add your brand colors (use hex codes for precision)',
            'Include links to your actual social profiles and calendar',
            'Use a professional photo (headshot or brand image)',
            'Keep bio concise - 2-3 sentences maximum',
            'Make primary CTA button prominent and clear',
            'Test on mobile - most people will view on phones',
          ],
        },
        {
          note: 'These templates are starting points. Feel free to mix and match elements from different templates to create something unique to you!',
        },
      ],
    },
  },
  'ai-tools-stack': {
    id: 'ai-tools-stack',
    title: 'Essential AI Tools Stack',
    description: 'The complete toolkit I use to build AI-powered applications without coding experience.',
    type: 'article',
    icon: '🛠️',
    lastUpdated: 'November 2024',
    content: {
      sections: [
        {
          heading: 'My Current AI Tools Stack',
          text: 'These are the tools I use daily to build, manage, and grow my AI-powered applications. No computer science degree required.',
        },
        {
          heading: '1. Building & Development',
          items: [
            'Lovable (lovable.dev) - Primary tool for building web apps with AI. Best for rapid prototyping and full applications.',
            'Cursor (cursor.sh) - AI-powered code editor. Use when I need more control or working with existing codebases.',
            'Claude (Anthropic) - For complex problem-solving, planning features, and generating detailed prompts.',
            'ChatGPT (OpenAI) - Quick questions, brainstorming, and content generation.',
          ],
        },
        {
          heading: '2. Design & Assets',
          items: [
            'Midjourney - AI image generation for hero images, backgrounds, and visual assets.',
            'DALL-E 3 - Quick image generation directly in ChatGPT.',
            'Figma - Designing mockups and planning layouts before building.',
            'Unsplash/Pexels - Free stock photos when needed.',
          ],
        },
        {
          heading: '3. Deployment & Hosting',
          items: [
            'Vercel - One-click deployment for web apps. Free tier is generous.',
            'Netlify - Alternative to Vercel, also great for static sites.',
            'Supabase - Backend database and authentication (PostgreSQL with AI assistance).',
            'Firebase - Real-time databases and user management.',
          ],
        },
        {
          heading: '4. Business & Operations',
          items: [
            'Stripe - Payment processing for subscriptions and one-time payments.',
            'Lemon Squeezy - Alternative to Stripe, handles taxes automatically.',
            'ConvertKit - Email marketing and newsletter management.',
            'Calendly - Booking and scheduling for consultations.',
          ],
        },
        {
          heading: '5. Analytics & Monitoring',
          items: [
            'Plausible - Privacy-friendly analytics (alternative to Google Analytics).',
            'PostHog - Product analytics and feature flags.',
            'Sentry - Error tracking and monitoring.',
            'Hotjar - User behavior and heatmaps.',
          ],
        },
        {
          heading: '6. Productivity & Organization',
          items: [
            'Notion - Documentation, project planning, and knowledge base.',
            'Linear - Task and project management.',
            'Slack - Team communication and community management.',
            'Loom - Quick video explanations and tutorials.',
          ],
        },
        {
          heading: '7. Learning & Community',
          items: [
            'Twitter/X - Following AI builders and staying updated.',
            'Reddit (r/ChatGPT, r/ClaudeAI) - Community discussions and tips.',
            'YouTube - Tutorials and walkthroughs.',
            'Discord communities - Real-time help and networking.',
          ],
        },
        {
          heading: 'Cost Breakdown (Monthly)',
          items: [
            'Lovable: $0-20 (free tier available)',
            'Cursor: $20 (Pro plan)',
            'Claude/ChatGPT: $20-40 (Pro plans)',
            'Midjourney: $30 (Basic plan)',
            'Vercel/Netlify: $0 (free tier)',
            'Supabase: $0-25 (free tier, then paid)',
            'Total: ~$90-135/month to run entire operation',
          ],
        },
        {
          heading: 'Tools I Don\'t Use (But You Might)',
          items: [
            'GitHub Copilot - Great if you write code manually',
            'Replit - Good all-in-one alternative to Cursor',
            'Webflow - No-code website builder (not AI-powered)',
            'Bubble - No-code app builder (steeper learning curve)',
          ],
        },
        {
          heading: 'My Recommendation for Beginners',
          text: 'Start with just these 3 tools:',
          items: [
            'Lovable (for building)',
            'ChatGPT or Claude (for planning and prompts)',
            'Vercel (for deploying)',
          ],
          note: 'Total cost: $0-20/month. Everything else can be added as you grow and need more capabilities.',
        },
        {
          text: 'The tools matter less than the mindset. I\'ve built everything with different combinations of these tools. Pick what works for you and start building.',
        },
      ],
    },
  },
  'deployment-checklist': {
    id: 'deployment-checklist',
    title: 'Deployment Checklist',
    description: 'Everything you need to check before deploying your app to production.',
    type: 'guide',
    icon: '✅',
    lastUpdated: 'November 2024',
    content: {
      sections: [
        {
          heading: 'Pre-Deployment Checklist',
          text: 'Go through this checklist before making your app live to ensure a smooth launch.',
        },
        {
          heading: '1. Functionality Testing',
          items: [
            '✓ All buttons and links work correctly',
            '✓ Forms submit properly and show confirmation',
            '✓ Navigation works on all pages',
            '✓ Images and media load correctly',
            '✓ Any calculations or tools produce accurate results',
            '✓ Error messages display when something goes wrong',
          ],
        },
        {
          heading: '2. Mobile Responsiveness',
          items: [
            '✓ Test on actual mobile device (not just browser resize)',
            '✓ Text is readable without zooming',
            '✓ Buttons are large enough to tap easily',
            '✓ Images scale properly',
            '✓ Navigation menu works on mobile',
            '✓ Forms are easy to fill out on mobile',
          ],
        },
        {
          heading: '3. Content Review',
          items: [
            '✓ All text is spelled correctly',
            '✓ Contact information is accurate',
            '✓ Links go to correct destinations',
            '✓ Email addresses work',
            '✓ Social media links are correct',
            '✓ No placeholder text remains (Lorem ipsum, etc.)',
          ],
        },
        {
          heading: '4. Performance',
          items: [
            '✓ Page loads in under 3 seconds',
            '✓ Images are optimized (not too large)',
            '✓ No unnecessary animations that slow things down',
            '✓ Works on slower internet connections',
          ],
        },
        {
          heading: '5. SEO Basics',
          items: [
            '✓ Page title is descriptive',
            '✓ Meta description is set',
            '✓ Images have alt text',
            '✓ URL is clean and readable',
            '✓ Favicon is set',
          ],
        },
        {
          heading: '6. Security & Privacy',
          items: [
            '✓ Forms have spam protection (if needed)',
            '✓ No sensitive information exposed',
            '✓ HTTPS is enabled (usually automatic)',
            '✓ Privacy policy linked (if collecting data)',
            '✓ Cookie consent (if using cookies)',
          ],
        },
        {
          heading: '7. Browser Testing',
          items: [
            '✓ Test in Chrome',
            '✓ Test in Safari',
            '✓ Test in Firefox',
            '✓ Test in Edge (if targeting business users)',
          ],
        },
        {
          heading: '8. Final Touches',
          items: [
            '✓ Favicon displays correctly',
            '✓ Social media preview image set (Open Graph)',
            '✓ Contact form sends to correct email',
            '✓ Analytics tracking is set up (if desired)',
            '✓ Custom domain connected (if using one)',
          ],
        },
        {
          heading: 'Post-Deployment',
          text: 'After deploying, do these immediately:',
          items: [
            '1. Visit your live site and click through everything',
            '2. Submit a test form to verify it works',
            '3. Check on mobile device',
            '4. Share with a friend and ask them to test',
            '5. Monitor for any errors in first 24 hours',
          ],
        },
        {
          heading: 'Common Issues & Quick Fixes',
          items: [
            'Images not loading? Check file paths and hosting',
            'Forms not submitting? Verify email settings',
            'Looks different on mobile? Add responsive design rules',
            'Slow loading? Optimize and compress images',
            'Links broken? Update URLs to absolute paths',
          ],
        },
        {
          note: 'Don\'t aim for perfection. Get it live, then iterate. A live app with minor issues beats a perfect app that never launches.',
        },
      ],
    },
  },
};

export default function ResourcePage() {
  const params = useParams();
  const id = params.id as string;
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [resource, setResource] = useState<ResourceContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchResource(id);
    }
  }, [id]);

  const fetchResource = async (resourceId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Try API first
      const response = await fetch(`/api/resources/${resourceId}`);
      const data = await response.json();
      
      if (data.success && data.resource) {
        // Format the resource data
        const formattedResource: ResourceContent = {
          ...data.resource,
          lastUpdated: data.resource.lastUpdated 
            ? new Date(data.resource.lastUpdated.seconds * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : undefined,
        };
        setResource(formattedResource);
      } else if (fallbackResources[resourceId]) {
        // Fallback to hardcoded resources for backwards compatibility
        setResource(fallbackResources[resourceId]);
      } else {
        setError('Resource not found');
      }
    } catch (error) {
      console.error('Error fetching resource:', error);
      // Try fallback
      if (fallbackResources[id]) {
        setResource(fallbackResources[id]);
      } else {
        setError('Failed to load resource');
      }
    } finally {
      setLoading(false);
    }
  };

  const typeLabels = {
    article: 'Article',
    'ad-landing': 'Ad / Landing Page',
    blog: 'Blog Post',
    prompts: 'Prompts',
    tool: 'Tool',
    guide: 'Guide',
    video: 'Video',
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Loading resource...</p>
        </div>
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-xl">{error || 'Resource not found'}</p>
          <Link
            href="/resources"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  // Check if resource is unpublished and user is not admin
  if (!resource.published && !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-xl">Resource not found</p>
          <p className="text-gray-400">This resource is not published yet.</p>
          <Link
            href="/resources"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
          >
            ← Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Preview Banner for Unpublished Resources */}
      {!resource.published && isAdmin && (
        <div className="bg-yellow-600/20 border-b border-yellow-500/50 py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">👁️</span>
              <p className="text-yellow-400 text-sm font-semibold">
                Preview Mode: This resource is not published. Only admins can see this.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold underline"
            >
              Edit in Admin →
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Back Link */}
        <Link 
          href="/resources"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 mb-8"
        >
          ← Back to Resources
        </Link>

        {/* Resource Header */}
        <div className="mb-12 space-y-6">
          <div className="flex items-start gap-6">
            <div className="text-6xl md:text-7xl">{resource.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-zinc-900 border border-gray-800 rounded-full text-xs font-semibold text-gray-400">
                  {typeLabels[resource.type]}
                </span>
                {resource.lastUpdated && (
                  <span className="text-sm text-gray-500">
                    Updated {resource.lastUpdated}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                {resource.title}
              </h1>
            </div>
          </div>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
            {resource.description}
          </p>
        </div>

        {/* Resource Content */}
        <div className="space-y-8">
          {resource.content.sections.map((section, index) => (
            <div key={index} className="space-y-4">
              {section.heading && (
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {section.heading}
                </h2>
              )}
              
              {section.text && (
                <p className="text-base md:text-lg text-gray-400 leading-relaxed">
                  {section.text}
                </p>
              )}
              
              {section.items && (
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-400">
                      <span className="text-red-500 font-bold flex-shrink-0 mt-1">→</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.code && (
                <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 overflow-x-auto">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {section.code}
                  </pre>
                </div>
              )}
              
              {section.note && (
                <div className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-xl p-6">
                  <p className="text-gray-300 leading-relaxed">
                    <span className="font-bold text-red-400">Note:</span> {section.note}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-3xl p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Found this helpful?
          </h3>
          <p className="text-gray-400 mb-6">
            Share it with someone who's ready to start building with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/resources"
              className="px-6 py-3 bg-zinc-900 border border-gray-800 text-white font-semibold rounded-xl hover:bg-zinc-800 transition-all"
            >
              ← More Resources
            </Link>
            <a
              href="https://twitter.com/intent/tweet?text=Check%20out%20this%20resource"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
            >
              Share on Twitter →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

