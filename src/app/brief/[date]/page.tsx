'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getDailyBriefByDate, TAG_CONFIG } from '@/data/daily-briefs';
import type { DailyBrief, DailyBriefStory } from '@/data/daily-briefs';
import {
  LAUNCHBOX_SITE_URL,
  LAUNCHBOX_PROMO_SHORT,
  LAUNCHBOX_PROMO_LONG,
  LAUNCHBOX_CTA_LABEL,
  LAUNCHBOX_LINK_NEW_TAB,
} from '@/lib/launchbox-marketing';
import { getExternalLinkProps } from '@/lib/external-link';

const StoryTag = ({ tag }: { tag: DailyBriefStory['tag'] }) => {
  const config = TAG_CONFIG[tag];
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest rounded-sm ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default function DailyBriefPage() {
  const params = useParams();
  const dateSlug = params.date as string;

  const [brief, setBrief] = useState<DailyBrief | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dateSlug) return;

    const loadBrief = async () => {
      setLoading(true);
      try {
        // Prefer Firestore so manual/cron-generated briefs override sample static data
        const res = await fetch(`/api/daily-briefs?date=${encodeURIComponent(dateSlug)}`);
        const data = await res.json();
        if (data.success && data.brief) {
          setBrief(data.brief as DailyBrief);
          return;
        }
      } catch (err) {
        console.error('[Brief] Failed to fetch:', err);
      }

      const staticBrief = getDailyBriefByDate(dateSlug);
      setBrief(staticBrief ?? null);
    };

    void loadBrief().finally(() => {
      setLoading(false);
    });
  }, [dateSlug]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Loading brief...</p>
        </div>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xl font-light mb-6">Brief not found.</p>
          <Link
            href="/newsletter-directory"
            className="text-white border-b border-white pb-1 hover:text-red-500 hover:border-red-500 transition-colors uppercase tracking-widest text-sm font-bold"
          >
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-red-500/30">
      {/* Compact Editorial Header */}
      <header className="w-full max-w-[90rem] mx-auto px-6 pt-28 md:pt-40 pb-12 md:pb-16">
        <div className="max-w-4xl">
          <Link
            href="/newsletter-directory"
            className="text-zinc-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-8 inline-block"
            aria-label="Back to archive"
            tabIndex={0}
          >
            ← Archive
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <span className="inline-block bg-red-600 text-white px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              Daily Brief
            </span>
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              {brief.displayDate}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-6">
            {brief.title}
          </h1>

          {brief.editorNote && (
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl">
              {brief.editorNote}
            </p>
          )}
        </div>
      </header>

      {/* Stories */}
      <main className="w-full max-w-[90rem] mx-auto px-6 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8">
            {/* Top Stories */}
            <div className="border-t border-zinc-800 pt-10">
              <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mb-8">
                Today&apos;s Stories
              </h2>

              <div className="space-y-0">
                {brief.stories.map((story, index) => (
                  <article
                    key={index}
                    className="group border-b border-zinc-900 py-8 first:pt-0 last:border-b-0"
                  >
                    <div className="flex items-start gap-4 md:gap-6">
                      <span className="text-zinc-700 font-mono text-3xl md:text-4xl font-bold leading-none mt-1 select-none flex-shrink-0 w-9 md:w-10 text-right">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>

                      <div className="flex-1 min-w-0 flex flex-col gap-3 md:gap-4">
                        <div className="flex items-center gap-3 md:gap-4">
                          {story.sourceAvatarUrl ? (
                            <div className="shrink-0">
                              <img
                                src={story.sourceAvatarUrl}
                                alt=""
                                width={64}
                                height={64}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border border-zinc-700 bg-zinc-900"
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  e.currentTarget.style.visibility = 'hidden';
                                }}
                              />
                            </div>
                          ) : null}
                          <div className="flex min-w-0 flex-col gap-1.5 items-start leading-tight">
                            <StoryTag tag={story.tag} />
                            {story.source ? (
                              <span className="text-zinc-600 text-xs font-medium tracking-wide">
                                via {story.source}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                          {story.link ? (
                            <a
                              href={story.link}
                              className="hover:text-red-400 transition-colors"
                              tabIndex={0}
                              {...getExternalLinkProps(story.link)}
                            >
                              {story.headline}
                              <span className="inline-block ml-2 text-zinc-600 group-hover:text-red-500 transition-colors text-base">
                                ↗
                              </span>
                            </a>
                          ) : (
                            story.headline
                          )}
                        </h3>

                        <p className="text-[1.05rem] md:text-[1.1rem] font-light leading-[1.75] text-zinc-400">
                          {story.summary}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            {brief.quickLinks && brief.quickLinks.length > 0 && (
              <div className="border-t border-zinc-800 pt-10 mt-10">
                <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mb-6">
                  Quick Links
                </h2>
                <ul className="space-y-3">
                  {brief.quickLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url || '#'}
                        className="group/link flex items-center gap-3 text-zinc-300 hover:text-white transition-colors"
                        tabIndex={0}
                        aria-label={link.label}
                        {...getExternalLinkProps(link.url || undefined)}
                      >
                        <span className="text-red-600 text-xs">●</span>
                        <span className="text-[1rem] font-light border-b border-zinc-800 group-hover/link:border-zinc-500 transition-colors pb-0.5">
                          {link.label}
                        </span>
                        <span className="text-zinc-700 group-hover/link:text-zinc-400 transition-colors text-sm">
                          ↗
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mobile Tool of the Day */}
            {brief.toolOfTheDay && (
              <div className="lg:hidden border-t border-zinc-800 pt-10 mt-10">
                <ToolOfTheDayCard tool={brief.toolOfTheDay} />
              </div>
            )}

            {/* Mobile Author Block */}
            <div className="mt-16 pt-10 border-t border-zinc-800 lg:hidden flex items-center gap-6">
              <div className="w-14 h-14 rounded-full overflow-hidden grayscale opacity-80 border border-zinc-800 flex-shrink-0">
                <img
                  src="/default-avatar.svg"
                  alt="Ian McDonald"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://ui-avatars.com/api/?name=Ian+McDonald&background=000000&color=ffffff';
                  }}
                />
              </div>
              <div>
                <p className="text-white font-bold text-base">Ian McDonald</p>
                <p className="text-zinc-500 text-sm mt-0.5">Builder, Founder of LaunchBox · launchbox.space</p>
              </div>
            </div>

            {/* Mobile LaunchBox Promo */}
            <div className="mt-10 lg:hidden border border-zinc-800 bg-zinc-950 p-8 relative font-satoshi">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              <h3 className="text-white font-bold text-2xl tracking-tight mb-3">LaunchBox</h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                {LAUNCHBOX_PROMO_SHORT}
              </p>
              <a
                href={LAUNCHBOX_SITE_URL}
                {...LAUNCHBOX_LINK_NEW_TAB}
                className="inline-flex items-center text-sm font-bold text-white uppercase tracking-widest hover:text-red-500 transition-colors"
                tabIndex={0}
                aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
              >
                {LAUNCHBOX_CTA_LABEL} <span className="ml-2">→</span>
              </a>
            </div>
          </div>

          {/* Right Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              {/* Author */}
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden grayscale opacity-80 border border-zinc-800">
                  <img
                    src="/default-avatar.svg"
                    alt="Ian McDonald"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://ui-avatars.com/api/?name=Ian+McDonald&background=000000&color=ffffff';
                    }}
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Ian McDonald</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Builder · LaunchBox · launchbox.space</p>
                </div>
              </div>

              {/* Tool of the Day */}
              {brief.toolOfTheDay && <ToolOfTheDayCard tool={brief.toolOfTheDay} />}

              {/* LaunchBox Promo */}
              <div className="border border-zinc-800 bg-zinc-950 p-7 relative group hover:border-zinc-700 transition-colors font-satoshi">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                <h3 className="text-white font-bold text-xl tracking-tight mb-3">LaunchBox</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                  {LAUNCHBOX_PROMO_SHORT}
                </p>
                <a
                  href={LAUNCHBOX_SITE_URL}
                  {...LAUNCHBOX_LINK_NEW_TAB}
                  className="inline-flex items-center text-xs font-bold text-white uppercase tracking-widest hover:text-red-500 transition-colors"
                  tabIndex={0}
                  aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
                >
                  {LAUNCHBOX_CTA_LABEL} <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Brutalist Footer CTA */}
      <footer className="w-full bg-white text-black py-24 md:py-32 px-6 mt-12">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="text-left">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 uppercase leading-none">
                Build Real <br className="hidden md:block" /> Things.
              </h2>
              <p className="text-xl md:text-2xl font-light text-zinc-600 mb-12 max-w-xl leading-relaxed">
                Get practical AI insights, what I&apos;m building, and lessons from the trenches delivered to your inbox.
              </p>
              <Link
                href="/newsletter"
                className="inline-block bg-black text-white px-10 py-6 text-sm md:text-base font-bold hover:bg-red-600 transition-colors uppercase tracking-[0.2em]"
                tabIndex={0}
                aria-label="Subscribe to the newsletter"
              >
                Subscribe Now
              </Link>
            </div>

            <div className="border-4 border-black p-10 md:p-16 relative bg-zinc-50 group hover:-translate-y-2 transition-transform duration-300 font-satoshi">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
              <p className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">Your platform</p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6">LaunchBox</h3>
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8 max-w-lg">
                {LAUNCHBOX_PROMO_LONG}
              </p>
              <a
                href={LAUNCHBOX_SITE_URL}
                {...LAUNCHBOX_LINK_NEW_TAB}
                className="inline-flex items-center text-black font-bold uppercase tracking-[0.15em] hover:text-red-600 transition-colors border-b-2 border-black hover:border-red-600 pb-1"
                tabIndex={0}
                aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
              >
                {LAUNCHBOX_CTA_LABEL} <span className="ml-3 text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Tool of the Day Card ─── */

interface ToolOfTheDayProps {
  tool: {
    name: string;
    description: string;
    link?: string;
    verdict: string;
  };
}

const ToolOfTheDayCard = ({ tool }: ToolOfTheDayProps) => {
  return (
    <div className="border border-zinc-800 bg-zinc-950/60 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-600" />
      <p className="text-zinc-500 font-mono text-[0.65rem] uppercase tracking-[0.2em] mb-3">
        Tool of the Day
      </p>
      <h3 className="text-white font-bold text-lg tracking-tight mb-2">
        {tool.link ? (
          <a
            href={tool.link}
            className="hover:text-red-400 transition-colors"
            tabIndex={0}
            aria-label={`Visit ${tool.name}`}
            {...getExternalLinkProps(tool.link)}
          >
            {tool.name} <span className="text-zinc-600 text-sm">↗</span>
          </a>
        ) : (
          tool.name
        )}
      </h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-4">{tool.description}</p>
      <p className="text-zinc-300 text-sm font-medium italic border-t border-zinc-800 pt-3">
        &ldquo;{tool.verdict}&rdquo;
      </p>
    </div>
  );
};
