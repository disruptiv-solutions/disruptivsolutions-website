'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const Approach: React.FC = () => {
  return (
    <section 
      id="approach"
      className="min-h-screen flex items-center justify-center bg-black snap-start"
    >
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10">
          How I Build
        </h2>
        
        <div className="space-y-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Start Messy</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              There's nothing you can imagine that you can't start building. Not everything needs to be perfect or a billion-dollar idea. Ship something today.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Build Real Solutions</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Products that non-technical people actually use. I ship features, fix bugs, and teach people to build real apps. No jargon, no fluff.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Compound Your Skills</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              Every build teaches you something. Weekend projects become portfolio pieces. Portfolio pieces become confidence. Confidence becomes momentum.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Learn in Public</h3>
            <p className="text-gray-300 text-lg leading-relaxed">
              From Disruptiv Solutions to ChatterCard to the Real AI platform to LaunchBox—every project taught me something I used in the next one. Share your journey. Help others avoid your mistakes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;

