'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const JOIN_WAITLIST_URL = 'https://launchbox.space/founders';

const handleOpen = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export default function Slide20Page() {
  const router = useRouter();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

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
        router.push('/resources/classes/class-2/slide-21');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-19');
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
              Slide 20 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            <div className="min-h-[calc(100vh-220px)] flex items-center px-2">
              <div className="max-w-6xl mx-auto space-y-5 w-full">
                <div className="text-center space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    Ready to Go Deeper?
                  </h2>
                  <p className="text-sm md:text-base text-gray-300">
                    Take your AI app development skills to the next level.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-red-600/25 via-red-500/10 to-transparent border border-red-500/40 rounded-2xl p-5 md:p-7 shadow-[0_0_40px_rgba(248,113,113,0.3)]">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="space-y-3 max-w-2xl">
                      <p className="text-[10px] tracking-[0.3em] uppercase text-red-300 font-semibold">
                        Launchbox First
                      </p>
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        🚀 Launchbox for Builders
                      </h3>
                      <p className="text-gray-100/90 text-sm md:text-base leading-relaxed">
                        The platform I&apos;m building for creators who want to offer{' '}
                        <span className="font-semibold text-white">courses, workshops, community, and AI tools</span>{' '}
                        all in one place. Turn what you built today into something you can run, sell, and scale.
                      </p>
                      <ul className="space-y-1.5 text-gray-200 text-sm md:text-base">
                        <li className="flex gap-2">
                          <span className="text-red-400">•</span>
                          <span className="leading-relaxed">
                            <span className="font-medium">Host live & recorded workshops</span>{' '}
                            <span className="text-gray-400 text-xs md:text-sm">Run sessions like this under your own brand.</span>
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-400">•</span>
                          <span className="leading-relaxed">
                            <span className="font-medium">Sell digital products & tools</span>{' '}
                            <span className="text-gray-400 text-xs md:text-sm">Templates, prompts, mini-apps, and more.</span>
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-red-400">•</span>
                          <span className="leading-relaxed">
                            <span className="font-medium">Build a real community hub</span>{' '}
                            <span className="text-gray-400 text-xs md:text-sm">Keep your people in one place instead of scattered tools.</span>
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-2 min-w-[200px]">
                      <button
                        type="button"
                        onClick={() => handleOpen(JOIN_WAITLIST_URL)}
                        className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
                      >
                        Join the Launchbox Waitlist →
                      </button>
                      <p className="text-[11px] text-gray-400 lg:text-right max-w-xs leading-tight">
                        Workshop attendees get first access, feature priority, and early pricing when Launchbox goes live.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/70 border border-gray-800 rounded-xl p-3.5 md:p-4">
                  <p className="text-xs md:text-sm text-gray-200 leading-relaxed">
                    <span className="font-semibold text-white">Want direct help from me?</span> If you&apos;re interested in{' '}
                    <span className="font-medium">1-on-1 consulting</span> or joining a future{' '}
                    <span className="font-medium">group cohort</span>, email{' '}
                    <span className="font-mono text-red-300">ian@ianmcdonald.ai</span> with the subject line
                    <span className="italic"> &quot;Consulting / Cohort Interest&quot; </span>
                    and one sentence about what you&apos;re building.
                  </p>
                </div>

                <div className="bg-zinc-900/80 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-xs md:text-sm font-semibold text-white flex items-center gap-2">
                      <span role="img" aria-label="clipboard">
                        📝
                      </span>
                      Help me improve
                    </p>
                    <p className="text-gray-400 text-xs md:text-sm">
                      2-minute survey — What did you think? What do you want to learn next?
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFeedbackModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-xs md:text-sm font-semibold text-white hover:bg-red-500 transition-colors whitespace-nowrap"
                  >
                    Share Your Feedback →
                  </button>
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
                href="/resources/classes/class-2/slide-19"
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
                      step === 20
                        ? 'w-12 bg-red-600'
                        : step < 20
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-21"
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

      {/* Feedback Modal Placeholder - You can add the actual FeedbackModal component here */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setIsFeedbackModalOpen(false)}>
          <div className="bg-zinc-900 border border-gray-800 rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Feedback Form</h3>
              <button onClick={() => setIsFeedbackModalOpen(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Feedback form coming soon! For now, email ian@ianmcdonald.ai with your feedback.
            </p>
            <button
              onClick={() => setIsFeedbackModalOpen(false)}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

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

