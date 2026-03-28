/**
 * Daily AI Briefs — short-form news digests.
 * URL format: /brief/3-23-26 (month-day-year)
 */

export interface DailyBriefStory {
  headline: string;
  source?: string;
  /** X/Twitter profile image URL when matched from tracked accounts (cron-generated briefs) */
  sourceAvatarUrl?: string;
  summary: string;
  link?: string;
  tag: 'breaking' | 'tool' | 'research' | 'funding' | 'launch' | 'opinion';
}

export interface DailyBrief {
  date: string;
  displayDate: string;
  title: string;
  editorNote?: string;
  stories: DailyBriefStory[];
  toolOfTheDay?: {
    name: string;
    description: string;
    link?: string;
    verdict: string;
  };
  quickLinks?: Array<{
    label: string;
    url: string;
  }>;
}

export const TAG_CONFIG: Record<DailyBriefStory['tag'], { label: string; color: string }> = {
  breaking: { label: 'Breaking', color: 'bg-red-600 text-white' },
  tool: { label: 'Tool', color: 'bg-zinc-700 text-zinc-200' },
  research: { label: 'Research', color: 'bg-indigo-600/80 text-indigo-100' },
  funding: { label: 'Funding', color: 'bg-emerald-600/80 text-emerald-100' },
  launch: { label: 'Launch', color: 'bg-amber-600/80 text-amber-100' },
  opinion: { label: 'Opinion', color: 'bg-zinc-600 text-zinc-200' },
};

export const dailyBriefs: DailyBrief[] = [
  {
    date: '3-23-26',
    displayDate: 'March 23, 2026',
    title: 'Monday AI Brief',
    editorNote:
      'Big week ahead. OpenAI is shipping again, open-source models are closing the gap faster than anyone expected, and there\'s a new tool I can\'t stop using. Let\'s get into it.',
    stories: [
      {
        headline: 'OpenAI Drops GPT-5.4 With Native Tool Use',
        source: 'The Verge',
        summary:
          'The new model can natively call APIs, read files, and execute multi-step workflows without external orchestration. Early benchmarks show a 40% improvement on agentic tasks. This is a big deal for anyone building AI products.',
        tag: 'breaking',
        link: '#',
      },
      {
        headline: 'Llama 4 Scout Outperforms GPT-4o on Coding Benchmarks',
        source: 'Hugging Face Blog',
        summary:
          'Meta\'s latest open-weight model is turning heads. It\'s free, it\'s fast, and on SWE-bench it\'s neck-and-neck with closed models costing 10x more to run.',
        tag: 'research',
        link: '#',
      },
      {
        headline: 'Mistral Raises $1.3B at $13B Valuation',
        source: 'TechCrunch',
        summary:
          'The French AI lab continues to attract massive capital. They\'re betting big on enterprise agents and on-prem deployments — a direct counter to OpenAI\'s cloud-first model.',
        tag: 'funding',
        link: '#',
      },
      {
        headline: 'Cursor Adds Background Agents',
        source: 'Cursor Blog',
        summary:
          'You can now spin up autonomous coding agents that run in the background on cloud VMs. Think of it as a junior dev you can hand tasks to while you focus on architecture.',
        tag: 'launch',
        link: '#',
      },
      {
        headline: 'Why I Stopped Using RAG for Everything',
        source: 'Ian McDonald',
        summary:
          'Hot take: most people reaching for Retrieval-Augmented Generation don\'t need it. A well-structured prompt with context windows this large is simpler, cheaper, and often better.',
        tag: 'opinion',
      },
    ],
    toolOfTheDay: {
      name: 'Firecrawl',
      description:
        'Scrape any website into clean, LLM-ready markdown in one API call. I\'ve been using this to build knowledge bases for RAG pipelines (when I actually need RAG) and it just works.',
      link: 'https://firecrawl.dev',
      verdict: 'Essential for anyone building AI apps that need web data.',
    },
    quickLinks: [
      { label: 'Anthropic\'s new safety research paper', url: '#' },
      { label: 'Google DeepMind open-sources Gemma 3', url: '#' },
      { label: 'Y Combinator AI batch highlights', url: '#' },
      { label: 'The best AI newsletters to follow in 2026', url: '#' },
    ],
  },
];

export const getDailyBriefByDate = (dateSlug: string): DailyBrief | undefined =>
  dailyBriefs.find((brief) => brief.date === dateSlug);
