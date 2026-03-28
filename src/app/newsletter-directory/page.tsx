'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/lib/adminConfig';
import { newsletterIssues } from '@/data/newsletter-issues';
import { dailyBriefs } from '@/data/daily-briefs';
import {
  LAUNCHBOX_SITE_URL,
  LAUNCHBOX_CTA_LABEL,
  LAUNCHBOX_LINK_NEW_TAB,
} from '@/lib/launchbox-marketing';

interface NewsletterResource {
  id: string;
  title: string;
  description: string;
  type: string;
  icon: string;
  published: boolean;
  lastUpdated?: string;
  createdAt?: string | { seconds: number; nanoseconds: number };
  userHasAccess?: boolean;
}

const formatDate = (date: string | { seconds: number; nanoseconds: number } | undefined): string => {
  if (!date) return '';
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date && typeof date === 'object' && 'seconds' in date) {
    dateObj = new Date(date.seconds * 1000);
  } else {
    return '';
  }
  if (isNaN(dateObj.getTime())) return '';
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface FirestoreBrief {
  date: string;
  displayDate: string;
  title: string;
  editorNote?: string;
  stories: Array<{ headline: string }>;
  generatedAt: string;
}

interface FirestoreWeekly {
  date: string;
  displayDate: string;
  title: string;
  intro?: string;
  weekLabel?: string;
  generatedAt: string;
}

type ArchiveRowVariant = 'brief' | 'issue' | 'platform';

interface ArchiveListRowProps {
  href: string;
  variant: ArchiveRowVariant;
  title: string;
  dateLabel: string;
  description: string;
  readLabel: string;
}

const ArchiveListRow = ({
  href,
  variant,
  title,
  dateLabel,
  description,
  readLabel,
}: ArchiveListRowProps) => {
  return (
    <Link
      href={href}
      className="group block border-b-2 border-zinc-700 py-5 md:py-6 hover:bg-zinc-950/80 transition-colors -mx-1 px-1 md:-mx-2 md:px-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      tabIndex={0}
      aria-label={`${readLabel}: ${title}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <div className="min-w-0 flex-1 flex gap-4 sm:gap-5">
          <span
            className={`shrink-0 w-14 sm:w-20 text-xs font-mono font-bold uppercase tracking-[0.18em] pt-1 ${
              variant === 'brief' ? 'text-red-400' : variant === 'platform' ? 'text-amber-400' : 'text-zinc-400'
            }`}
          >
            {variant === 'brief' ? 'Brief' : variant === 'platform' ? 'Platform' : 'Issue'}
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg md:text-xl font-semibold text-white leading-snug tracking-tight group-hover:text-red-400 transition-colors">
              {title}
            </h2>
            <p className="text-sm md:text-[0.9375rem] text-zinc-400 mt-2 leading-[1.65] line-clamp-2 sm:line-clamp-3">
              {description}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start sm:text-right sm:shrink-0 sm:pt-1 pl-[4.5rem] sm:pl-0">
          <span className="text-sm text-zinc-400 font-mono tabular-nums whitespace-nowrap leading-normal">
            {dateLabel}
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-red-400 group-hover:text-red-300 transition-colors whitespace-nowrap">
            {readLabel} →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function NewsletterDirectoryPage() {
  const { user } = useAuth();
  const [newsletters, setNewsletters] = useState<NewsletterResource[]>([]);
  const [firestoreBriefs, setFirestoreBriefs] = useState<FirestoreBrief[]>([]);
  const [firestoreWeeklies, setFirestoreWeeklies] = useState<FirestoreWeekly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateStatus, setGenerateStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [generatingWeekly, setGeneratingWeekly] = useState(false);
  const [weeklyStatus, setWeeklyStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const userIsAdmin = isAdmin(user?.uid);

  const handleGenerateBrief = async () => {
    if (!user) {
      setGenerateStatus({ type: 'error', message: 'You must be signed in to generate a brief.' });
      return;
    }

    setGenerating(true);
    setGenerateStatus(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/generate-daily-brief', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const raw = await res.text();
      let data: {
        success?: boolean;
        error?: string;
        details?: string;
        message?: string;
        dateSlug?: string;
        step?: string;
      } = {};

      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        setGenerateStatus({
          type: 'error',
          message: `Server error (${res.status}): ${raw.replace(/\s+/g, ' ').slice(0, 500)}`,
        });
        return;
      }

      if (!res.ok) {
        const detail = data.details ? ` ${data.details}` : '';
        setGenerateStatus({
          type: 'error',
          message: `${data.error || `Request failed (${res.status})`}${detail}`.trim(),
        });
        return;
      }

      if (data.success) {
        setGenerateStatus({ type: 'success', message: `Brief generated for ${data.dateSlug}` });
        // Refresh the briefs list
        const briefsRes = await fetch('/api/daily-briefs');
        const briefsData = await briefsRes.json();
        if (briefsData.success && briefsData.briefs) {
          setFirestoreBriefs(briefsData.briefs as FirestoreBrief[]);
        }
      } else {
        setGenerateStatus({ type: 'error', message: data.error || data.message || 'Generation failed' });
      }
    } catch {
      setGenerateStatus({ type: 'error', message: 'Network error — could not reach the server.' });
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateLaunchboxWeekly = async () => {
    if (!user) {
      setWeeklyStatus({ type: 'error', message: 'You must be signed in to generate a weekly update.' });
      return;
    }

    setGeneratingWeekly(true);
    setWeeklyStatus(null);

    try {
      const idToken = await user.getIdToken();
      const res = await fetch('/api/admin/generate-launchbox-weekly', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const raw = await res.text();
      let data: {
        success?: boolean;
        error?: string;
        details?: string;
        message?: string;
        dateSlug?: string;
        step?: string;
      } = {};

      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        setWeeklyStatus({
          type: 'error',
          message: `Server error (${res.status}): ${raw.replace(/\s+/g, ' ').slice(0, 500)}`,
        });
        return;
      }

      if (!res.ok) {
        const detail = data.details ? ` ${data.details}` : '';
        setWeeklyStatus({
          type: 'error',
          message: `${data.error || `Request failed (${res.status})`}${detail}`.trim(),
        });
        return;
      }

      if (data.success) {
        setWeeklyStatus({
          type: 'success',
          message: `LaunchBox weekly saved for ${data.dateSlug}`,
        });
        const weeklyRes = await fetch('/api/launchbox-weekly');
        const weeklyData = await weeklyRes.json();
        if (weeklyData.success && weeklyData.items) {
          setFirestoreWeeklies(weeklyData.items as FirestoreWeekly[]);
        }
      } else {
        setWeeklyStatus({
          type: 'error',
          message: data.message || data.error || 'Generation skipped or failed',
        });
      }
    } catch {
      setWeeklyStatus({ type: 'error', message: 'Network error — could not reach the server.' });
    } finally {
      setGeneratingWeekly(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        const [resourcesRes, briefsRes, weeklyRes] = await Promise.all([
          fetch(
            user?.uid
              ? `/api/resources?published=true&userId=${user.uid}`
              : '/api/resources?published=true'
          ),
          fetch('/api/daily-briefs'),
          fetch('/api/launchbox-weekly'),
        ]);

        const resourcesData = await resourcesRes.json();
        if (resourcesData.success) {
          const all = resourcesData.resources || [];
          setNewsletters(all.filter((r: NewsletterResource) => r.type === 'newsletter'));
        }

        const briefsData = await briefsRes.json();
        if (briefsData.success && briefsData.briefs) {
          setFirestoreBriefs(briefsData.briefs as FirestoreBrief[]);
        }

        const weeklyData = await weeklyRes.json();
        if (weeklyData.success && weeklyData.items) {
          setFirestoreWeeklies(weeklyData.items as FirestoreWeekly[]);
        }
      } catch {
        setError('Failed to load newsletters');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [user?.uid]);

  const firestoreBriefDates = useMemo(
    () => new Set(firestoreBriefs.map((b) => b.date)),
    [firestoreBriefs]
  );

  const staticBriefsFallbackOnly = useMemo(
    () => dailyBriefs.filter((b) => !firestoreBriefDates.has(b.date)),
    [firestoreBriefDates]
  );

  return (
    <div className="bg-black min-h-screen">
      {/* Header */}
      <section className="border-b-2 border-zinc-700 pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Resources
          </Link>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Newsletter Archive
          </h1>
          <p className="text-base sm:text-lg text-gray-400 mt-3 max-w-2xl">
            Past issues of Ian&apos;s newsletter — practical AI insights, what he&apos;s building, and lessons from the trenches.
          </p>

          {/* Admin: Generate Daily Brief */}
          {userIsAdmin && (
            <div className="mt-6 flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleGenerateBrief}
                  disabled={generating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-bold uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Generate today's daily brief"
                  tabIndex={0}
                >
                  {generating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Generate Today&apos;s Brief
                    </>
                  )}
                </button>

                {generateStatus && (
                  <span
                    className={`text-sm font-medium ${
                      generateStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {generateStatus.message}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleGenerateLaunchboxWeekly}
                  disabled={generatingWeekly}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-700 text-white text-sm font-bold uppercase tracking-widest hover:bg-amber-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Generate LaunchBox weekly platform update"
                  tabIndex={0}
                >
                  {generatingWeekly ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating weekly...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                      Generate LaunchBox weekly
                    </>
                  )}
                </button>

                {weeklyStatus && (
                  <span
                    className={`text-sm font-medium ${
                      weeklyStatus.type === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {weeklyStatus.message}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Directory Content */}
      <section className="py-8 md:py-10">
        <div className="max-w-5xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Loading newsletters...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
              <Link href="/resources" className="text-red-500 hover:text-red-400 mt-4 inline-block">
                ← Back to Resources
              </Link>
            </div>
          ) : newsletterIssues.length === 0 &&
            newsletters.length === 0 &&
            staticBriefsFallbackOnly.length === 0 &&
            firestoreBriefs.length === 0 &&
            firestoreWeeklies.length === 0 ? (
            <div className="text-center py-20 space-y-6">
              <p className="text-gray-400 text-lg">
                No newsletter issues published yet. Check back soon.
              </p>
              <Link
                href="/newsletter"
                className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                Subscribe to get new issues →
              </Link>
            </div>
          ) : (
            <div className="space-y-10 md:space-y-12">
              {/* LaunchBox platform updates (Firestore) */}
              {firestoreWeeklies.length > 0 && (
                <div>
                  <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                    LaunchBox platform updates
                  </h3>
                  <div className="border-t-2 border-zinc-600">
                    {firestoreWeeklies.map((w) => (
                      <ArchiveListRow
                        key={w.date}
                        href={`/launchbox-weekly/${w.date}`}
                        variant="platform"
                        title={w.title}
                        dateLabel={w.weekLabel || w.displayDate}
                        description={w.intro?.trim() || 'Weekly digest of what shipped in LaunchBox.'}
                        readLabel="Read update"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Daily Briefs (static + Firestore) */}
              {(staticBriefsFallbackOnly.length > 0 || firestoreBriefs.length > 0) && (
                <div>
                  <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                    Daily Briefs
                  </h3>
                  <div className="border-t-2 border-zinc-600">
                    {firestoreBriefs.map((brief) => (
                      <ArchiveListRow
                        key={brief.date}
                        href={`/brief/${brief.date}`}
                        variant="brief"
                        title={brief.title}
                        dateLabel={brief.displayDate}
                        description={brief.editorNote || `${brief.stories.length} stories`}
                        readLabel="Read brief"
                      />
                    ))}
                    {staticBriefsFallbackOnly.map((brief) => (
                      <ArchiveListRow
                        key={brief.date}
                        href={`/brief/${brief.date}`}
                        variant="brief"
                        title={brief.title}
                        dateLabel={brief.displayDate}
                        description={brief.editorNote || `${brief.stories.length} stories`}
                        readLabel="Read brief"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Long-form Newsletter Issues */}
              {newsletterIssues.length > 0 && (
                <div>
                  <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                    Long-form Issues
                  </h3>
                  <div className="border-t-2 border-zinc-600">
                    {newsletterIssues.map((issue) => (
                      <ArchiveListRow
                        key={issue.date}
                        href={`/newsletter/${issue.date}`}
                        variant="issue"
                        title={issue.title}
                        dateLabel={issue.displayDate}
                        description={issue.description}
                        readLabel="Read issue"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* API-fetched newsletter resources */}
              {newsletters.length > 0 && (
                <div>
                  <h3 className="text-zinc-400 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                    More Issues
                  </h3>
                  <div className="border-t-2 border-zinc-600">
                    {newsletters.map((newsletter) => (
                      <ArchiveListRow
                        key={newsletter.id}
                        href={`/resources/${newsletter.id}`}
                        variant="issue"
                        title={newsletter.title}
                        dateLabel={
                          formatDate(newsletter.lastUpdated || newsletter.createdAt) || '—'
                        }
                        description={newsletter.description}
                        readLabel="Read issue"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="border-t-2 border-zinc-700 py-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-white mb-3">
              Get new issues in your inbox
            </h3>
            <p className="text-gray-300 mb-4 max-w-xl mx-auto">
              Subscribe to Ian&apos;s newsletter for practical AI insights, what he&apos;s building with LaunchBox, and lessons from building in public.
            </p>
            <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">
              Launch your own white-label community at{' '}
              <a
                href={LAUNCHBOX_SITE_URL}
                {...LAUNCHBOX_LINK_NEW_TAB}
                className="text-red-400 hover:text-red-300 font-semibold underline underline-offset-2"
              >
                launchbox.space
              </a>
              . {LAUNCHBOX_CTA_LABEL} — $39.99 first month, then $49.99/mo.
            </p>
            <Link
              href="/newsletter"
              className="inline-block px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
            >
              Subscribe to Newsletter →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
