'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const LaunchBox: React.FC = () => {
  const handleWaitlist = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="launchbox"
      className="min-h-screen flex items-center justify-center bg-black snap-start snap-always"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <div className="mb-8">
          <span className="inline-block px-4 py-2 bg-red-600/20 border border-red-600 rounded-full text-red-400 text-sm font-semibold">
            Currently building in public with 50+ early members
          </span>
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          LaunchBox: Build Your First AI App in 30 Days
        </h2>
        
        <p className="text-xl text-gray-300 mb-10">
          Tools + Training + Community for people who are tired of just learning.
        </p>
        
        <div className="space-y-6 mb-10">
          <h3 className="text-2xl font-bold text-white">What You Get:</h3>
          <div className="space-y-4 text-gray-300 text-lg">
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>Working AI tools (chat, image, video, newsletter)</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>Step-by-step builds you can actually finish</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>A community of builders who get it</span>
            </p>
            <p className="flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>First app deployed in 30 days or I help you fix it</span>
            </p>
          </div>
        </div>
        
        <p className="text-lg text-gray-400 italic mb-8">
          Not perfect. Just real, working software.
        </p>
        
        <button
          onClick={handleWaitlist}
          className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:scale-105 transform whitespace-nowrap"
        >
          Join the Waitlist - Launching Q1 2025
        </button>
      </div>
    </section>
  );
};

export default LaunchBox;

