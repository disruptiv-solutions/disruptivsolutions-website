'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide11Page() {
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
        router.push('/resources/classes/class-2/slide-12');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-10');
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
              Slide 11 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 11: Platform Differences */}
              <div className="animate-fade-in">
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                      Not All Platforms Work the Same Way
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-300">
                      Here&apos;s when to use each tool and how to prompt them
                    </p>
                  </div>

                  {/* Four Platform Cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {/* LOVABLE */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">🎨 LOVABLE</h3>
                      <p className="text-sm text-gray-400 mb-1">(What we used in Class 1)</p>
                      <p className="text-gray-300 mb-4 font-semibold">Best for: Beginners, visual apps, quick websites</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-white mb-2">Prompting Tips:</p>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Very descriptive about UI/design</li>
                          <li>• Mention color codes, layout types</li>
                          <li>• Ask for Supabase if you need a database</li>
                          <li>• Start simple, iterate with chat</li>
                        </ul>
                      </div>

                      <div className="bg-zinc-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Example prompt:</p>
                        <p className="text-white text-sm italic">
                          &quot;Build a recipe sharing app. Grid of recipe cards, each shows image, title, cooking time. Click card to see full recipe. Use warm orange theme (#FF6B35).&quot;
                        </p>
                      </div>
                    </div>

                    {/* BOLT.NEW */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">⚡ BOLT.NEW</h3>
                      <p className="text-gray-300 mb-4 font-semibold">Best for: Full-stack apps, prototypes with backend</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-white mb-2">Prompting Tips:</p>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Specify both frontend AND backend needs</li>
                          <li>• Use &quot;prompt enhance&quot; feature</li>
                          <li>• Break into discussion mode phases</li>
                          <li>• Mention frameworks if you have preferences</li>
                        </ul>
                      </div>

                      <div className="bg-zinc-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Example prompt:</p>
                        <p className="text-white text-sm italic">
                          &quot;Build a simple task manager. Frontend: list of tasks with checkboxes, add new task form. Backend: save tasks to database, mark complete/incomplete. Clean, minimal design.&quot;
                        </p>
                      </div>
                    </div>

                    {/* CURSOR */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">💻 CURSOR</h3>
                      <p className="text-gray-300 mb-4 font-semibold">Best for: Developers, editing existing code, complex projects</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-white mb-2">Prompting Tips:</p>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Use @file and @folder to give context</li>
                          <li>• Ask questions before generating code</li>
                          <li>• Request it to act as code reviewer</li>
                          <li>• Keep context windows small</li>
                        </ul>
                      </div>

                      <div className="bg-zinc-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Example prompt:</p>
                        <p className="text-white text-sm italic">
                          &quot;@src/components/Header.tsx - Review this header component. Check for accessibility issues, performance problems, and suggest improvements. Then refactor with your recommendations.&quot;
                        </p>
                      </div>
                    </div>

                    {/* REPLIT */}
                    <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">🚀 REPLIT</h3>
                      <p className="text-gray-300 mb-4 font-semibold">Best for: Learning, collaborating, full dev environment</p>
                      
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-white mb-2">Prompting Tips:</p>
                        <ul className="space-y-1 text-gray-300 text-sm">
                          <li>• Ask for initial structure, then iterate</li>
                          <li>• Use for open-ended projects</li>
                          <li>• Great for debugging with AI</li>
                          <li>• Generous free tier for practice</li>
                        </ul>
                      </div>

                      <div className="bg-zinc-800/50 border border-gray-700 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-1">Example prompt:</p>
                        <p className="text-white text-sm italic">
                          &quot;Create a Python Flask app that displays a random motivational quote on the homepage. Include a &apos;Get New Quote&apos; button. Use simple Bootstrap styling.&quot;
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Text */}
                  <div className="text-center mt-8">
                    <p className="text-lg md:text-xl text-gray-300">
                      For today&apos;s practice: We&apos;ll stick with Lovable (you already have accounts). But now you know when to try others.
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
                href="/resources/classes/class-2/slide-10"
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
                      step === 11
                        ? 'w-12 bg-red-600'
                        : step < 11
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-12"
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

