import React, { useState } from 'react';
import { FeedbackModal } from './FeedbackModal';

const JOIN_WAITLIST_URL = 'https://www.ianmcdonald.ai/waitlist';

const handleOpen = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

export const GoDeeperStep: React.FC = () => {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-[calc(100vh-220px)] flex items-center px-2">
        <div className="max-w-6xl mx-auto space-y-5 w-full">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Go Deeper?
            </h2>
            <p className="text-sm md:text-base text-gray-300">
              Bring what you built today into a real product, community, or offer with Launchbox.
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
              <span className="italic"> "Consulting / Cohort Interest" </span>
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

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

