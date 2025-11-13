import React from 'react';

export const IntroductionStep: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
          A bit about me
        </h2>
      </div>

      {/* Main Content - Single Column */}
      <div className="max-w-4xl mx-auto space-y-8 text-center">
        <p className="text-3xl md:text-4xl font-bold text-white">
          Hi, I'm Ian McDonald
        </p>
        
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          18 months ago, I was in healthcare with zero coding knowledge. Today, I build AI-powered apps serving thousands of users.
        </p>
        
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          No bootcamp. No computer science degree. Just curiosity, AI tools, and refusing to quit when things got hard.
        </p>
        
        {/* What I've Built - Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          <div className="bg-zinc-900/40 border border-gray-800 rounded-xl p-6 text-left">
            <div className="text-red-400 font-bold mb-2">→</div>
            <p className="text-lg text-gray-300">Enterprise AI platform (1,500+ users)</p>
          </div>
          <div className="bg-zinc-900/40 border border-gray-800 rounded-xl p-6 text-left">
            <div className="text-red-400 font-bold mb-2">→</div>
            <p className="text-lg text-gray-300">Production apps without technical training</p>
          </div>
          <div className="bg-zinc-900/40 border border-gray-800 rounded-xl p-6 text-left">
            <div className="text-red-400 font-bold mb-2">→</div>
            <p className="text-lg text-gray-300">Launchbox (white-label AI workspace for creators)</p>
          </div>
          <div className="bg-zinc-900/40 border border-gray-800 rounded-xl p-6 text-left">
            <div className="text-red-400 font-bold mb-2">→</div>
            <p className="text-lg text-gray-300">My own creator business on the platform I built</p>
          </div>
        </div>
        
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed pt-4">
          I'm teaching this because I wish someone had shown me how accessible this really is.
        </p>
        
        <p className="text-2xl md:text-3xl font-bold text-red-400 pt-2">
          Let's build something together.
        </p>
      </div>

      {/* Quick Facts - Horizontal Flow */}
      <div className="border-t border-gray-800 pt-12">
        <h3 className="text-2xl font-bold text-white text-center mb-8">Quick Facts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl flex-shrink-0">→</span>
            <span className="text-gray-300">Healthcare worker → Self-taught developer (18 months)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl flex-shrink-0">→</span>
            <span className="text-gray-300">Built apps serving 1,500+ users without CS degree</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl flex-shrink-0">→</span>
            <span className="text-gray-300">Walked away from 1 project to build Launchbox</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl flex-shrink-0">→</span>
            <span className="text-gray-300">Running creator business on my own platform (proof it works)</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl flex-shrink-0">→</span>
            <span className="text-gray-300">Teaching AI app building while building in public</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-red-400 font-bold text-xl flex-shrink-0">→</span>
            <span className="text-gray-300">First workshop had 100+ attendees—all built working apps</span>
          </div>
        </div>
      </div>
    </div>
  );
};

