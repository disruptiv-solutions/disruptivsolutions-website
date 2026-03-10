'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide18Page() {
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
        router.push('/resources/classes/class-2/slide-19');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-17');
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
              Slide 18 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 18: Resources & Cheat Sheet */}
              <div className="animate-fade-in">
                <div className="max-w-5xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      Your Prompting Cheat Sheet
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300">
                      Bookmark this for your next build
                    </p>
                  </div>

                  {/* Download Box */}
                  <div className="bg-gradient-to-br from-red-600/30 via-red-600/15 to-transparent border-2 border-red-500/50 rounded-2xl p-8 shadow-xl shadow-red-600/30">
                    <div className="text-center space-y-4">
                      <div className="text-5xl mb-4">📥</div>
                      <h3 className="text-2xl font-bold text-white">
                        Download the Prompting Framework Template
                      </h3>
                      <button
                        onClick={() => {
                          // Placeholder for download functionality
                          alert('Download functionality coming soon!');
                        }}
                        className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/50 text-lg"
                      >
                        Download PDF
                      </button>
                    </div>
                    
                    {/* PDF Contents */}
                    <div className="mt-6 grid md:grid-cols-2 gap-3 text-sm text-gray-300">
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>The 4-part framework template</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Platform-specific tip sheets</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>20 example prompts for common projects</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Common fixes reference guide</span>
                      </div>
                      <div className="flex items-start gap-2 md:col-span-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>Links to communities and resources</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Reference */}
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Before You Prompt */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        Before You Prompt:
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• What&apos;s the goal?</li>
                        <li>• Who&apos;s it for?</li>
                        <li>• What sections/features do I need?</li>
                        <li>• What should it look like?</li>
                      </ul>
                    </div>

                    {/* While Building */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        While Building:
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Start simple, add complexity in phases</li>
                        <li>• Test on mobile and desktop</li>
                        <li>• Make one change at a time</li>
                        <li>• Save working versions</li>
                      </ul>
                    </div>

                    {/* When Stuck */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        When Stuck:
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li>• Is my prompt specific enough?</li>
                        <li>• Am I trying to do too much at once?</li>
                        <li>• Did I provide color codes, not just &quot;blue&quot;?</li>
                        <li>• Should I start a new chat and try again?</li>
                      </ul>
                    </div>
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
                href="/resources/classes/class-2/slide-17"
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
                      step === 18
                        ? 'w-12 bg-red-600'
                        : step < 18
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-19"
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

