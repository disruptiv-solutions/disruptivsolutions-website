'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getNewsletterByDate } from '@/data/newsletter-issues';
import {
  LAUNCHBOX_SITE_URL,
  LAUNCHBOX_PROMO_SHORT,
  LAUNCHBOX_PROMO_LONG,
  LAUNCHBOX_CTA_LABEL,
  LAUNCHBOX_LINK_NEW_TAB,
} from '@/lib/launchbox-marketing';
import { getExternalLinkProps } from '@/lib/external-link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function NewsletterDatePage() {
  const params = useParams();
  const dateSlug = params.date as string;
  const issue = dateSlug ? getNewsletterByDate(dateSlug) : null;

  if (!issue) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-500 text-xl font-light mb-6">Newsletter issue not found.</p>
          <Link
            href="/newsletter-directory"
            className="text-white border-b border-white pb-1 hover:text-red-500 hover:border-red-500 transition-colors uppercase tracking-widest text-sm font-bold"
          >
            Return to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen font-sans selection:bg-red-500/30">
      {/* Editorial Header */}
      <header className="w-full max-w-[90rem] mx-auto px-6 pt-32 md:pt-48 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Left Meta Column */}
          <div className="lg:col-span-3 flex flex-col justify-between order-2 lg:order-1">
            <Link
              href="/newsletter-directory"
              className="text-zinc-500 hover:text-white transition-colors uppercase tracking-widest text-xs font-bold mb-12 inline-block w-fit"
            >
              ← Archive
            </Link>
            
            <div className="space-y-8">
              <div>
                <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">Published</p>
                <p className="text-zinc-300 text-lg font-light">{issue.displayDate}</p>
              </div>
              <div>
                <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-2">Author</p>
                <p className="text-zinc-300 text-lg font-light">Ian McDonald</p>
              </div>
            </div>
          </div>

          {/* Right Title Column */}
          <div className="lg:col-span-9 order-1 lg:order-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-black text-white leading-[1.05] tracking-tighter mb-8 lg:mb-12">
              {issue.title}
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-zinc-400 font-light leading-[1.4] max-w-4xl">
              {issue.description}
            </p>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <main className="w-full max-w-[90rem] mx-auto px-6 py-16 md:py-24 border-t border-zinc-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Left Sticky Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-32">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-6 grayscale opacity-80 border border-zinc-800">
                <img 
                  src="/default-avatar.svg" 
                  alt="Ian McDonald" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Ian+McDonald&background=000000&color=ffffff'; }} 
                />
              </div>
              <p className="text-white font-bold text-lg">Ian McDonald</p>
              <p className="text-zinc-500 text-sm mt-1 leading-relaxed max-w-[180px]">
                Builder, Founder of LaunchBox — white-label community and course platform at launchbox.space.
              </p>
            </div>
          </div>

          {/* Main Reading Column */}
          <div className="lg:col-span-7 max-w-[65ch]">
            {issue.content?.sections && issue.content.sections.length > 0 ? (
              <div className="space-y-16">
                {issue.content.sections.map((section, index) => (
                  <div key={index} className="newsletter-section">
                    {section.heading && (
                      <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-8">
                        {section.heading}
                      </h2>
                    )}
                    
                    {section.text && (
                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({children}) => <p className="mb-8 last:mb-0 text-[1.15rem] md:text-[1.25rem] font-light leading-[1.8] text-zinc-300">{children}</p>,
                            strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
                            a: ({ children, href }) => (
                              <a
                                href={href}
                                className="text-white border-b border-zinc-700 hover:border-white transition-colors"
                                {...getExternalLinkProps(href)}
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {section.text}
                        </ReactMarkdown>
                      </div>
                    )}

                    {section.items && section.items.length > 0 && (
                      <ul className="mt-8 mb-12 space-y-6">
                        {section.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-6">
                            <span className="text-zinc-600 font-mono text-sm mt-2">{(i + 1).toString().padStart(2, '0')}</span>
                            <div className="text-[1.15rem] md:text-[1.25rem] font-light leading-[1.8] text-zinc-300">
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]} 
                                components={{
                                  p: ({ children }) => <span className="m-0">{children}</span>,
                                  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                                  a: ({ children, href }) => (
                                    <a
                                      href={href}
                                      className="text-white border-b border-zinc-700 hover:border-white transition-colors"
                                      {...getExternalLinkProps(href)}
                                    >
                                      {children}
                                    </a>
                                  ),
                                }}
                              >
                                {item as string}
                              </ReactMarkdown>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.note && (
                      <div className="my-16 pl-8 border-l-2 border-red-600 py-2">
                        <p className="text-[1.15rem] md:text-[1.25rem] font-light leading-[1.8] text-zinc-400 italic">
                          <strong className="font-bold text-white not-italic mr-2">Note:</strong> 
                          {section.note}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-500 font-light text-xl">Content coming soon.</p>
            )}

            {/* Mobile Author Block */}
            <div className="mt-24 pt-12 border-t border-zinc-900 lg:hidden flex items-center gap-6">
              <div className="w-16 h-16 rounded-full overflow-hidden grayscale opacity-80 border border-zinc-800 flex-shrink-0">
                <img 
                  src="/default-avatar.svg" 
                  alt="Ian McDonald" 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Ian+McDonald&background=000000&color=ffffff'; }} 
                />
              </div>
              <div>
                <p className="text-white font-bold text-lg">Ian McDonald</p>
                <p className="text-zinc-500 text-sm mt-1">Builder, Founder of LaunchBox · launchbox.space</p>
              </div>
            </div>

            {/* Mobile LaunchBox Promo Block */}
            <div className="mt-12 lg:hidden border border-zinc-800 bg-zinc-950 p-8 relative font-satoshi">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
              <h3 className="text-white font-bold text-2xl tracking-tight mb-3">LaunchBox</h3>
              <p className="text-zinc-400 text-base leading-relaxed mb-6">
                {LAUNCHBOX_PROMO_SHORT}
              </p>
              <a
                href={LAUNCHBOX_SITE_URL}
                {...LAUNCHBOX_LINK_NEW_TAB}
                className="inline-flex items-center text-sm font-bold text-white uppercase tracking-widest hover:text-red-500 transition-colors"
                aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
              >
                {LAUNCHBOX_CTA_LABEL} <span className="ml-2">→</span>
              </a>
            </div>
          </div>
          
          {/* Right Sticky Sidebar (Promo - Desktop) */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32">
              <div className="border border-zinc-800 bg-zinc-950 p-8 relative group hover:border-zinc-700 transition-colors font-satoshi">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
                <h3 className="text-white font-bold text-xl tracking-tight mb-3">LaunchBox</h3>
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {LAUNCHBOX_PROMO_SHORT}
                </p>
                <a
                  href={LAUNCHBOX_SITE_URL}
                  {...LAUNCHBOX_LINK_NEW_TAB}
                  className="inline-flex items-center text-xs font-bold text-white uppercase tracking-widest hover:text-red-500 transition-colors"
                  aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
                >
                  {LAUNCHBOX_CTA_LABEL} <span className="ml-2">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Brutalist Footer CTA */}
      <footer className="w-full bg-white text-black py-24 md:py-32 px-6 mt-12">
        <div className="max-w-[90rem] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Newsletter CTA */}
            <div className="text-left">
              <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 uppercase leading-none">
                Build Real <br className="hidden md:block" /> Things.
              </h2>
              <p className="text-xl md:text-2xl font-light text-zinc-600 mb-12 max-w-xl leading-relaxed">
                Get practical AI insights, what I&apos;m building, and lessons from the trenches delivered to your inbox.
              </p>
              <Link
                href="/newsletter"
                className="inline-block bg-black text-white px-10 py-6 text-sm md:text-base font-bold hover:bg-red-600 transition-colors uppercase tracking-[0.2em]"
              >
                Subscribe Now
              </Link>
            </div>

            {/* Right: LaunchBox Promo */}
            <div className="border-4 border-black p-10 md:p-16 relative bg-zinc-50 group hover:-translate-y-2 transition-transform duration-300 font-satoshi">
              <div className="absolute top-0 left-0 w-full h-2 bg-red-600" />
              <p className="text-red-600 font-bold tracking-widest uppercase text-sm mb-4">Your platform</p>
              <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6">LaunchBox</h3>
              <p className="text-xl text-zinc-600 font-light leading-relaxed mb-8 max-w-lg">
                {LAUNCHBOX_PROMO_LONG}
              </p>
              <a
                href={LAUNCHBOX_SITE_URL}
                {...LAUNCHBOX_LINK_NEW_TAB}
                className="inline-flex items-center text-black font-bold uppercase tracking-[0.15em] hover:text-red-600 transition-colors border-b-2 border-black hover:border-red-600 pb-1"
                aria-label={`${LAUNCHBOX_CTA_LABEL} at launchbox.space`}
              >
                {LAUNCHBOX_CTA_LABEL} <span className="ml-3 text-xl">→</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
