'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  LAUNCHBOX_SITE_URL,
  LAUNCHBOX_GITHUB_REPO_URL,
  LAUNCHBOX_PROMO_SHORT,
  LAUNCHBOX_PROMO_LONG,
  LAUNCHBOX_CTA_LABEL,
  LAUNCHBOX_LINK_NEW_TAB,
} from '@/lib/launchbox-marketing';
import { getExternalLinkProps } from '@/lib/external-link';
import { IAN_PROFILE_IMAGE_SRC } from '@/lib/ian-profile';
import type { LaunchboxWeeklyDoc } from '@/lib/launchbox-weekly-types';

export default function LaunchboxWeeklyPage() {
  const params = useParams();
  const dateSlug = params.date as string;

  const [weekly, setWeekly] = useState<LaunchboxWeeklyDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dateSlug) return;

    const loadWeekly = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/launchbox-weekly?date=${encodeURIComponent(dateSlug)}`);
        const data = (await res.json()) as { success?: boolean; weekly?: LaunchboxWeeklyDoc | null };
        if (data.success && data.weekly) {
          setWeekly(data.weekly);
          return;
        }
      } catch (err) {
        console.error('[LaunchboxWeekly] Failed to fetch:', err);
      }
      setWeekly(null);
    };

    void loadWeekly().finally(() => {
      setLoading(false);
    });
  }, [dateSlug]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" />
          <p className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Loading update...</p>
        </div>
      </div>
    );
  }

  if (!weekly) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xl font-light mb-6">This weekly update was not found.</p>
          <Link
            href="/newsletter-directory"
            className="text-white border-b border-white pb-1 hover:text-red-500 hover:border-red-500 transition-colors uppercase tracking-widest text-sm font-bold"
            tabIndex={0}
            aria-label="Return to newsletter archive"
          >
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-red-500/30">
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

          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="inline-block bg-amber-600 text-white px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.2em]">
              LaunchBox platform
            </span>
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              {weekly.weekLabel || weekly.displayDate}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-6">
            {weekly.title}
          </h1>

          {weekly.intro && (
            <p className="text-lg md:text-xl text-zinc-400 font-light leading-relaxed max-w-3xl">
              {weekly.intro}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-8">
            <a
              href={LAUNCHBOX_GITHUB_REPO_URL}
              {...getExternalLinkProps(LAUNCHBOX_GITHUB_REPO_URL)}
              className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white border-b border-zinc-600 hover:border-white transition-colors pb-0.5"
              tabIndex={0}
              aria-label="View LaunchBox repository on GitHub"
            >
              Repository →
            </a>
            {weekly.compareUrl && (
              <a
                href={weekly.compareUrl}
                {...getExternalLinkProps(weekly.compareUrl)}
                className="text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white border-b border-zinc-600 hover:border-white transition-colors pb-0.5"
                tabIndex={0}
                aria-label="View commit range on GitHub"
              >
                Compare on GitHub →
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="w-full max-w-[90rem] mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-8 space-y-12">
            <section aria-label="Highlights">
              <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mb-6">This week</h2>
              <ul className="space-y-10">
                {weekly.highlights.map((h, i) => (
                  <li key={`${h.headline}-${i}`} className="border-l-2 border-amber-600/80 pl-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">{h.headline}</h3>
                    <p className="text-zinc-400 mt-3 leading-relaxed text-base md:text-lg">{h.blurb}</p>
                    {h.commitUrl && (
                      <a
                        href={h.commitUrl}
                        {...getExternalLinkProps(h.commitUrl)}
                        className="inline-block mt-4 text-xs font-bold uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                        tabIndex={0}
                        aria-label={`View commit for ${h.headline}`}
                      >
                        Commit link →
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </section>

            {weekly.forBuilders?.trim() && (
              <section
                className="border border-zinc-800 bg-zinc-950/80 p-6 md:p-8"
                aria-label="For builders"
              >
                <h2 className="text-zinc-500 font-mono text-xs uppercase tracking-[0.2em] mb-4">
                  For builders
                </h2>
                <p className="text-zinc-400 leading-relaxed">{weekly.forBuilders}</p>
              </section>
            )}

            <div className="flex items-center gap-4 pt-4 lg:hidden">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900">
                <img
                  src={IAN_PROFILE_IMAGE_SRC}
                  alt="Ian McDonald"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover object-center"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div>
                <p className="text-white font-bold text-base">Ian McDonald</p>
                <p className="text-zinc-500 text-sm mt-0.5">Builder, Founder of LaunchBox · launchbox.space</p>
              </div>
            </div>

            <div className="mt-10 lg:hidden border border-zinc-800 bg-zinc-950 p-8 relative font-satoshi">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              <h3 className="text-white font-bold text-2xl tracking-tight mb-3">LaunchBox</h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">{LAUNCHBOX_PROMO_SHORT}</p>
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

          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900">
                  <img
                    src={IAN_PROFILE_IMAGE_SRC}
                    alt="Ian McDonald"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Ian McDonald</p>
                  <p className="text-zinc-500 text-xs mt-0.5">Builder · LaunchBox · launchbox.space</p>
                </div>
              </div>

              <p className="text-zinc-600 text-xs font-mono uppercase tracking-widest">
                {weekly.commitCount} commit{weekly.commitCount === 1 ? '' : 's'} · {weekly.repoFullName}
              </p>

              <div className="border border-zinc-800 bg-zinc-950 p-7 relative group hover:border-zinc-700 transition-colors font-satoshi">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                <h3 className="text-white font-bold text-xl tracking-tight mb-3">LaunchBox</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-5">{LAUNCHBOX_PROMO_SHORT}</p>
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
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8 max-w-lg">{LAUNCHBOX_PROMO_LONG}</p>
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
