'use client';

import React from 'react';
import { trackButtonClick, trackExternalLink } from '@/lib/analytics';

const AI_OPS_URL = 'https://calendar.app.google/HCxn9Xec9TmatLEZ6';

const Consulting: React.FC = () => {
  const handleBookCall = () => {
    trackButtonClick('book_ai_ops_call', {
      page_location: 'consulting_section',
    });
    trackExternalLink(AI_OPS_URL, 'AI Ops Call');
    window.open(AI_OPS_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      id="consulting"
      className="bg-black snap-start pt-[65px] pb-20 lg:py-0 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)]">
        <div className="h-full flex items-center justify-center pt-0 lg:pt-0">
          <div className="w-full max-w-xl mx-auto">
            <div className="space-y-6 flex flex-col justify-center">
              <p className="text-red-500/90 text-xs font-semibold tracking-[0.3em] uppercase">
                AI Ops
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Simplify your business with AI
              </h2>
              <p className="text-gray-300 leading-relaxed">
                Tool sprawl, workflow chaos, or automation that never quite works. We'll audit what you have, cut what you don't need, and build what actually moves the needle.
              </p>
              <div className="space-y-3">
                {[
                  'Identify where AI can save you the most time',
                  'Cut tools you\'re paying for but not using',
                  'Build automations that actually run',
                ].map((item) => (
                  <p key={item} className="flex items-start gap-3 text-gray-300">
                    <span className="text-red-600 font-bold mt-0.5">→</span>
                    <span>{item}</span>
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={handleBookCall}
                className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
              >
                Book an AI Ops Call
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consulting;
