'use client';

import React from 'react';
import { trackButtonClick, trackExternalLink, trackFormSubmission } from '@/lib/analytics';

const Consulting: React.FC = () => {
  const [selectedSession, setSelectedSession] = React.useState<'20' | '90'>('20');

  const handleBook = () => {
    // Track button click
    trackButtonClick('book_session', 'consulting_section');
    
    // Track consulting request
    trackFormSubmission('consulting_request', {
      session_length: selectedSession === '20' ? '20min' : '90min',
    });
    
    // Track external link click
    if (selectedSession === '20') {
      trackExternalLink('https://calendar.app.google/koPerS8JKfqi5HGE8', '20min Free Session');
      window.open('https://calendar.app.google/koPerS8JKfqi5HGE8', '_blank', 'noopener,noreferrer');
    } else {
      trackExternalLink('https://calendar.app.google/hJsP5Jz11pHsPGhh9', '90min Paid Session');
      window.open('https://calendar.app.google/hJsP5Jz11pHsPGhh9', '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section 
      id="consulting"
      className="bg-black snap-start pt-[65px] pb-20 lg:py-0 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)]">
        <div className="h-full flex items-center justify-center pt-0 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch w-full">
            {/* Left: Consulting - 2 columns */}
            <div className="lg:col-span-2 space-y-6 flex flex-col justify-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Consulting With Ian
              </h2>
              <p className="text-gray-300 text-sm mb-6">
                Book a session to get personalized guidance on your AI app project.
              </p>
              <div className="bg-zinc-900/60 border border-gray-700 rounded-xl p-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">20 min - Free</span>
                    <span className="text-green-400 font-semibold text-xs">Quick consult</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">90 min - $197</span>
                    <span className="text-red-400 font-semibold text-xs">Deep dive</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  trackButtonClick('book_session', 'consulting_section');
                  window.open('https://calendar.app.google/koPerS8JKfqi5HGE8', '_blank', 'noopener,noreferrer');
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
              >
                Book Consulting Session
              </button>
            </div>
            
            {/* Right: Group Cohort - 3 columns */}
            <div className="lg:col-span-3 w-full">
              <div className="bg-gradient-to-br from-red-900/40 via-red-800/20 to-transparent border-2 border-red-600/30 rounded-3xl p-8 lg:p-10 h-full flex flex-col backdrop-blur-sm shadow-2xl shadow-red-900/20">
                <div className="space-y-6 flex-1">
                  <div>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                      Join our upcoming group cohort
                    </h3>
                    <div className="inline-block bg-red-600/20 border border-red-500/40 rounded-lg px-4 py-2">
                      <p className="text-red-400 font-bold text-sm">
                        Beginning Nov 20th - limited spots
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-200 text-lg leading-relaxed">
                    Master the 4 core fundamentals of AI app development through hands-on lessons and live sessions with direct feedback.
                  </p>

                  <div className="bg-black/40 border-2 border-red-500/30 rounded-2xl p-5">
                    <div className="flex items-baseline gap-4">
                      <span className="text-gray-500 text-xl line-through">$497</span>
                      <span className="text-5xl font-bold text-red-400">$297</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                    <p className="flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-1">✓</span>
                      <span className="text-sm">Ideation & MVP setting</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-1">✓</span>
                      <span className="text-sm">Development principles</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-1">✓</span>
                      <span className="text-sm">Launch strategies</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-red-500 font-bold mt-1">✓</span>
                      <span className="text-sm">Maintenance & scaling</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    trackButtonClick('view_cohort', 'consulting_section');
                    trackExternalLink('https://ianmcdonald.ai/cohort', 'Group Cohort');
                    window.open('https://ianmcdonald.ai/cohort', '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-lg font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl hover:shadow-red-600/60 mt-6"
                >
                  Join Group Cohort →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consulting;
