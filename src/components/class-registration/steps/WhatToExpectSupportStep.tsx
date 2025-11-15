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

export const WhatToExpectSupportStep: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <p className="text-sm font-semibold tracking-[0.4em] text-red-400 uppercase">
          Support & Pace
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          How I’ll Support You During (and After) the Build
        </h2>
        <p className="text-gray-400 text-lg">
          How to get help, what if you’re faster/slower, and what happens after we wrap.
        </p>
      </div>

      <div className="grid gap-6">
        <SectionCard title="How I’ll Handle Questions While We Build" highlight="Live Support">
          <p>Channel: drop questions in the chat while we’re building.</p>
          <p>Checkpoints where I pause to help everyone at once:</p>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>After we generate the prompt</li>
            <li>After the first Lovable build finishes</li>
            <li>After we deploy</li>
          </ul>
          <p className="text-sm text-gray-400">
            If you’re still stuck, I’ll note your name and hang back after the main 60 minutes for one-on-one help.
          </p>
        </SectionCard>

        <SectionCard title="Different Speeds Are Normal" highlight="Pace & Reassurance">
          <div className="space-y-2">
            <p>
              <span className="font-semibold text-white">If you finish early:</span> polish your copy, try a new color palette,
              or experiment with one extra section (testimonials, FAQs, etc.).
            </p>
            <p>
              <span className="font-semibold text-white">If you fall behind:</span> stay focused on shipping a working v1.
              Design polish and fancy animations can happen later.
            </p>
            <p className="text-sm text-gray-400">
              I don’t want fast folks bored or slower folks rushed—that’s why extra help happens after the main session.
            </p>
          </div>
        </SectionCard>

        <SectionCard title="After the Workshop" highlight="Replay & Reuse">
          <p>
            You’ll get the replay, slides, and the form link so you can update your answers and regenerate your prompt whenever you want.
          </p>
          <p className="text-sm text-gray-300">
            Want to improve your site later? Revisit the form, tweak your details, run a new prompt, and rebuild inside Lovable.
          </p>
          <p className="text-xs text-gray-500">
            We’re getting to an 80% version together today. You can come back and make it a 100% version once you have breathing room.
          </p>
        </SectionCard>
      </div>
    </div>
  );
};

