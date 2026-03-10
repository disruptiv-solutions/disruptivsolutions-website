'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide7Page() {
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
        router.push('/resources/classes/class-2/slide-8');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-6');
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
              Slide 7 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 7: How AI Actually Reads Your Prompts */}
              <div className="animate-fade-in">
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      How AI Actually Reads Your Prompts
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300">
                      Think of AI like a really smart intern—helpful, but needs clear direction
                    </p>
                  </div>

                  {/* Two Column Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* LEFT SIDE - What AI is good at */}
                    <div className="bg-zinc-900/60 border border-green-600/50 rounded-2xl p-6">
                      <h3 className="text-2xl font-semibold text-white mb-4">What AI is good at:</h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 text-xl mt-1">✓</span>
                          <span>Following specific instructions</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 text-xl mt-1">✓</span>
                          <span>Using examples you provide</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 text-xl mt-1">✓</span>
                          <span>Filling in reasonable defaults</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-green-400 text-xl mt-1">✓</span>
                          <span>Working in phases/steps</span>
                        </li>
                      </ul>
                    </div>

                    {/* RIGHT SIDE - What AI struggles with */}
                    <div className="bg-zinc-900/60 border border-red-600/50 rounded-2xl p-6">
                      <h3 className="text-2xl font-semibold text-white mb-4">What AI struggles with:</h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-3">
                          <span className="text-red-400 text-xl mt-1">✗</span>
                          <span>Reading your mind</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-400 text-xl mt-1">✗</span>
                          <span>Knowing your unstated preferences</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-400 text-xl mt-1">✗</span>
                          <span>Understanding vague requests like &quot;make it better&quot;</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="text-red-400 text-xl mt-1">✗</span>
                          <span>Handling massive requests all at once</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Key Insight Box */}
                  <div className="mt-8 bg-gradient-to-r from-red-600/20 to-red-800/20 border-2 border-red-600/50 rounded-2xl p-6">
                    <p className="text-lg md:text-xl text-white text-center leading-relaxed">
                      &quot;AI doesn&apos;t know what &apos;professional&apos; means to YOU. It needs specifics: colors, layout type, sections, tone, who it&apos;s for.&quot;
                    </p>
                  </div>

                  {/* Bottom Text */}
                  <div className="text-center mt-6">
                    <p className="text-xl md:text-2xl text-gray-300">
                      The clearer you are, the less back-and-forth fixing you&apos;ll do.
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
                href="/resources/classes/class-2/slide-6"
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
                      step === 7
                        ? 'w-12 bg-red-600'
                        : step < 7
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-8"
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
