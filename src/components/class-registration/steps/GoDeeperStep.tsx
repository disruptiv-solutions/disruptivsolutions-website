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
        <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full">
          <div className="text-center space-y-3">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Ready to Go Deeper?
          </h2>
          <p className="text-base md:text-lg text-gray-300">
            Bring what you built today into a real product, community, or offer with Launchbox.
          </p>
          </div>

          <div className="bg-gradient-to-br from-red-600/25 via-red-500/10 to-transparent border border-red-500/40 rounded-[28px] p-6 md:p-10 shadow-[0_0_45px_rgba(248,113,113,0.35)] space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs tracking-[0.35em] uppercase text-red-300 font-semibold">
                Launchbox First
              </p>
              <h3 className="text-3xl md:text-[2.5rem] font-bold text-white leading-tight">
                🚀 Launchbox for Builders
              </h3>
              <p className="text-gray-100/90 text-base md:text-lg leading-relaxed">
                The platform I&apos;m building for creators who want to offer{' '}
                <span className="font-semibold text-white">courses, workshops, community, and AI tools</span>{' '}
                all in one place. Turn what you built today into something you can run, sell, and scale.
              </p>
              <ul className="space-y-2 text-gray-200 text-base md:text-lg">
                <li className="flex gap-2">
                  <span className="text-red-400">•</span>
                  <span className="leading-relaxed">
                    Host live & recorded workshops<br className="md:hidden" /> <span className="text-gray-400 text-sm md:text-base">Run sessions like this under your own brand.</span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">•</span>
                  <span className="leading-relaxed">
                    Sell digital products & tools<br className="md:hidden" /> <span className="text-gray-400 text-sm md:text-base">Templates, prompts, mini-apps, and more.</span>
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-400">•</span>
                  <span className="leading-relaxed">
                    Build a real community hub<br className="md:hidden" /> <span className="text-gray-400 text-sm md:text-base">Keep your people in one place instead of scattered tools.</span>
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3 min-w-[220px]">
              <button
                type="button"
                onClick={() => handleOpen(JOIN_WAITLIST_URL)}
                className="inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-base font-semibold text-white hover:bg-red-500 transition-colors"
              >
                Join the Launchbox Waitlist →
              </button>
              <p className="text-xs text-gray-400 lg:text-right max-w-sm">
                Workshop attendees get first access, feature priority, and early pricing when Launchbox goes live.
              </p>
            </div>
          </div>
        </div>

          <div className="bg-zinc-900/70 border border-gray-800 rounded-2xl p-4 md:p-5">
          <p className="text-sm text-gray-200 leading-relaxed">
            <span className="font-semibold text-white">Want direct help from me?</span> If you&apos;re interested in{' '}
            <span className="font-medium">1-on-1 consulting</span> or joining a future{' '}
            <span className="font-medium">group cohort</span>, email{' '}
            <span className="font-mono text-red-300">ian@ianmcdonald.ai</span> with the subject line
            <span className="italic"> “Consulting / Cohort Interest” </span>
            and one sentence about what you&apos;re building.
          </p>
          </div>

          <div className="bg-zinc-900/80 border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <span role="img" aria-label="clipboard">
                  📝
                </span>
                Help me improve
              </p>
              <p className="text-gray-400 text-sm">
                2-minute survey — What did you think? What do you want to learn next?
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-500 transition-colors"
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

