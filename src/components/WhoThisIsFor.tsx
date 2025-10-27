'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const WhoThisIsFor: React.FC = () => {
  return (
    <section 
      id="who-this-is-for"
      className="min-h-screen flex items-center justify-center bg-black snap-start snap-always"
      style={{ scrollMarginTop: '80px' }}
    >
      <div className="max-w-4xl mx-auto px-6 py-20 w-full">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-10">
          You're Exactly Where I Was 12 Months Ago
        </h2>
        
        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
          <div className="space-y-4">
            <p className="text-xl flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>You know you're capable of more</span>
            </p>
            <p className="text-xl flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>You have ideas but don't know where to start</span>
            </p>
            <p className="text-xl flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>You're tired of tutorials that don't lead anywhere</span>
            </p>
            <p className="text-xl flex items-start gap-3">
              <span className="text-red-600 font-bold">→</span>
              <span>You want to build something real, not just learn syntax</span>
            </p>
          </div>
          
          <p className="text-xl text-white font-semibold mt-8">
            Imposter syndrome is expensive.
          </p>
          
          <p>
            I spent years thinking I wasn't "technical enough." Then I built something 1,500+ people use daily.
          </p>
          
          <p>
            You don't need perfect code. You don't need years of experience.
          </p>
          
          <p className="text-white text-xl font-semibold">
            You need to start messy and build something today.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhoThisIsFor;

