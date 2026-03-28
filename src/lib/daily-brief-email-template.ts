import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';
import { getIanProfileImageUrl } from '@/lib/ian-profile';

/** Shape stored in Firestore `daily-briefs` (email fields optional). */
export type DailyBriefForEmail = {
  title: string;
  editorNote: string;
  displayDate: string;
  stories: Array<{
    headline: string;
    source: string;
    summary: string;
    link: string;
    tag: string;
  }>;
  quickLinks: Array<{ label: string; url: string }>;
  toolOfTheDay: {
    name: string;
    description: string;
    link: string;
    verdict: string;
  } | null;
};

const PREHEADER_MAX = 140;

const STORY_TAG_STYLES: Record<
  string,
  { theme_dark_color: string; source_text_color: string }
> = {
  breaking: { theme_dark_color: '#B91C1C', source_text_color: '#FECACA' },
  tool: { theme_dark_color: '#C2410C', source_text_color: '#FED7AA' },
  research: { theme_dark_color: '#1E3A5F', source_text_color: '#BFDBFE' },
  funding: { theme_dark_color: '#14532D', source_text_color: '#BBF7D0' },
  launch: { theme_dark_color: '#7C2D12', source_text_color: '#FDE68A' },
  opinion: { theme_dark_color: '#4C1D95', source_text_color: '#DDD6FE' },
};

const DEFAULT_STORY_STYLE = {
  theme_dark_color: '#2E3D52',
  source_text_color: '#E8D8C9',
};

let compiledTemplate: Handlebars.TemplateDelegate | null = null;

const getCompiledTemplate = (): Handlebars.TemplateDelegate => {
  if (compiledTemplate) {
    return compiledTemplate;
  }
  const templatePath = join(process.cwd(), 'src', 'emails', 'daily-brief-email.hbs');
  const source = readFileSync(templatePath, 'utf8');
  compiledTemplate = Handlebars.compile(source);
  return compiledTemplate;
};

/**
 * Only allow safe href targets for email HTML (avoid javascript: etc.).
 */
export const sanitizeEmailHref = (raw: string | undefined | null): string => {
  const s = (raw ?? '').trim();
  if (!s) {
    return '#';
  }
  const lower = s.toLowerCase();
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:')
  ) {
    return s;
  }
  return '#';
};

const humanizeTag = (tag: string): string => {
  if (!tag) return 'Story';
  return tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
};

const truncatePreheader = (text: string): string => {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= PREHEADER_MAX) {
    return t;
  }
  return `${t.slice(0, PREHEADER_MAX - 1).trim()}…`;
};

const defaultWebsiteUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (url) {
    return url.replace(/\/$/, '');
  }
  return 'https://example.com';
};

export type DailyBriefEmailTemplateContext = {
  subject_line: string;
  preheader_text: string;
  website_url: string;
  date_string: string;
  headline: string;
  intro_text: string;
  stories: Array<{
    category: string;
    source: string;
    title: string;
    description: string;
    url: string;
    theme_dark_color: string;
    source_text_color: string;
  }>;
  quick_links: Array<{ title: string; url: string }>;
  tool_of_the_day: {
    title: string;
    url: string;
    description: string;
    quote?: string;
  } | null;
  promo: unknown;
  author_name: string;
  /** Absolute URL to 1:1 profile image for email clients */
  author_image_url: string;
  ps_text: string;
};

export const buildDailyBriefEmailContext = (
  brief: DailyBriefForEmail
): DailyBriefEmailTemplateContext => {
  const website_url = defaultWebsiteUrl();
  const author_name =
    process.env.DAILY_BRIEF_EMAIL_AUTHOR_NAME?.trim() || 'Ian McDonald';
  const ps_text = process.env.DAILY_BRIEF_EMAIL_PS_TEXT?.trim() || '';

  const stories = (brief.stories ?? []).map((s) => {
    const styles =
      STORY_TAG_STYLES[s.tag?.toLowerCase() ?? ''] ?? DEFAULT_STORY_STYLE;
    return {
      category: humanizeTag(s.tag),
      source: s.source,
      title: s.headline,
      description: s.summary,
      url: sanitizeEmailHref(s.link),
      theme_dark_color: styles.theme_dark_color,
      source_text_color: styles.source_text_color,
    };
  });

  const quick_links = (brief.quickLinks ?? [])
    .filter((q) => (q.url ?? '').trim().length > 0)
    .map((q) => ({
      title: q.label,
      url: sanitizeEmailHref(q.url),
    }));

  let tool_of_the_day: DailyBriefEmailTemplateContext['tool_of_the_day'] = null;
  if (brief.toolOfTheDay && (brief.toolOfTheDay.name ?? '').trim()) {
    const t = brief.toolOfTheDay;
    const quote = (t.verdict ?? '').trim();
    tool_of_the_day = {
      title: t.name,
      url: sanitizeEmailHref(t.link),
      description: t.description,
      ...(quote ? { quote } : {}),
    };
  }

  return {
    subject_line: `${brief.title} — ${brief.displayDate}`,
    preheader_text: truncatePreheader(brief.editorNote),
    website_url,
    date_string: brief.displayDate,
    headline: brief.title,
    intro_text: brief.editorNote,
    stories,
    quick_links,
    tool_of_the_day,
    promo: false,
    author_name,
    author_image_url: getIanProfileImageUrl(website_url),
    ps_text,
  };
};

export const renderDailyBriefEmailHtml = (brief: DailyBriefForEmail): string => {
  const context = buildDailyBriefEmailContext(brief);
  const compile = getCompiledTemplate();
  return compile(context);
};
