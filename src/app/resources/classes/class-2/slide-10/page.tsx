'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide10Page() {
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
        router.push('/resources/classes/class-2/slide-11');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-9');
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
              Slide 10 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 10: Common Prompting Mistakes */}
              <div className="animate-fade-in">
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      Common Mistakes Beginners Make
                    </h2>
                  </div>

                  {/* Table Format */}
                  <div className="mt-8 overflow-x-auto">
                    <div className="min-w-full">
                      {/* Table Header */}
                      <div className="grid grid-cols-3 gap-4 mb-4 pb-2 border-b border-gray-700">
                        <div className="text-lg font-semibold text-red-400">❌ Mistake</div>
                        <div className="text-lg font-semibold text-gray-300">Why It Fails</div>
                        <div className="text-lg font-semibold text-green-400">✅ Better Approach</div>
                      </div>

                      {/* Row 1 */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-800">
                        <div className="text-white">
                          &quot;Make it look professional&quot;
                        </div>
                        <div className="text-gray-400">
                          Too vague—AI guesses
                        </div>
                        <div className="text-gray-300">
                          &quot;Use clean layout, sans-serif fonts, white space, business blue (#1E40AF)&quot;
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-800">
                        <div className="text-white">
                          &quot;Add a contact form&quot;
                        </div>
                        <div className="text-gray-400">
                          Missing specs
                        </div>
                        <div className="text-gray-300">
                          &quot;Add contact form with Name, Email, Message fields. Send to hello@example.com. Show success message after submit.&quot;
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-800">
                        <div className="text-white">
                          One giant paragraph of every detail
                        </div>
                        <div className="text-gray-400">
                          AI loses track
                        </div>
                        <div className="text-gray-300">
                          Break into Context, Instructions, Content, Format
                        </div>
                      </div>

                      {/* Row 4 */}
                      <div className="grid grid-cols-3 gap-4 py-4 border-b border-gray-800">
                        <div className="text-white">
                          &quot;Fix it&quot; or &quot;Make it better&quot;
                        </div>
                        <div className="text-gray-400">
                          AI doesn&apos;t know what&apos;s wrong
                        </div>
                        <div className="text-gray-300">
                          &quot;The header overlaps the hero image on mobile. Fix the spacing and make header sticky.&quot;
                        </div>
                      </div>

                      {/* Row 5 */}
                      <div className="grid grid-cols-3 gap-4 py-4">
                        <div className="text-white">
                          Building everything in one prompt
                        </div>
                        <div className="text-gray-400">
                          Errors multiply, hard to debug
                        </div>
                        <div className="text-gray-300">
                          Phase 1: Structure. Phase 2: Content. Phase 3: Features. Phase 4: Polish.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Banner */}
                  <div className="mt-8 bg-gradient-to-r from-red-600/20 to-red-800/20 border-2 border-red-600/50 rounded-2xl p-6 text-center">
                    <p className="text-lg md:text-xl text-white font-semibold">
                      Being specific isn&apos;t being picky—it&apos;s being effective.
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
                  href="/resources/classes/class-2/slide-9"
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
                      step === 10
                        ? 'w-12 bg-red-600'
                        : step < 10
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-11"
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

