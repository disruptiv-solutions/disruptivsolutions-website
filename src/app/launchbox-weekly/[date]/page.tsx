'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  LAUNCHBOX_SITE_URL,
  LAUNCHBOX_PROMO_SHORT,
  LAUNCHBOX_PROMO_LONG,
  LAUNCHBOX_CTA_LABEL,
  LAUNCHBOX_LINK_NEW_TAB,
} from '@/lib/launchbox-marketing';
import { getExternalLinkProps } from '@/lib/external-link';
import { IAN_PROFILE_IMAGE_SRC } from '@/lib/ian-profile';
import type { LaunchboxWeeklyPublic } from '@/lib/launchbox-weekly-types';
import { LAUNCHBOX_BRAND } from '@/lib/launchbox-brand';

const lb = {
  orange: LAUNCHBOX_BRAND.signalOrange,
  cloud: LAUNCHBOX_BRAND.cloudWhite,
  blue: LAUNCHBOX_BRAND.launchBlue,
  tan: LAUNCHBOX_BRAND.tanRelay,
  ink: LAUNCHBOX_BRAND.ink,
} as const;

export default function LaunchboxWeeklyPage() {
  const params = useParams();
  const dateSlug = params.date as string;

  const [weekly, setWeekly] = useState<LaunchboxWeeklyPublic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dateSlug) return;

    const loadWeekly = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/launchbox-weekly?date=${encodeURIComponent(dateSlug)}`);
        const data = (await res.json()) as { success?: boolean; weekly?: LaunchboxWeeklyPublic | null };
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
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5 px-6"
        style={{ backgroundColor: lb.cloud, color: lb.blue }}
      >
        <div
          className="h-10 w-10 rounded-full border-[3px] animate-spin"
          style={{ borderColor: `${lb.tan} transparent ${lb.tan} ${lb.orange}` }}
          aria-hidden
        />
        <p className="font-lb-secondary text-xs font-semibold uppercase tracking-[0.28em]">Loading update</p>
      </div>
    );
  }

  if (!weekly) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: lb.cloud }}>
        <header
          className="sticky top-0 z-20 border-b backdrop-blur-md"
          style={{ borderColor: lb.tan, backgroundColor: `${lb.cloud}f2` }}
        >
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5">
            <span className="text-base font-bold tracking-tight" style={{ color: lb.ink }}>
              LaunchBox
            </span>
            <Link
              href="/newsletter-directory"
              className="text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
              style={{ color: lb.blue }}
              tabIndex={0}
              aria-label="Back to newsletter archive"
            >
              Archive
            </Link>
          </div>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="text-lg font-medium md:text-xl" style={{ color: lb.blue }}>
            This platform update could not be found.
          </p>
          <Link
            href="/newsletter-directory"
            className="mt-8 inline-flex items-center rounded-lg px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ backgroundColor: lb.orange, outlineColor: lb.blue }}
            tabIndex={0}
            aria-label="Return to newsletter archive"
          >
            Back to archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col pb-0">
      {/* Product chrome — Launch Blue structure */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-md"
        style={{ borderColor: lb.tan, backgroundColor: `${lb.cloud}f2` }}
      >
        <div className="mx-auto flex h-[3.25rem] max-w-6xl items-center justify-between px-5 md:px-6">
          <div className="flex items-center gap-2.5">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: lb.orange }}
              aria-hidden
            />
            <span className="text-[0.95rem] font-bold tracking-tight md:text-base" style={{ color: lb.ink }}>
              LaunchBox
            </span>
          </div>
          <nav aria-label="Page">
            <Link
              href="/newsletter-directory"
              className="rounded-md px-2 py-1 text-sm font-semibold transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: lb.blue, outlineColor: lb.orange }}
              tabIndex={0}
            >
              Archive
            </Link>
          </nav>
        </div>
      </header>

      <article>
        {/* Hero — Cloud White led, orange + blue hierarchy */}
        <section
          className="border-b px-5 pb-14 pt-10 md:px-6 md:pb-16 md:pt-14"
          style={{ borderColor: lb.tan }}
        >
          <div className="mx-auto max-w-3xl">
            <p
              className="font-lb-secondary mb-6 inline-block border-b pb-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
              style={{ color: lb.blue, borderColor: lb.tan }}
            >
              {weekly.weekLabel || weekly.displayDate}
            </p>
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className="rounded-full border px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.18em]"
                style={{
                  borderColor: lb.tan,
                  backgroundColor: '#fff',
                  color: lb.orange,
                }}
              >
                Platform update
              </span>
            </div>
            <h1 className="text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl lg:text-[3.25rem]">
              {weekly.title}
            </h1>
            {weekly.intro && (
              <p
                className="mt-6 text-base leading-relaxed md:text-lg md:leading-relaxed"
                style={{ color: lb.blue }}
              >
                {weekly.intro}
              </p>
            )}
            <div className="mt-10">
              <a
                href={LAUNCHBOX_SITE_URL}
                {...getExternalLinkProps(LAUNCHBOX_SITE_URL)}
                className="inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-sm transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ backgroundColor: lb.orange, outlineColor: lb.blue }}
                tabIndex={0}
                aria-label="Open LaunchBox at launchbox.space"
              >
                Visit LaunchBox
              </a>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-5 py-14 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-8">
              <h2
                className="font-lb-secondary mb-8 text-[0.7rem] font-semibold uppercase tracking-[0.28em]"
                style={{ color: lb.blue }}
              >
                This week
              </h2>
              <ul className="flex flex-col gap-6 md:gap-7">
                {weekly.highlights.map((h, i) => (
                  <li key={`${h.headline}-${i}`}>
                    <article
                      className="overflow-hidden rounded-2xl border bg-white shadow-[0_1px_0_rgba(42,52,66,0.05)] transition-[box-shadow,transform] duration-200 hover:shadow-md md:hover:-translate-y-px"
                      style={{ borderColor: lb.tan }}
                    >
                      <div className="flex gap-0">
                        <div className="w-1 shrink-0 self-stretch" style={{ backgroundColor: lb.orange }} aria-hidden />
                        <div className="min-w-0 flex-1 px-5 py-6 md:px-7 md:py-7">
                          <h3 className="text-lg font-bold leading-snug tracking-tight md:text-xl">{h.headline}</h3>
                          <p className="mt-3 text-base leading-relaxed md:text-[1.05rem]" style={{ color: lb.blue }}>
                            {h.blurb}
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>

              {/* Mobile: author + promo */}
              <div className="mt-12 space-y-6 lg:hidden">
                <AuthorBlock />
                <PromoCard />
              </div>
            </div>

            <aside className="hidden lg:col-span-4 lg:block">
              <div
                className="sticky top-24 space-y-6 rounded-2xl border p-6"
                style={{ borderColor: lb.tan, backgroundColor: 'rgba(75, 96, 127, 0.06)' }}
              >
                <AuthorBlock />
                <div className="rounded-xl border bg-white p-5" style={{ borderColor: lb.tan }}>
                  <PromoCard compact />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>

      {/* Footer — Launch Blue structural band */}
      <footer className="mt-auto px-5 py-16 md:px-6 md:py-24" style={{ backgroundColor: lb.blue, color: lb.cloud }}>
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 md:items-start">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
                Build real things
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed opacity-95">
                Practical AI notes, what we&apos;re shipping, and lessons from the trenches — straight to your inbox.
              </p>
              <Link
                href="/newsletter"
                className="mt-8 inline-flex items-center justify-center rounded-xl px-8 py-3.5 text-sm font-bold uppercase tracking-[0.12em] transition-[transform,opacity] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  backgroundColor: lb.orange,
                  color: '#fff',
                  outlineColor: lb.cloud,
                }}
                tabIndex={0}
                aria-label="Subscribe to the newsletter"
              >
                Subscribe
              </Link>
            </div>
            <div
              className="rounded-2xl border-2 p-8 md:p-9"
              style={{ borderColor: lb.tan, backgroundColor: 'rgba(247, 242, 236, 0.08)' }}
            >
              <p
                className="font-lb-secondary text-[0.65rem] font-bold uppercase tracking-[0.2em]"
                style={{ color: lb.tan }}
              >
                Your platform
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">LaunchBox</h3>
              <p className="mt-4 text-sm leading-relaxed opacity-95 md:text-base">{LAUNCHBOX_PROMO_LONG}</p>
              <a
                href={LAUNCHBOX_SITE_URL}
                {...LAUNCHBOX_LINK_NEW_TAB}
                className="mt-6 inline-flex items-center text-sm font-bold uppercase tracking-[0.14em] text-white underline decoration-2 underline-offset-[0.35rem] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm"
                style={{ outlineColor: lb.orange, textDecorationColor: lb.tan }}
                tabIndex={0}
                aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
              >
                {LAUNCHBOX_CTA_LABEL} <span className="ml-2">→</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const AuthorBlock = () => (
  <div className="flex items-center gap-4 rounded-xl border bg-white p-4" style={{ borderColor: lb.tan }}>
    <div
      className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2"
      style={{ borderColor: lb.tan }}
    >
      <img
        src={IAN_PROFILE_IMAGE_SRC}
        alt="Ian McDonald"
        width={48}
        height={48}
        className="h-full w-full object-cover object-center"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div>
      <p className="text-sm font-bold" style={{ color: lb.ink }}>
        Ian McDonald
      </p>
      <p className="mt-0.5 text-xs leading-snug" style={{ color: lb.blue }}>
        Builder · LaunchBox
      </p>
    </div>
  </div>
);

const PromoCard = ({ compact }: { compact?: boolean }) => (
  <div>
    <div className="h-1 w-12 rounded-full" style={{ backgroundColor: lb.orange }} aria-hidden />
    <h3
      className={`font-bold tracking-tight ${compact ? 'mt-3 text-lg' : 'mt-4 text-xl'}`}
      style={{ color: lb.ink }}
    >
      LaunchBox
    </h3>
    <p className={`mt-3 leading-relaxed ${compact ? 'text-sm' : 'text-base'}`} style={{ color: lb.blue }}>
      {LAUNCHBOX_PROMO_SHORT}
    </p>
    <a
      href={LAUNCHBOX_SITE_URL}
      {...LAUNCHBOX_LINK_NEW_TAB}
      className={`mt-5 inline-flex items-center font-bold uppercase tracking-widest transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 rounded-sm ${
        compact ? 'text-xs' : 'text-sm'
      }`}
      style={{ color: lb.orange, outlineColor: lb.blue }}
      tabIndex={0}
      aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
    >
      {LAUNCHBOX_CTA_LABEL} <span className="ml-2">→</span>
    </a>
  </div>
);
