'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import RotatingText from './RotatingText';

const Hero: React.FC = () => {

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden snap-start snap-always" style={{ scrollMarginTop: '80px', paddingTop: '80px' }}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full" style={{ clipPath: 'inset(80px 0 0 0)' }}>
        <video
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.5) contrast(1.1)' }}
        >
          <source src="/ian.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay from right */}
        <div className="absolute inset-0 bg-gradient-to-l from-black via-black/70 to-transparent"></div>
      </div>

      <div className="w-full relative z-10 px-6 pt-72 flex items-center justify-end" style={{ minHeight: 'calc(100vh - 80px)' }}>
        {/* Content aligned to the right */}
        <div className="space-y-8 lg:text-right max-w-2xl lg:mr-12">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              You Don&apos;t Need a CS Degree
              <br />
              <RotatingText 
                texts={['to Build Real Apps', 'to Start Shipping', 'to Create Value', 'to Build Your Dream']}
                mainClassName="inline-block px-2 sm:px-2 md:px-3 bg-gradient-to-r from-red-600 to-red-700 text-white overflow-hidden py-0.5 sm:py-1 md:py-2 rounded-lg"
                staggerFrom={"last"}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2000}
              />
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed">
              You just need to start messy and build something today.
              <br /><br />
              I went from barely making rent to building an AI platform with 1,500+ active users—not because I&apos;m special, but because I stopped waiting for permission.
              <br /><br />
              Now I teach others to do the same.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col lg:flex-row gap-4 pt-4">
              <button
                onClick={() => document.getElementById('launchbox')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 border-2 border-red-600 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 hover:border-red-700 transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:scale-105 transform flex items-center justify-center whitespace-nowrap"
              >
                Join the LaunchBox Waitlist
              </button>
            </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center animate-bounce">
        <svg
          className="w-6 h-6 text-gray-500"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
