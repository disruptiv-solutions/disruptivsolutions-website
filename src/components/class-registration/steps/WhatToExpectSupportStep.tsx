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

interface WhatToExpectSupportStepProps {
  cardIndex: number;
  totalCards: number;
}

export const WhatToExpectSupportStep: React.FC<WhatToExpectSupportStepProps> = ({ cardIndex, totalCards }) => {
  const cards: Array<{ highlight: string; title: string; content: React.ReactNode }> = [
    {
      highlight: 'Live Support',
      title: 'How I\'ll Handle Questions While We Build',
      content: (
        <>
          <div className="space-y-4">
            <p className="text-base">
              <span className="font-semibold text-white">Channel:</span> Drop questions in the chat while we're building.
            </p>
            
            <div>
              <p className="font-semibold text-white mb-3">Checkpoints where I pause to help everyone at once:</p>
              <ul className="space-y-2 text-gray-300 text-base pl-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>After we generate the prompt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>After the first Lovable build finishes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400 mt-1">•</span>
                  <span>After we deploy</span>
                </li>
              </ul>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-6 pt-4 border-t border-gray-800">
            If you're still stuck, I'll note your name and hang back after the main 60 minutes for one-on-one help.
          </p>
        </>
      ),
    },
    {
      highlight: 'Pace & Reassurance',
      title: 'Different Speeds Are Normal',
      content: (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <img src="/bunny.png" alt="Fast bunny" className="w-12 h-12 flex-shrink-0" />
                <p>
                  <span className="font-semibold text-white">If you finish early:</span> polish your copy, try a new color palette,
                  or experiment with one extra section (testimonials, FAQs, etc.).
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <img src="/turtle.png" alt="Steady turtle" className="w-12 h-12 flex-shrink-0" />
                <p>
                  <span className="font-semibold text-white">If you fall behind:</span> stay focused on shipping a working v1.
                  Design polish and fancy animations can happen later.
                </p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-6 pt-4 border-t border-gray-800">
            I don't want fast folks bored or slower folks rushed—that's why extra help happens after the main session.
          </p>
        </>
      ),
    },
    {
      highlight: 'Replay & Reuse',
      title: 'After the Workshop',
      content: (
        <>
          <p>
            You’ll get the replay, slides, and the form link so you can update your answers and regenerate your prompt whenever you want.
          </p>
          <p className="text-sm text-gray-300">
            Want to improve your site later? Revisit the form, tweak your details, run a new prompt, and rebuild inside Lovable.
          </p>
          <p className="text-xs text-gray-500">
            We’re getting to an 80% version together today. You can come back and make it a 100% version once you have breathing room.
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
        <p className="text-sm font-semibold tracking-[0.4em] text-red-400 uppercase">Support & Pace</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white">How I’ll Support You During (and After) the Build</h2>
        <p className="text-gray-400 text-lg">
          How to get help, what if you’re faster/slower, and what happens after we wrap.
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

