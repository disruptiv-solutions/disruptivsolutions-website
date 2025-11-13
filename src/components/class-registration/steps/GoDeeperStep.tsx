import React, { useState, useEffect } from 'react';
import { FeedbackModal } from './FeedbackModal';

const COHORT_URL = 'https://ianmcdonald.ai/cohort';
const CONSULTING_URL = 'https://ianmcdonald.ai/consulting';

const openLink = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

// Countdown timer hook - 48 hours from component mount
const useCountdown = (hours: number) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: hours,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const endTime = Date.now() + hours * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = endTime - now;

      if (difference <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }

      const hoursLeft = Math.floor(difference / (1000 * 60 * 60));
      const minutesLeft = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hours]);

  return timeLeft;
};

export const GoDeeperStep: React.FC = () => {
  const countdown = useCountdown(48);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-6xl mx-auto space-y-4 pb-20 w-full">
      <div className="text-center space-y-2">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Ready to Go Deeper?
        </h2>
        <p className="text-base md:text-lg text-gray-300">
          Take your AI app development skills to the next level.
        </p>
      </div>

      {/* Consulting Rate & Group Cohort */}
      <div className="bg-gradient-to-br from-red-700/30 via-red-600/20 to-transparent border-2 border-red-500/50 rounded-2xl p-5 space-y-4 shadow-xl shadow-red-700/30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Consulting */}
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border-2 border-red-500/40 rounded-2xl p-5 flex flex-col space-y-4 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all">
            <div className="flex items-center gap-3">
              <div className="text-3xl">💼</div>
              <h5 className="text-xl font-bold text-white">
                1-on-1 Consulting
              </h5>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed flex-1">
              90-minute consulting session tailored to your app idea or business use case. Get personalized guidance on your next build.
            </p>
            <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-3">
              <p className="text-2xl font-bold text-red-400">$197</p>
              <p className="text-xs text-gray-400">per session</p>
            </div>
            <button
              type="button"
              onClick={() => openLink(CONSULTING_URL)}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-sm shadow-lg shadow-red-600/40 mt-auto"
            >
              Book Consulting →
            </button>
          </div>

          {/* Group Cohort */}
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border-2 border-red-500/40 rounded-2xl p-5 flex flex-col space-y-4 shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 transition-all relative overflow-hidden">
            {/* Countdown Timer in top right */}
            <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg">
              <div className="text-[10px] text-red-100 mb-0.5">Offer ends in</div>
              <div className="flex items-center gap-1">
                <span className="font-bold">{String(countdown.hours).padStart(2, '0')}</span>
                <span>:</span>
                <span className="font-bold">{String(countdown.minutes).padStart(2, '0')}</span>
                <span>:</span>
                <span className="font-bold">{String(countdown.seconds).padStart(2, '0')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl">👥</div>
              <h5 className="text-xl font-bold text-white">
                Group Cohort
              </h5>
            </div>
            <p className="text-gray-300 text-xs leading-relaxed flex-1">
              4-week intensive with live sessions. Master the core fundamentals of AI app development with direct feedback in a small group.
            </p>
            <div className="bg-red-600/20 border border-red-500/30 rounded-xl p-3">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-400 text-sm line-through">$497</span>
                <p className="text-2xl font-bold text-red-400">$297</p>
              </div>
              <p className="text-xs text-gray-400 mt-1">Workshop attendee pricing</p>
            </div>
            
            <button
              type="button"
              onClick={() => openLink(COHORT_URL)}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-sm shadow-lg shadow-red-600/40 mt-auto"
            >
              Join Group Cohort →
            </button>
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-4 text-center space-y-2 mt-6">
        <h4 className="text-xl font-bold text-white flex items-center justify-center gap-2">
          📝 Help me improve
        </h4>
        <p className="text-gray-300 text-xs">
          2-minute survey — What did you think? What do you want to learn next?
        </p>
        <button
          type="button"
          onClick={() => setIsFeedbackModalOpen(true)}
          className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all text-sm"
        >
          Share Your Feedback →
        </button>
      </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
};

