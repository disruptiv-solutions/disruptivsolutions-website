'use client';

import { useState, type FormEvent } from 'react';

const BOOKING_URL = 'https://calendar.app.google/okpHPUV8TA85GBaA6';

type Field = {
  key: string;
  label: string;
  hint?: string;
  type?: 'text' | 'textarea';
  optional?: boolean;
};

const QUESTIONS: Field[] = [
  {
    key: 'doing',
    label: 'What do you do, and who do you serve?',
    hint: 'One or two lines is plenty.',
    type: 'textarea',
  },
  {
    key: 'timeDrain',
    label: "What's eating the most time in your week right now?",
    hint: 'The stuff that runs through you.',
    type: 'textarea',
  },
  {
    key: 'target',
    label: 'Who or what are you trying to win in the next 90 days?',
    hint: 'A client, a funder, a contract, a launch.',
    type: 'textarea',
  },
  {
    key: 'tried',
    label: 'What have you already tried, and where does it fall short?',
    hint: 'Tools, approaches, or pitches that did not quite land.',
    type: 'textarea',
  },
  {
    key: 'outcome',
    label: 'If one thing came out of working together that moved you forward, what would it be?',
    type: 'textarea',
  },
  {
    key: 'tools',
    label: 'What tools and accounts do you use, and where does your business info live?',
    hint: 'ChatGPT, Claude, email, socials, a CRM, Drive, docs.',
    type: 'textarea',
  },
  {
    key: 'sensitive',
    label: 'Anything we should keep out of AI tools?',
    hint: 'Optional. Client data, private records, anything sensitive.',
    type: 'textarea',
    optional: true,
  },
];

export default function IntakePage() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [org, setOrg] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function setAnswer(key: string, value: string) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!firstName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please add your name and a valid email.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { firstName: firstName.trim(), email: email.trim(), org: org.trim() },
          answers,
          source: 'ianmcdonald.ai/intake',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || 'Could not send. Try again.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white placeholder:text-zinc-600 outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20';

  return (
    <div className="min-h-screen bg-[#040404] text-white antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[400px] w-[min(100vw,900px)] -translate-x-1/2 rounded-full bg-red-600/10 blur-[120px]"
      />

      <main className="relative z-10 mx-auto max-w-2xl px-5 py-16 sm:px-6 lg:py-24">
        {done ? (
          <div className="rounded-2xl border border-red-500/30 bg-gradient-to-b from-red-600/10 to-transparent p-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
              Got it
            </p>
            <h1 className="mb-4 text-2xl font-bold sm:text-3xl">Thanks, {firstName.split(' ')[0]}.</h1>
            <p className="mx-auto mb-8 max-w-md leading-relaxed text-zinc-400">
              I have your answers and I will review them before we talk, so our time together is all
              building, not catching up.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-7 py-4 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.02]"
            >
              Grab a time &rarr;
            </a>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-red-500/90">
                Before we talk
              </p>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                A few questions so our time is all{' '}
                <span className="bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">
                  building
                </span>
                .
              </h1>
              <p className="mt-4 leading-relaxed text-zinc-400">
                Short and honest beats long and polished. Rough answers are fine. This just helps me
                walk in already knowing where to start.
              </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col gap-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-200">
                    Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-zinc-200">
                    Email <span className="text-red-500">*</span>
                  </span>
                  <input
                    className={inputClass}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-zinc-200">
                  Business or organization
                </span>
                <input
                  className={inputClass}
                  value={org}
                  onChange={(e) => setOrg(e.target.value)}
                  autoComplete="organization"
                />
              </label>

              {QUESTIONS.map((q) => (
                <label key={q.key} className="block">
                  <span className="mb-1 block text-sm font-semibold text-zinc-200">
                    {q.label}
                    {q.optional && <span className="ml-2 text-xs font-normal text-zinc-500">optional</span>}
                  </span>
                  {q.hint && <span className="mb-2 block text-xs leading-snug text-zinc-500">{q.hint}</span>}
                  <textarea
                    className={`${inputClass} min-h-24 resize-y`}
                    value={answers[q.key] ?? ''}
                    onChange={(e) => setAnswer(q.key, e.target.value)}
                  />
                </label>
              ))}

              {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-7 py-4 text-base font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Send it over'}
              </button>
            </form>
          </>
        )}
      </main>
    </div>
  );
}
