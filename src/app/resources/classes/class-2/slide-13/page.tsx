'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Slide13Page() {
  const router = useRouter();
  const [context, setContext] = useState('');
  const [instructions, setInstructions] = useState('');
  const [content, setContent] = useState('');
  const [format, setFormat] = useState('');
  const [improvedContext, setImprovedContext] = useState('');
  const [improvedInstructions, setImprovedInstructions] = useState('');
  const [improvedContent, setImprovedContent] = useState('');
  const [improvedFormat, setImprovedFormat] = useState('');
  const [improvingContext, setImprovingContext] = useState(false);
  const [improvingInstructions, setImprovingInstructions] = useState(false);
  const [improvingContent, setImprovingContent] = useState(false);
  const [improvingFormat, setImprovingFormat] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasImprovedContent = improvedContext || improvedInstructions || improvedContent || improvedFormat;

  const improveSection = async (
    section: 'context' | 'instructions' | 'content' | 'format',
    input: string,
    setImproving: (v: boolean) => void,
    setImproved: (v: string) => void
  ) => {
    if (!input) return;
    setImproving(true);
    
    try {
      const response = await fetch('/api/improve-prompt-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, input }),
      });

      if (!response.ok) {
        throw new Error('Failed to improve');
      }

      const data = await response.json();
      setImproved(data.improved);
    } catch (error) {
      console.error('Error improving section:', error);
      // Fallback to basic improvement if API fails
      const fallbacks: Record<string, string> = {
        context: `${input}\n\n→ Consider adding: target demographic, pain points, what success looks like`,
        instructions: `${input}\n\n→ Try breaking this into phases: Structure → Content → Features → Polish`,
        content: `${input}\n\n→ Add specifics: pricing, hours, contact info, testimonials`,
        format: `${input}\n\n→ Be specific: hex colors, font names, mobile-first layout, animations`,
      };
      setImproved(fallbacks[section]);
    } finally {
      setImproving(false);
    }
  };

  const handleImproveContext = () => improveSection('context', context, setImprovingContext, setImprovedContext);
  const handleImproveInstructions = () => improveSection('instructions', instructions, setImprovingInstructions, setImprovedInstructions);
  const handleImproveContent = () => improveSection('content', content, setImprovingContent, setImprovedContent);
  const handleImproveFormat = () => improveSection('format', format, setImprovingFormat, setImprovedFormat);

  const handleCopyPrompt = async () => {
    const fullPrompt = `CONTEXT:\n${improvedContext}\n\nINSTRUCTIONS:\n${improvedInstructions}\n\nCONTENT:\n${improvedContent}\n\nFORMAT:\n${improvedFormat}`;
    try {
      await navigator.clipboard.writeText(fullPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleReset = () => {
    setContext('');
    setInstructions('');
    setContent('');
    setFormat('');
    setImprovedContext('');
    setImprovedInstructions('');
    setImprovedContent('');
    setImprovedFormat('');
  };

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
        router.push('/resources/classes/class-2/slide-14');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-12');
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
              Slide 13 of 21
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-32 md:pt-32 md:pb-36">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Slide 13: Practice Time */}
              <div className="animate-fade-in">
                <div className="space-y-6">
                  {/* Title */}
                  <div className="text-center space-y-2">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                      Practice Time: Build Your Prompt
                    </h2>
                    <p className="text-lg md:text-xl text-gray-300">
                      Fill in the framework → AI improves it → Copy &amp; use
                    </p>
                  </div>

                  {/* Headers Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-2 lg:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✏️</span>
                      <h3 className="text-base font-semibold text-white">Your Input</h3>
                    </div>
                    <div className="hidden lg:flex items-center justify-center">
                      <span className="text-xs text-gray-500">AI</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✨</span>
                        <h3 className="text-base font-semibold text-white">Improved Prompt</h3>
                      </div>
                      {hasImprovedContent && (
                        <button
                          onClick={handleCopyPrompt}
                          className="px-3 py-1.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-all"
                        >
                          {copied ? '✓ Copied!' : '📋 Copy All'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Row 1: CONTEXT */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-2 lg:gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-red-400 mb-1">1. CONTEXT (Who &amp; Goal)</label>
                      <textarea
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        maxLength={200}
                        className="w-full bg-zinc-800 text-white rounded-lg border border-gray-700 h-20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 resize-none"
                        placeholder='e.g., "Yoga studio for busy professionals. Goal: trial signups"'
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={handleImproveContext}
                        disabled={improvingContext || !context}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 hover:scale-105"
                      >
                        {improvingContext ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>🤖</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-400 mb-1">1. CONTEXT</label>
                      <div className={`w-full bg-zinc-800 rounded-lg border ${improvedContext ? 'border-green-600/50' : 'border-gray-700'} h-20 px-3 py-2 text-sm overflow-y-auto`}>
                        {improvedContext ? (
                          <pre className="text-green-300 text-xs whitespace-pre-wrap font-mono">{improvedContext}</pre>
                        ) : (
                          <span className="text-gray-600 italic text-xs">Click 🤖 to improve...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: INSTRUCTIONS */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-2 lg:gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-red-400 mb-1">2. INSTRUCTIONS (What to include)</label>
                      <textarea
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        maxLength={300}
                        className="w-full bg-zinc-800 text-white rounded-lg border border-gray-700 h-20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 resize-none"
                        placeholder='e.g., "Hero, class schedule, instructor bios, pricing, signup form"'
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={handleImproveInstructions}
                        disabled={improvingInstructions || !instructions}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 hover:scale-105"
                      >
                        {improvingInstructions ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>🤖</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-400 mb-1">2. INSTRUCTIONS</label>
                      <div className={`w-full bg-zinc-800 rounded-lg border ${improvedInstructions ? 'border-green-600/50' : 'border-gray-700'} h-20 px-3 py-2 text-sm overflow-y-auto`}>
                        {improvedInstructions ? (
                          <pre className="text-green-300 text-xs whitespace-pre-wrap font-mono">{improvedInstructions}</pre>
                        ) : (
                          <span className="text-gray-600 italic text-xs">Click 🤖 to improve...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 3: CONTENT */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-2 lg:gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-red-400 mb-1">3. CONTENT (Actual details)</label>
                      <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={400}
                        className="w-full bg-zinc-800 text-white rounded-lg border border-gray-700 h-20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 resize-none"
                        placeholder='e.g., "Inner Peace Yoga | Seattle | Classes: Flow, Power, Meditation"'
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={handleImproveContent}
                        disabled={improvingContent || !content}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 hover:scale-105"
                      >
                        {improvingContent ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>🤖</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-400 mb-1">3. CONTENT</label>
                      <div className={`w-full bg-zinc-800 rounded-lg border ${improvedContent ? 'border-green-600/50' : 'border-gray-700'} h-20 px-3 py-2 text-sm overflow-y-auto`}>
                        {improvedContent ? (
                          <pre className="text-green-300 text-xs whitespace-pre-wrap font-mono">{improvedContent}</pre>
                        ) : (
                          <span className="text-gray-600 italic text-xs">Click 🤖 to improve...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Row 4: FORMAT */}
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_80px_1fr] gap-2 lg:gap-4 items-center">
                    <div>
                      <label className="block text-xs font-semibold text-red-400 mb-1">4. FORMAT (How it looks)</label>
                      <textarea
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        maxLength={200}
                        className="w-full bg-zinc-800 text-white rounded-lg border border-gray-700 h-20 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 resize-none"
                        placeholder='e.g., "Calm, zen. Colors: sage green (#87A96B), white. Minimal."'
                      />
                    </div>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={handleImproveFormat}
                        disabled={improvingFormat || !format}
                        className="flex items-center gap-1 px-3 py-2 bg-gradient-to-br from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/30 hover:scale-105"
                      >
                        {improvingFormat ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>🤖</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-green-400 mb-1">4. FORMAT</label>
                      <div className={`w-full bg-zinc-800 rounded-lg border ${improvedFormat ? 'border-green-600/50' : 'border-gray-700'} h-20 px-3 py-2 text-sm overflow-y-auto`}>
                        {improvedFormat ? (
                          <pre className="text-green-300 text-xs whitespace-pre-wrap font-mono">{improvedFormat}</pre>
                        ) : (
                          <span className="text-gray-600 italic text-xs">Click 🤖 to improve...</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Reset button */}
                  {hasImprovedContent && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleReset}
                        className="text-sm text-gray-400 hover:text-white transition-colors underline"
                      >
                        Reset All
                      </button>
                    </div>
                  )}

                  {/* Bottom Tip */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500">
                      💡 Tip: The more specific your input, the better the AI can enhance it!
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
                href="/resources/classes/class-2/slide-12"
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
                      step === 13
                        ? 'w-12 bg-red-600'
                        : step < 13
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-14"
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
