import React from 'react';

export const ThankYouStep: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto text-center pb-20 w-full flex items-center justify-center min-h-[60vh]">
      <div className="space-y-6">
        <h2 className="text-6xl md:text-8xl font-bold text-white animate-fade-in">
          Thank You! 🙏
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 animate-fade-in">
          I hope you enjoyed building your first AI-powered website.
        </p>
        <p className="text-lg md:text-xl text-gray-400 animate-fade-in">
          Keep building, keep learning, and keep creating amazing things!
        </p>
      </div>
    </div>
  );
};

