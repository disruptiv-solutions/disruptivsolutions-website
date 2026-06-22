'use client';

import { useState, type FormEvent } from 'react';
import {
  QUESTIONS,
  computeReadout,
  type Answers,
  type Readout,
} from '@/lib/assessment';
import { trackEvent } from '@/lib/analytics';

const CAL_URL = 'https://calendar.app.google/TMV3V2nTEiyCWXKB6';
const LAUNCHBOX_URL = 'https://launchbox.space';

const INTAKE_QUESTIONS = [
  {
    id: 'role',
    label: 'What is your role?',
    options: [
      { value: 'owner', label: 'Owner / founder' },
      { value: 'exec', label: 'Executive / director' },
      { value: 'manager', label: 'Manager / team lead' },
      { value: 'team', label: 'Team member' },
    ],
  },
  {
    id: 'timeline',
    label: 'When are you hoping to have this running?',
    options: [
      { value: 'asap', label: 'As soon as possible' },
      { value: '1-3mo', label: 'Next 1-3 months' },
      { value: 'exploring', label: 'Just exploring' },
    ],
  },
  {
    id: 'size',
    label: 'Roughly how big is the company?',
    options: [
      { value: 'solo', label: 'Just me' },
      { value: '2-10', label: '2-10' },
      { value: '11-50', label: '11-50' },
      { value: '51-200', label: '51-200' },
      { value: '200+', label: '200+' },
    ],
  },
] as const;

export default function AiAssessment() {
  const [step, setStep] = useState(0); // 0..N-1 questions, N = contact
  const [answers, setAnswers] = useState<Answers>({});
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [business, setBusiness] = useState('');
  const [readout, setReadout] = useState<Readout | null>(null);
  const [aiSnapshot, setAiSnapshot] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [intake, setIntake] = useState<Record<string, string>>({});
  const [intakeDone, setIntakeDone] = useState(false);

  const total = QUESTIONS.length;
  const onContact = step === total;

  function selectSingle(qid: string, value: string) {
    setAnswers((a) => ({ ...a, [qid]: value }));
    // auto-advance — single-select feels like a real diagnostic this way
    setStep((s) => Math.min(s + 1, total));
  }

  function toggleMulti(qid: string, value: string, max: number) {
    setAnswers((a) => {
      const current = Array.isArray(a[qid]) ? (a[qid] as string[]) : [];
      if (current.includes(value)) {
        return { ...a, [qid]: current.filter((v) => v !== value) };
      }
      if (current.length >= max) return a;
      return { ...a, [qid]: [...current, value] };
    });
  }

  function setText(qid: string, value: string) {
    setAnswers((a) => ({ ...a, [qid]: value }));
  }

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!firstName.trim() || !email.trim()) {
      setError('Just your first name and email, then your snapshot is ready.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('That email looks off. Mind double-checking it?');
      return;
    }

    setError(null);
    const result = computeReadout(answers);
    setReadout(result); // show instantly — never blocks on the network
    trackEvent('ai_assessment_completed', {
      event_category: 'form',
      stage: result.stage.name,
      launchbox_fit: result.launchbox.fit,
    });

    setSubmitting(true);
    setAiLoading(true);
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { firstName: firstName.trim(), email: email.trim(), business: business.trim() },
          answers,
          readout: result,
          source: 'ianmcdonald.ai/assessment',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        aiSnapshot?: string | null;
        id?: string | null;
      };
      if (typeof data.aiSnapshot === 'string' && data.aiSnapshot.trim()) {
        setAiSnapshot(data.aiSnapshot.trim());
      }
      if (typeof data.id === 'string') setLeadId(data.id);
    } catch {
      // The prospect already has the deterministic snapshot; AI + capture are best-effort.
    } finally {
      setAiLoading(false);
      setSubmitting(false);
    }
  }

  function setIntakeAnswer(qid: string, value: string) {
    setIntake((s) => ({ ...s, [qid]: value }));
  }

  async function submitIntake() {
    trackEvent('button_click', {
      event_category: 'engagement',
      button_name: 'book_fit_call',
      location: 'assessment_intake',
    });
    try {
      if (leadId) {
        await fetch('/api/assessment/intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: leadId, intake }),
        });
      }
    } catch {
      // Capture is best-effort; never block the booking.
    }
    setIntakeDone(true);
    window.open(CAL_URL, '_blank', 'noopener,noreferrer');
  }

  const intakeComplete = INTAKE_QUESTIONS.every((q) => intake[q.id]);

  // ---------- RESULT ----------
  if (readout) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <p className="text-red-500/90 text-xs font-semibold tracking-[0.3em] uppercase">
            Your AI Snapshot
          </p>
          <div className="inline-flex flex-col items-center">
            <span className="text-sm text-gray-400 mb-1">
              Stage {readout.stage.level} of 4
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              {readout.stage.name}
            </h2>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            {[1, 2, 3, 4].map((n) => (
              <span
                key={n}
                className={`h-2 rounded-full transition-all ${
                  n <= readout.stage.level ? 'w-10 bg-red-600' : 'w-6 bg-white/15'
                }`}
              />
            ))}
          </div>
          <p className="text-gray-300 leading-relaxed max-w-xl mx-auto pt-2">
            {readout.stage.blurb}
          </p>
        </div>

        {(aiLoading || aiSnapshot) && (
          <div className="rounded-2xl border border-red-600/25 bg-white/[0.03] p-6 space-y-3">
            <p className="text-red-400 text-xs font-semibold tracking-[0.2em] uppercase">
              Your personalized read
            </p>
            {aiLoading && !aiSnapshot ? (
              <div className="space-y-2.5">
                <div className="h-3 w-3/4 rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-full rounded bg-white/10 animate-pulse" />
                <div className="h-3 w-5/6 rounded bg-white/10 animate-pulse" />
                <p className="text-gray-500 text-sm pt-1">Reading your answers…</p>
              </div>
            ) : (
              aiSnapshot
                ?.split('\n')
                .filter((p) => p.trim())
                .map((p, i) => (
                  <p key={i} className="text-gray-200 leading-relaxed">
                    {p.trim()}
                  </p>
                ))
            )}
          </div>
        )}

        <div className="space-y-4">
          <p className="text-white font-semibold text-lg">
            Where AI pays off fastest for you:
          </p>
          {readout.opportunities.map((opp) => (
            <div
              key={opp.title}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="flex items-start gap-3">
                <span className="text-red-600 font-bold mt-1">→</span>
                <div>
                  <p className="text-white font-semibold mb-1">{opp.title}</p>
                  <p className="text-gray-400 leading-relaxed">{opp.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-red-600/30 bg-red-600/[0.07] p-6">
          <p className="text-red-400 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Your quick win
          </p>
          <p className="text-gray-200 leading-relaxed">{readout.quickWin}</p>
        </div>

        {readout.launchbox.fit && (
          <div className="rounded-2xl border border-red-600/30 bg-gradient-to-br from-red-600/[0.12] to-transparent p-7 space-y-4">
            <p className="text-red-400 text-xs font-semibold tracking-[0.2em] uppercase">
              Built for you: LaunchBox
            </p>
            <p className="text-gray-200 leading-relaxed">{readout.launchbox.note}</p>
            <a
              href={LAUNCHBOX_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent('button_click', {
                  event_category: 'engagement',
                  button_name: 'see_launchbox_fit',
                  location: 'assessment_result',
                })
              }
              className="inline-flex items-center justify-center px-7 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/60 whitespace-nowrap"
            >
              See LaunchBox →
            </a>
          </div>
        )}

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 space-y-4">
          {intakeDone ? (
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold text-white">Opening your calendar…</h3>
              <p className="text-gray-300">
                If a new tab didn&apos;t open,{' '}
                <a
                  href={CAL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 underline underline-offset-4 hover:text-red-300"
                >
                  click here to grab a time
                </a>
                .
              </p>
            </div>
          ) : intakeOpen ? (
            <div className="space-y-5 text-left">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-1">Last thing before we book.</h3>
                <p className="text-gray-400 text-sm">
                  Three quick taps so I can prep before we talk.
                </p>
              </div>
              {INTAKE_QUESTIONS.map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-gray-300 mb-2">{q.label}</p>
                  <div className="flex flex-wrap gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setIntakeAnswer(q.id, opt.value)}
                        className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                          intake[q.id] === opt.value
                            ? 'border-red-600 bg-red-600/10 text-white'
                            : 'border-white/15 bg-white/[0.03] text-gray-300 hover:border-white/30'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={submitIntake}
                disabled={!intakeComplete}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to booking →
              </button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-white">
                Want me to map this for your actual business?
              </h3>
              <p className="text-gray-300 leading-relaxed max-w-lg mx-auto">
                Book a free 12-minute fit call. I&apos;ve already got your snapshot, so we&apos;ll
                spend the time on you, not the small talk.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
                <button
                  type="button"
                  onClick={() => setIntakeOpen(true)}
                  className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/60 inline-flex items-center justify-center whitespace-nowrap"
                >
                  Book your free 12-min call →
                </button>
                {!readout.launchbox.fit && (
                  <a
                    href={LAUNCHBOX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent('button_click', {
                        event_category: 'engagement',
                        button_name: 'see_launchbox',
                        location: 'assessment_result',
                      })
                    }
                    className="px-8 py-4 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap"
                  >
                    Rather DIY? See LaunchBox
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-gray-500">
          Your snapshot just landed with Ian. He&apos;ll bring it to the call.
        </p>
      </div>
    );
  }

  // ---------- CONTACT STEP ----------
  if (onContact) {
    return (
      <div className="w-full max-w-lg mx-auto">
        <ProgressBar step={step} total={total} />
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Where should I send your snapshot?
          </h2>
          <p className="text-gray-400">
            One readout, zero spam. You&apos;ll see your results on the next screen.
          </p>
        </div>
        <form onSubmit={handleContactSubmit} className="space-y-5 text-left">
          <div>
            <label htmlFor="a-name" className="block text-sm font-medium text-gray-300 mb-2">
              First name
            </label>
            <input
              id="a-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
              className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors"
              placeholder="Jane"
            />
          </div>
          <div>
            <label htmlFor="a-email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              id="a-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors"
              placeholder="you@business.com"
            />
          </div>
          <div>
            <label htmlFor="a-biz" className="block text-sm font-medium text-gray-300 mb-2">
              Business name <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <input
              id="a-biz"
              type="text"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              autoComplete="organization"
              className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors"
              placeholder="Acme Co."
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/60 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Building your snapshot…' : 'Show me my snapshot →'}
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
          >
            ← Back
          </button>
        </form>
      </div>
    );
  }

  // ---------- QUESTION STEP ----------
  const q = QUESTIONS[step];
  const answer = answers[q.id];
  const multiSelected = Array.isArray(answer) ? answer : [];
  const textValue = typeof answer === 'string' ? answer : '';
  const canAdvance =
    q.type === 'multi'
      ? multiSelected.length > 0
      : q.type === 'text'
      ? q.optional || textValue.trim().length > 0
      : false;

  return (
    <div className="w-full max-w-lg mx-auto">
      <ProgressBar step={step} total={total} />
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-2">
          {q.prompt}
        </h2>
        {q.helper && <p className="text-gray-400">{q.helper}</p>}
      </div>

      {q.type === 'single' && (
        <div className="space-y-3">
          {q.choices?.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => selectSingle(q.id, c.value)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                answer === c.value
                  ? 'border-red-600 bg-red-600/10 text-white'
                  : 'border-white/15 bg-white/[0.03] text-gray-200 hover:border-white/30 hover:bg-white/[0.06]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {q.type === 'multi' && (
        <>
          <div className="space-y-3">
            {q.choices?.map((c) => {
              const selected = multiSelected.includes(c.value);
              return (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => toggleMulti(q.id, c.value, q.maxSelect ?? 2)}
                  className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                    selected
                      ? 'border-red-600 bg-red-600/10 text-white'
                      : 'border-white/15 bg-white/[0.03] text-gray-200 hover:border-white/30 hover:bg-white/[0.06]'
                  }`}
                >
                  <span>{c.label}</span>
                  <span
                    className={`h-5 w-5 shrink-0 rounded-md border flex items-center justify-center text-xs ${
                      selected ? 'border-red-600 bg-red-600 text-white' : 'border-white/30'
                    }`}
                  >
                    {selected ? '✓' : ''}
                  </span>
                </button>
              );
            })}
          </div>
          <StepNav
            onBack={() => setStep((s) => Math.max(s - 1, 0))}
            onNext={() => setStep((s) => s + 1)}
            canAdvance={canAdvance}
            showBack={step > 0}
          />
        </>
      )}

      {q.type === 'text' && (
        <>
          <textarea
            rows={4}
            maxLength={2000}
            value={textValue}
            onChange={(e) => setText(q.id, e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-gray-500 focus:border-red-600/60 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors resize-none"
            placeholder={q.placeholder}
          />
          <StepNav
            onBack={() => setStep((s) => Math.max(s - 1, 0))}
            onNext={() => setStep((s) => s + 1)}
            canAdvance={canAdvance}
            showBack={step > 0}
            nextLabel={q.optional && textValue.trim().length === 0 ? 'Skip →' : 'Next →'}
          />
        </>
      )}
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / (total + 1)) * 100);
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-gray-500 mb-2">
        <span>{step < total ? `Question ${step + 1} of ${total}` : 'Last step'}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
          style={{ width: `${Math.max(pct, 6)}%` }}
        />
      </div>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  canAdvance,
  showBack,
  nextLabel = 'Next →',
}: {
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
  showBack: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-6">
      {showBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={onNext}
        disabled={!canAdvance}
        className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
      >
        {nextLabel}
      </button>
    </div>
  );
}
