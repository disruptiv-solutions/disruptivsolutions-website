'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { openSignUpModal } from '@/components/SignUpModal';
import { trackFormSubmission } from '@/lib/analytics';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video' | 'all';
  icon: string;
  imageUrl?: string;
  published: boolean;
  createdAt?: string | { seconds: number; nanoseconds: number };
  lastUpdated?: string | { seconds: number; nanoseconds: number };
  userHasAccess?: boolean;
  requiredTier?: 'free' | 'premium' | null;
  accessLevel?: 'public' | 'free' | 'premium';
}

const typeLabels = {
  all: 'All Resources',
  article: 'Articles',
  'ad-landing': 'Ads / Landing Pages',
  blog: 'Blog Posts',
  prompts: 'Prompts',
  tool: 'Tools',
  guide: 'Guides',
  video: 'Videos',
};

const formatDate = (date: string | { seconds: number; nanoseconds: number } | undefined): string => {
  if (!date) return '';
  
  let dateObj: Date;
  
  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date && typeof date === 'object' && 'seconds' in date) {
    // Firestore Timestamp format
    dateObj = new Date(date.seconds * 1000);
  } else {
    return '';
  }
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // Format as "Month Day, Year" (e.g., "November 15, 2025")
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Free Class Signup Banner Component
const FreeClassSignupBanner: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedSession, setSelectedSession] = useState<string>('dec4');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const sessions = [
    { id: 'dec4', label: 'Dec 4th · 12:00 PM EST' },
    { id: 'dec6', label: 'Dec 6th · 12:00 PM EST' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedSession) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const selectedSessionData = sessions.find(s => s.id === selectedSession);

    const webhookData = {
      name,
      email,
      phone: 'N/A',
      selectedSession: selectedSessionData?.label || '',
      subscribeNewsletter: false,
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/class-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit signup. Please try again.');
      }

      setSubmitSuccess(true);
      trackFormSubmission('free_class_signup', {
        session_date: selectedSessionData?.label || '',
        with_newsletter: false,
        page_location: '/resources',
      });
      
      setName('');
      setEmail('');
      setSelectedSession('dec4');

      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-600/10 via-red-500/5 to-transparent border border-red-600/30 rounded-2xl p-6 mb-8">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 items-end">
          {/* Left: Info + Form Fields */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
              <p className="text-xs uppercase tracking-wider text-red-400 font-bold">Free Live Class</p>
            </div>
            <h3 className="text-2xl font-bold text-white">Join the Next AI App Building Class</h3>
            <p className="text-sm text-gray-400 max-w-2xl">
              Live session on shipping your first working AI app. Choose your preferred date and get started.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="bg-black/50 text-white rounded-lg border border-gray-700 h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="bg-black/50 text-white rounded-lg border border-gray-700 h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
              />
              <select
                value={selectedSession}
                onChange={(e) => setSelectedSession(e.target.value)}
                required
                className="bg-black/50 text-white rounded-lg border border-gray-700 h-11 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.label}
                  </option>
                ))}
              </select>
            </div>

            {submitSuccess && (
              <div className="p-3 rounded-lg bg-green-900/30 border border-green-600/50">
                <p className="text-green-400 text-sm font-medium">
                  ✓ Successfully signed up! Check your email for details.
                </p>
              </div>
            )}

            {submitError && (
              <div className="p-3 rounded-lg bg-red-900/30 border border-red-600/50">
                <p className="text-red-400 text-sm font-medium">{submitError}</p>
              </div>
            )}
          </div>

          {/* Right: CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="lg:self-end px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? 'Signing Up...' : 'Sign Up Free →'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default function ResourcesPage() {
  const { user, isAdmin } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'article' | 'ad-landing' | 'blog' | 'prompts' | 'tool' | 'guide' | 'video'>('all');
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, [user]);

  const fetchResources = async () => {
    try {
      setLoading(true);
      // Include userId in query params if user is logged in
      const url = user?.uid 
        ? `/api/resources?published=true&userId=${user.uid}`
        : '/api/resources?published=true';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        // Debug: inspect date fields coming from API
        if (Array.isArray(data.resources) && data.resources.length > 0) {
          console.log('[Resources] Sample resource from API:', {
            id: data.resources[0].id,
            createdAt: data.resources[0].createdAt,
            lastUpdated: data.resources[0].lastUpdated,
          });
        }
        setResources(data.resources || []);
      } else {
        setError('Failed to load resources');
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = activeFilter === 'all' 
    ? resources 
    : resources.filter(resource => resource.type === activeFilter);

  const handleLockedClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    openSignUpModal({ force: true });
  };

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-black pt-24 pb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 via-black to-black"></div>
        
        <div className="relative max-w-5xl mx-auto px-6 text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
            Free Resources
          </h1>
          <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto">
            Everything you need to start building AI-powered applications. Prompts, guides, tutorials, and tools.
          </p>
        </div>
      </section>

      {/* Resources List */}
      <section className="bg-black py-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Free Class Signup Banner */}
          <FreeClassSignupBanner />

          {/* Launchbox Waitlist Banner */}
          <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12">
                  <Image
                    src="/launchbox-no-text.png"
                    alt="Launchbox"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <p className="text-black font-semibold text-lg mb-1">
                    Join the Launchbox waitlist
                  </p>
                  <p className="text-gray-600 text-sm">
                    Be first to know when Launchbox goes live.
                  </p>
                </div>
              </div>
              <Link
                href="/waitlist"
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40 whitespace-nowrap inline-flex items-center gap-2"
              >
                Learn More
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
          
          <div>
          {loading ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">Loading resources...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchResources}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
              >
                Try Again
              </button>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400">No resources found in this category.</p>
              {activeFilter !== 'all' && (
                <button
                  onClick={() => setActiveFilter('all')}
                  className="mt-4 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
                >
                  View All Resources
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Resource Count */}
              <div className="mb-6">
                <p className="text-sm text-gray-400">
                  Showing {filteredResources.length + (activeFilter === 'all' || activeFilter === 'video' ? 1 : 0)} {filteredResources.length + (activeFilter === 'all' || activeFilter === 'video' ? 1 : 0) === 1 ? 'resource' : 'resources'}
                  {activeFilter !== 'all' && ` in ${typeLabels[activeFilter]}`}
                </p>
              </div>
              
              {/* Class Videos Card - Always show when filter is 'all' or 'video' */}
              {(activeFilter === 'all' || activeFilter === 'video') && (
                <Link
                  href="/class-videos"
                  className="group block"
                >
                  <div className="bg-zinc-900 border border-gray-800 rounded-xl p-6 transition-all duration-300 hover:border-red-600/50 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-red-600/10">
                    <div className="flex items-start gap-6">
                      {/* Icon */}
                        <div className="text-4xl flex-shrink-0 relative text-red-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            className="w-10 h-10"
                          >
                            <path
                              fill="currentColor"
                              d="M3 6.5A2.5 2.5 0 0 1 5.5 4h11A2.5 2.5 0 0 1 19 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 3 17.5v-11ZM8 9.97V14l4-2.02L8 9.97Z"
                            />
                          </svg>
                        </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-red-400 transition-colors">
                            Nov 13th and Nov 15th Free app building classes
                          </h3>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="px-3 py-1 bg-zinc-800 border border-gray-700 rounded-full text-xs font-semibold text-gray-400 whitespace-nowrap">
                              {typeLabels.video}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-400 leading-relaxed mb-3">
                          Watch recorded sessions from our AI app building workshops. Learn how to build your first AI-powered website with step-by-step guidance.
                        </p>
                        <div className="flex items-center gap-2 text-red-400 font-semibold text-sm group-hover:gap-3 transition-all">
                          <span>Watch Class Recordings</span>
                          <span>→</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {filteredResources.map((resource) => {
                // Check if resource is locked (user doesn't have access and is not admin)
                const isLocked = !isAdmin && resource.userHasAccess === false;
                const lockType = isLocked ? (resource.requiredTier === 'premium' ? 'premium' : 'free') : null;

                return (
                <Link
                  key={resource.id}
                  href={`/resources/${resource.id}`}
                  className="group block"
                  onClick={isLocked ? handleLockedClick : undefined}
                  aria-disabled={isLocked}
                >
                    <div className={`bg-zinc-900 border rounded-xl p-6 transition-all duration-300 ${
                      isLocked 
                        ? 'border-yellow-600/50 bg-zinc-900/60 opacity-75 hover:border-yellow-600/70 hover:bg-zinc-800/60' 
                        : 'border-gray-800 hover:border-red-600/50 hover:bg-zinc-800/80 hover:shadow-lg hover:shadow-red-600/10'
                    }`}>
                      <div className="flex items-start gap-6">
                        {/* Icon with lock overlay */}
                        <div className="text-5xl flex-shrink-0 relative">
                          {resource.icon}
                          {isLocked && (
                            <div className="absolute -top-1 -right-1 bg-yellow-600 rounded-full p-1">
                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className={`text-xl md:text-2xl font-bold transition-colors ${
                              isLocked 
                                ? 'text-gray-500' 
                                : 'text-white group-hover:text-red-400'
                            }`}>
                              {resource.title}
                            </h3>
                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                              <span className="px-3 py-1 bg-zinc-800 border border-gray-700 rounded-full text-xs font-semibold text-gray-400 whitespace-nowrap">
                                {typeLabels[resource.type]}
                              </span>
                              {isLocked && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${
                                  lockType === 'premium'
                                    ? 'bg-purple-600/20 text-purple-400 border border-purple-600/30'
                                    : 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                }`}>
                                  {lockType === 'premium' ? '🔒 Premium' : '🔒 Free'}
                                </span>
                              )}
                              {(resource.lastUpdated || resource.createdAt) && (
                                <span className="text-[11px] text-gray-500">
                                  Updated{' '}
                                  {formatDate(
                                    (resource.lastUpdated ||
                                      resource.createdAt) as
                                      | string
                                      | { seconds: number; nanoseconds: number }
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className={`leading-relaxed mb-3 ${isLocked ? 'text-gray-500' : 'text-gray-400'}`}>
                            {resource.description}
                          </p>
                          <div className={`flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all ${
                            isLocked
                              ? 'text-yellow-500'
                              : 'text-red-400'
                          }`}>
                            <span>{isLocked ? 'Locked Content' : 'View Resource'}</span>
                            <span>→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-black py-16 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent border border-red-500/30 rounded-3xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Want More Resources?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join my newsletter to get new resources, tutorials, and AI building tips delivered to your inbox every week.
            </p>
            <a
              href="https://newsletter.example.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
            >
              Subscribe to Newsletter →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

