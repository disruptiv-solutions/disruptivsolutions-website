import React from 'react';

interface SectionCardProps {
  highlight?: string;
  title: string;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ highlight, title, children }) => (
  <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6 space-y-3 hover:border-gray-700 transition-colors max-w-3xl mx-auto">
    <div>
      {highlight && (
        <p className="text-sm uppercase tracking-wide text-red-400 font-semibold">{highlight}</p>
      )}
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <div className="space-y-2 text-gray-300 text-base leading-relaxed">{children}</div>
  </div>
);

interface WhatToExpectStepProps {
  cardIndex: number;
  totalCards: number;
}

export const WhatToExpectStep: React.FC<WhatToExpectStepProps> = ({ cardIndex, totalCards }) => {
  const cards: Array<{ highlight: string; title: string; content: React.ReactNode }> = [
    {
      highlight: 'The Platform',
      title: 'The Tool (Lovable.dev)',
      content: (
        <>
          <p>
            We’re building inside <span className="font-semibold text-white">Lovable.dev</span>.
            It’s free and includes enough AI build credits for today’s workshop.
          </p>
          <p className="text-sm text-gray-400">
            If you already burned through your credits previously, follow along, take notes, and rerun the steps later.
          </p>
        </>
      ),
    },
    {
      highlight: 'Expectation Reset',
      title: 'Things Will Be a Little Messy (and That’s Okay)',
      content: (
        <>
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
        </>
      ),
    },
    {
      highlight: 'Timeline',
      title: 'How We’ll Use Our Time',
      content: (
        <>
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
        </>
      ),
    },
  ];

  const safeIndex = Math.min(Math.max(cardIndex - 1, 0), cards.length - 1);
  const currentCard = cards[safeIndex];

  return (
    <div className="min-h-[calc(100vh-220px)] flex flex-col items-center justify-center px-4 text-center space-y-8">
      <div className="space-y-4 max-w-4xl">
        <p className="text-sm font-semibold tracking-[0.4em] text-red-400 uppercase">Lovable Build Prep</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">What to Expect While We Build in Lovable</h2>
        <p className="text-gray-400 text-lg">
          Where we’re building, what to expect, and how long each part takes.
        </p>
      </div>

      <SectionCard highlight={currentCard.highlight} title={currentCard.title}>
        {currentCard.content}
      </SectionCard>

      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
        Card {cardIndex} of {totalCards}
      </p>
    </div>
  );
};
