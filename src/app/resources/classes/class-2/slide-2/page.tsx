'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide2Page() {
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        const isFormElement =
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          target.isContentEditable;
        if (isFormElement) {
          return;
        }
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-3');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-1');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Slideshow Container */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header with Logo/Title */}
        <header className="fixed left-0 right-0 z-20 px-8 py-4 flex items-center justify-between pointer-events-none top-16 md:top-[4.5rem]">
          <div className="pointer-events-auto" />
          <div className="text-right pointer-events-auto">
            <div className="text-sm text-gray-400">
              Slide 2 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 2: Overview of Class 1 */}
              <div className="animate-fade-in">
                <div className="text-center max-w-5xl mx-auto">
                  <h2 className="text-5xl md:text-6xl font-bold text-white mb-12">
                    What We Did in Class 1
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/brain.png" alt="Brain" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Learned AI Basics</h3>
                      <p className="text-gray-400 text-sm">
                        Understood how AI app development works and how it changed from complex code to simple conversation
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/pencil.png" alt="Pencil" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Shared Our Stories</h3>
                      <p className="text-gray-400 text-sm">
                        Recorded or typed professional bios and details about who we are and what we do
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/stars.png" alt="Stars" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">AI Enhancement</h3>
                      <p className="text-gray-400 text-sm">
                        Used AI to enhance our bios and generate custom prompts tailored to our information
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/rocket.png" alt="Rocket" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Built Our Sites</h3>
                      <p className="text-gray-400 text-sm">
                        Copied our prompts into Lovable&apos;s platform and watched AI build our websites
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/eisel.png" alt="Easel" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Made Quick Edits</h3>
                      <p className="text-gray-400 text-sm">
                        Personalized our sites with quick edits to make them uniquely ours
                      </p>
                    </div>
                    
                    <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                      <div className="w-16 h-16 mx-auto mb-4">
                        <img src="/icons/globe.png" alt="Globe" className="w-full h-full object-contain" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">Deployed Live</h3>
                      <p className="text-gray-400 text-sm">
                        Published our sites to the web instantly and got live URLs to share
                      </p>
                    </div>
                  </div>
                  
                  {/* Summary Banner */}
                  <div className="mt-8 bg-gradient-to-r from-red-600/20 to-red-800/20 border-2 border-red-600/50 rounded-2xl p-6 text-center">
                    <p className="text-xl md:text-2xl text-white mb-2">
                      <span className="text-red-400 font-bold">Result:</span> We proved that building with AI isn&apos;t just for &quot;tech people&quot;
                    </p>
                    <p className="text-lg md:text-xl text-gray-300">
                      In ~30 minutes, everyone built a live website. The barrier isn&apos;t technical—it&apos;s belief.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 z-30 px-8 py-6 bg-gradient-to-t from-black via-black/95 to-transparent">
          <div className="max-w-6xl mx-auto">
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Link
                href="/resources/classes/class-2/slide-1"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-zinc-800 hover:border-gray-600 transition-all"
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-semibold">Previous</span>
              </Link>

              {/* Progress Dots - Centered */}
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((step) => (
                  <Link
                    key={step}
                    href={`/resources/classes/class-2/slide-${step}`}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      step === 2
                        ? 'w-12 bg-red-600'
                        : step < 2
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-3"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30"
              >
                <span>Next</span>
                <svg
                  className="w-5 h-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </footer>

        {/* Keyboard Shortcuts Hint */}
        <div className="absolute bottom-24 right-8 text-xs text-gray-600 hidden lg:block">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-zinc-800 rounded border border-gray-700">←</kbd>
            <kbd className="px-2 py-1 bg-zinc-800 rounded border border-gray-700">→</kbd>
            <span>to navigate</span>
          </div>
        </div>
      </div>

      {/* Add keyboard navigation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

