import React from 'react';

export const WhatYoullDoStep: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-8">
        What You'll Actually Do Today
      </h2>

      {/* 4-Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Step 1 */}
        <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-5 text-center hover:border-gray-700 transition-colors">
          <div className="w-16 h-16 mx-auto mb-3 bg-red-600/20 rounded-full flex items-center justify-center">
            <div className="text-3xl">✏️</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">STEP 1</h3>
          <p className="text-xl font-semibold text-red-400 mb-2">Tell Your Story</p>
          <p className="text-xs text-gray-400 mb-3">(5 min)</p>
          <ul className="text-xs text-gray-300 text-left space-y-1.5">
            <li>• Name & title</li>
            <li>• Bio & background</li>
            <li>• Contact details</li>
          </ul>
        </div>

        {/* Step 2 */}
        <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-5 text-center hover:border-gray-700 transition-colors">
          <div className="w-16 h-16 mx-auto mb-3 bg-red-600/20 rounded-full flex items-center justify-center">
            <div className="text-3xl">✨</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">STEP 2</h3>
          <p className="text-xl font-semibold text-red-400 mb-2">AI Generates Prompt</p>
          <p className="text-xs text-gray-400 mb-3">(1 min)</p>
          <ul className="text-xs text-gray-300 text-left space-y-1.5">
            <li>• Tailored to your info</li>
            <li>• Custom instructions</li>
            <li>• Ready to use</li>
          </ul>
        </div>

        {/* Step 3 */}
        <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-5 text-center hover:border-gray-700 transition-colors">
          <div className="w-16 h-16 mx-auto mb-3 bg-red-600/20 rounded-full flex items-center justify-center">
            <div className="text-3xl">🚀</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">STEP 3</h3>
          <p className="text-xl font-semibold text-red-400 mb-2">Build in Lovable</p>
          <p className="text-xs text-gray-400 mb-3">(15 min)</p>
          <ul className="text-xs text-gray-300 text-left space-y-1.5">
            <li>• Paste prompt</li>
            <li>• Watch AI build</li>
            <li>• Make quick edits</li>
          </ul>
        </div>

        {/* Step 4 */}
        <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-5 text-center hover:border-gray-700 transition-colors">
          <div className="w-16 h-16 mx-auto mb-3 bg-red-600/20 rounded-full flex items-center justify-center">
            <div className="text-3xl">🌐</div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">STEP 4</h3>
          <p className="text-xl font-semibold text-red-400 mb-2">Deploy & Share</p>
          <p className="text-xs text-gray-400 mb-3">(5 min)</p>
          <ul className="text-xs text-gray-300 text-left space-y-1.5">
            <li>• Click deploy</li>
            <li>• Get live URL</li>
            <li>• Ready to share</li>
          </ul>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="bg-gradient-to-r from-red-600/20 to-red-800/20 border-2 border-red-600/50 rounded-2xl p-6 text-center mt-8">
        <p className="text-2xl md:text-3xl font-bold text-white mb-2">
          Total time: ~30 minutes
        </p>
        <p className="text-xl md:text-2xl text-gray-300">
          Result: <span className="text-red-400 font-bold">Live website YOU built with AI</span>
        </p>
      </div>
    </div>
  );
};

