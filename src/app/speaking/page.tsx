import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SpeakingInquiryForm from "@/components/SpeakingInquiryForm";

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

export default function SpeakingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-black px-6 pt-32 pb-16 lg:pt-40 lg:pb-24 overflow-hidden">
        {/* Red radial glow */}
        <div
          aria-hidden
          className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-red-600/20 blur-[120px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-red-700/10 blur-[100px] pointer-events-none"
        />

        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-600/40 bg-red-600/10 text-red-400 text-xs font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              Now booking 2026 stages
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              I build AI products.
              <br />
              <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                Then I show founders how to do the same.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-2xl">
              Self-taught builder. In 2025 I shipped the{" "}
              <span className="text-white font-semibold">AI for Business</span>{" "}
              platform solo —{" "}
              <span className="text-white font-semibold">1,600+ users</span>,{" "}
              <span className="text-white font-semibold">$1.2M ARR</span>, in 9
              months. Now building LaunchBox — and speaking for operator
              audiences who want to do the same.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#book"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-600/30 hover:shadow-red-600/60 inline-flex items-center justify-center whitespace-nowrap"
              >
                Send an inquiry
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className="px-8 py-4 border-2 border-gray-300 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center whitespace-nowrap"
              >
                {EMAIL}
              </a>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[640px]">
              <div
                aria-hidden
                className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-red-600/40 to-red-900/20 blur-2xl"
              />
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl shadow-red-900/40 ring-1 ring-red-600/30">
                <Image
                  src="/speaking/ian-speaker-aixp.jpg"
                  alt="Ian McDonald speaking at AIXP Houston 2026"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent stage — timeline */}
      <section className="relative bg-gradient-to-b from-black via-zinc-950/50 to-black px-6 py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">
            Recent stage
          </h2>
          <div className="relative pl-8 sm:pl-12">
            {/* Timeline rail */}
            <div
              aria-hidden
              className="absolute left-2 sm:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-red-600 via-red-600/50 to-red-600/0"
            />
            <div className="space-y-10">
              <Stage
                title="AIXP Houston 2026"
                when="April 2026"
                body="4 speaking slots including the Founder Stories panel. Shared the LaunchBox build story with an operator audience. Mentioned during Maria Elena Duron's keynote."
              />
              <Stage
                title="Launch & Learn"
                when="Weekly, live"
                body="I run a live build session every week: one real product, one real funnel, from idea to shipped in under an hour."
              />
              <Stage
                title="AI for Business 2025"
                when="2025"
                body="Invited speaker on AI adoption for small business operators."
              />
              <Stage
                title="Chase pitch event"
                when="2025"
                body="Pitched LaunchBox to a room of bankers and operators. Measurable follow-through into partner conversations."
              />
              <Stage
                title="Orlando keynote"
                when="May 2025"
                body="Spoke to a room of 500+ people on building AI products as a self-taught operator."
              />
              <Stage
                title="Jacksonville keynote"
                when="March 2025"
                body="Spoke to a room of 250+ people on practical AI for non-technical founders."
              />
            </div>
          </div>
        </div>
      </section>

      {/* On stage — photo strip */}
      <section className="bg-black px-6 py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            On stage
          </h2>
          <p className="text-gray-400 mb-12">
            Real rooms. Real audiences. No green screen.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <StagePhoto
              src="/speaking/ian-speaker-aixp.jpg"
              alt="Ian McDonald speaking at AIXP Houston 2026"
              event="AIXP Houston"
              date="April 2026"
            />
            <StagePhoto
              src="/speaking/ian-speaker-orlando-2025.png"
              alt="Ian McDonald speaking in Orlando, May 2025"
              event="Orlando keynote"
              date="May 2025 · 500+ audience"
            />
            <StagePhoto
              src="/speaking/ian-speaker-jacksonville-2025.png"
              alt="Ian McDonald speaking in Jacksonville, March 2025"
              event="Jacksonville keynote"
              date="March 2025 · 250+ audience"
            />
          </div>
        </div>
      </section>

      {/* Watch a talk */}
      <section className="relative bg-gradient-to-b from-black via-zinc-950/50 to-black px-6 py-20 lg:py-28 border-t border-white/10 overflow-hidden">
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-red-600/10 blur-[140px] pointer-events-none"
        />
        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
            Watch a talk
          </h2>
          <p className="text-gray-400 mb-12">
            Orlando keynote, May 2025. 500+ in the room.
          </p>
          <div className="relative aspect-video rounded-2xl overflow-hidden ring-1 ring-red-600/30 shadow-2xl shadow-red-900/40">
            <iframe
              src="https://www.youtube.com/embed/iQvbWj8wWlE"
              title="Ian McDonald — Orlando keynote, May 2025"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* What I talk about */}
      <section className="bg-black px-6 py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">
            What I talk about
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Talk
              title="Live Build: If I Can, You Can"
              body="My signature keynote. The presentation itself is a Next.js app I built — the talk is the demo. Audiences hear the real story (Pensacola → Colorado → addiction recovery work → loss → built solo to $1.2M ARR) and leave knowing they can do this too. No CS degree required."
            />
            <Talk
              title="AI for Employers"
              body="For workforce boards, business councils, and employer networks. What AI adoption actually looks like inside a 5–50 person business right now — tools, workflows, what fails, what sticks. Zero hype."
            />
            <Talk
              title="From Idea to Funnel in 30 Minutes — Live"
              body="A working build session. I take a business idea from the room and ship a live funnel during the talk. Audiences see what modern AI tooling can actually do when a builder is driving."
            />
            <Talk
              title="How Communities Monetize Without Becoming Course Creators"
              body="For community hosts, coaches, and consultants. The white-label AI workspace model — how to turn your audience into recurring revenue without becoming a content factory."
            />
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="relative bg-gradient-to-b from-black via-zinc-950/50 to-black px-6 py-20 lg:py-28 border-t border-white/10 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12">
            What operators have said
          </h2>
          <div className="space-y-12">
            <Quote
              quote="If these tools would have been available 10 years ago, I already would have been doing millions of dollars a year. People like Ian are gonna help you attract that with your marketing."
              who="Pat Hilton"
              role="Headlining keynote · introducing Ian on stage, Orlando May 2025"
            />
            <Quote
              quote="I enjoyed your speech, the hands-on coding presentation, your honesty and humble attitude, and your drive."
              who="Monika Mielnik"
              role="Director, UX/UI Design & Development · AIXP Houston"
            />
            <Quote
              quote="Just watched the Orlando replay. Wow star struck! Can't believe you built the AI4B app."
              who="Shanshan Sateren"
              role="Audience member · Orlando keynote replay"
            />
            <Quote
              quote="Ian is doing something that I have yet to accomplish with NextShiftIQ. He is doing this with a fraction of the experience I have as a developer."
              who="Joseph Bankole"
              role="Senior Data Engineer · via LinkedIn, public post"
            />
            <Quote
              quote="Loved the way you broke it down — super clean, super intuitive."
              who="Mosiah Barlow"
              role="Orlando keynote attendee"
            />
            <Quote
              quote="Simplicity is priceless."
              who="Jules B"
              role="LaunchBox partner"
            />
            <Quote
              quote="I'm going to put you in as our expert AI."
              who="Nancy Smith"
              role="Workforce Solutions East End"
            />
            <Quote
              quote="I loved your presentation and can't wait to implement it."
              who="Debbie H Page"
              role="Orlando keynote attendee"
            />
          </div>
        </div>
      </section>

      {/* By the numbers */}
      <section className="bg-black px-6 py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-5xl mx-auto space-y-16">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              What I&apos;ve actually built
            </h2>
            <p className="text-gray-400">
              I don&apos;t talk about AI in theory. I talk from the build.
            </p>
          </div>

          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="text-xl font-semibold text-white">
                2025 — AI platform, built solo
              </h3>
              <span className="text-sm text-gray-500">9 months</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <Stat number="1,600+" label="active users" />
              <Stat number="$1.2M" label="ARR" />
              <Stat number="9 mo" label="self-taught, zero team" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-3 mb-6">
              <h3 className="text-xl font-semibold text-white">
                Now — LaunchBox
              </h3>
              <span className="text-sm text-gray-500">Currently shipping</span>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <Stat number="$1,250" label="MRR, still solo" />
              <Stat number="14" label="partners on platform" />
              <Stat number="80%+" label="margin per partner" />
            </div>
          </div>
        </div>
      </section>

      {/* Who I speak for */}
      <section className="relative bg-gradient-to-b from-black via-zinc-950/50 to-black px-6 py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Who I speak for
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            I speak for rooms where the audience has to go build something
            Monday morning — employer networks, founder groups, community
            hosts, and operator conferences. If your audience wants a guy
            who&apos;s actually shipping, not a consultant talking about
            shipping, I&apos;m your speaker.
          </p>
        </div>
      </section>

      {/* Book me — inquiry form */}
      <section
        id="book"
        className="relative bg-black px-6 py-20 lg:py-28 border-t border-white/10 overflow-hidden scroll-mt-20"
      >
        <div
          aria-hidden
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none"
        />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Book me
            </h2>
            <p className="text-lg text-gray-300">
              Tell me about your event or what you have in mind. I&apos;ll
              reply personally within a day or two.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 backdrop-blur-sm">
            <SpeakingInquiryForm />
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Prefer to grab time directly?{" "}
            <Link
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline underline-offset-4"
            >
              Use my calendar
            </Link>
            . Or email{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-red-400 hover:text-red-300 underline underline-offset-4"
            >
              {EMAIL}
            </a>
            .
          </p>
        </div>
      </section>

      {/* About */}
      <section className="bg-gradient-to-b from-black via-zinc-950/50 to-black px-6 py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            About Ian
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Born and raised in Pensacola, Florida. Moved to Colorado at
            nineteen looking for a different life — and stayed eleven years.
            Spent eight of them working in addiction and recovery treatment. A
            job he was good at, and one that eventually hollowed him out.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            When his dad got sick with cancer, Ian split four years between
            Colorado and Pensacola, trying to grow a career while losing his
            biggest supporter. His dad passed in December 2024. With $5,000
            and no plan, Ian moved back to Pensacola and went all-in on
            building.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            No CS degree. No bootcamp. No co-founder. He&apos;d been teaching
            himself to code on FreeCodeCamp before ChatGPT, then accelerated
            when it dropped. The first real project came from his roommate — a
            Slack app wired to ChatGPT and Monday.com. By 2025 he&apos;d built
            the AI for Business platform: 1,600+ users, $1.2M ARR, nine
            months, solo.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            That experience pointed at a bigger gap. Most coaches, consultants,
            and community-led businesses don&apos;t need more AI features —
            they need an easier way to launch a branded experience, own their
            audience, and stop stitching together five tools. That became
            LaunchBox.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mt-4">
            He talks from the builder&apos;s seat, not from theory.
          </p>
        </div>
      </section>
    </>
  );
}

function StagePhoto({
  src,
  alt,
  event,
  date,
}: {
  src: string;
  alt: string;
  event: string;
  date: string;
}) {
  return (
    <div className="group relative aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 hover:ring-red-600/50 transition-all duration-300 shadow-xl">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
      />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="text-white font-semibold">{event}</div>
        <div className="text-xs text-red-400 tracking-wide uppercase mt-1">
          {date}
        </div>
      </div>
    </div>
  );
}

function Stage({
  title,
  when,
  body,
}: {
  title: string;
  when: string;
  body: string;
}) {
  return (
    <div className="relative">
      {/* Timeline dot */}
      <div
        aria-hidden
        className="absolute -left-8 sm:-left-12 top-2 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-600/20 shadow-lg shadow-red-600/50"
      />
      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h3 className="text-xl lg:text-2xl font-semibold text-white">
          {title}
        </h3>
        <span className="px-3 py-1 rounded-full bg-red-600/10 border border-red-600/30 text-red-400 text-xs font-medium tracking-wide">
          {when}
        </span>
      </div>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Talk({ title, body }: { title: string; body: string }) {
  return (
    <div className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 lg:p-8 hover:border-red-600/50 hover:bg-white/[0.07] transition-all duration-300 overflow-hidden">
      {/* Top accent line that lights up on hover */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{body}</p>
    </div>
  );
}

function Quote({
  quote,
  who,
  role,
  plain,
}: {
  quote: string;
  who: string;
  role: string;
  plain?: boolean;
}) {
  if (plain) {
    return (
      <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed pl-6">
        {quote}
      </p>
    );
  }
  return (
    <blockquote className="relative pl-6 lg:pl-12">
      {/* Decorative quote glyph */}
      <span
        aria-hidden
        className="absolute -top-6 -left-2 lg:-left-4 text-7xl lg:text-9xl font-serif text-red-600/20 leading-none select-none pointer-events-none"
      >
        &ldquo;
      </span>
      <p className="relative text-2xl lg:text-3xl text-white leading-relaxed mb-3 font-medium">
        &ldquo;{quote}&rdquo;
      </p>
      <footer className="text-gray-400">
        <span className="font-semibold text-gray-200">{who}</span>
        {role && <span>, {role}</span>}
      </footer>
    </blockquote>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="group relative bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-2xl p-8 hover:border-red-600/50 hover:from-red-600/10 transition-all duration-300 overflow-hidden">
      {/* Top red accent */}
      <div
        aria-hidden
        className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-red-600 to-transparent"
      />
      {/* Hover glow */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/0 group-hover:from-red-600/10 group-hover:to-red-600/0 transition-all duration-300 pointer-events-none"
      />
      <div className="relative">
        <div className="text-5xl lg:text-7xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent mb-3">
          {number}
        </div>
        <div className="text-gray-400 text-sm uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}
