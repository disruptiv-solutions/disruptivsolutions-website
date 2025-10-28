'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const MyStory: React.FC = () => {
  return (
    <section 
      id="mystory"
      className="bg-black snap-start py-20 lg:py-0"
    >
      <div className="max-w-7xl mx-auto px-6 w-full lg:h-[calc(100vh-65px)]">
        <div className="lg:h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-12 items-start w-full">
          {/* Left: Heading + lead */}
          <div className="lg:pr-8 space-y-6">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              From Barely Making Rent to Building AI Products People Pay For
            </h2>
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                A year ago I was barely making money, questioning if this entrepreneur thing was realistic.
              </p>
              
              <p>
                Then I lost my dad in December 2023.
              </p>

              <p>
                He was the person who believed in me no matter what. When he left, I had a choice: step into those shoes and believe in myself like he did, or abandon hope.
              </p>
              
              <p className="text-white font-semibold text-xl">
                I chose to bet on myself.
              </p>
              
              <p>
                I went from client work (Disruptiv Solutions) to building proof-of-concept tools (ChatterCard) to becoming lead architect for an AI platform serving 1,500+ active users. From knowing nothing about speaking to leading workshops.
              </p>
            </div>
          </div>

          {/* Separator (desktop only), vertically centered */}
          <div className="hidden lg:block justify-self-center self-center">
            <div className="w-px bg-gray-800 rounded-full" style={{ height: '70%' }}></div>
          </div>

          {/* Right: Remaining story */}
          <div className="lg:pl-8 space-y-6 text-gray-300 text-lg leading-relaxed">
            <p>
              I learned that imposter syndrome is expensive. That knowing your worth isn't optional.
            </p>
            
            <p>
              Now I'm 31, living in Pensacola, FL, building in public and teaching others to do the same.
            </p>
            
            <p>
              I work on my dream every day. I also know that grinding isn't always the answer—rest matters too.
            </p>
            
            <div className="rounded-xl border border-gray-800 bg-zinc-900/30 pl-6 pr-6 py-6 mt-8 space-y-3">
              <p className="text-white font-semibold text-xl mb-4">If you're where I was 12 months ago:</p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 font-bold">→</span>
                <span>You're more capable than you think</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 font-bold">→</span>
                <span>Work on your craft daily</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 font-bold">→</span>
                <span>Failure is growth</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-600 font-bold">→</span>
                <span>Build your audience</span>
              </p>
            </div>
            
            <p className="text-white font-semibold text-xl mt-8">
              The universe put you exactly where you need to be.
            </p>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyStory;

