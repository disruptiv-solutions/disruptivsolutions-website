'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const Consulting: React.FC = () => {
  return (
    <section 
      id="consulting"
      className="bg-black snap-start pt-[65px] pb-20 lg:py-0 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)]">
        <div className="h-full flex items-center justify-center pt-0 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left: Content */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Consulting With Ian
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href="https://calendar.app.google/koPerS8JKfqi5HGE8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base text-center bg-red-600 text-white shadow-lg shadow-red-600/50 hover:bg-red-700"
                >
                  20 min - Free
                </a>
                <a
                  href="https://calendar.app.google/hJsP5Jz11pHsPGhh9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base text-center bg-white/10 text-gray-300 hover:bg-white/20 border border-white/5"
                >
                  $89 - 90 min
                </a>
              </div>
              <p className="text-gray-100/90 text-lg leading-relaxed mb-6">
                Book a 1:1 consult to review your AI product, unblock builds, or plan your launch.
              </p>
              <div className="space-y-3 text-gray-400 mb-6">
                <p className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span>Get unstuck on your build</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span>Review your AI product strategy</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span>Plan your launch roadmap</span>
                </p>
              </div>
            </div>
            
            {/* Right: Empty placeholder or remove if not needed */}
            <div className="w-full hidden lg:block">
              {/* Right side can be empty or used for additional content if needed */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consulting;
