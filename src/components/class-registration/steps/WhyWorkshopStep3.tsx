import React from 'react';

export const WhyWorkshopStep3: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto text-center space-y-8">
      <div className="space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Today:
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="text-5xl font-bold text-red-400 mb-3">60</div>
            <div className="text-xl text-white">minutes</div>
          </div>
          
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="text-5xl font-bold text-red-400 mb-3">1</div>
            <div className="text-xl text-white">live website</div>
          </div>
          
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
            <div className="text-5xl font-bold text-red-400 mb-3">YOU</div>
            <div className="text-xl text-white">built by</div>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-gray-800 space-y-4">
        <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
          The barrier isn't technical anymore.
        </p>
        <p className="text-2xl md:text-3xl text-white font-light leading-relaxed">
          It's belief.
        </p>
        <p className="text-3xl md:text-4xl font-bold text-red-400 pt-4">
          Let's prove it.
        </p>
      </div>
    </div>
  );
};

