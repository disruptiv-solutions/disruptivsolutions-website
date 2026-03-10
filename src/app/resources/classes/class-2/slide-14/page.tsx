'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Slide14Page() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Welcome! 🚀 Paste your prompt here and I\'ll generate a real website preview using AI.\n\nTry pasting your prompt from slide 13, or type something like:\n"Build a website for a yoga studio called Inner Peace Yoga with a calming green color scheme"' }
  ]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isBuilding) return;

    const userMessage = prompt.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setPrompt('');
    setIsBuilding(true);
    setError(null);

    // Add building message
    setMessages(prev => [...prev, { role: 'assistant', content: '🔨 Building your website...\n\nThis usually takes 10-20 seconds. Watch the magic happen!' }]);

    try {
      const response = await fetch('/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      
      if (data.html) {
        setPreviewHtml(data.html);
        setMessages(prev => {
          // Remove the building message and add success
          const filtered = prev.slice(0, -1);
          return [...filtered, { 
            role: 'assistant', 
            content: '✨ Done! Your website preview is ready!\n\nYou can:\n• Type follow-up requests to modify it\n• Ask to "change the color to blue"\n• Request to "add a testimonials section"\n• Say "make the hero bigger"\n\nIteration is how you get exactly what you want!'
          }];
        });
      } else {
        throw new Error('No HTML received');
      }
    } catch (err) {
      console.error('Error generating preview:', err);
      setError('Failed to generate preview. Please try again.');
      setMessages(prev => {
        const filtered = prev.slice(0, -1);
        return [...filtered, { 
          role: 'assistant', 
          content: '❌ Oops! Something went wrong generating the preview.\n\nThis could be due to:\n• API rate limits\n• Network issues\n• Complex prompt\n\nTry again with a simpler prompt!'
        }];
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleIteration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isBuilding || !previewHtml) return;

    const userMessage = prompt.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setPrompt('');
    setIsBuilding(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '🔄 Updating your website...' }]);

    try {
      // For iteration, include context about what was already built
      const iterationPrompt = `The user has an existing website and wants to make changes.

CURRENT WEBSITE HTML:
${previewHtml}

USER'S REQUESTED CHANGES:
${userMessage}

Generate an updated version of the website incorporating the user's changes. Keep the overall structure but apply their modifications. Output ONLY the complete HTML code.`;

      const response = await fetch('/api/generate-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: iterationPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preview');
      }

      const data = await response.json();
      
      if (data.html) {
        setPreviewHtml(data.html);
        setMessages(prev => {
          const filtered = prev.slice(0, -1);
          return [...filtered, { 
            role: 'assistant', 
            content: '✅ Updated! Check out the changes in the preview.\n\nKeep iterating until it\'s perfect!'
          }];
        });
      }
    } catch (err) {
      console.error('Error updating preview:', err);
      setMessages(prev => {
        const filtered = prev.slice(0, -1);
        return [...filtered, { 
          role: 'assistant', 
          content: '❌ Couldn\'t apply those changes. Try rephrasing your request!'
        }];
      });
    } finally {
      setIsBuilding(false);
    }
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
        router.push('/resources/classes/class-2/slide-15');
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        router.push('/resources/classes/class-2/slide-13');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Slideshow Container */}
      <div className="relative h-screen flex flex-col">
        {/* Main Slide Content - Fixed height between nav and footer */}
        <main className="flex-1 flex px-2 md:px-4 pt-20 pb-24" style={{ height: 'calc(100vh - 0px)' }}>
          <div className="w-full mx-auto flex flex-col" style={{ height: 'calc(100vh - 160px)' }}>
            {/* Artifact Layout - Fixed Height, Full Width - Chat 1/3, Preview 2/3 */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-2 md:gap-4 flex-1 min-h-0">
              
              {/* LEFT SIDE - Chat Interface */}
              <div className="bg-zinc-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-0">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">AI Builder</div>
                    <div className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                      Powered by Claude
                    </div>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        msg.role === 'user' 
                          ? 'bg-red-600 text-white' 
                          : 'bg-zinc-800 text-gray-200'
                      }`}>
                        <pre className="whitespace-pre-wrap text-sm font-sans">{msg.content}</pre>
                      </div>
                    </div>
                  ))}
                  
                  {/* Building indicator */}
                  {isBuilding && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-800 text-gray-200 rounded-2xl px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-6 h-6">
                            <div className="absolute inset-0 border-2 border-red-500/30 rounded-full" />
                            <div className="absolute inset-0 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                          <span className="text-sm text-gray-300">AI is building...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Chat Input */}
                <form onSubmit={previewHtml ? handleIteration : handleSubmit} className="p-4 border-t border-gray-800">
                  <div className="flex gap-2">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={previewHtml ? "Type changes (e.g., 'make the header blue')" : "Paste your prompt here..."}
                      className="flex-1 bg-zinc-800 text-white rounded-xl border border-gray-700 px-4 py-3 text-sm resize-none h-20 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                      disabled={isBuilding}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (previewHtml) {
                            handleIteration(e);
                          } else {
                            handleSubmit(e);
                          }
                        }
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!prompt.trim() || isBuilding}
                      className="px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-400 text-xs mt-2">{error}</p>
                  )}
                </form>
              </div>

              {/* RIGHT SIDE - Preview Panel */}
              <div className="bg-zinc-900 border border-gray-800 rounded-2xl flex flex-col overflow-hidden min-h-0">
                {/* Preview Header */}
                <div className="px-4 py-3 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <span className="text-xs text-gray-400 font-mono">preview.ai-builder.app</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {previewHtml && (
                      <>
                        <button 
                          onClick={() => {
                            setPreviewHtml(null);
                            setMessages([{ role: 'assistant', content: 'Preview cleared! Paste a new prompt to start fresh. 🚀' }]);
                          }}
                          className="px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-zinc-800 rounded transition-colors"
                        >
                          Clear
                        </button>
                        <button 
                          onClick={() => {
                            const blob = new Blob([previewHtml], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            window.open(url, '_blank');
                          }}
                          className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors"
                          title="Open in new tab"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview Content */}
                <div className="flex-1 bg-white overflow-hidden">
                  {isBuilding && !previewHtml ? (
                    // Skeleton Loader
                    <div className="h-full bg-gray-50 p-4 animate-pulse">
                      {/* Skeleton Nav */}
                      <div className="flex items-center justify-between mb-8">
                        <div className="h-8 w-32 bg-gray-200 rounded" />
                        <div className="flex gap-4">
                          <div className="h-4 w-16 bg-gray-200 rounded" />
                          <div className="h-4 w-16 bg-gray-200 rounded" />
                          <div className="h-4 w-16 bg-gray-200 rounded" />
                        </div>
                      </div>
                      {/* Skeleton Hero */}
                      <div className="text-center py-12 space-y-4">
                        <div className="h-10 w-3/4 bg-gray-200 rounded mx-auto" />
                        <div className="h-6 w-1/2 bg-gray-200 rounded mx-auto" />
                        <div className="flex justify-center gap-4 mt-6">
                          <div className="h-10 w-32 bg-gray-300 rounded-lg" />
                          <div className="h-10 w-32 bg-gray-200 rounded-lg" />
                        </div>
                      </div>
                      {/* Skeleton Content */}
                      <div className="grid grid-cols-3 gap-4 mt-8">
                        <div className="h-32 bg-gray-200 rounded-xl" />
                        <div className="h-32 bg-gray-200 rounded-xl" />
                        <div className="h-32 bg-gray-200 rounded-xl" />
                      </div>
                      {/* Building indicator */}
                      <div className="flex items-center justify-center mt-8 gap-3">
                        <div className="relative w-6 h-6">
                          <div className="absolute inset-0 border-2 border-red-500/30 rounded-full" />
                          <div className="absolute inset-0 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <span className="text-gray-500 text-sm">Building your website...</span>
                      </div>
                    </div>
                  ) : !previewHtml ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="text-6xl mb-4">🖼️</div>
                      <p className="text-center text-sm text-gray-500">
                        Your AI-generated website will appear here
                      </p>
                      <p className="text-center text-xs text-gray-400 mt-2">
                        Paste a prompt and press Enter to get started
                      </p>
                    </div>
                  ) : (
                    <iframe
                      ref={iframeRef}
                      srcDoc={previewHtml}
                      className="w-full h-full border-0"
                      title="Website Preview"
                      sandbox="allow-scripts"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="fixed bottom-0 left-0 right-0 z-30 px-8 py-6 bg-gradient-to-t from-black via-black/95 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <Link
                href="/resources/classes/class-2/slide-13"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-zinc-800 hover:border-gray-600 transition-all"
              >
                <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-semibold">Previous</span>
              </Link>

              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((step) => (
                  <Link
                    key={step}
                    href={`/resources/classes/class-2/slide-${step}`}
                    className={`h-3 rounded-full transition-all duration-300 ${
                      step === 14
                        ? 'w-12 bg-red-600'
                        : step < 14
                        ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                        : 'w-3 bg-gray-700 hover:bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${step}`}
                  />
                ))}
              </div>

              <Link
                href="/resources/classes/class-2/slide-15"
                className="group flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30"
              >
                <span>Next</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
