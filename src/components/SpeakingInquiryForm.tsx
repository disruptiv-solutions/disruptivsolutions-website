'use client';

import { useState, type FormEvent } from 'react';

const INTEREST_OPTIONS = [
  { value: '', label: 'Select one…' },
  { value: 'speaking-event', label: 'Speaking at my event' },
  { value: 'corporate-workshop', label: 'Bringing me to my company / team' },
  { value: 'podcast-interview', label: 'Podcast or interview' },
  { value: 'general-chat', label: 'Just want to chat' },
  { value: 'other', label: 'Other' },
];

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export default function SpeakingInquiryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !interest) {
      setStatus({
        kind: 'error',
        message: 'Please fill in your name, email, and what you are interested in.',
      });
      return;
    }

    setStatus({ kind: 'submitting' });

    try {
      const res = await fetch('/api/speaking-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, interest, note }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!res.ok) {
        setStatus({
          kind: 'error',
          message:
            data.error ??
            'Could not submit. Email ian@ianmcdonald.ai directly.',
        });
        return;
      }

      setStatus({ kind: 'success' });
      setName('');
      setEmail('');
      setInterest('');
      setNote('');
    } catch {
      setStatus({
        kind: 'error',
        message:
          'Network error. Email ian@ianmcdonald.ai directly while we sort it out.',
      });
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="rounded-2xl border border-red-600/40 bg-red-600/10 p-8 text-center">
        <div className="text-2xl font-bold text-white mb-2">Got it.</div>
        <p className="text-gray-300">
          Check your inbox in a minute — you should see a confirmation from Ian.
          He&apos;ll follow up personally within a day or two.
        </p>
        <button
          type="button"
          onClick={() => setStatus({ kind: 'idle' })}
          className="mt-6 text-sm text-red-400 hover:text-red-300 underline underline-offset-4"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  const submitting = status.kind === 'submitting';

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="speaking-name"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Your name
          </label>
          <input
            id="speaking-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
            autoComplete="name"
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors disabled:opacity-50"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label
            htmlFor="speaking-email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            id="speaking-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
            autoComplete="email"
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors disabled:opacity-50"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="speaking-interest"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          What are you interested in?
        </label>
        <select
          id="speaking-interest"
          required
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          disabled={submitting}
          className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors disabled:opacity-50"
        >
          {INTEREST_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="speaking-note"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Anything to add?{' '}
          <span className="text-gray-500 font-normal">(optional)</span>
        </label>
        <textarea
          id="speaking-note"
          rows={4}
          maxLength={5000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={submitting}
          className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors disabled:opacity-50 resize-none"
          placeholder="Event date, audience, format — whatever helps."
        />
      </div>

      {status.kind === 'error' && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {status.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/60 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center whitespace-nowrap"
        >
          {submitting ? 'Sending…' : 'Send inquiry'}
        </button>
        <p className="text-sm text-gray-500 text-center sm:text-left">
          You&apos;ll get an email confirmation. Ian replies personally.
        </p>
      </div>
    </form>
  );
}
