'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Image from 'next/image';
import type { User } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';
import { trackButtonClick, trackEvent } from '@/lib/analytics';

const BOOKING_URL = 'https://calendar.app.google/okpHPUV8TA85GBaA6';
const KIT_SLUG = 'supplier-readiness-builder';
const STORAGE_KEY = 'ianmcdonald-ai:supplier-readiness-builder:v1';
const SESSION_KEY = 'ianmcdonald-ai:supplier-readiness-builder:session';

type StepId = 'intro' | 'brain' | 'teammate' | 'score' | 'prompts' | 'manual' | 'automations' | 'next';

type KitState = {
  firstName: string;
  title: string;
  email: string;
  companyName: string;
  businessType: string;
  painPoint: string;
  intent: string;
  wantsAudit: boolean;
  overview: string;
  services: string;
  certifications: string;
  pastPerformance: string;
  differentiators: string;
  targets: string;
  swot: string;
  goals: string;
  scores: Record<number, number>;
  selectedWorkflow: string;
  workflowContext: string;
  week1: string;
  week2: string;
  week3: string;
  week4: string;
  manualChecks: Record<number, boolean>;
  manualRule: string;
  leadId: string;
  leadCaptured: boolean;
};

type PromptEntry = { name: string; why: string; text: string };

const steps: { id: StepId; title: string }[] = [
  { id: 'intro', title: 'Welcome' },
  { id: 'score', title: 'Readiness Score' },
  { id: 'brain', title: 'Business Brain' },
  { id: 'teammate', title: 'AI as a Teammate' },
  { id: 'prompts', title: 'Prompt Pack' },
  { id: 'manual', title: 'What Stays Manual' },
  { id: 'automations', title: 'Automations' },
  { id: 'next', title: 'Next Step' },
];

// The reusable pattern behind every prompt. This is the actual lesson - a person
// who understands these five parts can write a strong prompt for any task,
// with or without this kit.
const promptAnatomy = [
  { label: 'Context', detail: 'Who you serve, what you sell, how you sound. Front-load it so the AI stops guessing.' },
  { label: 'Assignment', detail: 'One clear job, and the exact format you want back.' },
  { label: 'Source material', detail: 'The real facts, notes, and numbers it should use - not its imagination.' },
  { label: 'Boundaries', detail: 'What to avoid, what not to invent, what to flag as uncertain.' },
  { label: 'Review', detail: 'What a human checks before anything leaves the building.' },
];

// Human-in-the-loop gates. AI drafts; you decide. Knowing where to keep a human
// is the difference between a tool that helps you and one that embarrasses you.
const manualGates = [
  'Verify every fact, name, number, and claim the AI produced.',
  'Confirm the targets and contacts AI suggested actually exist before I reach out.',
  'Check the tone matches my brand voice, not the AI default.',
  'Make sure no confidential or sensitive information was pasted into a public AI tool.',
  'Give final approval before anything reaches a client, buyer, or partner.',
];

const scoreItems = [
  'Our core business documents are organized in one place.',
  'We have a current capability statement.',
  'We can clearly explain who we serve, what we solve, and why we are different.',
  'We maintain a target client or agency list.',
  'We track meetings, introductions, and follow-up tasks.',
  'We have reusable proposal or outreach language.',
  'We know which information should not be pasted into AI tools.',
  'We have a process for turning goals into weekly or monthly actions.',
];

const workflows = [
  {
    id: 'targetPrep',
    title: 'Prepare For A Target Client',
    phrase: 'target-client preparation',
    description: 'Research priorities, clarify fit, create smart questions, and shape outreach.',
  },
  {
    id: 'followUp',
    title: 'Follow Up After A Conversation',
    phrase: 'follow-up after a conversation',
    description: 'Turn meeting notes into a recap email, task list, CRM note, and reminders.',
  },
  {
    id: 'growthPlan',
    title: 'Turn SWOT Into A 30-Day Plan',
    phrase: 'turning SWOT into a 30-day plan',
    description: 'Convert strategic planning work into initiatives, owners, measures, and review rhythm.',
  },
  {
    id: 'valueProp',
    title: 'Improve Buyer-Facing Value Prop',
    phrase: 'buyer-facing value proposition improvement',
    description: 'Make the business easier for corporate buyers and partners to understand.',
  },
  {
    id: 'opportunityFit',
    title: 'Check Opportunity Fit',
    phrase: 'opportunity-fit review',
    description: 'Identify strengths, gaps, proof points, clarification questions, and partner needs.',
  },
  {
    id: 'businessProfile',
    title: 'Create A Business Profile',
    phrase: 'business profile creation',
    description: 'Generate a reusable company profile for prompts, outreach, and planning.',
  },
];

const emptyState: KitState = {
  firstName: '',
  title: '',
  email: '',
  companyName: '',
  businessType: '',
  painPoint: '',
  intent: '',
  wantsAudit: false,
  overview: '',
  services: '',
  certifications: '',
  pastPerformance: '',
  differentiators: '',
  targets: '',
  swot: '',
  goals: '',
  scores: {},
  selectedWorkflow: 'followUp',
  workflowContext: '',
  week1: '',
  week2: '',
  week3: '',
  week4: '',
  manualChecks: {},
  manualRule: '',
  leadId: '',
  leadCaptured: false,
};

export default function SupplierReadinessBuilder() {
  const { user, loading } = useAuth();
  const [state, setState] = useState<KitState>(emptyState);
  const [activeStep, setActiveStep] = useState<StepId>('intro');
  const prompts = useMemo(() => makePrompts(state), [state]);
  const [activePrompt, setActivePrompt] = useState('Business Growth Plan');
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [brainPrompt, setBrainPrompt] = useState('');
  const [painPrompt, setPainPrompt] = useState('');
  const [toast, setToast] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  // Mobile-only sub-slide within the Welcome step. 0 = welcome content,
  // 1 = the "After the workshop" CTA on its own slide. Desktop ignores this
  // and always shows both blocks inline.

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<KitState>;
        setState((current) => ({ ...current, ...parsed }));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      setState((current) => ({
        ...current,
        firstName: current.firstName || firstNameFromUser(user),
        email: current.email || user.email || '',
      }));
    }
  }, [loading, user]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Stable anonymous id so autosaved progress updates one record per browser.
  useEffect(() => {
    try {
      let sid = window.localStorage.getItem(SESSION_KEY);
      if (!sid) {
        sid =
          window.crypto?.randomUUID?.() ??
          `s-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
        window.localStorage.setItem(SESSION_KEY, sid);
      }
      setSessionId(sid);
    } catch {
      /* localStorage unavailable; autosave just stays off */
    }
  }, []);

  // Debounced autosave: persist everything they have filled in so far, even if
  // they never submit the opt-in form. Fires ~1.5s after they stop typing.
  useEffect(() => {
    if (!sessionId || !hasCaptureContent(state)) return;
    const timer = window.setTimeout(() => {
      fetch('/api/kits/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          kitSlug: KIT_SLUG,
          ...buildCapturePayload(state, computeAverageScore(state.scores)),
        }),
      }).catch(() => {});
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [state, sessionId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 2200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!copiedKey) return;
    const timer = window.setTimeout(() => setCopiedKey(''), 1600);
    return () => window.clearTimeout(timer);
  }, [copiedKey]);

  const averageScore = useMemo(() => computeAverageScore(state.scores), [state.scores]);
  const activeEntry = prompts.find((entry) => entry.name === activePrompt) ?? prompts[0];
  const currentIndex = steps.findIndex((step) => step.id === activeStep);

  function scrollToTop() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.scrollingElement?.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      });
    });
  }

  function goToStep(step: StepId) {
    setActiveStep(step);
    setMobileNavOpen(false);
    scrollToTop();
  }

  async function captureLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!state.firstName.trim() || !isValidEmail(state.email)) {
      setLeadError('Add your first name and a valid email so I know where to follow up.');
      return;
    }

    setSubmittingLead(true);
    setLeadError(null);
    trackEvent('workshop_kit_capture_attempt', {
      event_category: 'form',
      kit_slug: KIT_SLUG,
    });

    try {
      const response = await fetch('/api/kits/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitSlug: KIT_SLUG,
          source: 'ianmcdonald.ai/kits/supplier-readiness-builder',
          sessionId,
          selectedWorkflow: state.selectedWorkflow,
          authUid: user?.uid ?? null,
          businessBrain: businessContext(state),
          promptPack: prompts.map((entry) => ({ name: entry.name, text: entry.text })),
          ...buildCapturePayload(state, averageScore),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { id?: string; error?: string };
      if (!response.ok) throw new Error(data.error || 'Could not save your info.');
      setState((current) => ({ ...current, leadCaptured: true, leadId: data.id || current.leadId }));
      setToast('Sent. I have your details and worksheet, and I will follow up.');
      trackEvent('workshop_kit_lead_captured', {
        event_category: 'form',
        kit_slug: KIT_SLUG,
      });
    } catch (error) {
      setLeadError(error instanceof Error ? error.message : 'Could not save your info.');
    } finally {
      setSubmittingLead(false);
    }
  }

  async function submitAuditIntent() {
    trackButtonClick('supplier_readiness_audit_cta', {
      location: 'supplier_readiness_builder',
      kit_slug: KIT_SLUG,
    });
    try {
      await fetch('/api/kits/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: state.leadId,
          kitSlug: KIT_SLUG,
          wantsAudit: true,
          selectedWorkflow: state.selectedWorkflow,
          averageScore,
          company: state.companyName,
          businessType: state.businessType,
        }),
      });
    } catch {
      // Best effort only. Do not block booking.
    }
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');
  }

  function update<K extends keyof KitState>(key: K, value: KitState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  function setScore(index: number, score: number) {
    setState((current) => ({ ...current, scores: { ...current.scores, [index]: score } }));
  }

  function toggleManual(index: number) {
    setState((current) => ({
      ...current,
      manualChecks: { ...current.manualChecks, [index]: !current.manualChecks[index] },
    }));
  }

  function buildBrainPrompt() {
    setBrainPrompt(businessContextPrompt(state));
    setToast('Business context prompt built.');
    trackEvent('workshop_kit_business_context_built', {
      event_category: 'engagement',
      kit_slug: KIT_SLUG,
    });
  }

  function buildPainPrompt() {
    setPainPrompt(painPointPromptText(state));
    setToast('Starting prompt built.');
    trackEvent('workshop_kit_pain_point_prompt_built', {
      event_category: 'engagement',
      kit_slug: KIT_SLUG,
    });
  }

  function loadSample() {
    setState({
      ...emptyState,
      firstName: state.firstName,
      email: state.email,
      leadCaptured: state.leadCaptured,
      leadId: state.leadId,
      companyName: 'Gulf Coast Facility Solutions',
      businessType: 'Commercial facilities maintenance',
      overview:
        'We keep high-traffic commercial and institutional buildings clean, safe, and operational for property managers and facilities teams. We solve the problem of slow, unreliable maintenance and janitorial support.',
      pastPerformance:
        'MBE certified with OSHA-trained crews. Supported a multi-site office portfolio, recurring municipal facility maintenance, and event cleanup for venues with 5,000+ attendees.',
      differentiators:
        'Fast response times, bilingual crews, documented quality checks, and owner-led account management. We show up and we communicate.',
      goals:
        'Win recurring contracts with healthcare systems and universities, get on two supplier shortlists in 12 months, and stop losing hours to manual follow-up.',
      scores: { 0: 3, 1: 3, 2: 4, 3: 3, 4: 2, 5: 2, 6: 3, 7: 2 },
    });
    setToast('Sample business loaded.');
  }

  function downloadExport() {
    const nextPrompts = prompts.length ? prompts : makePrompts(state);
    const content = exportMarkdown(state, nextPrompts);
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slugify(state.companyName || 'supplier-readiness-plan')}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setToast('Readiness plan downloaded.');
  }

  async function copyText(value: string, message: string, key?: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(message);
      if (key) setCopiedKey(key);
    } catch {
      setToast('Copy failed. Select and copy manually.');
    }
  }

  return (
    <main className="relative z-10 min-h-[calc(100dvh-4rem)] overflow-x-hidden pt-16 lg:pt-16">
      <div className="grid min-h-[calc(100dvh-4rem)] min-w-0 lg:grid-cols-[250px_minmax(0,1fr)_330px]">
        <aside className="hidden border-b border-[#0B0F14]/10 bg-[#0B0F14] p-5 text-white shadow-2xl shadow-[#0B0F14]/20 lg:fixed lg:right-0 lg:top-16 lg:z-20 lg:flex lg:flex-col lg:h-[calc(100dvh-64px)] lg:w-[330px] lg:border-b-0 lg:border-l lg:border-[#0B0F14]">
          <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            <div className="flex flex-col gap-5">
              {/* Presenter */}
              <div className="border-b border-white/10 pb-5">
                <div className="flex items-center gap-3.5">
                  <Image
                    src="/ian-mcdonald.png"
                    alt="Ian McDonald"
                    width={120}
                    height={120}
                    priority
                    className="h-14 w-14 shrink-0 rounded-2xl object-cover ring-1 ring-white/15"
                  />
                  <div className="min-w-0">
                    <p className="text-base font-black leading-tight text-white">Ian McDonald</p>
                    <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Practical AI Workshops
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#F7F1E8]/70">
                  Built an AI product to{' '}
                  <span className="font-semibold text-white">$1.2M ARR and 1,600 users</span> &mdash; solo.
                  HMSDC&rsquo;s AI subject-matter expert for the Academy.
                </p>
              </div>

              {/* Title */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F7F1E8]/45">
                  Workshop kit
                </p>
                <h1 className="mt-1.5 text-2xl font-black leading-tight text-white">
                  AI Supplier Readiness Builder
                </h1>
              </div>

              {/* MBE badge */}
              <div className="flex flex-col items-center gap-3 text-center">
                <Image
                  src="/mbe-leadership-academy.png"
                  alt="HMSDC MBE Leadership Academy badge"
                  width={320}
                  height={320}
                  priority
                  className="h-36 w-auto object-contain drop-shadow-xl"
                />
                <span className="text-[11px] font-bold uppercase leading-snug tracking-[0.16em] text-[#F7F1E8]/75">
                  HMSDC MBE Leadership Academy &middot; 2026
                </span>
              </div>

              {/* Capstone value */}
              <div className="rounded-2xl border border-[#FF7A2F]/25 bg-[#FF7A2F]/[0.08] p-4">
                <p className="text-base font-black leading-snug text-white">
                  Leave with a draft of{' '}
                  <span className="text-[#FF7A2F]">3 of your 6 Capstone deliverables</span> &mdash; built live.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#F7F1E8]/60">
                  Capability Statement, Strategic Target List, and your Procurement Readiness score.
                </p>
              </div>
            </div>
          </div>

          {/* Nav footer */}
          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <button
              type="button"
              onClick={() => {
                if (currentIndex > 0) goToStep(steps[currentIndex - 1].id);
              }}
              disabled={currentIndex <= 0}
              className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.1] disabled:opacity-40"
            >
              &lsaquo; Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentIndex < steps.length - 1) goToStep(steps[currentIndex + 1].id);
              }}
              disabled={currentIndex >= steps.length - 1}
              className="min-w-0 flex-1 rounded-xl bg-[#FF7A2F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#EF1111] disabled:opacity-40"
            >
              Next &rsaquo;
            </button>
          </div>
        </aside>

        <aside className="hidden border-b border-[#0B0F14]/10 bg-[#0B0F14] p-5 text-white shadow-2xl shadow-[#0B0F14]/20 lg:fixed lg:left-0 lg:top-16 lg:z-20 lg:block lg:h-[calc(100dvh-64px)] lg:w-[250px] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-[#0B0F14]">
          <nav className="grid gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(step.id)}
                className={`grid grid-cols-[34px_1fr] items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                  activeStep === step.id
                    ? 'border-[#FF7A2F]/70 bg-[#FF7A2F]/14 text-white'
                    : 'border-white/[0.09] bg-white/[0.025] text-[#F7F1E8]/64 hover:border-[#FF7A2F]/35 hover:text-white'
                }`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#FF7A2F] text-sm font-bold text-white">
                  {index === 0 ? '★' : index}
                </span>
                <span className="text-sm font-semibold">{step.title}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 rounded-2xl border border-[#F6C443]/25 bg-[#F6C443]/10 p-4">
            <p className="font-semibold text-white">Privacy posture</p>
            <p className="mt-2 text-sm leading-relaxed text-[#F7F1E8]/70">
              No account data includes your worksheet unless you export it or request an audit.
            </p>
          </div>
        </aside>

        <section
          className={`min-w-0 max-w-full px-5 sm:px-6 lg:col-start-2 lg:row-start-1 lg:px-8 lg:pt-8 lg:pb-8 ${
            activeStep === 'intro' ? 'pt-0 pb-0 sm:pt-0' : 'pt-2 pb-28 sm:pt-6'
          }`}
        >
          <div className="w-full min-w-0 max-w-full">
            <div className={activeStep === 'brain' || activeStep === 'intro' ? 'mt-0' : 'mt-8'}>
              {activeStep === 'brain' && (
                <>
                  <section className="mb-10">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      Problem
                    </p>
                    <h2 className="mt-2 max-w-none text-4xl font-black tracking-tight text-[#0B0F14] sm:text-5xl lg:whitespace-nowrap lg:text-[clamp(2.5rem,3.2vw,3.5rem)]">
                      Your business lives in ten different places
                    </h2>
                    <div className="mt-6 overflow-hidden rounded-2xl border border-[#E7D8C6] bg-white shadow-[0_24px_80px_-70px_rgba(11,15,20,0.5)]">
                      <Image
                        src="/slides/framing-desktop.png"
                        alt="From scattered business information to one organized system"
                        width={1536}
                        height={1024}
                        className="hidden h-auto w-full max-w-none lg:block"
                      />
                      <Image
                        src="/slides/framing-mobile.png"
                        alt="From scattered business information to one organized system"
                        width={1122}
                        height={1402}
                        className="h-auto w-full max-w-none lg:hidden"
                      />
                    </div>
                    <div className="mt-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EF1111]">
                        The issue
                      </p>
                      <p className="mt-3 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                        Your capability statement is in one folder. Past performance is in another.
                        Your differentiators live in your head, and your numbers are in a spreadsheet
                        you have to hunt for. So every time you open AI you re-explain your business
                        from scratch, and it hands back generic answers. That scattered information is
                        the reason AI has not felt useful yet.
                      </p>
                    </div>
                  </section>

                  <section className="mb-10 flex min-h-[460px] flex-col justify-center rounded-3xl border border-[#E7D8C6] bg-white/60 p-6 shadow-[0_24px_80px_-70px_rgba(11,15,20,0.5)] sm:p-10 lg:min-h-[520px]">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      Solution
                    </p>
                    <h3 className="mt-4 max-w-5xl text-4xl font-black tracking-tight text-[#0B0F14] sm:text-5xl lg:text-[clamp(3rem,4.2vw,4.75rem)]">
                      Give AI one Business Brain to work from.
                    </h3>
                    <div className="mt-10 grid gap-5 lg:grid-cols-3">
                      {[
                        {
                          label: 'Context',
                          text: 'Tell AI who you serve, what you sell, where you compete, and what proof points matter.',
                        },
                        {
                          label: 'Voice',
                          text: 'Give it your positioning, differentiators, and buyer-facing language so outputs sound like your company.',
                        },
                        {
                          label: 'Reuse',
                          text: 'Use the same Business Brain for outreach, proposals, follow-up, planning, and team handoffs.',
                        },
                      ].map((item, index) => (
                        <div key={item.label} className="rounded-2xl border border-[#E7D8C6] bg-[#F7F1E8]/75 p-5">
                          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#FF7A2F] text-sm font-black text-white">
                            {index + 1}
                          </span>
                          <h4 className="mt-5 text-xl font-black text-[#0B0F14] lg:text-2xl">{item.label}</h4>
                          <p className="mt-2 text-base leading-relaxed text-[#334155] lg:text-lg">{item.text}</p>
                        </div>
                      ))}
                    </div>
                    <p className="mt-8 max-w-4xl text-xl font-semibold leading-relaxed text-[#0B0F14]">
                      Build it once. Reuse it in every chat from here on.
                    </p>
                  </section>

                  <Panel eyebrow="The action" title="Build Your Business Brain">
                  <p className="text-lg leading-relaxed text-[#334155] lg:text-xl">
                    Four questions is all we need today. The goal is not the perfect profile. It is
                    enough context that AI stops giving you generic answers. Rough is fine. Blank is
                    what slows us down.
                  </p>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <Textarea
                      label="1. Business snapshot"
                      hint="What do you do, who do you serve, and what problem do you solve?"
                      value={state.overview}
                      onChange={(value) => update('overview', value)}
                    />
                    <Textarea
                      label="2. Proof & qualifications"
                      hint="What certifications, past performance, projects, or results prove you can do the work?"
                      value={state.pastPerformance}
                      onChange={(value) => update('pastPerformance', value)}
                    />
                    <Textarea
                      label="3. Differentiators"
                      hint="Why should a buyer choose you over a similar vendor?"
                      value={state.differentiators}
                      onChange={(value) => update('differentiators', value)}
                    />
                    <Textarea
                      label="4. Growth focus"
                      hint="What opportunity, buyer, workflow, or goal are you focused on next?"
                      value={state.goals}
                      onChange={(value) => update('goals', value)}
                    />
                  </div>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button type="button" onClick={loadSample} className="rounded-xl border border-[#0B0F14]/15 bg-white/65 px-5 py-3 text-sm font-semibold text-[#0B0F14] transition hover:border-[#FF7A2F]/50 hover:bg-white">
                      Load sample
                    </button>
                    <button type="button" onClick={buildBrainPrompt} className="rounded-xl bg-[#FF7A2F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7A2F]/25 transition hover:bg-[#EF1111]">
                      Build My Business Context
                    </button>
                  </div>
                  {brainPrompt && (
                    <div className="mt-6 rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-5 text-white">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                          Your prompt &mdash; copy and paste it into AI
                        </p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => copyText(brainPrompt, 'Prompt copied.', 'brain')} className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]">
                            {copiedKey === 'brain' ? 'Copied' : 'Copy'}
                          </button>
                          <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#FF7A2F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#EF1111]">
                            Open ChatGPT
                          </a>
                        </div>
                      </div>
                      <textarea
                        readOnly
                        value={brainPrompt}
                        className="mt-4 min-h-[240px] w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm leading-relaxed text-[#F7F1E8] outline-none"
                      />
                      <p className="mt-3 text-sm leading-relaxed text-[#F7F1E8]/70">
                        Paste this into ChatGPT or Claude. Save what it gives you &mdash; that is your
                        reusable Business Brain you can paste at the start of any chat.
                      </p>
                    </div>
                  )}
                  <div className="mt-6 rounded-2xl border border-[#FF7A2F]/30 bg-[#FF7A2F]/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Give your brain a permanent home
                    </p>
                    <p className="mt-2 text-[#0B0F14]">
                      NotebookLM is free. Upload your business profile plus a few key documents
                      &mdash; capability statement, past performance, certifications &mdash; and it
                      answers only from your material, with no re-pasting. That is your business
                      brain, on call.
                    </p>
                  </div>
                  </Panel>
                </>
              )}

              {activeStep === 'teammate' && (
                <>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      AI as a teammate
                    </p>
                    <h2 className="mt-2 max-w-none text-4xl font-black tracking-tight text-[#0B0F14] sm:text-5xl">
                      You&rsquo;re treating AI like a vending machine.
                    </h2>
                  </div>

                  <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7D8C6] bg-white shadow-[0_24px_80px_-70px_rgba(11,15,20,0.5)]">
                    <Image
                      src="/slides/teammate-desktop.png"
                      alt="Treating AI like a vending machine versus onboarding it like a teammate"
                      width={1672}
                      height={941}
                      className="hidden h-auto w-full max-w-none lg:block"
                    />
                    <Image
                      src="/slides/teammate-mobile.png"
                      alt="Treating AI like a vending machine versus onboarding it like a teammate"
                      width={1122}
                      height={1402}
                      className="h-auto w-full max-w-none lg:hidden"
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EF1111]">
                      The issue
                    </p>
                    <p className="mt-3 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      Right now you type a question, copy the answer, and start over. Fifty times a
                      day. The AI has no memory of your business and no access to your real work, so
                      every task starts from zero. That is busywork with extra steps.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      The fix
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-[#0B0F14] sm:text-4xl lg:text-5xl">
                      AI is a teammate that can go do the work.
                    </h3>
                    <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      Most people ask AI for one answer at a time, like a vending machine. The shift
                      is treating it like a teammate. On a team plan you give AI access to the tools
                      you already use, and it goes and does the work &mdash; reading your files,
                      drafting your replies, updating your sheets. You are not just using AI. You are
                      giving your whole team their own team.
                    </p>
                  </div>

                  <Panel eyebrow="The platforms" title="Give your team their own team">
                    <p className="text-lg leading-relaxed text-[#334155] lg:text-xl">
                      These platforms offer team plans &mdash; shared, private workspaces where AI can
                      plug into the tools you already use.
                    </p>
                    <div className="mt-6 grid gap-3 md:grid-cols-3">
                      {[
                        { name: 'ChatGPT', plan: 'Team / Business', best: 'Shared workspace, your data stays private, custom GPTs for your team.', logo: 'openai' },
                        { name: 'Claude', plan: 'Team / for Work', best: 'Best for long documents and careful analysis. Projects hold shared context.', logo: 'claude' },
                        { name: 'Google', plan: 'Gemini in Workspace', best: 'Built into the Drive, Gmail, and Docs you already use.', logo: 'gemini' },
                      ].map((platform) => (
                        <div key={platform.name} className="rounded-2xl border border-[#E7D8C6] bg-white/70 p-5">
                          <div className="flex items-center gap-3">
                            <LogoIcon slug={platform.logo} label={platform.name} className="h-8 w-8 shrink-0 object-contain" />
                            <p className="text-lg font-bold text-[#0B0F14] lg:text-xl">{platform.name}</p>
                          </div>
                          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#FF7A2F]">
                            {platform.plan}
                          </p>
                          <p className="mt-2 text-sm text-[#334155] lg:text-base">{platform.best}</p>
                        </div>
                      ))}
                    </div>

                    <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Connectors turn a chat box into a teammate
                    </p>
                    <p className="mt-1 text-sm text-[#667085]">
                      Give it access and it works inside your real tools.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {[
                        { name: 'Slack', logo: 'slack' },
                        { name: 'Notion', logo: 'notion' },
                        { name: 'Microsoft 365', logo: 'microsoft365' },
                        { name: 'Canva', logo: 'canva' },
                        { name: 'Asana', logo: 'asana' },
                        { name: 'Gmail', logo: 'gmail' },
                        { name: 'Google Drive', logo: 'google-drive' },
                        { name: 'Google Calendar', logo: 'google-calendar' },
                        { name: 'ClickUp', logo: 'clickup' },
                        { name: 'HubSpot', logo: 'hubspot' },
                        { name: 'Zapier', logo: 'zapier' },
                        { name: 'Adobe', logo: 'adobe' },
                        { name: 'Stripe', logo: 'stripe' },
                        { name: 'QuickBooks', logo: 'quickbooks' },
                        { name: 'Google Sheets', logo: 'google-sheets' },
                        { name: 'Salesforce', logo: 'salesforce' },
                      ].map((connector) => (
                        <div key={connector.name} className={`flex items-center gap-3 rounded-2xl border border-[#E7D8C6] bg-white/70 p-3 ${connector.name === 'Salesforce' ? 'sm:hidden lg:flex' : ''}`}>
                          <LogoIcon slug={connector.logo} label={connector.name} className="h-7 w-7 shrink-0 object-contain" />
                          <span className="text-sm font-semibold text-[#0B0F14] lg:text-base">{connector.name}</span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-[#667085] lg:text-base">
                      ...and so much more.
                    </p>

                  </Panel>
                </>
              )}

              {activeStep === 'intro' && (
                <section className="-mx-5 h-[calc(100dvh-8rem)] overflow-hidden bg-[#F7F1E8]/40 px-5 sm:-mx-6 sm:px-6 lg:mx-0 lg:h-auto lg:overflow-visible lg:bg-transparent lg:px-0 lg:py-0">
                  {/* Mobile welcome */}
                  <div className="flex h-full min-h-0 flex-col items-center justify-between py-[clamp(0.5rem,2.5vh,1.5rem)] text-center lg:hidden">
                    {/* Presenter card */}
                    <div className="flex w-full max-w-[340px] items-center gap-3 rounded-2xl border border-[#E7D8C6] bg-white/70 p-2.5 shadow-[0_18px_60px_-55px_rgba(11,15,20,0.6)]">
                      <Image
                        src="/ian-mcdonald.png"
                        alt="Ian McDonald"
                        width={112}
                        height={112}
                        priority
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 text-left">
                        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#FF7A2F]">
                          Ian McDonald
                        </p>
                        <span className="mt-1 block h-px w-8 bg-[#FF7A2F]/60" />
                        <p className="mt-1 text-xs font-black uppercase tracking-[0.14em] text-[#111827]">
                          Practical AI Workshops
                        </p>
                      </div>
                    </div>

                    {/* Badge */}
                    <Image
                      src="/mbe-leadership-academy.png"
                      alt="HMSDC MBE Leadership Academy"
                      width={320}
                      height={320}
                      priority
                      className="h-[clamp(150px,26vh,260px)] w-auto object-contain drop-shadow-xl"
                    />

                    {/* Eyebrow */}
                    <div className="flex items-center gap-2">
                      <span className="h-px w-5 bg-[#FF7A2F]/50" />
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#FF7A2F]">
                        AI for Supplier Readiness
                      </p>
                      <span className="h-px w-5 bg-[#FF7A2F]/50" />
                    </div>

                    {/* Headline */}
                    <h2 className="font-serif text-[clamp(2rem,9.5vw,2.85rem)] font-bold leading-[1.02] tracking-tight text-[#111827]">
                      Turn your growth plan into a working{' '}
                      <span className="relative whitespace-nowrap text-[#FF7A2F]">
                        AI system.
                        <svg
                          aria-hidden
                          className="absolute -bottom-1.5 left-0 h-2.5 w-full"
                          viewBox="0 0 200 10"
                          fill="none"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M3 7C40 2 160 2 197 6"
                            stroke="#FF7A2F"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                    </h2>

                    {/* Caption */}
                    <p className="max-w-[300px] text-xs leading-relaxed text-[#667085]">
                      A practical workshop for building repeatable business workflows with AI.
                    </p>
                  </div>

                  {/* Desktop welcome */}
                  <div className="hidden lg:flex lg:min-h-[calc(100dvh-8rem)] lg:flex-col lg:justify-between lg:gap-5">
                    <div className="flex items-center justify-between gap-8">
                      <div className="flex items-center gap-4">
                        <Image
                          src="/ian-mcdonald.png"
                          alt="Ian McDonald"
                          width={128}
                          height={128}
                          priority
                          className="h-14 w-14 shrink-0 rounded-2xl object-cover shadow-[0_18px_50px_-32px_rgba(11,15,20,0.65)]"
                        />
                        <div>
                          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FF7A2F]">
                            Ian McDonald
                          </p>
                          <p className="mt-1 text-xs font-black uppercase tracking-[0.2em] text-[#667085]">
                            Practical AI Workshops
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#FF7A2F]">
                            HMSDC
                          </p>
                          <p className="mt-1 text-sm font-black uppercase leading-tight tracking-[0.12em] text-[#0B0F14]">
                            MBE Leadership
                            <br />
                            Academy
                          </p>
                        </div>
                        <Image
                          src="/mbe-leadership-academy.png"
                          alt="HMSDC MBE Leadership Academy"
                          width={180}
                          height={180}
                          priority
                          className="h-16 w-auto shrink-0 object-contain drop-shadow-lg"
                        />
                      </div>
                    </div>

                    <div className="mx-auto grid max-w-[1020px] flex-1 items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(345px,0.7fr)] xl:max-w-[1080px]">
                      <div className="max-w-[660px]">
                        <div className="flex items-center gap-3">
                          <span className="h-px w-10 bg-[#FF7A2F]/70" />
                          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#FF7A2F]">
                            AI for Supplier Readiness
                          </p>
                        </div>
                        <h2 className="mt-5 font-serif text-[clamp(4.05rem,4.9vw,5.6rem)] font-bold leading-[0.93] tracking-tight text-[#0B0F14]">
                          Turn your growth plan into a working{' '}
                          <span className="relative inline-block whitespace-nowrap text-[#FF7A2F]">
                            AI system.
                            <svg
                              aria-hidden
                              className="absolute -bottom-2 left-0 h-4 w-full"
                              viewBox="0 0 200 10"
                              fill="none"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M3 7C40 2 160 2 197 6"
                                stroke="#FF7A2F"
                                strokeWidth="3.5"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        </h2>
                        <p className="mt-6 max-w-[640px] text-[1.35rem] leading-relaxed text-[#667085]">
                          Practical AI you can put to work today. Over the next hour we build a real,
                          reusable system together, and you walk out with draft Capstone assets.
                        </p>
                      </div>

                      <div className="justify-self-center rounded-[2rem] border border-[#E7D8C6] bg-white/78 p-5 text-center shadow-[0_34px_90px_-62px_rgba(11,15,20,0.6)] backdrop-blur">
                        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#FF7A2F]">
                          Scan to join
                        </p>
                        <Image
                          src="/hmsdc-qr.png"
                          alt="Scan to open the kit on your device"
                          width={600}
                          height={600}
                          priority
                          className="mt-4 h-[clamp(260px,21.5vw,325px)] w-[clamp(260px,21.5vw,325px)] rounded-2xl"
                        />
                        <p className="mt-5 text-2xl font-black leading-tight text-[#0B0F14]">
                          Open it on your device
                        </p>
                        <p className="mt-2 text-xl font-black text-[#FF7A2F]">ianmcdonald.ai/hmsdc</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-[#E7D8C6] bg-[#0B0F14] text-white shadow-[0_28px_90px_-70px_rgba(11,15,20,0.7)]">
                      {['Score readiness', 'Build your Business Brain', 'Generate reusable prompts'].map((item, index) => (
                        <div key={item} className="flex items-center gap-4 border-r border-white/10 px-5 py-3 last:border-r-0">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#FF7A2F] text-sm font-black text-white">
                            {index + 1}
                          </span>
                          <span className="text-base font-black leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {activeStep === 'score' && (
                <Panel eyebrow="Step 1" title="Readiness Scorecard">
                  <p className="text-lg leading-relaxed text-[#334155] lg:text-xl">
                    Start here. Score each item from 1 to 5 &mdash; it takes about a minute.
                    The point is not perfection. It is finding the first system to improve, and
                    it doubles as the first draft of your Procurement Readiness Framework.
                  </p>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <TextField
                      label="Business name"
                      value={state.companyName}
                      onChange={(value) => update('companyName', value)}
                      placeholder="Your company"
                      autoComplete="organization"
                    />
                    <TextField
                      label="Your name"
                      value={state.firstName}
                      onChange={(value) => update('firstName', value)}
                      placeholder="First and last"
                      autoComplete="name"
                    />
                    <TextField
                      label="Your title"
                      value={state.title}
                      onChange={(value) => update('title', value)}
                      placeholder="Owner, CEO, Principal..."
                    />
                  </div>
                  <div className="mt-6 grid gap-3">
                    {scoreItems.map((item, index) => (
                      <div key={item} className="grid gap-3 rounded-2xl border border-[#E7D8C6] bg-white/70 p-4 md:grid-cols-[1fr_220px] md:items-center">
                        <p className="text-[#111827]">{item}</p>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map((score) => (
                            <button
                              key={score}
                              type="button"
                              onClick={() => setScore(index, score)}
                              className={`h-9 rounded-lg border text-sm font-bold transition ${
                                state.scores[index] === score
                                  ? 'border-[#FF7A2F] bg-[#FF7A2F] text-white'
                                  : 'border-[#E7D8C6] bg-[#F7F1E8] text-[#0B0F14] hover:border-[#FF7A2F]/50 hover:bg-[#FF7A2F]/10'
                              }`}
                            >
                              {score}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-5 text-white">
                    <span className="text-4xl font-black text-[#F6C443]">{averageScore.toFixed(1)}</span>
                    <p className="mt-2 text-[#F7F1E8]/72">{scoreAdvice(averageScore, Object.keys(state.scores).length)}</p>
                  </div>
                </Panel>
              )}

              {activeStep === 'prompts' && (
                <>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      Prompting
                    </p>
                    <h2 className="mt-2 max-w-none text-4xl font-black tracking-tight text-[#0B0F14] sm:text-5xl">
                      Generic prompt in, generic answer out.
                    </h2>
                  </div>

                  <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7D8C6] bg-white shadow-[0_24px_80px_-70px_rgba(11,15,20,0.5)]">
                    <Image
                      src="/slides/prompt-anatomy-desktop.png"
                      alt="The five parts of a strong prompt assembling into one polished prompt"
                      width={1672}
                      height={941}
                      className="hidden h-auto w-full max-w-none lg:block"
                    />
                    <Image
                      src="/slides/prompt-anatomy-mobile.png"
                      alt="The five parts of a strong prompt assembling into one polished prompt"
                      width={1122}
                      height={1402}
                      className="h-auto w-full max-w-none lg:hidden"
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EF1111]">
                      The issue
                    </p>
                    <p className="mt-3 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      Ask a vague question and you get a vague answer that could fit any company on
                      earth. Then you burn ten minutes rewriting it to sound like you. The AI is
                      rarely the problem. The prompt just never told it who you are or what you
                      actually need.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      The fix
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-[#0B0F14] sm:text-4xl lg:text-5xl">
                      Every strong prompt has the same five parts &mdash; and you already built the most
                      important one.
                    </h3>
                    <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      Context, Assignment, Source, Boundaries, Review. That first part &mdash; Context
                      &mdash; is the Business Brain you just built, so you are already halfway to a great
                      prompt before you type a word. Learn the pattern once and you can write your own
                      for anything. Context in, relevance out.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      {promptAnatomy.map((part, index) => (
                        <div key={part.label} className="rounded-2xl border border-[#E7D8C6] bg-white/70 p-4">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FF7A2F] text-xs font-bold text-white">
                            {index + 1}
                          </span>
                          <p className="mt-3 font-bold text-[#0B0F14] lg:text-lg">{part.label}</p>
                          <p className="mt-1 text-sm leading-relaxed text-[#334155] lg:text-base">{part.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Panel eyebrow="Step 4" title="Your Prompt Pack">
                  <p className="text-lg leading-relaxed text-[#334155] lg:text-xl">
                    Click a Capstone deliverable below. Each one builds a ready-to-paste prompt from
                    the business profile you just created, so you walk out with a draft of your
                    graduation work.
                  </p>
                  <div className="mt-6 flex flex-col gap-3 lg:grid lg:grid-cols-[250px_1fr] lg:grid-rows-[auto_1fr_auto] lg:gap-4">
                    {/* Deliverable tabs */}
                    <div className="order-1 flex flex-col gap-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2">
                      {prompts.length ? (
                        prompts.map((entry) => (
                          <button
                            key={entry.name}
                            type="button"
                            onClick={() => setActivePrompt(entry.name)}
                            className={`flex min-h-[60px] items-center rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                              activePrompt === entry.name
                                ? 'border-[#FF7A2F] bg-[#0B0F14] text-white'
                                : 'border-[#E7D8C6] bg-white/70 text-[#0B0F14] hover:border-[#FF7A2F]/45'
                            }`}
                          >
                            {entry.name}
                          </button>
                        ))
                      ) : (
                        <p className="rounded-2xl border border-[#E7D8C6] bg-white/70 p-4 text-sm text-[#667085]">
                          Generate prompts to fill this area.
                        </p>
                      )}
                    </div>

                    {/* Prompt text */}
                    <div className="relative order-2 lg:order-none lg:col-start-2 lg:row-start-2 lg:row-span-2 lg:min-h-0">
                      <textarea
                        readOnly
                        value={activeEntry?.text || ''}
                        placeholder="Generate prompts to see your workshop prompt pack."
                        className="h-full min-h-[460px] w-full resize-y rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-4 pr-20 font-mono text-sm leading-relaxed text-[#F7F1E8] outline-none focus:border-[#FF7A2F]/80"
                      />
                      {activeEntry && (
                        <button
                          type="button"
                          onClick={() => copyText(activeEntry.text || '', 'Prompt copied.', 'prompt')}
                          className="absolute right-3 top-3 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:border-[#FF7A2F] hover:bg-[#FF7A2F]"
                        >
                          {copiedKey === 'prompt' ? 'Copied' : 'Copy'}
                        </button>
                      )}
                    </div>

                    {/* Open ChatGPT */}
                    {activeEntry && (
                      <a
                        href="https://chatgpt.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="order-3 rounded-xl bg-[#FF7A2F] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-[#FF7A2F]/25 transition hover:bg-[#EF1111] lg:order-none lg:col-start-1 lg:row-start-3 lg:self-end"
                      >
                        Open ChatGPT &rarr;
                      </a>
                    )}

                    {/* Why this works */}
                    {activeEntry && (
                      <div className="order-4 rounded-2xl border border-[#FF7A2F]/30 bg-[#FF7A2F]/10 p-4 lg:order-none lg:col-start-2 lg:row-start-1 lg:self-start">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                          Why this works
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-[#0B0F14]">{activeEntry.why}</p>
                      </div>
                    )}
                  </div>
                  </Panel>
                </>
              )}

              {activeStep === 'manual' && (
                <>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      What stays manual
                    </p>
                    <h2 className="mt-2 max-w-none text-4xl font-black tracking-tight text-[#0B0F14] sm:text-5xl">
                      AI sounds confident even when it&rsquo;s wrong.
                    </h2>
                  </div>

                  <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7D8C6] bg-white shadow-[0_24px_80px_-70px_rgba(11,15,20,0.5)]">
                    <Image
                      src="/slides/human-owns-desktop.png"
                      alt="AI drafts, a human reviews and approves before anything goes out"
                      width={1672}
                      height={941}
                      className="hidden h-auto w-full max-w-none lg:block"
                    />
                    <Image
                      src="/slides/human-owns-mobile.png"
                      alt="AI drafts, a human reviews and approves before anything goes out"
                      width={1122}
                      height={1402}
                      className="h-auto w-full max-w-none lg:hidden"
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EF1111]">
                      The issue
                    </p>
                    <p className="mt-3 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      AI will state a fake number, invent a contact, or misquote a rule in the exact
                      same confident tone it uses for the truth. Paste that into a proposal or a buyer
                      email and the mistake becomes yours. Confident does not mean correct.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      The fix
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-[#0B0F14] sm:text-4xl lg:text-5xl">
                      You stay the editor. AI drafts &mdash; you decide.
                    </h3>
                    <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      AI invents facts, numbers, and names without blinking. The drafts you just
                      generated, your growth plan, your target list, your capability statement, are a
                      starting point, not the final word. Before any of it reaches a buyer, you check
                      it. The businesses that win are not the ones using the most AI. They are the
                      ones who know what to verify. Keep a human on anything that carries your name.
                    </p>
                  </div>

                  <Panel eyebrow="Step 5" title="Decide what stays manual">
                  <p className="text-lg leading-relaxed text-[#334155] lg:text-xl">
                    Mark the checks you will always do yourself before anything AI touches goes out
                    the door.
                  </p>
                  <div className="mt-6 grid gap-3">
                    {manualGates.map((gate, index) => (
                      <button
                        key={gate}
                        type="button"
                        onClick={() => toggleManual(index)}
                        className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                          state.manualChecks[index]
                            ? 'border-[#FF7A2F]/60 bg-[#FF7A2F]/10'
                            : 'border-[#E7D8C6] bg-white/70 hover:border-[#FF7A2F]/45'
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md border text-sm font-bold ${
                            state.manualChecks[index]
                              ? 'border-[#FF7A2F] bg-[#FF7A2F] text-white'
                              : 'border-[#C9B8A4] bg-white text-transparent'
                          }`}
                        >
                          &#10003;
                        </span>
                        <span className="text-[#111827]">{gate}</span>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl border border-[#FF7A2F]/30 bg-[#FF7A2F]/10 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Coach it, don&rsquo;t quit
                    </p>
                    <p className="mt-2 text-[#0B0F14]">
                      AI is a teammate, not a one-shot magic button. If the first answer is not right,
                      redirect it the way you would coach a new hire: tell it what was off and what you
                      want instead, then run it again. And when it finally nails the result, capture how
                      you got there &mdash; ask it, &ldquo;write me a prompt I can reuse to recreate this
                      exact result.&rdquo; Now you have a repeatable tool, not a lucky hit.
                    </p>
                  </div>
                  <div className="mt-5 rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-5 text-white">
                    <p className="font-semibold text-[#F6C443]">The takeaway</p>
                    <p className="mt-2 text-[#F7F1E8]/80">
                      AI gives you speed. Your judgment is what makes the output safe to put
                      in front of a buyer. Keep the human on the parts that carry your name.
                    </p>
                  </div>
                  </Panel>
                </>
              )}

              {activeStep === 'automations' && (
                <>
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      Automations &amp; systems
                    </p>
                    <h2 className="mt-2 max-w-none text-4xl font-black tracking-tight text-[#0B0F14] sm:text-5xl">
                      You&rsquo;re still the one pressing go every time.
                    </h2>
                  </div>

                  <div className="mb-6 overflow-hidden rounded-2xl border border-[#E7D8C6] bg-white shadow-[0_24px_80px_-70px_rgba(11,15,20,0.5)]">
                    <Image
                      src="/slides/automate-desktop.png"
                      alt="A manual one-time sequence turned into a loop that runs every week"
                      width={1672}
                      height={941}
                      className="hidden h-auto w-full max-w-none lg:block"
                    />
                    <Image
                      src="/slides/automate-mobile.png"
                      alt="A manual one-time sequence turned into a loop that runs every week"
                      width={1122}
                      height={1402}
                      className="h-auto w-full max-w-none lg:hidden"
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#EF1111]">
                      The issue
                    </p>
                    <p className="mt-3 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      Even with a great prompt, nothing happens until you sit down, open the tool, and
                      start it. The work still waits on you. That is fine once, but the tasks that eat
                      your week are the ones that repeat, and you are doing them by hand every time.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                      The fix
                    </p>
                    <h3 className="mt-2 text-3xl font-black tracking-tight text-[#0B0F14] sm:text-4xl lg:text-5xl">
                      The real unlock is a system that runs without you.
                    </h3>
                    <p className="mt-4 max-w-4xl text-lg leading-relaxed text-[#1F2937] lg:text-2xl">
                      A teammate does the task when you ask. A system does it on its own. Imagine
                      Monday morning: your daily brief is already written, new leads are researched,
                      and follow-ups are drafted and waiting for your okay. You stop doing the
                      busywork and just steer. That is the difference between using AI and having AI
                      work for you, and it is how you get out of the day-to-day and back to running
                      the business.
                    </p>
                  </div>

                  <Panel eyebrow="Step 6" title="What to put on autopilot first">
                  <p className="text-lg leading-relaxed text-[#334155] lg:text-xl">
                    The systems that save owners the most time. Once they are set up, they run on
                    their own, and you just approve and steer.
                  </p>
                  <div className="mt-6 grid gap-3 md:grid-cols-2">
                    {[
                      { name: 'Morning Owner Brief', does: 'Inbox, calendar, deals, overdue invoices, and your priorities for the day, in one digest.' },
                      { name: 'Lead Follow-Up', does: 'Researches each new lead, drafts a personal reply, and updates the CRM.' },
                      { name: 'Meeting Prep & Recap', does: 'Pulls context before the meeting, then summarizes and creates tasks after.' },
                      { name: 'Invoice Chasing', does: 'Nudges overdue invoices with the right reminder so cash comes in faster.' },
                      { name: 'Weekly Business Review', does: 'A one-page snapshot of how the business is doing and what to focus on next.' },
                      { name: 'Opportunity Watch', does: 'Scans for new contracts and solicitations that fit your business, and flags the ones worth pursuing.' },
                    ].map((system) => (
                      <div key={system.name} className="rounded-2xl border border-[#E7D8C6] bg-white/70 p-5">
                        <p className="text-lg font-bold text-[#0B0F14] lg:text-xl">{system.name}</p>
                        <p className="mt-2 text-sm text-[#334155] lg:text-base">{system.does}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-5 text-white">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Now you
                    </p>
                    <p className="mt-2 text-xl font-bold text-white">
                      What is your biggest pain point right now?
                    </p>
                    <p className="mt-1 text-sm text-[#F7F1E8]/70">
                      The thing that eats your week. I will turn it into a starting move you can run
                      today.
                    </p>
                    <textarea
                      value={state.painPoint}
                      onChange={(event) => update('painPoint', event.target.value)}
                      placeholder="e.g. I lose hours every week chasing invoices and following up with leads."
                      className="mt-3 min-h-24 w-full resize-y rounded-xl border border-white/10 bg-white/[0.06] p-4 text-white placeholder:text-[#F7F1E8]/35 outline-none transition focus:border-[#FF7A2F]/70"
                    />
                    <button
                      type="button"
                      onClick={buildPainPrompt}
                      className="mt-3 rounded-xl bg-[#FF7A2F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7A2F]/25 transition hover:bg-[#EF1111]"
                    >
                      Build me a prompt to tackle this
                    </button>
                    {painPrompt && (
                      <div className="mt-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                            Your starting prompt
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => copyText(painPrompt, 'Prompt copied.', 'pain')}
                              className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/[0.1]"
                            >
                              {copiedKey === 'pain' ? 'Copied' : 'Copy'}
                            </button>
                            <a
                              href="https://chatgpt.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-[#FF7A2F] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#EF1111]"
                            >
                              Open ChatGPT
                            </a>
                          </div>
                        </div>
                        <textarea
                          readOnly
                          value={painPrompt}
                          className="mt-3 min-h-[180px] w-full resize-y rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm leading-relaxed text-[#F7F1E8] outline-none"
                        />
                      </div>
                    )}
                  </div>

                  </Panel>
                </>
              )}

              {activeStep === 'next' && (
                <Panel eyebrow="Next step" title="Want help applying this to your growth plan?">
                  <div className="mb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Before you go
                    </p>
                    <h3 className="mt-2 text-2xl font-black tracking-tight text-[#0B0F14] sm:text-3xl">
                      After today, what do you want to do with this?
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        { id: 'diy', label: 'Run with the kit on my own' },
                        { id: 'session', label: 'Get a working session on my growth plan' },
                        { id: 'build', label: 'Have my AI systems built for me' },
                        { id: 'talk', label: 'Not sure yet, let us talk' },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => update('intent', option.id)}
                          className={`rounded-2xl border p-4 text-left text-sm font-semibold transition ${
                            state.intent === option.id
                              ? 'border-[#FF7A2F] bg-[#FF7A2F]/10 text-[#0B0F14]'
                              : 'border-[#E7D8C6] bg-white/70 text-[#0B0F14] hover:border-[#FF7A2F]/45 hover:bg-white'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {state.intent && (
                      <p className="mt-3 text-sm font-medium text-[#0B0F14]">
                        {state.intent === 'diy' &&
                          'Love it. Everything you need is in this kit, and I am here if you get stuck.'}
                        {state.intent === 'session' &&
                          'Perfect. That is the Growth Plan Working Session below.'}
                        {state.intent === 'build' &&
                          'That is the done-with-you build. Start with a free Fit Call below and we will scope it.'}
                        {state.intent === 'talk' &&
                          'Smart. Grab a free Fit Call below and we will find your first move together.'}
                      </p>
                    )}
                  </div>
                  <div className="mb-6 rounded-2xl border border-[#E7D8C6] bg-white/70 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                      Start cheap, scale safely
                    </p>
                    <p className="mt-2 text-[#0B0F14]">
                      You can start with one $20 tool, ChatGPT or Claude, plus NotebookLM for free.
                      When you are ready to put real bid and customer data to work, you move to a
                      business account where your data stays private. Setting that up so it is safe
                      and actually useful is exactly what I do.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-5 text-white shadow-xl shadow-[#0B0F14]/15">
                    <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                          Get your kit emailed to you
                        </p>
                        <h3 className="mt-2 text-xl font-bold text-white">
                          Want your finished plan and prompt pack sent to you?
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[#F7F1E8]/72">
                          I&rsquo;ll send your readiness plan, the full prompt library, and a
                          procurement-ready capability statement. When you submit, I receive the
                          worksheet you built so I can tailor it to you. As HMSDC&rsquo;s AI expert for
                          the Academy, I can also help you implement it.
                        </p>
                      </div>

                      <form onSubmit={captureLead} className="grid gap-3 md:grid-cols-2">
                        {state.leadCaptured && (
                          <div className="rounded-2xl border border-[#F6C443]/30 bg-[#F6C443]/10 p-3 md:col-span-2">
                            <p className="text-sm font-semibold text-white">
                              Sent &mdash; check your inbox. Need to change something? Update the
                              fields and resend.
                            </p>
                          </div>
                        )}
                          <Input
                            label="First name"
                            value={state.firstName}
                            onChange={(value) => update('firstName', value)}
                            autoComplete="given-name"
                            required
                          />
                          <Input
                            label="Email"
                            value={state.email}
                            onChange={(value) => update('email', value)}
                            autoComplete="email"
                            type="email"
                            required
                          />
                          <Input
                            label="Company"
                            value={state.companyName}
                            onChange={(value) => update('companyName', value)}
                            autoComplete="organization"
                          />
                          <Input
                            label="Business type"
                            value={state.businessType}
                            onChange={(value) => update('businessType', value)}
                            placeholder="Construction, IT, facilities..."
                          />
                          <label className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-[#F7F1E8]/82 md:col-span-2">
                            <input
                              type="checkbox"
                              checked={state.wantsAudit}
                              onChange={(event) => update('wantsAudit', event.target.checked)}
                              className="mt-1 h-4 w-4 accent-[#FF7A2F]"
                            />
                            I would like help implementing an AI readiness system after the workshop.
                          </label>
                          {leadError && (
                            <div className="rounded-xl border border-[#EF1111]/40 bg-[#EF1111]/10 px-4 py-3 text-sm text-red-100 md:col-span-2">
                              {leadError}
                            </div>
                          )}
                          <button
                            type="submit"
                            disabled={submittingLead}
                            className="rounded-xl bg-[#FF7A2F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7A2F]/25 transition hover:bg-[#EF1111] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
                          >
                            {submittingLead
                              ? 'Sending...'
                              : state.leadCaptured
                                ? 'Resend my kit'
                                : 'Email me my kit'}
                          </button>
                        </form>
                    </div>
                  </div>
                  <p className="mt-6 max-w-3xl text-lg leading-relaxed text-[#334155] lg:text-xl">
                    You just built the foundation. If you want a hand turning it into the
                    sections corporate buyers actually read, here is the path &mdash; no
                    pressure, start wherever you are comfortable.
                  </p>

                  <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
                    <div className="rounded-2xl border border-[#FF7A2F]/35 bg-white/75 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
                          Growth Plan AI Working Session
                        </p>
                        <span className="rounded-full border border-[#FF7A2F]/30 bg-[#FF7A2F]/10 px-3 py-1 text-xs font-semibold text-[#0B0F14]">
                          90 min &middot; 1:1
                        </span>
                      </div>
                      <p className="mt-3 text-[#0B0F14]">
                        Bring your SWOT and target list. We build your AI business profile,
                        rebuild one growth-plan section live, and you leave with a prompt pack
                        tuned to your business.
                      </p>
                      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#FF7A2F]">
                        Academy rate for cohort members
                      </p>
                    </div>
                    <div className="rounded-2xl border border-[#E7D8C6] bg-white/70 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#667085]">
                        Not sure yet?
                      </p>
                      <p className="mt-2 text-[#0B0F14]">
                        Start with a free 15-minute Fit Call. We find the one workflow worth
                        building first &mdash; no obligation.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button type="button" onClick={submitAuditIntent} className="rounded-xl bg-[#FF7A2F] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FF7A2F]/25 transition hover:bg-[#EF1111]">
                      Book a Free Fit Call
                    </button>
                    <button type="button" onClick={downloadExport} className="rounded-xl border border-[#0B0F14]/15 bg-white/65 px-5 py-3 text-sm font-semibold text-[#0B0F14] transition hover:border-[#FF7A2F]/50 hover:bg-white">
                      Download My Plan
                    </button>
                    <button type="button" onClick={() => copyText(auditEmail(state), 'Working session request copied.', 'audit')} className="rounded-xl border border-[#0B0F14]/15 bg-white/65 px-5 py-3 text-sm font-semibold text-[#0B0F14] transition hover:border-[#FF7A2F]/50 hover:bg-white">
                      {copiedKey === 'audit' ? 'Copied' : 'Copy My Working Session Request'}
                    </button>
                  </div>
                  <div className="mt-8 rounded-2xl border border-[#0B0F14] bg-[#0B0F14] p-5 text-white">
                    <h3 className="text-lg font-bold text-white">Your readiness snapshot</h3>
                    <dl className="mt-4 grid gap-3 text-sm md:grid-cols-[180px_1fr]">
                      <dt className="font-semibold text-[#F6C443]">Company</dt>
                      <dd className="text-[#F7F1E8]/72">{state.companyName || 'Not entered'}</dd>
                      <dt className="font-semibold text-[#F6C443]">Score</dt>
                      <dd className="text-[#F7F1E8]/72">{averageScore.toFixed(1)} average readiness score</dd>
                      <dt className="font-semibold text-[#F6C443]">Biggest challenge</dt>
                      <dd className="text-[#F7F1E8]/72">{state.painPoint || 'Not entered'}</dd>
                    </dl>
                  </div>
                </Panel>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Mobile step navigation bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 lg:hidden">
        {mobileNavOpen && (
          <div className="mx-3 mb-2 max-h-[55vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0B0F14] p-2 shadow-2xl">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  goToStep(step.id);
                }}
                className={`grid w-full grid-cols-[28px_1fr] items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  activeStep === step.id ? 'bg-[#FF7A2F]/15 text-white' : 'text-[#F7F1E8]/70'
                }`}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FF7A2F] text-xs font-bold text-white">
                  {index === 0 ? '★' : index}
                </span>
                <span className="text-sm font-semibold">{step.title}</span>
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 border-t border-white/10 bg-[#0B0F14] px-3 py-3">
          <button
            type="button"
            onClick={() => {
              if (currentIndex > 0) {
                goToStep(steps[currentIndex - 1].id);
              }
            }}
            disabled={currentIndex <= 0}
            className="rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-40"
          >
            &lsaquo; Back
          </button>
          <button
            type="button"
            onClick={() => setMobileNavOpen((value) => !value)}
            className="min-w-0 flex-1 rounded-xl px-3 py-2 text-center"
          >
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FF7A2F]">
              {currentIndex === 0 ? 'Welcome' : `Step ${currentIndex}`}
            </span>
            <span className="block truncate text-sm font-semibold text-white">
              {steps[currentIndex]?.title}
            </span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (currentIndex < steps.length - 1) {
                goToStep(steps[currentIndex + 1].id);
              }
            }}
            disabled={currentIndex >= steps.length - 1}
            className="rounded-xl bg-[#FF7A2F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#EF1111] disabled:opacity-40"
          >
            Next &rsaquo;
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-24 right-5 z-50 max-w-sm rounded-xl border border-[#FF7A2F]/35 bg-[#0B0F14] px-4 py-3 text-sm text-white shadow-2xl lg:bottom-5">
          {toast}
        </div>
      )}
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
  autoComplete,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#F7F1E8]/82">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-white/15 bg-white/[0.06] px-4 py-3 text-white placeholder:text-[#F7F1E8]/35 outline-none transition focus:border-[#FF7A2F]/70 focus:ring-2 focus:ring-[#FF7A2F]/25"
      />
    </label>
  );
}

function Textarea({
  label,
  hint,
  value,
  onChange,
  className = '',
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-sm font-semibold text-[#111827]">{label}</span>
      {hint && <span className="mb-2 block text-xs leading-snug text-[#667085]">{hint}</span>}
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-32 w-full resize-y rounded-2xl border border-[#E7D8C6] bg-white/75 p-4 text-[#0B0F14] placeholder:text-[#667085]/60 outline-none transition focus:border-[#FF7A2F]/70 focus:ring-2 focus:ring-[#FF7A2F]/20"
      />
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[#111827]">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#E7D8C6] bg-white/75 px-4 py-3 text-[#0B0F14] placeholder:text-[#667085]/60 outline-none transition focus:border-[#FF7A2F]/70 focus:ring-2 focus:ring-[#FF7A2F]/20"
      />
    </label>
  );
}

function Panel({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-[#E7D8C6] bg-[#F7F1E8]/92 p-5 shadow-[0_28px_90px_-70px_rgba(11,15,20,0.55)] backdrop-blur sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0B0F14] sm:text-4xl lg:text-5xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function LogoIcon({ slug, label, className }: { slug: string; label: string; className?: string }) {
  return (
    <img
      src={`/logos/${slug}.svg`}
      alt={`${label} logo`}
      loading="lazy"
      className={className ?? 'h-7 w-7 object-contain'}
    />
  );
}

function firstNameFromUser(user: User): string {
  const displayName = user.displayName?.trim();
  if (displayName) return displayName.split(/\s+/)[0] ?? displayName;
  if (user.email) return user.email.split('@')[0] ?? '';
  return '';
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Everything a participant types across the slides, in one payload. Shared by the
// opt-in submit (emails Ian) and the anonymous autosave (persists progress).
function buildCapturePayload(state: KitState, averageScore: number) {
  return {
    contact: {
      firstName: state.firstName.trim(),
      email: state.email.trim(),
      company: state.companyName.trim(),
      businessType: state.businessType.trim(),
    },
    title: state.title.trim(),
    painPoint: state.painPoint.trim(),
    intent: state.intent,
    wantsAudit: state.wantsAudit,
    averageScore,
    worksheet: {
      overview: state.overview.trim(),
      services: state.services.trim(),
      certifications: state.certifications.trim(),
      pastPerformance: state.pastPerformance.trim(),
      differentiators: state.differentiators.trim(),
      targets: state.targets.trim(),
      swot: state.swot.trim(),
      goals: state.goals.trim(),
    },
    scoresText: scoreItems
      .map((item, index) => `${item} ${state.scores[index] || 'Not scored'}/5`)
      .join('\n'),
    manualChecksText: manualGates
      .filter((_, index) => state.manualChecks[index])
      .map((gate) => `- ${gate}`)
      .join('\n'),
  };
}

// True once the participant has typed anything worth saving.
function hasCaptureContent(state: KitState): boolean {
  return Boolean(
    state.firstName.trim() ||
      state.email.trim() ||
      state.companyName.trim() ||
      state.title.trim() ||
      state.painPoint.trim() ||
      state.overview.trim() ||
      state.services.trim() ||
      state.certifications.trim() ||
      state.pastPerformance.trim() ||
      state.differentiators.trim() ||
      state.targets.trim() ||
      state.swot.trim() ||
      state.goals.trim() ||
      Object.keys(state.scores).length ||
      Object.values(state.manualChecks).some(Boolean),
  );
}

function computeAverageScore(scores: Record<number, number>): number {
  const values = Object.values(scores).map(Number).filter(Boolean);
  return values.length ? values.reduce((sum, score) => sum + score, 0) / values.length : 0;
}

function scoreAdvice(average: number, count: number): string {
  if (!count) return 'Complete the scorecard to get a recommendation.';
  if (average < 2.5) {
    return 'Start with the Business Brain. Your first win is organizing the facts, documents, and proof points your team already has.';
  }
  if (average < 3.6) {
    return 'Build one workflow that fixes a repeatable bottleneck, especially follow-up or target-client prep.';
  }
  return 'You are ready to systemize. Focus on ownership, review rhythm, and reusable workflows your team can run without you.';
}

function businessContext(state: KitState): string {
  return [
    `Company: ${state.companyName || '[Company name]'}`,
    `Contact: ${state.firstName || '[Your name]'}, ${state.title || '[Your title]'}`,
    `Business type: ${state.businessType || '[Business type]'}`,
    `Business snapshot (what we do, who we serve, the problem we solve): ${state.overview || '[Business snapshot]'}`,
    `Proof and qualifications (certifications, past performance, projects, results): ${state.pastPerformance || '[Proof and qualifications]'}`,
    `Differentiators (why a buyer chooses us over a similar vendor): ${state.differentiators || '[Differentiators]'}`,
    `Growth focus (the opportunity, buyer, workflow, or goal we are focused on next): ${state.goals || '[Growth focus]'}`,
  ].join('\n');
}

function painPointPromptText(state: KitState): string {
  return `Here is my business:\n${businessContext(state)}\n\nMy biggest pain point right now is: ${state.painPoint.trim() || '[describe your biggest pain point]'}\n\nGive me one practical, realistic way to use AI on this pain point today, and the exact first prompt I would type to start. Keep it specific to my business and free of jargon.`;
}

function businessContextPrompt(state: KitState): string {
  return `You are a sharp small-business consultant. Build me a reusable business profile I can paste at the start of any future chat.\n\nHere is my business:\n${businessContext(state)}\n\nTurn this into one clean, organized profile with these sections: company name and primary contact (name and title), business summary, who we serve, what we sell, differentiators, certifications and categories, proof points, brand voice, and current priority. Keep it tight and buyer-facing. End with one line on how to use it.`;
}

function makePrompts(state: KitState): PromptEntry[] {
  const business =
    businessContext(state) +
    (state.workflowContext.trim() ? `\nFocus / priority: ${state.workflowContext.trim()}` : '');
  return [
    {
      name: 'Business Growth Plan',
      why: 'The centerpiece Capstone deliverable. It turns your profile into the structured plan corporate buyers and procurement officers expect to see.',
      text: `You are a sharp small-business growth strategist. Using my business profile below, draft a comprehensive Business Growth Plan.\n\nMy business profile:\n${business}\n\nInclude these sections:\n1. Company overview and market positioning\n2. Growth objectives and strategic priorities for the next 12 to 24 months\n3. Target markets and ideal customers\n4. Competitive differentiators\n5. Growth strategy and key initiatives, each with an owner and a milestone\n6. Operational and capacity considerations\n7. The key metrics I should track\n\nKeep it executive, specific, and buyer-facing. Flag anything I still need to provide.`,
    },
    {
      name: 'Strategic Target Client List',
      why: 'Uses the AI web research to turn your service area and capabilities into a list of real, named corporations, agencies, and primes to pursue.',
      text: `Using my business profile below, build a Strategic Target Client List for procurement.\n\nMy business profile:\n${business}\n\nUse your web research and browsing tools to find REAL, currently operating organizations. Name actual companies, not hypothetical examples. Do the following:\n1. Search the web to identify real corporations, public agencies, and prime contractors that buy what I sell in my service area.\n2. For each, note why they are a fit, what they likely buy from a supplier like me, and any supplier registration, supplier-diversity program, or open procurement portal you can find. Include a source link where possible.\n3. Rank them into realistic-now versus aspirational.\n4. List exactly what I should verify about each before reaching out, such as current contracts, the right buyer or department, and registration requirements.\n\nIf you cannot browse the web, say so clearly, then give me the best real organizations you already know of and mark each as needing verification. Do not fabricate contact names, emails, or phone numbers.`,
    },
    {
      name: 'Financial Forecast & Capital Strategy',
      why: 'Frames your numbers and funding options the way lenders, CDFIs, and estimators expect. Always confirm figures with your CPA.',
      text: `You are a small-business financial advisor. Using my business profile below, help me outline a Financial Forecast and Capital Strategy.\n\nMy business profile:\n${business}\n\nHelp me structure:\n1. A simple 12-month revenue and cost projection framework, with the assumptions I need to fill in\n2. Working-capital and cash-flow needs for taking on larger contracts\n3. Funding options to consider, such as a line of credit, contract financing, CDFIs, or grants\n4. Financial risks to watch and how to mitigate them\n5. What a lender or estimator will want to see\n\nThis is not financial or accounting advice. Tell me clearly which numbers I must confirm with a CPA.`,
    },
    {
      name: 'Procurement Readiness Framework',
      why: 'Scores where you stand on what buyers check first, and gives you a checklist to close the gaps before you bid.',
      text: `Using my business profile below, assess my procurement readiness and build a Procurement Readiness Framework.\n\nMy business profile:\n${business}\n\nProduce:\n1. A readiness assessment across certifications, bonding and insurance, past performance, capability statement, financials, and operational systems.\n2. The biggest gaps that would stop me from qualifying for contracts.\n3. A prioritized checklist to close those gaps in the next 90 days.\n4. The documents I should have ready before I bid.\n\nFlag anything that needs expert or legal review.`,
    },
    {
      name: 'Executive Introduction Video Script',
      why: 'A tight, confident script for the Spark Hire intro video, built from your positioning and brand voice.',
      text: `Write a 60 to 90 second Executive Introduction Video script for me, in my brand voice, using my business profile below.\n\nMy business profile:\n${business}\n\nThe script should cover, conversationally:\n1. Who I am and my company\n2. Who we serve and the problem we solve\n3. What makes us different\n4. Proof or results that build credibility\n5. The opportunity I am looking for right now\n6. A confident closing line\n\nKeep it natural to say out loud, not corporate. Mark any spot where I should add a specific number or example.`,
    },
    {
      name: 'Competitive Positioning Strategy',
      why: 'Sharpens how buyers understand and remember you: who you serve, what you solve, why you are different, in one clear line.',
      text: `Using my business profile below, define my Competitive Positioning Strategy.\n\nMy business profile:\n${business}\n\nProduce:\n1. A one-sentence value proposition covering who we serve, what we solve, and why we are different.\n2. Our top 3 differentiators, stated in buyer terms.\n3. How we compare to likely competitors, and where we win.\n4. The proof points that back each claim.\n5. Five versions of the value proposition, then your recommendation of the strongest and why.\n\nKeep it clear, specific, and easy to repeat.`,
    },
  ];
}

function exportMarkdown(state: KitState, prompts: PromptEntry[]): string {
  const average = computeAverageScore(state.scores);
  const promptText = prompts
    .map((entry) => `## ${entry.name}\n\n_Why this works: ${entry.why}_\n\n\`\`\`text\n${entry.text}\n\`\`\``)
    .join('\n\n');
  const anatomyText = promptAnatomy
    .map((part, index) => `${index + 1}. **${part.label}** - ${part.detail}`)
    .join('\n');
  const manualText = manualGates
    .map((gate, index) => `- [${state.manualChecks[index] ? 'x' : ' '}] ${gate}`)
    .join('\n');

  return `# AI Supplier Readiness Builder Export\n\n## Attendee\n- Name: ${state.firstName}\n- Email: ${state.email}\n- Company: ${state.companyName}\n- Business type: ${state.businessType}\n- Wants implementation help: ${state.wantsAudit ? 'Yes' : 'No'}\n\n## Business Brain\n${businessContext(state)}\n\n## Readiness Score\nAverage score: ${average.toFixed(1)}\n\n${scoreItems
    .map((item, index) => `- ${item} ${state.scores[index] || 'Not scored'}/5`)
    .join('\n')}\n\n## The Prompt Pattern (use this for any task)\n${anatomyText}\n\n## What Stays Manual\n${manualText}\n\n# Prompt Pack\n\n${promptText}\n`;
}

function auditEmail(state: KitState): string {
  const selectedWorkflow = workflows.find((workflow) => workflow.id === state.selectedWorkflow);
  return `Subject: Growth Plan AI Working Session\n\nHi Ian,\n\nI attended your AI session at the HMSDC MBE Leadership Academy and would like to book the Growth Plan AI Working Session (Academy rate).\n\nCompany: ${state.companyName || '[company]'}\nGrowth-plan section I most want help with: ${selectedWorkflow?.title || 'Not selected'}\nWhat I am trying to win: [contract, certification, or buyer]\n\nIf a free Fit Call is the better first step, I am open to that too.\n\nThanks,\n${state.firstName || '[name]'}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
