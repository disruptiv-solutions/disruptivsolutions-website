'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide6Page() {
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
        router.push('/resources/classes/class-2/slide-7');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-5');
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
              Slide 6 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 6: The Problem Most Beginners Face */}
              <div className="animate-fade-in">
                <div className="max-w-6xl mx-auto space-y-8">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-12">
                    The Problem Most Beginners Face
                  </h2>

                  {/* Split Screen Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* LEFT SIDE - Vague Prompt */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-red-400 mb-3">Vague Prompt:</h3>
                        <div className="bg-zinc-800/50 border border-gray-700 rounded-lg p-4">
                          <p className="text-white italic">&quot;Make me a website for my business&quot;</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">What AI Delivers:</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start gap-2">
                            <span className="text-red-400">✗</span>
                            <span>Generic template</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400">✗</span>
                            <span>Random colors</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400">✗</span>
                            <span>Missing key sections</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-400">✗</span>
                            <span>Doesn&apos;t match your vision</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* RIGHT SIDE - Specific Prompt */}
                    <div className="bg-zinc-900/60 border border-green-600/50 rounded-2xl p-6">
                      <div className="mb-4">
                        <h3 className="text-xl font-semibold text-green-400 mb-3">Specific Prompt:</h3>
                        <div className="bg-zinc-800/50 border border-gray-700 rounded-lg p-4">
                          <p className="text-white text-sm leading-relaxed">
                            &quot;Build a professional website for a wedding photography business. Include: hero section with booking CTA, portfolio gallery (grid layout), about me section, pricing packages table, contact form. Use soft pink (#FFC0CB) and white color scheme. Elegant, romantic feel.&quot;
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">What AI Delivers:</h4>
                        <ul className="space-y-2 text-gray-300">
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Exactly what you asked for</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Right colors, right sections</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Professional result</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-400">✓</span>
                            <span>Matches your vision</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="text-center mt-8">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      Same tool. Different results.
                    </p>
                    <p className="text-xl md:text-2xl lg:text-3xl font-bold text-red-400 mt-2">
                      The prompt is everything.
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
                href="/resources/classes/class-2/slide-5"
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
                      step === 6
                        ? 'w-12 bg-red-600'
                        : step < 6
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-7"
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
