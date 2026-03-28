import { NextResponse } from 'next/server';
import { jsonrepair } from 'jsonrepair';
import { initFirebaseAdmin } from '@/lib/firebase-admin';
import { utcDateToBriefSlug } from '@/lib/daily-brief-date-slug';
import { LAUNCHBOX_GITHUB_REPO_FULL_NAME } from '@/lib/launchbox-marketing';
import { sanitizeLaunchboxWeeklyForPublic } from '@/lib/launchbox-weekly-public';
import type { LaunchboxWeeklyDoc, LaunchboxWeeklyGenerated } from '@/lib/launchbox-weekly-types';

const COLLECTION = 'launchbox-weekly';
const MAX_COMMIT_PAGES = 5;
const COMMITS_PER_PAGE = 100;

const IAN_LAUNCHBOX_WEEKLY_VOICE = `You are writing in the voice of Ian McDonald, founder of LaunchBox.

Readers are creators, coaches, and community owners using LaunchBox — not engineers. Translate repository activity into what changed for them in plain language: new capabilities, fixes, improvements, and anything that affects their experience.

RULES:
- Friendly, direct, minimal jargon (no stack traces, file paths, or library names unless a customer would recognize them)
- Do not invent features not supported by the commit list
- Group related commits into single highlights when they are the same theme
- Ignore pure chore commits (lockfile-only, typo in comments) unless user-visible
- If the list is mostly internal refactors, say so honestly and focus on any user-facing impact

PRIVACY (required for public release):
- Never mention GitHub, commit SHAs/hashes, branch names, or URLs
- Do not describe internal admin/superadmin tools, auth tokens, sessions, security internals, or infrastructure
- Frame internal-only work in customer terms only when there is a clear end-user benefit; otherwise skip or generalize ("stability and performance")
- Do not name employees or GitHub usernames from commit metadata

TONE: helpful product update, not a sales pitch.`;

type GitHubCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name?: string; date?: string } | null;
  };
  author: { login: string } | null;
};

const stripJsonFence = (raw: string): string => {
  let s = raw.trim();
  if (s.startsWith('```')) {
    s = s.replace(/^```(?:json)?\s*\n?/i, '');
    s = s.replace(/\n?```\s*$/i, '');
  }
  return s.trim();
};

const parseWeeklyJson = (content: string): { ok: true; data: LaunchboxWeeklyGenerated } | { ok: false; reason: string } => {
  const cleaned = stripJsonFence(content);
  try {
    const parsed = JSON.parse(cleaned) as LaunchboxWeeklyGenerated;
    if (!parsed?.title || !Array.isArray(parsed.highlights)) {
      return { ok: false, reason: 'AI JSON missing title or highlights array.' };
    }
    return { ok: true, data: parsed };
  } catch (firstErr) {
    try {
      const repaired = jsonrepair(cleaned);
      const parsed = JSON.parse(repaired) as LaunchboxWeeklyGenerated;
      if (!parsed?.title || !Array.isArray(parsed.highlights)) {
        return { ok: false, reason: `Repaired JSON still invalid: ${String(firstErr)}` };
      }
      return { ok: true, data: parsed };
    } catch (e2) {
      return {
        ok: false,
        reason: `Failed to parse AI JSON: ${String(firstErr)}; repair: ${String(e2)}`,
      };
    }
  }
};

const githubHeaders = (token: string): HeadersInit => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'X-GitHub-Api-Version': '2022-11-28',
});

const fetchDefaultBranch = async (
  token: string,
  owner: string,
  repo: string
): Promise<string | null> => {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: githubHeaders(token),
  });
  if (!res.ok) {
    const t = await res.text();
    console.error('[LaunchboxWeekly] repo meta failed:', res.status, t);
    return null;
  }
  const data = (await res.json()) as { default_branch?: string };
  return data.default_branch ?? 'main';
};

const fetchCommitsSince = async (
  token: string,
  owner: string,
  repo: string,
  branch: string,
  sinceIso: string
): Promise<GitHubCommit[]> => {
  const all: GitHubCommit[] = [];
  for (let page = 1; page <= MAX_COMMIT_PAGES; page += 1) {
    const url = new URL(`https://api.github.com/repos/${owner}/${repo}/commits`);
    url.searchParams.set('sha', branch);
    url.searchParams.set('since', sinceIso);
    url.searchParams.set('per_page', String(COMMITS_PER_PAGE));
    url.searchParams.set('page', String(page));

    const res = await fetch(url.toString(), { headers: githubHeaders(token) });
    if (!res.ok) {
      const t = await res.text();
      console.error('[LaunchboxWeekly] commits page failed:', res.status, t);
      break;
    }
    const batch = (await res.json()) as GitHubCommit[];
    if (!Array.isArray(batch) || batch.length === 0) break;
    all.push(...batch);
    if (batch.length < COMMITS_PER_PAGE) break;
  }
  return all;
};

const formatCommitsForPrompt = (commits: GitHubCommit[]): string => {
  return commits
    .map((c) => {
      const firstLine = (c.commit?.message ?? '').split('\n')[0]?.trim() ?? '';
      return `- ${firstLine}`;
    })
    .join('\n');
};

const generateWeeklyFromCommits = async (
  commits: GitHubCommit[],
  openRouterKey: string,
  weekContext: string
): Promise<{ ok: true; data: LaunchboxWeeklyGenerated } | { ok: false; reason: string }> => {
  const model =
    process.env.OPENROUTER_LAUNCHBOX_WEEKLY_MODEL?.trim() ||
    process.env.OPENROUTER_DAILY_BRIEF_MODEL?.trim() ||
    'openai/gpt-4o';

  const block = formatCommitsForPrompt(commits);

  const systemPrompt = `${IAN_LAUNCHBOX_WEEKLY_VOICE}

You are summarizing LaunchBox platform work from internal change notes (derived from commits) for a public weekly update page.

OUTPUT: One JSON object only, no markdown fences. Required keys:
- "title": string (short headline for the week)
- "weekLabel": string (human-readable week, e.g. "Week of March 22, 2026")
- "intro": string (2-4 sentences setting context in Ian's voice)
- "highlights": array of 3-10 objects, each with only "headline" (string) and "blurb" (2-3 sentences, customer-safe, no links)

Do not include "commitUrl", "forBuilders", or any other keys.`;

  const userPrompt = `${weekContext}

Change notes (one line per change; order may vary):

${block}

Produce the JSON summary.`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openRouterKey}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      'X-Title': 'Disruptiv Solutions LaunchBox Weekly',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.65,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    const snippet = errText.length > 500 ? `${errText.slice(0, 500)}…` : errText;
    const keyHint =
      response.status === 401
        ? ' OpenRouter rejected this API key (401). Check OPENROUTER_API_KEY in Vercel.'
        : '';
    return {
      ok: false,
      reason: `OpenRouter HTTP ${response.status}${snippet ? `: ${snippet}` : ''}${keyHint}`,
    };
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (data.error?.message) {
    return { ok: false, reason: `OpenRouter: ${data.error.message}` };
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return { ok: false, reason: 'OpenRouter returned no message content.' };
  }

  return parseWeeklyJson(content);
};

export const runLaunchboxWeeklyGeneration = async (): Promise<NextResponse> => {
  const githubToken = process.env.GITHUB_TOKEN?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  if (!githubToken) {
    return NextResponse.json(
      {
        error: 'GITHUB_TOKEN not configured',
        details: 'Add GITHUB_TOKEN to environment variables (repo read access).',
        step: 'config',
      },
      { status: 500 }
    );
  }
  if (!openRouterKey) {
    return NextResponse.json(
      {
        error: 'OPENROUTER_API_KEY not configured',
        details: 'Add OPENROUTER_API_KEY to environment variables.',
        step: 'config',
      },
      { status: 500 }
    );
  }

  const repoFull = LAUNCHBOX_GITHUB_REPO_FULL_NAME;
  const [owner, repo] = repoFull.split('/');
  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'Invalid LAUNCHBOX_GITHUB_REPO_FULL_NAME', details: repoFull },
      { status: 500 }
    );
  }

  const branch =
    process.env.LAUNCHBOX_GITHUB_DEFAULT_BRANCH?.trim() ||
    (await fetchDefaultBranch(githubToken, owner, repo)) ||
    'main';

  const now = new Date();
  const since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const sinceIso = since.toISOString();

  try {
    const commits = await fetchCommitsSince(githubToken, owner, repo, branch, sinceIso);

    if (commits.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No commits found in the last 7 days on the default branch.',
        dateSlug: utcDateToBriefSlug(now),
        branch,
        repoFullName: repoFull,
      });
    }

    const weekContext = `Product: LaunchBox
Window: changes from the last 7 days (since ${sinceIso} UTC)
Items to summarize: ${commits.length}`;

    const generated = await generateWeeklyFromCommits(commits, openRouterKey, weekContext);

    if (!generated.ok) {
      return NextResponse.json(
        { error: 'AI generation failed', details: generated.reason, step: 'openrouter' },
        { status: 500 }
      );
    }

    const dateSlug = utcDateToBriefSlug(now);
    const displayDate = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const highlights = generated.data.highlights.map(({ headline, blurb }) => ({
      headline,
      blurb,
    }));

    const doc: LaunchboxWeeklyDoc = {
      title: generated.data.title,
      weekLabel: generated.data.weekLabel,
      intro: generated.data.intro,
      highlights,
      date: dateSlug,
      displayDate,
      commitCount: commits.length,
      repoFullName: repoFull,
      generatedAt: now.toISOString(),
      windowSince: sinceIso,
    };

    const { adminDb, error: adminInitError } = initFirebaseAdmin();
    if (!adminDb) {
      throw new Error(adminInitError || 'Firebase Admin not initialized');
    }

    await adminDb.collection(COLLECTION).doc(dateSlug).set(doc);
    console.log(`[LaunchboxWeekly] Stored weekly issue ${dateSlug}`);

    const weeklyPublic = sanitizeLaunchboxWeeklyForPublic(doc);

    return NextResponse.json({
      success: true,
      dateSlug,
      weekly: weeklyPublic,
    });
  } catch (error) {
    console.error('[LaunchboxWeekly] Generation error:', error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: 'LaunchBox weekly generation failed', details: message, step: 'unknown' },
      { status: 500 }
    );
  }
};
