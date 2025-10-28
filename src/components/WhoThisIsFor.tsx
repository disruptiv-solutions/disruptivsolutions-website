'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const WhoThisIsFor: React.FC = () => {
  return (
    <section 
      id="who-this-is-for"
      className="bg-black snap-start min-h-screen py-20 lg:py-0"
      style={{ minHeight: '100vh' }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full h-full lg:h-[calc(100vh-65px)]">
        <div className="lg:h-full flex items-center pt-16 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1px_1fr] gap-12 items-center w-full h-full">
            {/* Left: Who This Is For - Static */}
            <div className="lg:pr-8 flex flex-col justify-center space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10">
                You're Exactly Where I Was 12 Months Ago
              </h2>
              
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                <div className="space-y-4">
                  <p className="text-xl flex items-start gap-3">
                    <span className="text-red-600 font-bold">→</span>
                    <span>You know you're capable of more</span>
                  </p>
                  <p className="text-xl flex items-start gap-3">
                    <span className="text-red-600 font-bold">→</span>
                    <span>You have ideas but don't know where to start</span>
                  </p>
                  <p className="text-xl flex items-start gap-3">
                    <span className="text-red-600 font-bold">→</span>
                    <span>You're tired of tutorials that don't lead anywhere</span>
                  </p>
                  <p className="text-xl flex items-start gap-3">
                    <span className="text-red-600 font-bold">→</span>
                    <span>You want to build something real, not just learn syntax</span>
                  </p>
                </div>
                
                <p className="mt-8">
                  I spent years thinking I wasn't "technical enough."<br />
                  Then I built something 1,500+ people use daily.
                </p>
                
                <p className="text-white text-xl font-semibold">
                  You don't need perfect code. You don't need years of experience.<br /><br />
                  You need to start messy and build something today.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden lg:block justify-self-center self-stretch flex items-center">
              <div className="w-px bg-gray-800 rounded-full h-[calc(100%-2rem)] my-8"></div>
            </div>

            {/* Right: My Story - Scrollable */}
            <div className="lg:pl-8 h-full overflow-y-auto scrollbar-hide relative">
              <div className="space-y-6 text-gray-300 text-lg leading-relaxed pb-8">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 sticky top-0 bg-black pt-4 pb-4 z-20">
                  My Story
                </h2>
                {/* Fade gradient overlay - fades content as it scrolls up */}
                <div className="sticky top-[80px] left-0 right-0 h-20 bg-gradient-to-b from-black via-black/70 to-transparent pointer-events-none z-10 -mt-20"></div>
                
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
      </div>
    </section>
  );
};

export default WhoThisIsFor;
