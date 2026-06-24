"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ── Conversion links (confirm before the talk) ───────────────────────────
   BOOKING_URL: the "AI Ops / Fit Call" booking already live on this site.
   COMMUNITY_URL: the Idea-to-AI Facebook group.
   Both are easy to swap — single constants. */
const ASSESSMENT_URL = "/assessment";
const BOOKING_URL = "https://calendar.app.google/okpHPUV8TA85GBaA6";
const COMMUNITY_URL = "https://www.facebook.com/groups/2000295250823114";

/* ── Content ─────────────────────────────────────────────────────────── */
const PROFILE_PROMPT = `You are a sharp small-business consultant. Build me a reusable business profile from these answers:
- What I sell: [products or services]
- Who is most likely to buy it: [ideal customer]
- Where I operate: [city / area I serve]
- Why customers choose me: [my edge]
- The opportunity I want to find right now: [more customers, contracts, partners...]
- How my business should sound: [tone — friendly, plain, expert]

Turn this into a clean profile I can paste at the start of any future chat: business summary, ideal customer, core services, differentiators, buying triggers, brand voice, and current priority. End with one line on how to use it.`;

const STEPS: { n: string; title: string; sub: string; tool: string; prompt: string }[] = [
  {
    n: "02",
    title: "Research the market",
    sub: "Find the market before you write the message.",
    tool: "ChatGPT / Perplexity",
    prompt: `Using the business profile above, research the local market and business development opportunities for this business. Create a practical opportunity map:
1. Direct competitors to study
2. Local places to find leads
3. Referral partners who already serve this audience
4. Relevant directories, associations, or public-sector opportunities to monitor
5. Customer pain points and buying triggers to listen for
6. Three outreach angles based on what you find
Keep it practical and prioritize actions I could take this week.`,
  },
  {
    n: "03",
    title: "Organize into a working list",
    sub: "A wall of text is not a business system.",
    tool: "ChatGPT",
    prompt: `Take that research and organize it into a working opportunity tracker I can act on. Make a table with: Organization, Opportunity type, Contact or department, Reason it fits, Source, Priority (High/Medium/Low), Next action, and Status. Fill in what you found and leave blanks where I need to add detail.`,
  },
  {
    n: "04",
    title: "Turn one opportunity into action",
    sub: "Research only matters when it changes what you do next.",
    tool: "ChatGPT",
    prompt: `Pick the single best opportunity from the tracker above and draft:
1. A personalized introduction email
2. A short follow-up message
3. A call-preparation brief
4. A recommended next step
Keep the tone natural and specific to this contact — not a mass blast.`,
  },
  {
    n: "05",
    title: "Review before acting",
    sub: "AI is your first reader, not your final authority.",
    tool: "Claude / ChatGPT",
    prompt: `Review this draft before I use it. Check: 1. Is it accurate? 2. Did you invent or assume anything? 3. Does it include private or sensitive information? 4. Does it sound like my business? 5. Is the personalization specific enough? 6. Is the next action clear and low-pressure? Rewrite it so it sounds like a helpful small business owner, not a spam campaign.`,
  },
];

const CHECKLIST = [
  "Create a free account on ONE tool — ChatGPT, Claude, or Gemini. Just one.",
  "Run the business-profile prompt on your real business and save the result.",
  "Paste that profile at the start of your next chat and feel the difference.",
  "Pick one opportunity and run research → tracker → outreach on it.",
  "Save the prompts that worked in a notes app. That's your toolkit.",
  "Set one rule: I verify everything before it goes out.",
];

const TOOLS = [
  { name: "ChatGPT", best: "All-around: drafting, research, connected workflows", cost: "Free · paid for files + connections", url: "https://chatgpt.com" },
  { name: "Claude", best: "Long documents, analysis, careful writing", cost: "Free · paid for bigger docs", url: "https://claude.ai" },
  { name: "Gemini", best: "If you live in Google Workspace", cost: "Free · paid for Drive tie-in", url: "https://gemini.google.com" },
  { name: "Copilot", best: "If you live in Microsoft 365", cost: "Free · paid inside Office", url: "https://copilot.microsoft.com" },
  { name: "Perplexity", best: "Web research with visible sources", cost: "Free · paid for deep research", url: "https://www.perplexity.ai" },
];

const RULES = [
  { title: "Keep private data out of free tools.", body: "Customer details, anything confidential — when in doubt, leave it out." },
  { title: "Verify every fact, number, and name.", body: "AI sounds confident even when it's wrong. Check before it goes out." },
  { title: "You own the decision.", body: "AI can be your first reader, researcher, and drafter. Not your final authority." },
];

const PATHS = [
  { tag: "Free", title: "Join the community", body: "New prompts, examples, and follow-up support from other owners doing this.", cta: "Join free", href: COMMUNITY_URL, primary: false },
  { tag: "Free call", title: "Book an AI Workflow Fit Call", body: "We look at one repetitive process in your business, find where AI fits, and decide the right next move.", cta: "Book a Fit Call", href: BOOKING_URL, primary: true },
  { tag: "Done for you", title: "Have me build it for you", body: "I build the workflow inside your own accounts so it runs every week without you. Book a call and we'll scope it.", cta: "Set up a call", href: BOOKING_URL, primary: false },
];

const SECTIONS = [
  { id: "snapshot", label: "Snapshot" },
  { id: "prompts", label: "Prompts" },
  { id: "checklist", label: "Checklist" },
  { id: "tools", label: "Tools" },
  { id: "rules", label: "Rules" },
  { id: "work", label: "Work with Ian" },
];

/* ── Icons (inline, no dep) ──────────────────────────────────────────── */
function IconCopy() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

/* ── Copy button ─────────────────────────────────────────────────────── */
function CopyButton({ text, label = "Copy prompt" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }}
      className={`inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition-colors w-full sm:w-auto ${
        copied
          ? "bg-emerald-600 text-white"
          : "bg-gradient-to-r from-red-600 to-red-700 text-white active:scale-[0.98]"
      }`}
      aria-live="polite"
    >
      {copied ? <IconCheck /> : <IconCopy />}
      {copied ? "Copied" : label}
    </button>
  );
}

/* ── Prompt card (copy-first, optional reveal) ───────────────────────── */
function PromptCard({ step }: { step: (typeof STEPS)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-sm font-bold text-white shadow-lg">
          {step.n}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-snug text-white">{step.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">{step.sub}</p>
          <p className="mt-2 text-xs font-medium uppercase tracking-wider text-zinc-500">{step.tool}</p>
        </div>
      </div>

      {open && (
        <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl border border-white/[0.08] bg-black/40 p-4 text-[13px] leading-relaxed text-zinc-300">
          {step.prompt}
        </pre>
      )}

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <CopyButton text={step.prompt} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-white/[0.12] px-5 text-sm font-semibold text-zinc-300 transition-colors active:bg-white/[0.04] sm:w-auto"
        >
          {open ? "Hide prompt" : "Show prompt"}
        </button>
      </div>
    </div>
  );
}

/* ── Sticky section nav (the floating component) ─────────────────────── */
function SectionNav() {
  const [active, setActive] = useState("snapshot");
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="sticky top-[60px] z-20 -mx-5 mb-10 border-b border-white/[0.06] bg-[#040404]/85 px-5 py-2.5 backdrop-blur sm:top-[64px]">
      <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              active === s.id ? "bg-red-600 text-white" : "bg-white/[0.05] text-zinc-400 active:bg-white/[0.1]"
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ── Page ────────────────────────────────────────────────────────────── */
export default function SummitKit() {
  return (
    <div className="w-full max-w-2xl pb-28 sm:pb-16">
      {/* Hero */}
      <header className="text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-red-500/90">
          Small Business Diversity &amp; Inclusion Summit
        </p>
        <h1 className="text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
          You just saw this live.
          <br />
          <span className="bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">
            Now do it for your business.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-zinc-400 sm:text-lg">
          The exact prompts, the checklist, and the free tools from the workshop. Start with the 2-minute snapshot, then work the five steps.
        </p>
      </header>

      <SectionNav />

      {/* Snapshot — primary CTA */}
      <section id="snapshot" className="scroll-mt-32">
        <Link
          href={ASSESSMENT_URL}
          className="group block rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600/20 to-transparent p-6 transition-colors active:border-red-500/60"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
            Start here — step 1, context
          </p>
          <p className="mt-2 text-xl font-bold leading-snug text-white">
            Take the free 2-minute AI Snapshot
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
            The same thing we just did on stage. Answer a few questions about your business and see exactly where AI fits — instantly.
          </p>
          <span className="mt-5 inline-flex min-h-[48px] items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 text-sm font-semibold text-white shadow-lg">
            Take the snapshot →
          </span>
        </Link>

        {/* Step 1 profile prompt */}
        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-5 sm:p-6">
          <h3 className="text-lg font-bold text-white">Build your reusable business profile</h3>
          <p className="mt-1 text-sm leading-relaxed text-zinc-400">
            Paste this into any free AI tool, fill in the brackets. This profile is the shortcut you reuse on every task after today.
          </p>
          <div className="mt-4">
            <CopyButton text={PROFILE_PROMPT} label="Copy the profile prompt" />
          </div>
        </div>
      </section>

      {/* Prompts — the 5-step workflow */}
      <section id="prompts" className="mt-14 scroll-mt-32">
        <h2 className="text-2xl font-bold tracking-tight text-white">The five-step workflow</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Build the profile above first, then run these in order. Tap to copy — the prompt drops straight into ChatGPT, Claude, or Gemini.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          {STEPS.map((s) => (
            <PromptCard key={s.n} step={s} />
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section id="checklist" className="mt-14 scroll-mt-32">
        <h2 className="text-2xl font-bold tracking-tight text-white">Do this Monday</h2>
        <ul className="mt-6 flex flex-col gap-3">
          {CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-600/20 text-red-400">
                <IconCheck />
              </span>
              <span className="text-sm leading-relaxed text-zinc-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Tools */}
      <section id="tools" className="mt-14 scroll-mt-32">
        <h2 className="text-2xl font-bold tracking-tight text-white">Free vs paid — a simple guide</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Start free. Don&apos;t buy a paid plan because the internet says so — upgrade only when one tool clearly earns its keep.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {TOOLS.map((t) => (
            <a
              key={t.name}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors active:bg-white/[0.05]"
            >
              <div className="min-w-0">
                <p className="font-semibold text-white">{t.name}</p>
                <p className="mt-0.5 text-sm text-zinc-400">{t.best}</p>
                <p className="mt-1 text-xs text-zinc-500">{t.cost}</p>
              </div>
              <span className="shrink-0 text-zinc-500">→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Rules */}
      <section id="rules" className="mt-14 scroll-mt-32">
        <h2 className="text-2xl font-bold tracking-tight text-white">AI safety — 3 rules</h2>
        <div className="mt-6 flex flex-col gap-3">
          {RULES.map((r, i) => (
            <div key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
              <p className="font-semibold text-white">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Work with Ian — conversion ladder */}
      <section id="work" className="mt-14 scroll-mt-32">
        <h2 className="text-2xl font-bold tracking-tight text-white">Your next step</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Start it yourself, or have me help. Three ways forward.
        </p>
        <div className="mt-6 flex flex-col gap-4">
          {PATHS.map((p) => (
            <a
              key={p.title}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-2xl border p-6 transition-colors ${
                p.primary
                  ? "border-red-500/40 bg-gradient-to-r from-red-600/20 to-transparent active:border-red-500/70"
                  : "border-white/[0.08] bg-white/[0.02] active:border-white/[0.2]"
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-[0.2em] ${p.primary ? "text-red-400" : "text-zinc-500"}`}>
                {p.tag}
              </p>
              <p className="mt-2 text-lg font-bold leading-snug text-white">{p.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{p.body}</p>
              <span
                className={`mt-4 inline-flex min-h-[48px] items-center gap-2 rounded-xl px-6 text-sm font-semibold text-white shadow-lg ${
                  p.primary ? "bg-gradient-to-r from-red-600 to-red-700" : "bg-white/[0.08]"
                }`}
              >
                {p.cta} →
              </span>
            </a>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-zinc-600">
          Ian McDonald · Disruptiv Solutions ·{" "}
          <a href="mailto:ian@ianmcdonald.ai" className="text-zinc-400 underline underline-offset-4 decoration-zinc-600 active:text-white">
            email me directly
          </a>
        </p>
      </section>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-[#040404]/95 px-4 py-3 backdrop-blur sm:hidden">
        <Link
          href={ASSESSMENT_URL}
          className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-base font-semibold text-white shadow-lg active:scale-[0.99]"
        >
          Take the 2-minute AI Snapshot →
        </Link>
      </div>
    </div>
  );
}
