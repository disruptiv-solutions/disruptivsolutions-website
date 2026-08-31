import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SpeakingInquiryForm from "@/components/SpeakingInquiryForm";
import SpeakingStickyCta from "@/components/speaking/SpeakingStickyCta";
import SpeakingPageSubnav from "@/components/speaking/SpeakingPageSubnav";
import VideoTestimonialsFolder from "@/components/speaking/VideoTestimonialsFolder";
import { loadSpeakingTranscripts } from "@/lib/load-speaking-transcripts";
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
    images: ["/ian-stage.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaking — Ian McDonald",
    description:
      "Self-taught AI builder. Speaking for operator audiences.",
    images: ["/ian-stage.jpg"],
  },
};

const CALENDAR_URL = "https://calendar.app.google/J6uMiKkf3AM4zS9MA";
const EMAIL = "ian@ianmcdonald.ai";
const LAUNCH_AND_LEARN_URL = "https://meet.google.com/cgm-vcdg-hvh";

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ian McDonald",
  jobTitle: "Founder, LaunchBox",
  url: "https://disruptiv.solutions/speaking",
  email: `mailto:${EMAIL}`,
  image: "https://disruptiv.solutions/ian-stage.jpg",
  description:
    "Self-taught AI product builder. Speaks for operator audiences — employer networks, founder groups, community hosts.",
  performerIn: [
    {
      "@type": "Event",
      name: "Grow with Google — Automate Business Workflows with Gemini",
      location: "Virtual",
      startDate: "2026-08-25",
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventCompleted",
    },
    {
      "@type": "Event",
      name: "Small & Diverse Business Inclusion Summit",
      location: {
        "@type": "Place",
        name: "1010 Lamar Street",
        address: {
          "@type": "PostalAddress",
          streetAddress: "1010 Lamar Street",
          addressLocality: "Houston",
          addressRegion: "TX",
          postalCode: "77002",
          addressCountry: "US",
        },
      },
      startDate: "2026-06-26T09:30:00-05:00",
      endDate: "2026-06-26T15:00:00-05:00",
      eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
    },
    {
      "@type": "Event",
      name: "Houston AI Club AI Lightning Lesson",
      location: "Virtual",
      startDate: "2026-05-21T10:30:00-05:00",
    },
    { "@type": "Event", name: "AIXP Houston 2026", location: "Houston, TX" },
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
    title: "Grow with Google — Automate Business Workflows with Gemini",
    when: "August 25, 2026 · Virtual",
    body: "Guest workshop showing small-business owners how to use Gemini with Gmail, Google Meet, Drive, and Calendar to turn client conversations into organized follow-ups, proposals, and next actions.",
  },
  {
    title: "Small & Diverse Business Inclusion Summit",
    when: "June 26, 2026",
    body: "Spoke at the Office of Commissioner Rodney Ellis' Small & Diverse Business Inclusion Summit in Houston, a full day of networking and resource sharing for a room of about 100 small business owners, entrepreneurs, and industry leaders. Ian demonstrated live how a small business can use AI like an employee, not a chatbot: turning scattered information into a workflow that helps you find and follow up on opportunities.",
    logoSrc: "/speaking/harris-county-precinct-one-logo.png",
    logoAlt: "Harris County Precinct One — Commissioner Rodney Ellis logo",
    logoFrame: "poster",
  },
  {
    title: "Houston AI Club — AI Lightning Lesson",
    when: "May 21, 2026",
    body: "30-minute virtual session for Houston AI Club: From AI Consumer to AI Builder. Live demo of LaunchBox building a community from scratch. 50+ attendees, active Q&A throughout — covered practical AI, the consumer-to-builder gap, and a live build on screen.",
    logoSrc: "/speaking/houston-ai-club-logo-cropped.png",
    logoAlt: "Houston AI Club logo",
    logoFrame: "wide",
  },
  {
    title: "AIXP Houston 2026",
    when: "April 2026",
    body: "4 speaking slots including the Founder Stories panel. Shared the LaunchBox build story with an operator audience and was referenced during the event's keynote.",
    logoSrc: "/speaking/aixp-horizontal-logo-cropped.png",
    logoAlt: "AIXP logo",
    logoFrame: "wide",
  },
  {
    title: "Chase pitch event",
    when: "2026",
    body: "Pitched LaunchBox to a room of bankers and operators. Measurable follow-through into partner conversations.",
    logoSrc: "/speaking/chase-logo.svg",
    logoAlt: "Chase logo",
    logoFrame: "extraWide",
  },
  {
    title: "Orlando keynote",
    when: "May 2025",
    body: "Spoke to a room of 500+ people on building AI products as a self-taught operator.",
    logoSrc: "/speaking/orlando-jacksonville-logo-cropped.png",
    logoAlt: "AI event logo",
    logoFrame: "wide",
  },
  {
    title: "Jacksonville keynote",
    when: "March 2025",
    body: "Spoke to a room of 250+ people on practical AI for non-technical founders.",
    logoSrc: "/speaking/orlando-jacksonville-logo-cropped.png",
    logoAlt: "AI event logo",
    logoFrame: "wide",
  },
] as const;

const TALK_ITEMS = [
  {
    title: "If I Can Build This, You Can Build Yours",
    bestFor:
      "Founder events, AI conferences, small business communities, workforce groups, operator audiences",
    outcome:
      "Audiences leave believing AI can help them build real business assets now, even without a technical background.",
    body: "Ian's signature keynote blends founder story, practical AI lessons, and live show-and-tell. He shares how he went from healthcare with no coding background to building AI products as a solo founder — including the AI for Business platform and now LaunchBox. Then he shows the audience how LaunchBox and LaunchKit turn an idea, audience, and offer into a platform brief, waitlist page, sales page, lead magnets, and launch plan. The message is simple: you don't need to become a software company to start building like one.",
  },
  {
    title: "AI for Employers",
    bestFor: "Workforce boards, chambers, employer networks",
    outcome:
      "Practical ways small teams can use AI in marketing, operations, content, and customer workflows — starting Monday.",
    body: "What AI adoption actually looks like inside a 5–50 person business right now. Tools, workflows, what fails, what sticks. Zero hype.",
  },
  {
    title: "From Idea to Platform in 30 Minutes — Live",
    bestFor:
      "Workshops, founder meetups, business communities, coach and consultant groups",
    outcome:
      "A live example of turning a real idea from the room into a platform concept, launch page, lead magnet, and first invite path.",
    body: "A working build session. Ian takes a business or community idea from the audience and uses LaunchBox to show how quickly AI can turn it into a real launch plan. The point isn't to watch another demo — it's to see the path from vague idea to something people can actually join.",
  },
  {
    title: "Turn Your Expertise Into a Platform",
    bestFor:
      "Coaches, consultants, creators, membership groups, community-led businesses",
    outcome:
      "A practical model for turning knowledge, audience, and lived experience into a branded AI-powered platform people can join.",
    body: "Most experts don't need more content — they need a clearer way to package what they already know. This session shows how coaches, consultants, and community hosts can use AI to create a launchable offer, build a branded experience, and start with their first 10 members instead of getting stuck building a giant course.",
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
      "Great story buddy! I wish my son joined this call. Your story is inspiring.",
    who: "Frank Huang",
    role: "Houston AI Club · May 2026",
  },
  {
    quote: "Amazing story! Thank you for sharing, Ian.",
    who: "Aya Takase",
    role: "Houston AI Club · May 2026",
  },
  {
    quote:
      "Ian is doing something that I have yet to accomplish with NextShiftIQ. He is doing this with a fraction of the experience I have as a developer.",
    who: "Joseph Bankole",
    role: "Senior Data Engineer · via LinkedIn, public post",
  },
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

const SESSION_FORMATS = [
  "20–30 minute keynote",
  "45–60 minute workshop",
  "Live build session",
  "Panel guest",
  "Founder / operator fireside chat",
  "Custom — ask",
] as const;

const HERO_PROOF = [
  { number: "1,600+", label: "platform users" },
  { number: "$1.2M", label: "ARR in 9 months" },
  { number: "500+", label: "largest room" },
] as const;

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

const BookCta = ({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) => (
  <a
    href="#book"
    className={cn(
      "inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-semibold text-white shadow-lg shadow-red-600/30 outline-none transition hover:from-red-500 hover:to-red-600 hover:shadow-red-500/45 focus-visible:ring-2 focus-visible:ring-red-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
      compact ? "h-11 px-6 text-sm" : "h-14 px-8 text-base",
      className
    )}
  >
    Bring Ian to your event
  </a>
);

const ProofStrip = () => (
  <div className="grid grid-cols-3 gap-3 border-t border-white/[0.08] pt-8 sm:gap-4">
    {HERO_PROOF.map((item) => (
      <div key={item.label} className="text-center sm:text-left">
        <div className="text-2xl sm:text-3xl font-bold tabular-nums text-white">
          {item.number}
        </div>
        <div className="mt-1 text-[10px] sm:text-xs uppercase tracking-widest text-zinc-500">
          {item.label}
        </div>
      </div>
    ))}
  </div>
);

const LaunchLearnBanner = () => (
  <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
    <div>
      <p className="text-red-500/95 text-xs font-semibold tracking-[0.25em] uppercase mb-1">
        Not booking a stage?
      </p>
      <p className="text-base font-semibold text-white">
        Launch &amp; Learn — free weekly open call
      </p>
      <p className="mt-1 text-sm text-zinc-500">
        Google Meet · Wednesdays · 1:00–2:00 PM CT
      </p>
    </div>
    <Link
      href={LAUNCH_AND_LEARN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl border border-red-500/35 bg-red-500/10 px-6 text-sm font-semibold text-red-100 transition hover:border-red-400/50 hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70"
    >
      Join the open call
    </Link>
  </div>
);

export default async function SpeakingPage() {
  const transcripts = loadSpeakingTranscripts();

  return (
    <div className="text-white antialiased pb-20 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <SpeakingStickyCta />
      <SpeakingPageSubnav />

      <section
        className="relative min-h-[90vh] flex items-center justify-center bg-[#040404] px-5 sm:px-6 pt-32 pb-16 lg:pt-36 lg:pb-20 overflow-hidden snap-start"
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
          className="absolute top-1/2 left-1/2 h-[1px] w-[min(100vw,1200px)] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-red-500/15 to-transparent"
        />

        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-14 lg:gap-16 items-center relative z-10">
          <div className="space-y-8 order-2 lg:order-1">
            <div className="flex flex-wrap items-center gap-3">
              <div className="speaking-hero-entrance inline-flex items-center gap-2.5 rounded-full border border-red-500/35 bg-gradient-to-b from-red-500/12 to-red-600/5 px-4 py-1.5 text-red-300/95 text-xs font-semibold tracking-wide uppercase shadow-[0_0_0_1px_rgba(0,0,0,0.4)]">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-red-500 shadow-[0_0_10px_2px_rgba(239,68,68,0.5)]"
                  aria-hidden
                />
                <span>Wednesdays @ 1 PM CT — Launch &amp; Learn</span>
              </div>
              <Link
                href="/start"
                className="speaking-hero-entrance inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/60 px-4 py-1.5 text-xs font-semibold text-zinc-300 transition hover:border-zinc-500/80 hover:text-white"
              >
                Saw me speak? Start here →
              </Link>
            </div>
            <h1 className="speaking-hero-entrance speaking-hero-delay-1 text-4xl sm:text-5xl lg:text-6xl xl:text-[3.35rem] font-bold leading-[1.05] tracking-[-0.03em] text-white">
              I build AI products.
              <br />
              <span className="mt-1 inline-block bg-gradient-to-r from-red-400 via-red-500 to-rose-800 bg-clip-text text-transparent [text-shadow:0_0_40px_rgba(239,68,68,0.12)]">
                Then I show operators how to turn AI into something real.
              </span>
            </h1>
            <p className="speaking-hero-entrance speaking-hero-delay-2 text-lg sm:text-xl text-zinc-400 leading-relaxed max-w-2xl [text-wrap:pretty]">
              Self-taught builder. In 2025, I built the{" "}
              <span className="text-zinc-100 font-semibold">AI for Business</span>{" "}
              platform solo, supporting{" "}
              <span className="text-zinc-100 font-semibold">1,600+ users</span>{" "}
              and powering a business that reached{" "}
              <span className="text-zinc-100 font-semibold">$1.2M ARR</span> in 9
              months. Now building LaunchBox and speaking for rooms that want
              to see how real people can use AI to build platforms, funnels,
              communities, and businesses — without waiting for permission.
            </p>
            <div className="speaking-hero-entrance speaking-hero-delay-3 flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
              <BookCta />
              <Link
                href={CALENDAR_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-xl border border-zinc-600/80 bg-zinc-950/40 px-8 text-center text-base font-semibold text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900/50 focus-visible:ring-2 focus-visible:ring-zinc-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950"
              >
                Check my calendar
              </Link>
            </div>
            <p className="speaking-hero-entrance speaking-hero-delay-4 text-sm text-zinc-500 max-w-md leading-relaxed">
              Keynotes, panels, and live builds. Based in Houston, available
              to travel.
            </p>
            <div className="speaking-hero-entrance speaking-hero-delay-4">
              <ProofStrip />
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="speaking-hero-entrance speaking-hero-delay-2 relative w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[440px]">
              <div
                aria-hidden
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-red-500/45 via-zinc-900/40 to-red-950/20 blur-2xl"
              />
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06),inset_0_0_0_1px_rgba(255,255,255,0.04)]">
                <div
                  aria-hidden
                  className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-white/[0.04]"
                />
                <Image
                  src="/ian-stage.jpg"
                  alt="Ian McDonald speaking on stage"
                  fill
                  priority
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 440px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="fit"
        className="scroll-mt-32 relative bg-[#030303] px-5 sm:px-6 py-16 lg:py-20 border-t border-white/[0.07]"
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
            copy="Rooms where the audience doesn't just want to hear about AI — they want to leave believing they can build something Monday morning. Founder groups, employer networks, chambers, workforce boards, and operator conferences."
          />
          <p className="mb-8 text-base text-zinc-400 leading-relaxed max-w-3xl [text-wrap:pretty]">
            If your audience wants a polished futurist, I&apos;m probably not
            your guy. If they want someone who&apos;s shipping AI products and
            showing the messy middle — that&apos;s where I&apos;m useful.
          </p>
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
        className="relative bg-[#040404] px-5 sm:px-6 py-20 lg:py-24 border-t border-white/[0.07] snap-start overflow-hidden"
        aria-labelledby="launch-learn-heading"
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(249,115,22,0.12),transparent_62%)]"
        />
        <div className="max-w-5xl mx-auto relative">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:items-center rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.075] via-zinc-950/85 to-orange-950/[0.1] p-6 sm:p-8 lg:p-10 shadow-[0_28px_90px_-55px_rgba(249,115,22,0.75)]">
            <div className="mx-auto w-full max-w-[240px] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_22px_60px_-28px_rgba(255,255,255,0.8)]">
              <Image
                src="/speaking/launch-and-learn.png"
                alt="Launch and Learn with Ian"
                width={240}
                height={240}
                className="h-auto w-full"
              />
            </div>
            <div>
              <p className="text-orange-300/95 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
                Free weekly open call
              </p>
              <h2
                id="launch-learn-heading"
                className="text-3xl sm:text-4xl lg:text-[2.4rem] font-bold text-white tracking-tight leading-[1.12]"
              >
                Launch and Learn with Ian
              </h2>
              <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-2xl [text-wrap:pretty]">
                A recurring Google Meet for practical AI building, founder Q&A,
                and real-time walkthroughs. Drop in live on Wednesdays at 1 PM
                CT.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={LAUNCH_AND_LEARN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 w-fit items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-red-600 px-6 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 transition hover:from-orange-400 hover:to-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  Join the open call
                </Link>
                <p className="text-sm text-zinc-500">
                  Google Meet · Wednesdays · 1:00-2:00 PM CT
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="stage"
        className="scroll-mt-32 relative bg-gradient-to-b from-[#030303] via-zinc-950/40 to-[#030303] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start overflow-hidden"
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
            title="Upcoming and recent stage"
            copy="From Houston AI Club to 500+ person keynotes - a mix of room sizes, same through-line: shipping beats slides."
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
                    logoSrc={"logoSrc" in s ? s.logoSrc : undefined}
                    logoAlt={"logoAlt" in s ? s.logoAlt : undefined}
                    logoFrame={"logoFrame" in s ? s.logoFrame : undefined}
                    href={"href" in s ? (s.href as string) : undefined}
                    cta={"cta" in s ? (s.cta as string) : undefined}
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
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4 md:gap-5 md:items-stretch">
            <div className="md:row-span-3 min-h-[240px] md:min-h-0">
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
                src="/speaking/ian-speaker-summit-2026.jpg"
                alt="Ian McDonald speaking at the Small & Diverse Business Inclusion Summit in Houston, June 2026"
                event="Inclusion Summit"
                date="June 2026 · ~100 audience"
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
        id="talks"
        className="scroll-mt-32 bg-[#030303] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] snap-start"
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

          <div className="mt-12 lg:mt-16 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
            <p className="text-red-500/95 text-xs font-semibold tracking-[0.3em] uppercase mb-4">
              Available formats
            </p>
            <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3 text-zinc-300">
              {[
                "20–30 minute keynote",
                "45–60 minute workshop",
                "Live build session",
                "Panel guest",
                "Founder / operator fireside chat",
                "Custom — ask",
              ].map((fmt) => (
                <li key={fmt} className="flex items-start gap-2.5">
                  <span
                    aria-hidden
                    className="mt-2 inline-block w-1 h-1 rounded-full bg-red-500 shrink-0"
                  />
                  <span className="text-sm sm:text-base">{fmt}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-zinc-400 leading-relaxed border-t border-white/[0.08] pt-5">
              Every session can include a soft next step into Launch &amp;
              Learn, a private workshop, or LaunchBox for audiences who want
              to keep building after the event.
            </p>
          </div>
        </div>
      </section>

      <section
        id="proof"
        className="scroll-mt-32 relative bg-gradient-to-b from-[#040404] via-zinc-950/40 to-[#040404] px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.07] overflow-hidden snap-start"
        aria-labelledby="testimonials-heading"
      >
        <div
          aria-hidden
          className="absolute top-0 left-1/2 h-px w-full max-w-4xl -translate-x-1/2 bg-gradient-to-r from-transparent via-red-500/30 to-transparent"
        />
        <div className="max-w-5xl mx-auto relative">
          <SectionHeader
            kicker="Operators"
            id="testimonials-heading"
            title="What people have said"
            copy="Pull quotes from stages, inboxes, and the messy middle of real work."
          />
          <VideoTestimonialsFolder items={transcripts} className="mb-12 lg:mb-16" />
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
              <Stat number="35" label="subscribers · 14 hosting communities" />
              <Stat number="80%+" label="margin per partner" />
            </div>
            <p className="mt-6 text-sm text-zinc-400 leading-relaxed max-w-3xl">
              LaunchBox is the live example in Ian&apos;s talks: a working
              platform that helps people turn an idea into a branded AI-powered
              community, launch pages, content, and first invites.
            </p>
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
            I speak for rooms where the audience doesn&apos;t just want to
            hear about AI — they want to leave believing they can build
            something with it Monday morning. Founder groups, employer
            networks, chambers, workforce boards, community hosts, coach and
            consultant communities, operator conferences.
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
              After years of moving between Colorado and Pensacola while his
              dad battled cancer, Ian went all-in on building in December 2023
              with $5,000 and no safety net. He now lives in Houston.
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
        className="bg-black px-5 sm:px-6 py-20 lg:py-28 border-t border-white/[0.08]"
        aria-labelledby="partnership-heading"
      >
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            kicker="Partnership"
            id="partnership-heading"
            title="Ways to structure a session"
            copy="Every event is different. Pick the format that fits your room — or just tell me what you have in mind in the inquiry below."
          />

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <PartnershipOption
              title="Standard speaking fee"
              body="Keynotes, panels, and practical AI sessions. The default for most events."
            />
            <PartnershipOption
              title="Workshop / training fee"
              body="Deeper hands-on sessions where the audience builds during the event. Right for cohort kickoffs, founder meetups, and small-group trainings."
            />
            <PartnershipOption
              title="Community activation partnership"
              body="For groups that want attendees to keep building after the session — through LaunchBox, Launch & Learn, or a private First 10 Challenge tailored to the audience."
            />
            <PartnershipOption
              title="Revenue-share option"
              body="For select communities, I'm open to partnership structures where the host shares in revenue from LaunchBox activations that come from the event. That can include a custom landing page, event-specific code, or a follow-up workshop so the audience has a clear path to keep building."
            />
          </div>

          <p className="mt-8 text-sm text-zinc-400 leading-relaxed max-w-3xl">
            The goal is simple: your audience leaves with a practical path to
            keep building, and the host has upside if the session turns into
            real implementation. If that's the kind of partnership
            you&apos;re exploring, mention it in the inquiry.
          </p>
        </div>
      </section>

      <section
        id="book"
        className="scroll-mt-32 relative bg-[#020202] px-5 sm:px-6 py-20 lg:py-32 border-t border-white/[0.08] overflow-hidden snap-start"
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
  logoSrc,
  logoAlt,
  logoFrame = "square",
  href,
  cta,
  index,
}: {
  title: string;
  when: string;
  body: string;
  logoSrc?: string;
  logoAlt?: string;
  logoFrame?: "wide" | "extraWide" | "square" | "poster";
  href?: string;
  cta?: string;
  index: number;
}) => {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute -left-1.5 sm:left-0 top-5 flex h-9 w-9 max-sm:static max-sm:mb-3 items-center justify-center rounded-full border border-red-500/40 bg-zinc-950 text-[10px] font-bold text-red-300 shadow-[0_0_24px_-4px_rgba(239,68,68,0.7)]"
      >
        {String(index).padStart(2, "0")}
      </div>
      <div className="max-sm:pl-0 sm:ml-12 overflow-hidden rounded-2xl border border-white/[0.1] bg-gradient-to-br from-white/[0.07] via-zinc-950/85 to-red-950/[0.08] shadow-[0_22px_55px_-42px_rgba(255,255,255,0.45)] transition duration-300 hover:border-red-500/35 hover:bg-white/[0.09]">
        <div className={cn("flex flex-col", logoSrc ? "sm:flex-row" : "")}>
          {logoSrc && (
            <div className="flex shrink-0 items-center justify-center border-b border-white/[0.08] bg-white/[0.035] p-5 sm:w-56 sm:border-b-0 sm:border-r">
              <div
                className={cn(
                  "flex shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-[0_18px_40px_-22px_rgba(255,255,255,0.9)]",
                  logoFrame === "wide" &&
                    "h-16 w-40 border border-white/15 bg-white px-4 py-2.5",
                  logoFrame === "extraWide" &&
                    "h-16 w-44 border border-white/15 bg-white px-2 py-2",
                  logoFrame === "square" &&
                    "h-16 w-16 border border-white/20 bg-zinc-950 p-1.5",
                  logoFrame === "poster" &&
                    "h-32 w-32 border border-white/15 bg-white"
                )}
              >
                <Image
                  src={logoSrc}
                  alt={logoAlt ?? ""}
                  width={
                    logoFrame === "poster"
                      ? 128
                      : logoFrame === "extraWide"
                        ? 176
                        : logoFrame === "wide"
                          ? 144
                          : 64
                  }
                  height={logoFrame === "poster" ? 128 : 64}
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          )}
          <div className="min-w-0 flex-1 p-5 sm:p-6 lg:p-7">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {title}
              </h3>
              <span className="inline-flex w-fit items-center rounded-full border border-red-500/35 bg-red-500/10 px-3 py-1 text-red-200 text-xs font-semibold tracking-wide">
                {when}
              </span>
            </div>
            <p className="text-zinc-300/90 leading-relaxed [text-wrap:pretty]">
              {body}
            </p>
            {href && cta && (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit items-center rounded-lg border border-red-500/35 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-100 transition hover:border-red-400/60 hover:bg-red-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70"
              >
                {cta}
              </Link>
            )}
          </div>
        </div>
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

const PartnershipOption = ({
  title,
  body,
}: {
  title: string;
  body: string;
}) => {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 transition duration-300 hover:border-red-500/30 hover:bg-white/[0.03]">
      <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{body}</p>
    </div>
  );
};
