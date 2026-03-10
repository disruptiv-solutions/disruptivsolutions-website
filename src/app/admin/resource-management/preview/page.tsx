'use client';

import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/components/AdminRoute';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const PREVIEW_STORAGE_KEY = 'admin-resource-preview-draft';

interface ResourceSection {
  heading?: string;
  text?: string;
  items?: string[];
  code?: string;
  note?: string;
}

interface PreviewData {
  title: string;
  description: string;
  type: string;
  icon: string;
  imageUrl?: string;
  imagePrompt?: string;
  tldr?: string;
  published: boolean;
  content: { sections: ResourceSection[] };
}

const typeLabels: Record<string, string> = {
  article: 'Article',
  'ad-landing': 'Ad / Landing Page',
  blog: 'Blog Post',
  prompts: 'Prompts',
  tool: 'Tool',
  guide: 'Guide',
  video: 'Video',
};

const cleanCitationMarkers = (text: string): string => {
  if (!text || typeof text !== 'string') return text;
  return text
    .replace(/[\uE000-\uF8FF]/g, '')
    .replace(/cite turn\d+[a-z]+\d+/gi, '')
    .replace(/cite turn\d+search\d+/gi, '')
    .replace(/\[cite[^\]]*\]/gi, '')
    .replace(/\(cite[^)]*\)/gi, '')
    .replace(/\bcite\s+turn\d+[a-z]+\d+\b/gi, '')
    .replace(/  +/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
};

export default function ResourcePreviewPage() {
  const [data, setData] = useState<PreviewData | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PreviewData;
        setData(parsed);
      }
    } catch {
      setData(null);
    }
  }, []);

  return (
    <AdminRoute>
      <div className="min-h-screen bg-black">
        {/* Preview Banner */}
        <div className="bg-yellow-600/20 border-b border-yellow-500/50 py-3 px-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">👁️</span>
              <p className="text-yellow-400 text-sm font-semibold">
                Full Page Preview — Shows how the resource will look when published
              </p>
            </div>
            <Link
              href="/admin/resource-management"
              className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold underline"
            >
              ← Back to Editor
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-6 pt-12 pb-20">
          {!data ? (
            <div className="text-center py-20 space-y-6">
              <p className="text-gray-400 text-lg">
                No preview data. Go back to the resource editor and click &quot;View Full Preview&quot; to see your content here.
              </p>
              <Link
                href="/admin/resource-management"
                className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                ← Back to Resource Management
              </Link>
            </div>
          ) : (
            <>
              {/* Resource Header */}
              <div className="mb-12 space-y-6">
                <div className="flex items-start gap-6">
                  <div className="text-6xl md:text-7xl">{data.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-zinc-900 border border-gray-800 rounded-full text-xs font-semibold text-gray-400">
                        {typeLabels[data.type] || data.type}
                      </span>
                      {!data.published && (
                        <span className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 rounded-full text-xs font-semibold text-yellow-400">
                          Draft
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                      {data.title || 'Resource Title'}
                    </h1>
                  </div>
                </div>
                <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
                  {data.description || 'Resource description...'}
                </p>
              </div>

              {/* Hero Image */}
              {data.imageUrl && data.imageUrl.trim() && (
                <div className="mb-12 -mx-6">
                  <div className="rounded-3xl overflow-hidden border border-gray-800 shadow-2xl shadow-black/40">
                    <img
                      src={data.imageUrl}
                      alt={data.title}
                      className="w-full h-auto object-cover"
                      style={{ aspectRatio: '16/9' }}
                    />
                  </div>
                </div>
              )}

              {/* TLDR Section */}
              {data.tldr && data.tldr.trim() && (
                <div className="mb-12 bg-gradient-to-br from-red-600/10 via-red-500/5 to-transparent border border-red-500/20 rounded-2xl p-6 md:p-8">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">⚡</span>
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-white mb-2">TL;DR</h3>
                      <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                        {data.tldr}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Content Sections */}
              <div className="space-y-8">
                {data.content?.sections?.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>Add sections in the editor to see content here</p>
                  </div>
                ) : (
                  data.content?.sections?.map((section, index) => (
                    <div key={index} className="space-y-4">
                      {section.heading && (
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                          {section.heading}
                        </h2>
                      )}
                      {section.text && (
                        <div className="text-base md:text-lg text-gray-400 leading-relaxed prose prose-invert prose-headings:text-white prose-p:text-gray-400 prose-strong:text-white prose-code:text-red-400 prose-code:bg-zinc-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm max-w-none">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                              strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                              code: ({ children, ...props }: { children?: React.ReactNode; inline?: boolean }) => {
                                const inline = props.inline;
                                if (inline) {
                                  return (
                                    <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono">
                                      {children}
                                    </code>
                                  );
                                }
                                return (
                                  <code className="text-gray-300 font-mono text-sm">{children}</code>
                                );
                              },
                              pre: ({ children }) => (
                                <pre className="bg-zinc-900 border border-gray-800 rounded-xl p-6 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre-wrap my-4">
                                  {children}
                                </pre>
                              ),
                              ul: ({ children }) => <ul className="list-none space-y-3 my-4">{children}</ul>,
                              li: ({ children }) => (
                                <li className="flex items-start gap-3">
                                  <span className="text-red-500 font-bold flex-shrink-0 mt-1">→</span>
                                  <span className="flex-1">{children}</span>
                                </li>
                              ),
                              ol: ({ children }) => <ol className="list-decimal list-inside space-y-3 my-4 ml-4">{children}</ol>,
                              h1: ({ children }) => <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-8">{children}</h1>,
                              h2: ({ children }) => <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 mt-6">{children}</h2>,
                              h3: ({ children }) => <h3 className="text-xl md:text-2xl font-bold text-white mb-3 mt-4">{children}</h3>,
                              blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-red-500/50 pl-4 italic text-gray-300 my-4">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {cleanCitationMarkers(section.text)}
                          </ReactMarkdown>
                        </div>
                      )}
                      {section.items && section.items.length > 0 && (
                        <ul className="space-y-3">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-3 text-gray-400">
                              <span className="text-red-500 font-bold flex-shrink-0 mt-1">→</span>
                              <span className="leading-relaxed">
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  components={{
                                    p: ({ children }) => <span>{children}</span>,
                                    strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                    code: ({ children }) => (
                                      <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono">
                                        {children}
                                      </code>
                                    ),
                                  }}
                                >
                                  {item}
                                </ReactMarkdown>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.code && (
                        <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 overflow-x-auto">
                          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                            {section.code}
                          </pre>
                        </div>
                      )}
                      {section.note && (
                        <div className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-xl p-6">
                          <p className="text-gray-300 leading-relaxed">
                            <span className="font-bold text-red-400">Note:</span>{' '}
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <span>{children}</span>,
                                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                                code: ({ children }) => (
                                  <code className="text-red-400 bg-zinc-900 px-1.5 py-0.5 rounded text-sm font-mono">
                                    {children}
                                  </code>
                                ),
                              }}
                            >
                              {section.note}
                            </ReactMarkdown>
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </AdminRoute>
  );
}
