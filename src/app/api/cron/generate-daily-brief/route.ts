import { NextRequest, NextResponse } from 'next/server';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { renderDailyBriefEmailHtml } from '@/lib/daily-brief-email-template';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/* ─── X Accounts to Track ─── */

const X_ACCOUNTS = [
  'heyrobinai',
  'techhalla',
  'AiBreakfast',
  'mreflow',
  'dr_cintas',
  'rubenhassid',
  'heynavtoor',
  'r0ck3t23',
  'PhilKiel',
  'HenryCrochemore',
  'RoundtableSpace',
  'OfficialLoganK',
  'minchoi',
  'akshay_pachaar',
  'AmericanutopiaX',
  'sama',
  'AdityaJiRathore',
] as const;

/* ─── Ian McDonald Voice (matches generate-resource) ─── */

const IAN_BRIEF_VOICE = `You are writing in the voice of Ian McDonald, founder of LaunchBox.

Ian is a real builder, not a guru. He is "the guide who's still on the journey" — someone a few steps ahead, sharing what he is learning as he builds with AI in public. The content should feel like a smart, honest note from a builder in the trenches.

VOICE RULES:
- Write conversationally and directly
- Use short paragraphs and lots of white space
- Sound human, clear, grounded, and useful
- Be confident, but never arrogant
- Focus on practical insight, not hype
- Explain AI simply for non-technical readers
- Use active voice and contractions
- Fragments are okay. Em dashes are okay.

NEVER USE: corporate jargon, fake guru language, hypey marketing, buzzwords, passive voice, thought-leadership filler, grand predictions with no substance.

TONE: "this guy is legit," "this is useful," "he's actually building," "I can do this too."`;

/* ─── Types ─── */

interface TweetData {
  text: string;
  created_at?: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    impression_count: number;
  };
}

interface CollectedTweet {
  username: string;
  profileImageUrl: string | null;
  text: string;
  date: string;
  engagement: number;
}

/** Larger variant than default _normal (X CDN) */
const upgradeTwitterProfileImageUrl = (url: string): string =>
  url.replace(/_normal(\.[a-z]+)$/i, '_bigger$1');

const buildUsernameToAvatarMap = (tweets: CollectedTweet[]): Map<string, string> => {
  const map = new Map<string, string>();
  for (const t of tweets) {
    if (!t.profileImageUrl) continue;
    const key = t.username.toLowerCase();
    if (!map.has(key)) {
      map.set(key, upgradeTwitterProfileImageUrl(t.profileImageUrl));
    }
  }
  return map;
};

/**
 * Attach sourceAvatarUrl to each story by parsing @handles in `source` and matching tracked accounts.
 */
const enrichStoriesWithSourceAvatars = (
  stories: GeneratedBrief['stories'],
  tweets: CollectedTweet[]
): Array<GeneratedBrief['stories'][number] & { sourceAvatarUrl?: string }> => {
  const avatarByUser = buildUsernameToAvatarMap(tweets);

  return stories.map((story) => {
    const source = story.source || '';
    const handles = [...source.matchAll(/@([a-zA-Z0-9_]{1,15})/g)].map((m) => m[1].toLowerCase());

    let avatar: string | undefined;
    for (const h of handles) {
      const u = avatarByUser.get(h);
      if (u) {
        avatar = u;
        break;
      }
    }

    if (!avatar) {
      const lower = source.toLowerCase();
      for (const [username, url] of avatarByUser) {
        if (lower.includes(username)) {
          avatar = url;
          break;
        }
      }
    }

    if (!avatar) {
      return { ...story };
    }
    return { ...story, sourceAvatarUrl: avatar };
  });
};

interface GeneratedBrief {
  title: string;
  editorNote: string;
  stories: Array<{
    headline: string;
    source: string;
    summary: string;
    link: string;
    tag: 'breaking' | 'tool' | 'research' | 'funding' | 'launch' | 'opinion';
  }>;
  toolOfTheDay: {
    name: string;
    description: string;
    link: string;
    verdict: string;
  } | null;
  quickLinks: Array<{
    label: string;
    url: string;
  }>;
}

/* ─── Step 1: Fetch Tweets ─── */

const fetchAllTweets = async (bearerToken: string): Promise<CollectedTweet[]> => {
  const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const allTweets: CollectedTweet[] = [];

  // Batch user lookup — X API v2 supports up to 100 usernames
  const usernamesParam = X_ACCOUNTS.join(',');
  const userLookupRes = await fetch(
    `https://api.x.com/2/users/by?usernames=${usernamesParam}&user.fields=profile_image_url,username`,
    { headers: { Authorization: `Bearer ${bearerToken}` } }
  );

  if (!userLookupRes.ok) {
    console.error('[DailyBrief] Batch user lookup failed:', userLookupRes.status);
    return allTweets;
  }

  const userLookupData = (await userLookupRes.json()) as {
    data?: Array<{ id: string; username: string; profile_image_url?: string }>;
  };

  const users = userLookupData?.data ?? [];
  console.log(`[DailyBrief] Resolved ${users.length}/${X_ACCOUNTS.length} accounts`);

  // Fetch tweets for each user (sequential to respect rate limits)
  for (const user of users) {
    try {
      const tweetsRes = await fetch(
        `https://api.x.com/2/users/${user.id}/tweets?max_results=20&tweet.fields=text,created_at,public_metrics&start_time=${encodeURIComponent(startTime)}&exclude=retweets,replies`,
        { headers: { Authorization: `Bearer ${bearerToken}` } }
      );

      if (!tweetsRes.ok) {
        console.warn(`[DailyBrief] Tweet fetch failed for @${user.username}:`, tweetsRes.status);
        continue;
      }

      const tweetsData = (await tweetsRes.json()) as { data?: TweetData[] };
      const tweets = tweetsData?.data ?? [];

      for (const tweet of tweets) {
        if (!tweet?.text) continue;
        const engagement =
          (tweet.public_metrics?.like_count ?? 0) +
          (tweet.public_metrics?.retweet_count ?? 0) * 2 +
          (tweet.public_metrics?.reply_count ?? 0);

        allTweets.push({
          username: user.username,
          profileImageUrl: user.profile_image_url ?? null,
          text: tweet.text.replace(/\n/g, ' ').trim(),
          date: tweet.created_at
            ? new Date(tweet.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '',
          engagement,
        });
      }
    } catch (err) {
      console.warn(`[DailyBrief] Error fetching tweets for @${user.username}:`, err);
    }
  }

  // Sort by engagement descending so AI sees the most-engaged posts first
  allTweets.sort((a, b) => b.engagement - a.engagement);
  console.log(`[DailyBrief] Collected ${allTweets.length} total tweets`);
  return allTweets;
};

/* ─── Step 2: AI Generation ─── */

const generateBriefFromTweets = async (
  tweets: CollectedTweet[],
  openRouterKey: string,
  dateLabel: string
): Promise<GeneratedBrief | null> => {
  const tweetBlock = tweets
    .map((t) => `[@${t.username}] (${t.date}, engagement: ${t.engagement}): ${t.text}`)
    .join('\n');

  const jsonSchema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Short punchy title for the daily brief, e.g. "Monday AI Brief" or "The Open-Source Week"',
      },
      editorNote: {
        type: 'string',
        description: "Ian's 2-3 sentence opener setting the tone for the day. Conversational, direct, slightly opinionated.",
      },
      stories: {
        type: 'array',
        description: '5-7 of the most newsworthy/interesting stories distilled from the tweets',
        items: {
          type: 'object',
          properties: {
            headline: { type: 'string', description: 'Punchy news-style headline' },
            source: { type: 'string', description: 'The @username(s) who posted about this' },
            summary: {
              type: 'string',
              description: '2-3 sentences explaining why this matters. Written in Ian\'s voice — practical, grounded, no hype.',
            },
            link: { type: 'string', description: 'URL if mentioned in tweet, otherwise empty string' },
            tag: {
              type: 'string',
              enum: ['breaking', 'tool', 'research', 'funding', 'launch', 'opinion'],
              description: 'Category tag for the story',
            },
          },
          required: ['headline', 'source', 'summary', 'link', 'tag'],
          additionalProperties: false,
        },
      },
      toolOfTheDay: {
        type: ['object', 'null'],
        description: 'If any tweet mentions a specific AI tool worth highlighting, feature it here. Otherwise null.',
        properties: {
          name: { type: 'string' },
          description: { type: 'string', description: '2-3 sentences about what the tool does and why it matters.' },
          link: { type: 'string', description: 'URL if available, otherwise empty string' },
          verdict: { type: 'string', description: "One-line Ian-voice verdict, e.g. \"Essential for anyone building RAG apps.\"" },
        },
        required: ['name', 'description', 'link', 'verdict'],
        additionalProperties: false,
      },
      quickLinks: {
        type: 'array',
        description: '3-5 additional interesting tweets/topics that didn\'t make the main stories but are worth a click',
        items: {
          type: 'object',
          properties: {
            label: { type: 'string', description: 'Short descriptive label' },
            url: { type: 'string', description: 'URL if available, otherwise empty string' },
          },
          required: ['label', 'url'],
          additionalProperties: false,
        },
      },
    },
    required: ['title', 'editorNote', 'stories', 'toolOfTheDay', 'quickLinks'],
    additionalProperties: false,
  };

  const systemPrompt = `${IAN_BRIEF_VOICE}

You are generating a Daily AI Brief — a short, punchy digest of the day's top AI news and finds, curated from real posts by AI thought leaders on X (Twitter).

Your job:
1. Read through all the tweets below
2. Identify the 5-7 most newsworthy, interesting, or practically useful stories/themes
3. Group related tweets into single stories where they cover the same topic
4. Write each story with a punchy headline, source attribution, and 2-3 sentence summary in Ian's voice
5. If any tweet mentions a specific AI tool worth spotlighting, include a "Tool of the Day"
6. Add 3-5 quick links for interesting tweets that didn't make the main stories

RULES:
- Be selective. Not every tweet is a story. Prioritize things that are genuinely new, useful, or important.
- Ignore promotional/self-serving tweets unless they contain real news
- Combine tweets from different accounts that cover the same story
- Use the engagement numbers as a signal for what's resonating
- The source field should list @username(s) who posted about the story; put the primary account first (used for profile photo)
- Write summaries that explain WHY something matters to someone building with AI, not just WHAT happened
- If it's a slow news day, fewer stories is better than padding with filler`;

  const userPrompt = `Today is ${dateLabel}. Here are the latest posts from AI thought leaders on X from the last 24 hours:

${tweetBlock}

Generate the Daily AI Brief from these posts.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openRouterKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Disruptiv Solutions Daily Brief Generator',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'daily_brief',
          strict: true,
          schema: jsonSchema,
        },
      },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('[DailyBrief] OpenRouter error:', response.status, errText);
    return null;
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    console.error('[DailyBrief] Empty AI response');
    return null;
  }

  try {
    return JSON.parse(content) as GeneratedBrief;
  } catch (err) {
    console.error('[DailyBrief] Failed to parse AI JSON:', err);
    return null;
  }
};

/* ─── Step 3: Store in Firestore ─── */

type BriefForStorage = Omit<GeneratedBrief, 'stories'> & {
  stories: Array<GeneratedBrief['stories'][number] & { sourceAvatarUrl?: string }>;
};

const storeBrief = async (
  brief: BriefForStorage,
  dateSlug: string,
  displayDate: string,
  tweetCount: number
) => {
  const { adminDb } = initFirebaseAdmin();
  if (!adminDb) {
    throw new Error('Firebase Admin not initialized');
  }

  const baseDoc = {
    date: dateSlug,
    displayDate,
    title: brief.title,
    editorNote: brief.editorNote,
    stories: brief.stories,
    toolOfTheDay: brief.toolOfTheDay ?? null,
    quickLinks: brief.quickLinks,
    tweetCount,
    generatedAt: new Date().toISOString(),
  };

  let emailHtml: string | undefined;
  let emailHtmlGeneratedAt: string | undefined;
  try {
    emailHtml = renderDailyBriefEmailHtml({
      title: brief.title,
      editorNote: brief.editorNote,
      displayDate,
      stories: brief.stories.map((s) => ({
        headline: s.headline,
        source: s.source,
        summary: s.summary,
        link: s.link,
        tag: s.tag,
      })),
      quickLinks: brief.quickLinks,
      toolOfTheDay: brief.toolOfTheDay ?? null,
    });
    emailHtmlGeneratedAt = new Date().toISOString();
  } catch (err) {
    console.error('[DailyBrief] Email HTML render failed:', err);
  }

  const doc = {
    ...baseDoc,
    ...(emailHtml
      ? { emailHtml, emailHtmlGeneratedAt }
      : {}),
  };

  await adminDb.collection('daily-briefs').doc(dateSlug).set(doc);
  console.log(`[DailyBrief] Stored brief for ${dateSlug} in Firestore`);
  return doc;
};

/* ─── Cron window (8:00 America/Chicago) ───
 * Vercel crons are UTC-only. Two schedules (13:00 and 14:00 UTC) cover
 * 8am CT during CDT (UTC-5 → 13:00 UTC) and CST (UTC-6 → 14:00 UTC).
 * The handler exits early unless the current hour in Chicago is 8.
 */

const getHourInTimeZone = (date: Date, timeZone: string): number => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date);
  const hour = parts.find((p) => p.type === 'hour')?.value;
  return hour ? parseInt(hour, 10) : -1;
};

/* ─── Route Handler ─── */

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  const isVercel = process.env.VERCEL === '1';

  if (isVercel && !cronSecret) {
    return NextResponse.json(
      { error: 'CRON_SECRET must be set in Vercel project settings' },
      { status: 500 }
    );
  }

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  /* Only enforce the 8am CT window on Vercel so local/manual tests can run anytime */
  if (isVercel) {
    const chicagoHour = getHourInTimeZone(new Date(), 'America/Chicago');
    if (chicagoHour !== 8) {
      return NextResponse.json({
        skipped: true,
        reason: 'Not the 8:00 AM America/Chicago run window',
        chicagoHour,
      });
    }
  }

  const bearerToken = process.env.X_API_BEARER_TOKEN;
  const openRouterKey = process.env.OPENROUTER_API_KEY;

  if (!bearerToken) {
    return NextResponse.json({ error: 'X_API_BEARER_TOKEN not configured' }, { status: 500 });
  }
  if (!openRouterKey) {
    return NextResponse.json({ error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
  }

  try {
    const now = new Date();
    const dateSlug = `${now.getMonth() + 1}-${now.getDate()}-${String(now.getFullYear()).slice(2)}`;
    const displayDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const dateLabel = now.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    console.log(`[DailyBrief] Starting generation for ${dateSlug}`);

    // Step 1: Fetch tweets
    const tweets = await fetchAllTweets(bearerToken);

    if (tweets.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No tweets found in the last 24 hours from tracked accounts.',
        dateSlug,
      });
    }

    // Step 2: AI generation
    const generatedBrief = await generateBriefFromTweets(tweets, openRouterKey, dateLabel);

    if (!generatedBrief) {
      return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
    }

    const briefWithAvatars: BriefForStorage = {
      ...generatedBrief,
      stories: enrichStoriesWithSourceAvatars(generatedBrief.stories, tweets),
    };

    // Step 3: Store in Firestore
    const storedDoc = await storeBrief(briefWithAvatars, dateSlug, displayDate, tweets.length);

    const { emailHtml: _omitHtml, ...briefForResponse } = storedDoc as typeof storedDoc & {
      emailHtml?: string;
    };

    return NextResponse.json({
      success: true,
      dateSlug,
      brief: briefForResponse,
      emailHtmlGenerated: Boolean(_omitHtml),
    });
  } catch (error) {
    console.error('[DailyBrief] Cron error:', error);
    return NextResponse.json(
      { error: 'Daily brief generation failed', details: String(error) },
      { status: 500 }
    );
  }
}
