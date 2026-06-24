import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Start Here — Ian McDonald",
  description:
    "Not sure where to begin? Pick your path — LaunchBox, AI Ops, or booking Ian to speak.",
};

const doors = [
  {
    number: "01",
    headline: "Build something with LaunchBox",
    sub: "For coaches, creators, consultants, and founders who want to launch a branded community, course, or membership — without stitching five tools together.",
    cta: "See LaunchBox",
    href: "https://launchbox.space",
    external: true,
    accent: "from-red-600 to-red-700",
    border: "hover:border-red-500/50",
    glow: "hover:shadow-[0_20px_60px_-20px_rgba(220,38,38,0.35)]",
  },
  {
    number: "02",
    headline: "Simplify my business with AI",
    sub: "For businesses with tool sprawl, workflow chaos, or automation needs. We'll audit what you have, cut what you don't need, and build what actually moves the needle.",
    cta: "Book an AI Ops Call",
    href: "https://calendar.app.google/okpHPUV8TA85GBaA6",
    external: true,
    accent: "from-zinc-600 to-zinc-700",
    border: "hover:border-zinc-400/40",
    glow: "hover:shadow-[0_20px_60px_-20px_rgba(255,255,255,0.08)]",
  },
  {
    number: "03",
    headline: "Book Ian to speak or run a workshop",
    sub: "For event organizers, chambers, accelerators, and founder communities. Keynotes, panels, and live build sessions for operator audiences.",
    cta: "Go to the Speaking page",
    href: "/speaking",
    external: false,
    accent: "from-red-700 to-rose-800",
    border: "hover:border-red-500/40",
    glow: "hover:shadow-[0_20px_60px_-20px_rgba(220,38,38,0.25)]",
  },
];

export default function StartPage() {
  return (
    <div className="min-h-screen bg-[#040404] text-white antialiased">
      {/* Background grid */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
      />
      <div
        aria-hidden
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[min(100vw,900px)] h-[400px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none"
      />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-5 sm:px-6 py-24 lg:py-32">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="mb-16 lg:mb-20 text-center">
            <p className="text-red-500/90 text-xs font-semibold tracking-[0.3em] uppercase mb-5">
              Welcome
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white mb-6">
              What do you want
              <br />
              <span className="bg-gradient-to-r from-red-400 to-rose-600 bg-clip-text text-transparent">
                help with?
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Pick the path that fits. Each one leads somewhere specific.
            </p>
          </div>

          {/* Recommended first step — the AI Snapshot lead magnet */}
          <Link
            href="/assessment"
            className="group mb-8 block rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-600/15 to-transparent p-5 sm:p-6 transition-all duration-300 hover:border-red-500/60"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-red-400 text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                  New here? Start with this
                </p>
                <p className="text-white font-semibold text-lg leading-snug">
                  Take the free 2-minute AI Snapshot
                </p>
                <p className="text-zinc-400 text-sm mt-1 [text-wrap:pretty]">
                  Answer a few quick questions and see exactly where AI fits your business.
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform group-hover:scale-[1.03] whitespace-nowrap">
                Take it →
              </span>
            </div>
          </Link>

          {/* Three Doors */}
          <div className="flex flex-col gap-5">
            {doors.map((door) => {
              const inner = (
                <div
                  className={`group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.05] to-transparent p-8 lg:p-10 transition-all duration-300 ${door.border} ${door.glow}`}
                >
                  {/* Number */}
                  <span
                    aria-hidden
                    className="absolute right-6 top-6 text-7xl font-bold leading-none text-white/[0.04] select-none"
                  >
                    {door.number}
                  </span>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10">
                    {/* Number pill */}
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${door.accent} text-white text-sm font-bold shadow-lg`}
                    >
                      {door.number}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
                        {door.headline}
                      </h2>
                      <p className="text-zinc-400 leading-relaxed text-sm sm:text-base [text-wrap:pretty] group-hover:text-zinc-300 transition-colors">
                        {door.sub}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="shrink-0">
                      <span
                        className={`inline-flex items-center gap-2 rounded-xl bg-gradient-to-r ${door.accent} px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 group-hover:scale-[1.03] group-hover:shadow-xl whitespace-nowrap`}
                      >
                        {door.cta} →
                      </span>
                    </div>
                  </div>
                </div>
              );

              return door.external ? (
                <a
                  key={door.number}
                  href={door.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <Link key={door.number} href={door.href}>
                  {inner}
                </Link>
              );
            })}
          </div>

          {/* Footer note */}
          <p className="mt-14 text-center text-sm text-zinc-600">
            Not sure?{" "}
            <a
              href="mailto:ian@ianmcdonald.ai"
              className="text-zinc-400 underline underline-offset-4 decoration-zinc-600 hover:text-white transition-colors"
            >
              Email Ian directly
            </a>{" "}
            — he reads them.
          </p>
        </div>
      </main>
    </div>
  );
}
