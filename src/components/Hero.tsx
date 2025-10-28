'use client';

/* eslint-disable react/no-unescaped-entities */
import React, { useRef, useEffect } from 'react';
import RotatingText from './RotatingText';

const Hero: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null) as React.RefObject<HTMLElement>;
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When hero section is fully/significantly visible (snapped into view)
          if (entry.isIntersecting && entry.intersectionRatio > 0.7) {
            // Only play if we haven't played yet for this entry
            if (!hasPlayedRef.current) {
              video.currentTime = 0;
              video.play().catch((error) => {
                console.warn('Video autoplay failed:', error);
              });
              hasPlayedRef.current = true;
            }
          } else if (!entry.isIntersecting || entry.intersectionRatio < 0.3) {
            // Reset flag when section is no longer visible
            hasPlayedRef.current = false;
          }
        });
      },
      {
        threshold: [0, 0.3, 0.7, 1],
        rootMargin: '0px'
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative h-screen lg:min-h-screen flex items-center justify-center bg-black snap-start" style={{ overflow: 'hidden' }}>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
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

      {/* Content wrapper positioned correctly */}
      <div className="w-full relative px-6 pt-[85px] pb-6 lg:pt-72 flex items-center justify-end h-full" style={{ zIndex: 10 }}>
        {/* Content aligned to the right */}
        <div className="space-y-4 lg:space-y-8 lg:text-right max-w-2xl lg:mr-12 w-full">
            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-3 lg:mb-6">
              Ian McDonald
              <br />
              <span className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-normal text-gray-300">
                AI App Entrepreneur & Builder
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-2xl leading-relaxed mb-3 lg:mb-8">
              I teach non-technical people to build AI apps that actually work.
              <br /><br />
              From side hustles to enterprise platforms with 1,500+ users—I build in public and show others how to do the same.
              <br /><br />
              <span className="text-white font-semibold">Currently building: LaunchBox</span>
            </p>

            {/* CTAs */}
            <div className="hidden lg:flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const launchbox = document.getElementById('launchbox');
                  if (launchbox) {
                    const rect = launchbox.getBoundingClientRect();
                    const scrollPosition = window.scrollY + rect.top;
                    // Scroll to start of LaunchBox section (card 0)
                    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
              >
                Join LaunchBox Waitlist
              </button>
              <button
                onClick={() => {
                  const launchbox = document.getElementById('launchbox');
                  if (launchbox) {
                    const rect = launchbox.getBoundingClientRect();
                    const sectionHeight = window.innerHeight * 3;
                    const scrollPosition = window.scrollY + rect.top + (sectionHeight / 3);
                    // Scroll to 1/3 through LaunchBox section (card 1 - Free Class)
                    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-gray-300 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Free Class
              </button>
              <button
                onClick={() => {
                  const launchbox = document.getElementById('launchbox');
                  if (launchbox) {
                    const rect = launchbox.getBoundingClientRect();
                    const sectionHeight = window.innerHeight * 3;
                    const scrollPosition = window.scrollY + rect.top + (sectionHeight * 2 / 3);
                    // Scroll to 2/3 through LaunchBox section (card 2 - Newsletter)
                    window.scrollTo({ top: scrollPosition, behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-gray-300 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Join My Newsletter
              </button>
            </div>

        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 lg:bottom-12 left-0 right-0 flex justify-center animate-bounce" style={{ zIndex: 10 }}>
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
