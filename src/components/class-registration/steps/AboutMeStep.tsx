import React from 'react';

export const AboutMeStep: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="order-2 lg:order-1 text-center lg:text-left space-y-6">
        <h2 className="text-5xl md:text-6xl font-bold text-white">
          A Bit About Me
        </h2>

        <p className="text-3xl md:text-4xl font-bold text-white">
          Hi, I'm Ian McDonald
        </p>

        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          On January 1st, 2024, after losing my dad, I made a bet on myself. I decided to teach myself how to build apps with AI—no computer science degree, no bootcamp, just curiosity and refusing to quit when it got hard.
        </p>

        <div className="space-y-4">
          <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
            18 months later, I've built:
          </p>
          <ul className="text-lg md:text-xl text-gray-300 leading-relaxed space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold flex-shrink-0">→</span>
              <span>An AI platform serving nearly 2,000 active users</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold flex-shrink-0">→</span>
              <span>Enterprise tools used by real businesses</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-400 font-bold flex-shrink-0">→</span>
              <span>A growing waitlist for Launchbox—my platform that helps creators like me offer courses, education, tools, and community all in one place</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
        <div className="w-64 h-64 md:w-96 md:h-96 rounded-3xl overflow-hidden border-4 border-red-600 shadow-xl shadow-red-600/40">
          <img
            src="/iananddad.jpg"
            alt="Ian and his dad"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

