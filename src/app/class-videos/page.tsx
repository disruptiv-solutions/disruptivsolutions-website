'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FeedbackModal } from '@/components/class-registration/steps/FeedbackModal';

export default function ClassVideosPage() {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Free AI App Building Classes
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Watch recorded sessions from our AI app building workshops
            </p>
          </div>

          {/* Waitlist Banner */}
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
                    You're on the Launchbox waitlist
                  </p>
                  <p className="text-gray-600 text-sm">
                    Thanks for joining! You'll be first to know when Launchbox goes live.
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

          {/* Video 1 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Nov 15th AI App Building Class</h2>
            <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/BealDwGLVU8"
                title="Nov 15th AI App building class"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Video 2 */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11/13/25 Video</h2>
            <div className="aspect-video rounded-xl overflow-hidden bg-zinc-900">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/G8Jcyc3qWZo"
                title="11/13/25 video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>

          {/* Interactive Presentation Link */}
          <div className="mb-8 bg-zinc-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-3">Follow Along</h3>
            <p className="text-gray-400 mb-4">
              Want to follow along with the interactive presentation from the class?
            </p>
            <Link
              href="/free-class/1"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
            >
              Follow along with the interactive presentation here
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

          {/* Share Feedback Button */}
          <div className="text-center">
            <button
              onClick={() => setIsFeedbackModalOpen(true)}
              className="px-8 py-4 bg-zinc-900 border border-gray-800 text-white font-semibold rounded-xl hover:bg-zinc-800 hover:border-gray-700 transition-all"
            >
              Share Feedback
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}
