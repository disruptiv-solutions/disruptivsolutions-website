import React from 'react';

const SectionCard: React.FC<{
  title: string;
  highlight?: string;
  children: React.ReactNode;
}> = ({ title, highlight, children }) => (
  <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6 space-y-3 hover:border-gray-700 transition-colors">
    <div>
      <p className="text-sm uppercase tracking-wide text-red-400 font-semibold">
        {highlight}
      </p>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-2 text-gray-300 text-base leading-relaxed">
      {children}
    </div>
  </div>
);

export const WhatToExpectStep: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <p className="text-sm font-semibold tracking-[0.4em] text-red-400 uppercase">
          Lovable Build Prep
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          What to Expect While We Build in Lovable
        </h2>
        <p className="text-gray-400 text-lg">
          Lower the pressure, know the plan, and focus on learning the process—not
          chasing perfection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <SectionCard title="The Tool (Lovable.dev)" highlight="The Platform">
          <p>
            We&apos;ll build everything inside <span className="font-semibold text-white">Lovable.dev</span>.
            You get free build credits to start—plenty for this workshop.
            Already hit a limit? Follow along, take notes, and rerun the steps later.
          </p>
          <p className="text-sm text-gray-400">
            (You saw this in the prep email—now we&apos;re just reinforcing it.)
          </p>
        </SectionCard>

        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard
            title="Things Will Be a Little Messy (and That’s Okay)"
            highlight="Expectation Reset"
          >
            <p>AI might:</p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>Choose an odd layout or image</li>
              <li>Mess up some copy</li>
              <li>Throw an error or time out</li>
            </ul>
            <p>
              That&apos;s part of the lesson. We&apos;re aiming for a{' '}
              <span className="text-white font-semibold">live, imperfect version 1</span>, not a polished portfolio.
            </p>
          </SectionCard>

          <SectionCard
            title="How We’ll Use Our Time"
            highlight="Time Blocks"
          >
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <span className="font-semibold text-white">5 min</span> – Paste prompt &amp; run first build
              </li>
              <li>
                <span className="font-semibold text-white">10–15 min</span> – Fix layout, add your details
              </li>
              <li>
                <span className="font-semibold text-white">5 min</span> – Deploy &amp; grab live link
              </li>
            </ul>
            <p className="text-sm text-gray-400">
              If tokens, accounts, or Wi-Fi act up, you still get the replay, slides, and your prompt.
            </p>
          </SectionCard>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <SectionCard
            title="How I’ll Handle Questions While We Build"
            highlight="Support Plan"
          >
            <p>Channel: drop questions in chat while we work.</p>
            <p>Checkpoints where I pause and help:</p>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              <li>After we generate the prompt</li>
              <li>After the first Lovable build</li>
              <li>After we deploy</li>
            </ul>
            <p>
              If you&apos;re still stuck, I&apos;ll note your name and hang back after the main 60 minutes
              for one-on-one help.
            </p>
          </SectionCard>

          <SectionCard
            title="Different Speeds Are Normal"
            highlight="Pace"
          >
            <div className="space-y-2">
              <p>
                <span className="font-semibold text-white">If you finish early:</span> polish copy, try new colors,
                or add one bonus section (testimonials, FAQs, etc.).
              </p>
              <p>
                <span className="font-semibold text-white">If you fall behind:</span> stay focused on shipping a
                working v1. Design polish comes later.
              </p>
              <p className="text-sm text-gray-400">
                I don&apos;t want fast folks bored or slower folks rushed—that&apos;s why extra help happens after
                the main session.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

