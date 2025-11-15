import React from 'react';

interface SectionCardProps {
  highlight?: string;
  title: string;
  children: React.ReactNode;
  showImage?: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({ highlight, title, children, showImage = false }) => {
  if (showImage) {
    return (
      <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Text content */}
          <div className="space-y-4">
            {highlight && (
              <p className="text-sm uppercase tracking-wide text-red-400 font-semibold">{highlight}</p>
            )}
            <h3 className="text-2xl md:text-3xl font-bold text-white">{title}</h3>
            <div className="space-y-3 text-gray-300 text-base leading-relaxed">{children}</div>
          </div>
          
          {/* Right side - Image */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-xl overflow-hidden border border-gray-700 shadow-lg max-w-md w-full">
              <img 
                src="/PROMPTS GO HERE.png" 
                alt="Lovable chat interface preview" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
};

interface WhatToExpectStepProps {
  cardIndex: number;
  totalCards: number;
}

export const WhatToExpectStep: React.FC<WhatToExpectStepProps> = ({ cardIndex, totalCards }) => {
  const cards: Array<{ highlight: string; title: string; content: React.ReactNode; showImage?: boolean }> = [
    {
      highlight: 'The Platform',
      title: 'The Tool (Lovable.dev)',
      showImage: true,
      content: (
        <>
          <p>
            We're building inside <span className="font-semibold text-white">Lovable.dev</span>.
            It's free and includes <span className="font-semibold text-white">5 credits</span> provided by Lovable—enough for about 5 messages between you and the AI.
          </p>
          <p className="text-sm text-gray-400">
            If you already burned through your credits previously, follow along, take notes, and rerun the steps later.
          </p>
        </>
      ),
    },
    {
      highlight: 'Expectation Reset',
      title: 'Things Will Be a Little Messy (and That\'s Okay)',
      content: (
        <>
          <p>AI might:</p>
          <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
            <li>Pick an odd layout or image</li>
            <li>Mess up some copy</li>
            <li>Throw an error or time out</li>
          </ul>
          <div className="my-4 rounded-xl overflow-hidden border border-gray-700">
            <img 
              src="/build-error.png" 
              alt="Example of a build error" 
              className="w-full h-auto"
            />
          </div>
          <p>
            That's part of the lesson. We're aiming for a <span className="text-white font-semibold">live, imperfect v1</span>,
            not a polished portfolio site.
          </p>
        </>
      ),
    },
    {
      highlight: 'Timeline',
      title: 'How We\'ll Use Our Time',
      content: (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-8 items-start">
            <ul className="space-y-3 text-gray-300 text-base">
              <li className="flex items-start gap-3">
                <span className="font-bold text-white text-lg min-w-[5rem]">7 minutes</span>
                <span>Fill in your information form</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white text-lg min-w-[5rem]">5 minutes</span>
                <span>Follow along as we paste the prompt into Lovable & run the first build</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white text-lg min-w-[5rem]">5 minutes</span>
                <span>Pause for questions (if there are any issues)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white text-lg min-w-[5rem]">5 minutes</span>
                <span>Add a new feature together</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-white text-lg min-w-[5rem]">5 minutes</span>
                <span>Final Q&A and wrap up</span>
              </li>
            </ul>
            
            <div className="hidden lg:flex items-center justify-center">
              <div className="text-8xl opacity-20">🕐</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-400 mt-6 pt-4 border-t border-gray-800">
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

      <SectionCard 
        highlight={currentCard.highlight} 
        title={currentCard.title}
        showImage={currentCard.showImage}
      >
        {currentCard.content}
      </SectionCard>

      <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
        Card {cardIndex} of {totalCards}
      </p>
    </div>
  );
};
