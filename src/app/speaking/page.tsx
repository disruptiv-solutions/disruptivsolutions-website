import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SpeakingInquiryForm from "@/components/SpeakingInquiryForm";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Speaking — Ian McDonald",
  description:
    "Self-taught AI builder. Speaking for operator audiences — employers, founders, community hosts. No decks full of hype.",
  openGraph: {
    title: "Speaking — Ian McDonald",
    description:
      "Self-taught AI builder. Speaking for operator audiences — employers, founders, community hosts.",
    type: "website",
    images: ["/speaking/ian-speaker-aixp.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaking — Ian McDonald",
    description:
      "Self-taught AI builder. Speaking for operator audiences.",
    images: ["/speaking/ian-speaker-aixp.jpg"],
  },
};

const CALENDAR_URL = "https://calendar.app.google/J6uMiKkf3AM4zS9MA";
const EMAIL = "ian@ianmcdonald.ai";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ian McDonald",
  jobTitle: "Founder, LaunchBox",
  url: "https://disruptiv.solutions/speaking",
  email: `mailto:${EMAIL}`,
  image: "https://disruptiv.solutions/speaking/ian-speaker-aixp.jpg",
  description:
    "Self-taught AI product builder. Speaks for operator audiences — employer networks, founder groups, community hosts.",
  performerIn: [
    { "@type": "Event", name: "AIXP Houston 2026", location: "Houston, TX" },
    { "@type": "Event", name: "AI for Business 2025" },
  ],
};

const BEST_FIT: readonly string[] = [
  "AI and innovation conferences",
  "Founder and startup communities",
  "Chambers of commerce and business councils",
  "Workforce boards and employer networks",
  "Coach, consultant, and creator communities",
  "Community-led businesses and membership groups",
];

const STAGE_ITEMS = [
  {
    title: "AIXP Houston 2026",
    when: "April 2026",
    body: "4 speaking slots including the Founder Stories panel. Shared the LaunchBox build story with an operator audience. Mentioned during Maria Elena Duron's keynote.",
  },
  {
    title: "Launch & Learn",
    when: "Weekly, live",
    body: "I run a live build session every week: one real product, one real funnel, from idea to shipped in under an hour.",
  },
  {
    title: "AI for Business 2025",
    when: "2025",
    body: "Invited speaker on AI adoption for small business operators.",
  },
  {
    title: "Chase pitch event",
    when: "2025",
    body: "Pitched LaunchBox to a room of bankers and operators. Measurable follow-through into partner conversations.",
  },
  {
    title: "Orlando keynote",
    when: "May 2025",
    body: "Spoke to a room of 500+ people on building AI products as a self-taught operator.",
  },
  {
    title: "Jacksonville keynote",
    when: "March 2025",
    body: "Spoke to a room of 250+ people on practical AI for non-technical founders.",
  },
] as const;

const TALK_ITEMS = [
  {
    title: "Live Build: If I Can, You Can",
    bestFor: "Founder events, AI conferences, operator audiences",
    outcome:
      "Belief, practical examples, and a clear sense of what's actually possible with AI-assisted building today.",
    body: "My signature keynote. The presentation itself is a Next.js app I built — the talk is the demo. Audiences hear the real story (Pensacola → Colorado → recovery work → loss → built solo to $1.2M ARR) and leave knowing they can do this too. No CS degree required.",
  },
  {
    title: "AI for Employers",
    bestFor: "Workforce boards, chambers, employer networks",
    outcome:
      "Practical ways small teams can use AI in marketing, operations, content, and customer workflows — starting Monday.",
    body: "What AI adoption actually looks like inside a 5–50 person business right now. Tools, workflows, what fails, what sticks. Zero hype.",
  },
  {
    title: "From Idea to Funnel in 30 Minutes — Live",
    bestFor: "Workshops, founder meetups, business communities",
    outcome:
      "A live example of turning a real idea from the room into a working funnel using modern AI tools.",
    body: "A working build session. I take a business idea from the audience and ship a live funnel during the talk. Audiences see what modern AI tooling can actually do when a builder is driving.",
  },
  {
    title: "How Communities Monetize Without Becoming Course Creators",
    bestFor: "Coaches, consultants, membership and community groups",
    outcome:
      "A new model for recurring revenue through branded AI-powered communities — without becoming a content factory.",
    body: "The white-label AI workspace model. How community hosts turn an existing audience into reliable monthly revenue.",
  },
] as const;

const QUOTES: readonly {
  quote: string;
  who: string;
  role: string;
}[] = [
  {
    quote:
      "If these tools would have been available 10 years ago, I already would have been doing millions of dollars a year. People like Ian are gonna help you attract that with your marketing.",
    who: "Pat Hilton",
    role: "Headlining keynote · introducing Ian on stage, Orlando May 2025",
  },
  {
    quote:
      "I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive.",
    who: "Monika Mielnik",
    role: "Director, UX/UI Design & Development · AIXP Houston",
  },
  {
    quote:
      "Just watched the Orlando replay. Wow star struck! Can't believe you built the AI4B app.",
    who: "Shanshan Sateren",
    role: "Audience member · Orlando keynote replay",
  },
  {
    quote:
      "Ian is doing something that I have yet to accomplish with NextShiftIQ. He is doing this with a fraction of the experience I have as a developer.",
    who: "Joseph Bankole",
    role: "Senior Data Engineer · via LinkedIn, public post",
  },
  {
    quote: "Loved the way you broke it down — super clean, super intuitive.",
    who: "Mosiah Barlow",
    role: "Orlando keynote attendee",
  },
  { quote: "Simplicity is priceless.", who: "Jules B", role: "LaunchBox partner" },
  {
    quote: "I'm going to put you in as our expert AI.",
    who: "Nancy Smith",
    role: "Workforce Solutions East End",
  },
  {
    quote: "I loved your presentation and can't wait to implement it.",
    who: "Debbie H Page",
    role: "Orlando keynote attendee",
  },
];

const SectionHeader = ({
  kicker,
  title,
  copy,
  className,
  id,
}: {
  kicker?: string;
  title: string;
  copy?: string;
  className?: string;
  id?: string;
}) => (
  <div
    className={cn(
      "mb-10 lg:mb-14 max-w-3xl [text-wrap:balance]",
      className
    )}
  >
    {kicker && (
      <p className="text-red-500/95 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
        {kicker}
      </p>
    )}
    <h2
      id={id}
      className="text-3xl sm:text-4xl lg:text-[2.6rem] font-bold text-white tracking-tight leading-[1.12]"
    >
      {title}
    </h2>
    {copy && (
      <p className="mt-4 text-base sm:text-lg text-zinc-400 leading-relaxed">
        {copy}
      </p>
    )}
  </div>
);

export default function SpeakingPage() {
  return (
    <div className="text-white antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <section
        className="relative min-h-screen flex items-center justify-center bg-[#040404] px-5 sm:px-6 pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden snap-start"
        aria-label="Intro"
      >
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_-20%,rgba(220,38,38,0.16),transparent)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
        />
        <div aria-hidden className="speaking-grain absolute inset-0" />
        <div
          aria-hidden
          className="absolute -top-32 -right-20 w-[min(90vw,640px)] h-[min(90vw,640px)] rounded-full bg-red-600/18 blur-[100px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -left-16 w-[480px] h-[480px] rounded-full bg-amber-500/6 blur-[90px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 h-[1px] w-[min(100vw,1200px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-red-500/15 to-transparent"
        />

        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 lg:gap-16 items-center relative z-10">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="speaking-hero-entrance inline-flex items-center gap-2.5 rounded-full border border-red-500/35 bg-gradient-to-b from-red-500/12 to-red-600/5 px-4 py-1.5 text-red-300/95 text-xs font-semibold tracking-wide uppercase shadow-[0_0_0_1px_rgba(0,0,0,0.4)]">
              <span
                className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.5)]"
                aria-hidden
              />
              <span>Now booking 2026 stages</span>
            </div>
            <h1 className="speaking-hero-entrance speaking-hero-delay-1 text-4xl sm:text-5xl lg:text-6xl xl:text-[3.35rem] font-bold leading-[1.05] tracking-[-0.03em] text-white">
              I build AI products.
              <br />
              <span className="mt-1 inline-block bg-gradient-to-r from-red-400 via-red-500 to-rose-800 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(239,68,68,0.12)]">
                Then I show operators how to turn AI into something real.
              </span>
            </h1>
            <p className="speaking-hero-entrance speaking-hero-delay-2 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl [text-wrap:pretty]">
              Self-taught builder. In 2025 I built the{" "}
              <span className="text-zinc-100 font-semibold">AI for Business</span>{" "}
              platform solo, supporting{" "}
              <span className="text-zinc-100 font-semibold">1,600+ users</span> — the
              platform powered{" "}
              <span className="text-zinc-100 font-semibold">$1.2M ARR</span> in 9
              months. Now building LaunchBox and speaking for rooms that want
              practical AI on Monday morning, not decks full of hype.
            </p>
            <div className="speaking-hero-entrance speaking-hero-delay-3 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <a
                href="#book"
                className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 text-center text-base font-semibold text-white shadow-lg shadow-red-600/30 outline-none transition hover:from-red-500 hover:to-red-600 hover:shadow-red-500/45 focus-visible:ring-2 focus-visible:ring-red-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Bring Ian to your event
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex h-14 items-center justify-center rounded-xl border border-zinc-600/80 bg-zinc-950/40 px-8 text-center text-base font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900/50 focus-visible:ring-2 focus-visible:ring-zinc-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                {EMAIL}
              </a>
            </div>
            <p className="speaking-hero-entrance speaking-hero-delay-4 text-sm text-zinc-500 max-w-md leading-relaxed">
              Keynotes, panels, and live builds. Travel from Pensacola — planning
              ahead helps.
            </p>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="speaking-hero-entrance speaking-hero-delay-2 relative w-full max-w-[600px] lg:max-w-[640px]">
              <div
                aria-hidden
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-red-500/45 via-zinc-900/40 to-amber-500/5 blur-2xl"
              />
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-white/[0.04]"
                />
                <Image
                  src="/speaking/ian-speaker-aixp.jpg"
                  alt="Ian McDonald speaking at AIXP Houston 2026"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                />
              </div>
              <div
                aria-hidden
                className="absolute -bottom-3 -right-2 hidden sm:block w-32 h-10 rounded-md border border-white/10 bg-zinc-900/80 backdrop-blur-sm shadow-lg rotate-2"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative bg-[#030303] px-5 sm:px-6 py-20 lg:py-24 border-t border-white/[0.07] snap-start"
        aria-labelledby="best-fit-heading"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(39,39,42,0.5),transparent)]"
        />
        <div className="max-w-5xl mx-auto relative">
          <SectionHeader
            kicker="For organizers"
            id="best-fit-heading"
            title="Best fit for"
            copy="Rooms where the audience has to go build something Monday morning."
          />
          <ul className="grid sm:grid-cols-2 gap-3 list-none p-0 m-0">
            {BEST_FIT.map((item) => (
              <li
                key={item}
                className="group flex gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition duration-300 hover:border-red-500/30 hover:from-red-500/[0.06]"
              >
                <span
                  aria-hidden
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 text-xs font-bold"
                >
                  ✓
                </span>
                <span className="text-zinc-300 leading-snug [text-wrap:balance] group-hover:text-zinc-100 transition-colors">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="relative bg-gradient-to-b from-[#030303] via-zinc-950/40 to-[#030303] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start overflow-hidden"
        aria-labelledby="recent-stage-heading"
      >
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-px max-lg:hidden bg-gradient-to-b from-red-500/0 via-red-500/20 to-red-500/0"
          style={{ left: "8%" }}
        />
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            kicker="Track record"
            id="recent-stage-heading"
            title="Recent stage"
            copy="From live builds to 500+ person keynotes — a mix of room sizes, same through-line: shipping beats slides."
          />
          <div className="relative pl-0 sm:pl-10">
            <div
              aria-hidden
              className="absolute left-3 sm:left-5 top-2 bottom-3 w-px max-sm:hidden bg-gradient-to-b from-red-500 via-red-500/50 to-zinc-800/80"
            />
            <ol className="space-y-12 list-none p-0 m-0">
              {STAGE_ITEMS.map((s, i) => (
                <li key={s.title} className="relative pl-0 sm:pl-6">
                  <Stage
                    title={s.title}
                    when={s.when}
                    body={s.body}
                    index={i + 1}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section
        className="bg-[#040404] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start"
        aria-labelledby="on-stage-heading"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            kicker="Proof, not B-roll"
            id="on-stage-heading"
            title="On stage"
            copy="Real rooms. Real audiences. No green screen."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-4 md:gap-5 md:items-stretch">
            <div className="md:row-span-2 min-h-[240px] md:min-h-0">
              <StagePhoto
                src="/speaking/ian-speaker-aixp.jpg"
                alt="Ian McDonald speaking at AIXP Houston 2026"
                event="AIXP Houston"
                date="April 2026"
                featured
              />
            </div>
            <div className="min-h-0">
              <StagePhoto
                src="/speaking/ian-speaker-orlando-2025.png"
                alt="Ian McDonald speaking in Orlando, May 2025"
                event="Orlando keynote"
                date="May 2025 · 500+ audience"
              />
            </div>
            <div className="min-h-0">
              <StagePhoto
                src="/speaking/ian-speaker-jacksonville-2025.png"
                alt="Ian McDonald speaking in Jacksonville, March 2025"
                event="Jacksonville keynote"
                date="March 2025 · 250+ audience"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative bg-gradient-to-b from-[#040404] via-zinc-950/35 to-[#040404] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] overflow-hidden snap-start"
        aria-labelledby="watch-heading"
      >
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw,720px)] h-[min(100vw,720px)] rounded-full bg-red-600/8 blur-[120px] pointer-events-none"
        />
        <div className="max-w-4xl mx-auto relative">
          <SectionHeader
            kicker="Keynote"
            id="watch-heading"
            title="Watch a talk"
            copy="Orlando, May 2025 — 500+ in the room. Same energy I bring to your stage."
          />
          <div className="relative">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-zinc-600/20 via-zinc-800/10 to-zinc-900/20 blur-sm"
            />
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-zinc-700/50 bg-zinc-950 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <div
                aria-hidden
                className="absolute top-0 left-0 right-0 z-20 h-9 flex items-center justify-center gap-1.5 border-b border-white/5 bg-zinc-950/90 backdrop-blur-sm"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-red-500/80" />
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500/50" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
                <span className="ml-2 text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Keynote
                </span>
              </div>
              <iframe
                src="https://www.youtube.com/embed/iQvbWj8wWlE"
                title="Ian McDonald — Orlando keynote, May 2025"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute left-0 right-0 top-9 bottom-0 h-[calc(100%-2.25rem)] w-full"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#030303] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start"
        aria-labelledby="talks-heading"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            kicker="Pick the talk"
            id="talks-heading"
            title="Talks I can bring to your audience"
            copy="Each one mapped to the room it’s built for — clear outcomes, not abstract trends."
          />
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6">
            {TALK_ITEMS.map((t, i) => (
              <Talk
                key={t.title}
                index={i + 1}
                title={t.title}
                bestFor={t.bestFor}
                outcome={t.outcome}
                body={t.body}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative bg-gradient-to-b from-[#040404] via-zinc-950/40 to-[#040404] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] overflow-hidden snap-start"
        aria-labelledby="testimonials-heading"
      >
        <div className="max-w-5xl mx-auto relative">
          <SectionHeader
            kicker="Operators"
            id="testimonials-heading"
            title="What people have said"
            copy="Pull quotes from stages, inboxes, and the messy middle of real work."
          />
          <div className="space-y-0">
            <div className="mb-10 lg:mb-12 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-500/[0.08] to-transparent p-6 sm:p-8 lg:p-10">
              <Quote
                quote={QUOTES[0].quote}
                who={QUOTES[0].who}
                role={QUOTES[0].role}
                featured
              />
            </div>
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10">
              {QUOTES.slice(1).map((q) => (
                <Quote
                  key={q.who + q.quote.slice(0, 20)}
                  quote={q.quote}
                  who={q.who}
                  role={q.role}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="bg-[#040404] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start"
        aria-labelledby="built-heading"
      >
        <div className="max-w-5xl mx-auto space-y-16 lg:space-y-20">
          <SectionHeader
            kicker="Builder record"
            id="built-heading"
            title="What I’ve actually built"
            copy="I don’t talk about AI in theory. I talk from the build."
          />

          <div>
            <div className="mb-2 flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                2025 — AI for Business platform, built solo
              </h3>
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                9 months
              </span>
            </div>
            <p className="text-sm text-zinc-500 mb-8 max-w-3xl leading-relaxed">
              Built the platform supporting 1,600+ users — the business reached
              $1.2M ARR in 9 months.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
              <Stat number="1,600+" label="active users" />
              <Stat number="$1.2M" label="ARR powered" />
              <Stat number="9 mo" label="self-taught, zero team" />
            </div>
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

          <div>
            <div className="mb-8 flex flex-wrap items-baseline gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Now — LaunchBox
              </h3>
              <span className="text-xs font-semibold tracking-widest text-zinc-500 uppercase">
                Shipping
              </span>
            </div>
            <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
              <Stat number="$1,250" label="MRR, still solo" />
              <Stat number="14" label="partners on platform" />
              <Stat number="80%+" label="margin per partner" />
            </div>
          </div>
        </div>
      </section>

      <section
        className="relative bg-gradient-to-b from-[#030303] via-zinc-950/30 to-[#030303] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start"
        aria-labelledby="who-for-heading"
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            kicker="Positioning"
            id="who-for-heading"
            title="Who I speak for"
            className="!max-w-full"
          />
          <p className="text-lg text-zinc-300 leading-relaxed [text-wrap:pretty]">
            I speak for rooms where the audience has to go build something
            Monday morning. Founder groups, employer networks, chambers,
            workforce boards, community hosts, coach and consultant
            communities, operator conferences.
          </p>
          <p className="text-lg text-zinc-300 leading-relaxed mt-5 [text-wrap:pretty]">
            If your audience wants a polished futurist, I&apos;m probably not
            your guy. If they want someone who&apos;s actually shipping AI
            products, showing the messy middle, and making the path feel
            possible — that&apos;s where I&apos;m useful.
          </p>
        </div>
      </section>

      <section
        className="bg-gradient-to-b from-[#040404] via-zinc-950/25 to-[#040404] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start"
        aria-labelledby="about-ian-heading"
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeader
            kicker="The story"
            id="about-ian-heading"
            title="About Ian"
            className="!max-w-full"
          />
          <div className="max-w-none">
            <p className="text-lg text-zinc-300 leading-relaxed">
              Pensacola native. Moved to Colorado at nineteen looking for a
              different life — stayed eleven years, eight of them working in
              addiction and recovery treatment.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed mt-4">
              When his dad got sick with cancer, Ian split four years between
              Colorado and Pensacola, watching his biggest supporter decline.
              His dad passed in December 2024. With $5,000 and no plan, Ian
              moved back to Pensacola and went all-in on building.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed mt-4">
              No CS degree. No bootcamp. No co-founder. He&apos;d been teaching
              himself on FreeCodeCamp before ChatGPT — then accelerated when it
              dropped. By 2025 he&apos;d built the AI for Business platform
              solo, supporting 1,600+ users and powering $1.2M ARR in 9 months.
            </p>
            <p className="text-lg text-zinc-300 leading-relaxed mt-4">
              That experience pointed at a bigger gap: most coaches, consultants,
              and community-led businesses don&apos;t need more AI features —
              they need an easier way to launch a branded experience and own
              their audience without stitching together five tools. That became
              LaunchBox.
            </p>
            <p className="text-lg text-zinc-200 font-medium leading-relaxed mt-4">
              He talks from the builder&apos;s seat, not from theory.
            </p>
          </div>
        </div>
      </section>

      <section
        id="book"
        className="relative bg-[#020202] px-5 sm:px-6 py-20 lg:py-32 border-t border-white/[0.08] overflow-hidden scroll-mt-20 snap-start"
        aria-labelledby="book-heading"
      >
        <div
          aria-hidden
          className="absolute top-0 left-1/2 w-full max-w-3xl -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent"
        />
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(100vw,560px)] h-[min(100vw,560px)] rounded-full bg-red-600/6 blur-[100px] pointer-events-none"
        />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-10 lg:mb-12">
            <p className="text-red-500/95 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Next step
            </p>
            <h2
              className="text-3xl sm:text-4xl lg:text-[2.4rem] font-bold text-white tracking-tight"
              id="book-heading"
            >
              Bring Ian to your event
            </h2>
            <p className="text-lg text-zinc-400 mt-4 max-w-md mx-auto leading-relaxed">
              Tell me about your event or what you have in mind. I&apos;ll reply
              personally within a day or two.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 p-6 sm:p-9 lg:p-10 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_32px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
            <SpeakingInquiryForm />
          </div>

          <p className="text-center text-sm text-zinc-500 mt-8 leading-relaxed">
            Prefer to grab time directly?{" "}
            <Link
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 underline underline-offset-4 decoration-red-500/30 hover:text-red-300 hover:decoration-red-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70 rounded-sm"
            >
              Use my calendar
            </Link>
            . Or email{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-red-400 underline underline-offset-4 decoration-red-500/30 hover:text-red-300 hover:decoration-red-400/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70 rounded-sm"
            >
              {EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

const StagePhoto = ({
  src,
  alt,
  event,
  date,
  featured = false,
}: {
  src: string;
  alt: string;
  event: string;
  date: string;
  featured?: boolean;
}) => {
  return (
    <div
      className={cn(
        "group relative h-full min-h-[200px] w-full overflow-hidden rounded-2xl",
        "border border-white/[0.08] shadow-xl transition duration-500",
        "hover:border-red-500/35 hover:shadow-[0_20px_50px_-15px_rgba(220,38,38,0.25)]",
        featured && "min-h-[280px] md:min-h-full"
      )}
    >
      <div
        className={cn(
          "relative w-full h-full",
          featured ? "min-h-[280px] md:min-h-full md:aspect-auto" : "aspect-video"
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
      />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        <div className="text-white text-base sm:text-lg font-semibold leading-tight">
          {event}
        </div>
        <div className="text-[11px] sm:text-xs text-red-400/95 tracking-widest uppercase mt-1.5">
          {date}
        </div>
      </div>
    </div>
  );
};

const Stage = ({
  title,
  when,
  body,
  index,
}: {
  title: string;
  when: string;
  body: string;
  index: number;
}) => {
  return (
    <div className="relative pl-0 sm:pl-2">
      <div
        aria-hidden
        className="absolute -left-1.5 sm:left-0 top-2 flex h-9 w-9 max-sm:static max-sm:mb-2 items-center justify-center rounded-full border border-red-500/30 bg-zinc-950 text-[10px] font-bold text-red-400 shadow-[0_0_20px_-4px_rgba(239,68,68,0.5)]"
      >
        {String(index).padStart(2, "0")}
      </div>
      <div className="max-sm:pl-0 sm:pl-12">
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>
          <span className="inline-flex items-center rounded-full border border-red-500/30 bg-red-500/5 px-3 py-1 text-red-300/95 text-xs font-semibold tracking-wide">
            {when}
          </span>
        </div>
        <p className="text-zinc-400 leading-relaxed [text-wrap:pretty]">{body}</p>
      </div>
    </div>
  );
};

const Talk = ({
  index,
  title,
  bestFor,
  outcome,
  body,
}: {
  index: number;
  title: string;
  bestFor: string;
  outcome: string;
  body: string;
}) => {
  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-zinc-900/30 to-zinc-950/40 p-6 lg:p-7 transition duration-300 hover:border-red-500/35"
    >
      <div
        aria-hidden
        className="absolute -right-2 -top-1 text-7xl font-bold leading-none text-white/[0.03] select-none"
      >
        {String(index).padStart(2, "0")}
      </div>
      <p className="relative text-xs font-bold tracking-[0.2em] text-red-500/90 uppercase mb-3">
        Session {String(index).padStart(2, "0")}
      </p>
      <h3 className="relative text-lg sm:text-xl font-bold text-white mb-4 leading-snug [text-wrap:balance]">
        {title}
      </h3>
      <dl className="relative space-y-2.5 mb-4 text-sm">
        <div className="flex flex-col sm:flex-row sm:gap-2 gap-0.5 sm:items-start">
          <dt className="text-red-400/90 font-semibold tracking-wide uppercase text-xs shrink-0 w-28">
            Best for
          </dt>
          <dd className="text-zinc-300 leading-snug">{bestFor}</dd>
        </div>
        <div className="flex flex-col sm:flex-row sm:gap-2 gap-0.5 sm:items-start">
          <dt className="text-red-400/90 font-semibold tracking-wide uppercase text-xs shrink-0 w-28">
            Outcome
          </dt>
          <dd className="text-zinc-300 leading-snug">{outcome}</dd>
        </div>
      </dl>
      <p className="relative text-sm text-zinc-500 leading-relaxed [text-wrap:pretty] group-hover:text-zinc-400 transition-colors">
        {body}
      </p>
    </article>
  );
};

const Quote = ({
  quote,
  who,
  role,
  featured = false,
}: {
  quote: string;
  who: string;
  role: string;
  featured?: boolean;
}) => {
  if (featured) {
    return (
      <blockquote className="relative m-0 p-0">
        <span
          aria-hidden
          className="absolute -left-1 -top-2 text-8xl sm:text-9xl font-serif text-red-500/15 leading-none select-none"
        >
          &ldquo;
        </span>
        <p className="relative text-2xl sm:text-3xl text-white leading-[1.35] font-medium [text-wrap:pretty] pl-2 sm:pl-4">
          {quote}
        </p>
        <footer className="mt-6 pl-2 sm:pl-4 text-sm text-zinc-500">
          <span className="font-semibold text-zinc-200">{who}</span>
          {role && <span className="text-zinc-500"> — {role}</span>}
        </footer>
      </blockquote>
    );
  }
  return (
    <blockquote className="relative m-0 border-l-2 border-red-500/25 pl-5">
      <p className="text-base sm:text-lg text-zinc-300 leading-relaxed [text-wrap:pretty]">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="mt-3 text-sm text-zinc-500">
        <span className="font-medium text-zinc-300">{who}</span>
        {role && <span> — {role}</span>}
      </footer>
    </blockquote>
  );
};

const Stat = ({ number, label }: { number: string; label: string }) => {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-7 transition duration-300 hover:border-red-500/30"
    >
      <div
        aria-hidden
        className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent opacity-60"
      />
      <div
        className="text-4xl sm:text-5xl lg:text-6xl font-bold tabular-nums bg-gradient-to-br from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent"
      >
        {number}
      </div>
      <div className="text-xs text-zinc-500 uppercase tracking-widest mt-2">
        {label}
      </div>
    </div>
  );
};
