import React from 'react';

export const TheConceptStep: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
        This entire presentation...
      </h2>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: Presentation Mockup */}
        <div className="bg-zinc-900/60 border-2 border-gray-700 rounded-2xl p-6 shadow-2xl">
          <div className="bg-gradient-to-br from-red-900/30 to-zinc-900/30 rounded-xl p-8 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="text-6xl">📊</div>
              <p className="text-xl text-gray-300">Interactive Workshop</p>
              <p className="text-sm text-gray-400">16 Slides • Live Forms • Real-time</p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/10 rounded p-3 h-16 flex items-center justify-center text-3xl">👋</div>
                <div className="bg-white/10 rounded p-3 h-16 flex items-center justify-center text-3xl">📝</div>
                <div className="bg-white/10 rounded p-3 h-16 flex items-center justify-center text-3xl">🚀</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Prompt & Text */}
        <div className="space-y-6">
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            ...was built with AI
          </h3>

          {/* Prompt Box */}
          <div className="bg-red-600/20 border-2 border-red-500/50 rounded-2xl p-6">
            <p className="text-base md:text-lg text-white leading-relaxed">
              "Build an interactive workshop presentation with 16 slides, including live participant forms, real-time polling, sticky note boards with Firebase, and a custom prompt generator. Modern dark theme with smooth navigation."
            </p>
          </div>

          {/* Final statement */}
          <div className="pt-4 space-y-3">
            <p className="text-3xl md:text-4xl font-bold text-red-400">
              That's AI development.
            </p>
            <p className="text-xl md:text-2xl text-white font-light">
              Plain English → Working App
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

