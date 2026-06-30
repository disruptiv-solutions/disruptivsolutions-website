import type { Metadata } from 'next';
import Link from 'next/link';
import { WORKSHOP_KITS } from '@/lib/workshop-kits';

export const metadata: Metadata = {
  title: 'Workshop Kits | Ian McDonald AI',
  description:
    'Practical AI workshop kits from Ian McDonald AI. Guided tools for operators, founders, teams, and small businesses.',
};

export default function WorkshopKitsPage() {
  return (
    <div className="min-h-screen bg-[#F7F1E8] text-[#0B0F14] antialiased">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(rgba(11,15,20,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(11,15,20,0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_76%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[420px] w-[min(100vw,920px)] -translate-x-1/2 rounded-full bg-[#FF7A2F]/18 blur-[120px]"
      />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-6 pt-32 pb-24">
        <section className="overflow-hidden rounded-[28px] bg-[#0B0F14] px-6 py-8 text-white shadow-2xl shadow-[#0B0F14]/25 sm:px-8 lg:px-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[#FF7A2F]">
            Ian McDonald | Practical AI Workshops
          </p>
          <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.04]">
            Practical AI. Real workflows. <span className="text-[#FF7A2F]">Built live.</span>
          </h1>
          <div className="mt-3 h-1 w-32 rounded-full bg-[#FF7A2F]" />
          <p className="mt-6 max-w-2xl text-lg text-[#F7F1E8]/78 leading-relaxed">
            Each kit is built for a specific room: a guided worksheet, prompt pack,
            scorecard, export, and next-step path so attendees leave with more than notes.
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-2">
          {WORKSHOP_KITS.map((kit) => (
            <Link
              key={kit.slug}
              href={`/kits/${kit.slug}`}
              className="group rounded-2xl border border-[#E7D8C6] bg-white/75 p-6 shadow-sm transition duration-300 hover:border-[#FF7A2F]/60 hover:bg-white"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7A2F]">
                  {kit.eyebrow}
                </p>
                <span className="rounded-full border border-[#FF7A2F]/30 bg-[#FF7A2F]/10 px-3 py-1 text-xs font-semibold text-[#0B0F14]">
                  {kit.status}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-[#0B0F14]">{kit.title}</h2>
              <p className="mt-3 text-[#667085] leading-relaxed">{kit.description}</p>
              <p className="mt-5 text-sm text-[#667085]">{kit.audience}</p>
              <span className="mt-6 inline-flex text-sm font-semibold text-[#FF7A2F] transition group-hover:text-[#EF1111]">
                Open kit -&gt;
              </span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
