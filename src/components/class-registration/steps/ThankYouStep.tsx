import React from 'react';

export const ThankYouStep: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center pb-20 w-full flex items-center justify-center min-h-[calc(100vh-220px)]">
      <div className="space-y-8">
        <h2 className="text-6xl md:text-8xl font-bold text-white animate-fade-in">
          Thank You! 🙏
        </h2>
        <p className="text-2xl md:text-3xl text-gray-300 animate-fade-in delay-100">
          You just built an AI-powered website. That&apos;s a big deal.
        </p>
        <p className="text-lg md:text-xl text-gray-400 animate-fade-in delay-200 max-w-2xl mx-auto">
          Keep building, keep experimenting, and don&apos;t let this be the last thing you create with AI.
        </p>
        <p className="text-sm md:text-base text-gray-500 animate-fade-in delay-300 max-w-2xl mx-auto pt-4">
          P.S. If you already know you want more of this, you can join my Launchbox Founding Member List and lock in the lowest pricing when it launches. I&apos;ll send the link in the follow-up email.
        </p>
      </div>
    </div>
  );
};

