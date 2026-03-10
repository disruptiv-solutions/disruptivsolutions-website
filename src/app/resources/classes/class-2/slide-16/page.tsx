'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide16Page() {
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
        router.push('/resources/classes/class-2/slide-17');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-15');
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
              Slide 16 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 16: Advanced Tips */}
              <div className="animate-fade-in">
                <div className="max-w-5xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      Level Up: Advanced Prompting Techniques
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300">
                      Try these once you&apos;ve got the basics down
                    </p>
                  </div>

                  {/* Four Advanced Techniques */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Technique 1: Role-Playing */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          1
                        </div>
                        <h3 className="text-lg font-semibold text-purple-400">Role-Playing</h3>
                      </div>
                      <div className="bg-zinc-800/50 border border-purple-600/30 rounded-lg p-4 mb-3">
                        <p className="text-purple-300 font-mono text-sm italic">
                          &quot;Act as a senior UX designer. Review this layout and suggest 3 improvements for better user flow.&quot;
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        <span className="text-purple-400 font-semibold">Why it works:</span> AI adjusts its perspective and gives more specialized feedback.
                      </p>
                    </div>

                    {/* Technique 2: Examples-First */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          2
                        </div>
                        <h3 className="text-lg font-semibold text-blue-400">Examples-First</h3>
                      </div>
                      <div className="bg-zinc-800/50 border border-blue-600/30 rounded-lg p-4 mb-3">
                        <p className="text-blue-300 font-mono text-sm italic">
                          &quot;Here&apos;s a screenshot of a design I like [attach]. Build something similar but for a fitness app instead of a restaurant.&quot;
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        <span className="text-blue-400 font-semibold">Why it works:</span> Visual references reduce ambiguity.
                      </p>
                    </div>

                    {/* Technique 3: Version Control */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <h3 className="text-lg font-semibold text-green-400">Version Control</h3>
                      </div>
                      <div className="bg-zinc-800/50 border border-green-600/30 rounded-lg p-4 mb-3">
                        <p className="text-green-300 text-sm">
                          Use Git or version history. Before making big changes, commit/save your current version.
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        <span className="text-green-400 font-semibold">Why it works:</span> You can always roll back if AI changes too much at once.
                      </p>
                    </div>

                    {/* Technique 4: The Question-First Approach */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">
                          4
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-400">The Question-First Approach</h3>
                      </div>
                      <div className="bg-zinc-800/50 border border-yellow-600/30 rounded-lg p-4 mb-3">
                        <p className="text-yellow-300 font-mono text-sm italic">
                          &quot;Before building, ask me 5 questions about this project to make sure you understand what I need.&quot;
                        </p>
                      </div>
                      <p className="text-sm text-gray-400">
                        <span className="text-yellow-400 font-semibold">Why it works:</span> Catches misunderstandings before code is written.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700 rounded-2xl p-6 text-center">
                    <p className="text-lg text-gray-300">
                      You don&apos;t need these today—but they&apos;re here when you&apos;re ready to level up.
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
                href="/resources/classes/class-2/slide-15"
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
                      step === 16
                        ? 'w-12 bg-red-600'
                        : step < 16
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-17"
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

