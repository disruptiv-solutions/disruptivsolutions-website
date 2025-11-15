import React from 'react';

const SectionCard: React.FC<{
  title: string;
  highlight?: string;
  children: React.ReactNode;
}> = ({ title, highlight, children }) => (
  <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6 space-y-3 hover:border-gray-700 transition-colors">
    <div>
      {highlight && (
        <p className="text-sm uppercase tracking-wide text-red-400 font-semibold">
          {highlight}
        </p>
      )}
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-2 text-gray-300 text-base leading-relaxed">{children}</div>
  </div>
);

export const WhatToExpectStep: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold tracking-[0.4em] text-red-400 uppercase">
          Lovable Build Prep
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          What to Expect While We Build in Lovable
        </h2>
        <p className="text-gray-400 text-lg">
          Where we’re building, what to expect, and how long each part takes.
        </p>
      </div>

      <div className="grid gap-6">
        <SectionCard title="The Tool (Lovable.dev)" highlight="The Platform">
          <p>
            We’re building inside <span className="font-semibold text-white">Lovable.dev</span>.
            It’s free and includes enough AI build credits for today’s workshop.
          </p>
          <p className="text-sm text-gray-400">
            If you already burned through your credits previously, follow along, take notes, and rerun the steps later.
          </p>
        </SectionCard>

        <SectionCard
          title="Things Will Be a Little Messy (and That’s Okay)"
          highlight="Expectation Reset"
        >
          <p>AI might:</p>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Pick an odd layout or image</li>
            <li>Mess up some copy</li>
            <li>Throw an error or time out</li>
          </ul>
          <p>
            That’s part of the lesson. We’re aiming for a <span className="text-white font-semibold">live, imperfect v1</span>,
            not a polished portfolio site.
          </p>
        </SectionCard>

        <SectionCard title="How We’ll Use Our Time" highlight="Timeline">
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <span className="font-semibold text-white">5 minutes</span> – Paste your prompt & run the first build
            </li>
            <li>
              <span className="font-semibold text-white">10–15 minutes</span> – Fix layout, add your details, swap images
            </li>
            <li>
              <span className="font-semibold text-white">5 minutes</span> – Deploy & share the link
            </li>
          </ul>
          <p className="text-sm text-gray-400">
            If tokens, account limits, or Wi-Fi get weird, you still get the replay, slides, and your prompt so you can rebuild later.
          </p>
        </SectionCard>
      </div>
    </div>
  );
};
