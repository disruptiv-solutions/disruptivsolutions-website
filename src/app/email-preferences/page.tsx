'use client';

import { useCallback, useEffect, useState } from 'react';

type Preferences = { launchbox: boolean; ian: boolean };
type Status = 'loading' | 'ready' | 'saving' | 'saved' | 'invalid' | 'error' | 'unavailable';

const LANES: { key: keyof Preferences; title: string; blurb: string }[] = [
  {
    key: 'ian',
    title: 'Ian McDonald: Founder Log + AI Workshops',
    blurb:
      'Weekly founder stories, real AI builds, practical lessons, demonstrations, and public or paid workshops.',
  },
  {
    key: 'launchbox',
    title: 'LaunchBox: Product + Partner Updates',
    blurb:
      'Product changes, support resources, community updates, and included partner workshops.',
  },
];

export default function EmailPreferencesPage() {
  const [token, setToken] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<Preferences>({ launchbox: false, ian: false });
  const [status, setStatus] = useState<Status>('loading');

  // Read the token from the URL rather than useSearchParams, so this page needs
  // no Suspense boundary and never pre-renders with a stale token.
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get('t');
    if (!t) {
      setStatus('invalid');
      return;
    }
    setToken(t);

    // Read-only: loading this page must not change anything, because link
    // scanners fetch it before the subscriber does.
    fetch(`/api/email-preferences?t=${encodeURIComponent(t)}`)
      .then(async (res) => {
        if (!res.ok) {
          // A server-side misconfiguration is not the subscriber's problem and
          // must not be reported to them as an expired link.
          const body = (await res.json().catch(() => ({}))) as { error?: string };
          setStatus(
            body.error === 'not_configured' || res.status >= 500 ? 'unavailable' : 'invalid',
          );
          return;
        }
        const data = (await res.json()) as { preferences: Preferences };
        setPrefs(data.preferences);
        setStatus('ready');
      })
      .catch(() => setStatus('unavailable'));
  }, []);

  const save = useCallback(async () => {
    if (!token) return;
    setStatus('saving');
    try {
      const res = await fetch('/api/email-preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, ...prefs }),
      });
      setStatus(res.ok ? 'saved' : 'error');
    } catch {
      setStatus('error');
    }
  }, [token, prefs]);

  return (
    <main className="min-h-screen bg-[#040404] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="pointer-events-none fixed left-1/2 top-0 h-[400px] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-2xl px-5 py-16 sm:px-6 lg:py-24">
        <div className="mb-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-red-500/90">
            Email preferences
          </p>
          <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Choose what you get from{' '}
            <span className="bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">
              Ian
            </span>
          </h1>
          <p className="mt-4 leading-relaxed text-zinc-400">
            Pick one or both. Nothing changes until you hit save.
          </p>
        </div>

        {status === 'loading' && <p className="text-zinc-400">Loading your preferences…</p>}

        {status === 'invalid' && (
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-600/10 to-transparent p-8">
            <h2 className="mb-3 text-xl font-bold">This link isn&rsquo;t valid anymore</h2>
            <p className="leading-relaxed text-zinc-400">
              It may have expired, or the address was copied incompletely. Open the link from your
              most recent email, or just reply to any email from me and I&rsquo;ll set it manually.
            </p>
          </div>
        )}

        {status === 'unavailable' && (
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-600/10 to-transparent p-8">
            <h2 className="mb-3 text-xl font-bold">I can&rsquo;t load your preferences right now</h2>
            <p className="leading-relaxed text-zinc-400">
              That&rsquo;s a problem on my end, not with your link. Try again in a few minutes, or
              reply to any email from me and I&rsquo;ll set it manually.
            </p>
          </div>
        )}

        {status === 'saved' && (
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-600/10 to-transparent p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">You&rsquo;re set</h2>
            <p className="mx-auto max-w-md leading-relaxed text-zinc-400">
              {!prefs.ian && !prefs.launchbox
                ? "You've opted out of both lanes. You won't get either newsletter, and that's completely fine."
                : `You'll get ${[prefs.ian && 'the Founder Log + AI workshops', prefs.launchbox && 'LaunchBox product + partner updates'].filter(Boolean).join(' and ')}.`}
            </p>
          </div>
        )}

        {(status === 'ready' || status === 'saving' || status === 'error') && (
          <>
            <div className="space-y-4">
              {LANES.map((lane) => (
                <label
                  key={lane.key}
                  className="flex cursor-pointer gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-red-500/40"
                >
                  <input
                    type="checkbox"
                    checked={prefs[lane.key]}
                    onChange={(e) => setPrefs((p) => ({ ...p, [lane.key]: e.target.checked }))}
                    className="mt-1 h-5 w-5 shrink-0 accent-red-600"
                  />
                  <span>
                    <span className="block font-semibold">{lane.title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-zinc-400">
                      {lane.blurb}
                    </span>
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={save}
              disabled={status === 'saving'}
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
            >
              {status === 'saving' ? 'Saving…' : 'Save my preferences'}
            </button>

            {status === 'error' && (
              <p className="mt-4 text-sm text-red-400">
                That didn&rsquo;t save. Try again, or reply to any email from me and I&rsquo;ll sort
                it out.
              </p>
            )}

            <p className="mt-8 text-sm leading-relaxed text-zinc-500">
              Unchecking both means you stop hearing from me entirely. No hard feelings.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
