'use client';

import React from 'react';
import { trackButtonClick, trackExternalLink, trackFormSubmission } from '@/lib/analytics';

const FREE_CONSULT_URL = 'https://calendar.app.google/koPerS8JKfqi5HGE8';

const Consulting: React.FC = () => {
  const handleBookFreeConsultation = () => {
    trackButtonClick('book_session', {
      page_location: 'consulting_section',
      session_length: '20min',
    });
    trackFormSubmission('consulting_request', { session_length: '20min' });
    trackExternalLink(FREE_CONSULT_URL, '20min Free Session');
    window.open(FREE_CONSULT_URL, '_blank', 'noopener,noreferrer');
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                Consulting With Ian
              </h2>
              <p className="text-gray-300 text-sm mb-6">
                Book a free 20-minute session to get personalized guidance on your AI app project.
              </p>
              <div className="bg-zinc-900/60 border-2 border-green-500/40 rounded-xl p-5 mb-6">
                <p className="text-white font-semibold text-lg mb-1">20 min – Free</p>
                <p className="text-green-400 text-sm font-medium">Quick consult. No commitment.</p>
              </div>
              <button
                type="button"
                onClick={handleBookFreeConsultation}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
              >
                Book Free 20‑Minute Consultation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consulting;
