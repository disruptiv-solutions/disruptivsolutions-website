'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide15Page() {
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
        router.push('/resources/classes/class-2/slide-16');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-14');
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
              Slide 15 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 15: Common Problems & Quick Fixes */}
              <div className="animate-fade-in">
                <div className="max-w-5xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      When Things Go Wrong (And They Will)
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300">
                      Here&apos;s how to debug like a pro
                    </p>
                  </div>

                  {/* Problem-Solution Grid */}
                  <div className="space-y-4">
                    {/* Problem 1 */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-400 mb-2">Problem: AI picks wrong colors</h3>
                          <div className="bg-zinc-800/50 border border-green-600/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-1">Quick Fix:</p>
                            <p className="text-green-400 font-mono text-sm">
                              &quot;Change primary color to #DC2626 and secondary to #991B1B throughout the site.&quot;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Problem 2 */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-400 mb-2">Problem: Layout broken on mobile</h3>
                          <div className="bg-zinc-800/50 border border-green-600/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-1">Quick Fix:</p>
                            <p className="text-green-400 font-mono text-sm">
                              &quot;The header overlaps content on mobile screens. Fix spacing and make it responsive.&quot;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Problem 3 */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-400 mb-2">Problem: Missing a section you mentioned</h3>
                          <div className="bg-zinc-800/50 border border-green-600/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-1">Quick Fix:</p>
                            <p className="text-green-400 font-mono text-sm">
                              &quot;Add the testimonials section below the services section. Include 3 testimonial cards with name, photo, and quote.&quot;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Problem 4 */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          4
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-400 mb-2">Problem: Text is placeholder/lorem ipsum</h3>
                          <div className="bg-zinc-800/50 border border-green-600/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-1">Quick Fix:</p>
                            <p className="text-green-400 font-mono text-sm">
                              &quot;Replace all placeholder text with: [paste your actual content]&quot;
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Problem 5 */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                          5
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-red-400 mb-2">Problem: AI times out or fails</h3>
                          <div className="bg-zinc-800/50 border border-green-600/30 rounded-lg p-4">
                            <p className="text-sm text-gray-400 mb-1">Quick Fix:</p>
                            <p className="text-green-400 text-sm">
                              Start a new chat, use a shorter prompt, build in smaller phases.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pro Tip Box */}
                  <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-800/20 border-2 border-yellow-600/50 rounded-2xl p-6">
                    <div className="flex items-start gap-3">
                      <span className="text-yellow-400 text-2xl">💡</span>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-400 mb-2">Pro Tip:</h3>
                        <p className="text-white">
                          &quot;Keep a doc of your working prompts. When something works well, save it as a template for next time.&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Banner */}
                  <div className="bg-gradient-to-r from-red-600/20 to-red-800/20 border-2 border-red-600/50 rounded-2xl p-6 text-center">
                    <p className="text-lg font-semibold text-white">
                      Debugging is part of the process. Every error teaches you how to prompt better next time.
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
                href="/resources/classes/class-2/slide-14"
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
                      step === 15
                        ? 'w-12 bg-red-600'
                        : step < 15
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-16"
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

