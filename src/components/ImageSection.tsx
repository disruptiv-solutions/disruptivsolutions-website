'use client';

import React, { useRef, useEffect, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import LightRays from './LightRays';

interface ImageSectionProps {
  imagePath?: string;
  alt?: string;
}

const approaches = [
  {
    title: 'Start Messy',
    description: "There's nothing you can imagine that you can't start building. Not everything needs to be perfect or a billion-dollar idea. Ship something today."
  },
  {
    title: 'Build Real Solutions',
    description: 'Products that non-technical people actually use. I ship features, fix bugs, and teach people to build real apps. No jargon, no fluff.'
  },
  {
    title: 'Compound Your Skills',
    description: 'Every build teaches you something. Weekend projects become portfolio pieces. Portfolio pieces become confidence. Confidence becomes momentum.'
  },
  {
    title: 'Learn in Public',
    description: 'From Disruptiv Solutions to ChatterCard to the Real AI platform to LaunchBox—every project taught me something I used in the next one. Share your journey. Help others avoid your mistakes.'
  }
];

const ImageSection: React.FC<ImageSectionProps> = ({ 
  imagePath = '/ian-stage.jpg', 
  alt = 'Image' 
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [sectionHeight, setSectionHeight] = useState(800); // Safe default for SSR
  const [tilt, setTilt] = useState({ x: -5, y: 8 }); // Default tilt for 3D effect

  useEffect(() => {
    // Set the actual section height on client mount
    if (typeof window !== 'undefined') {
      setSectionHeight(window.innerHeight - 65);
    }

    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionHeight = section.offsetHeight;
      
      // Calculate scroll progress: 0 to 1 through the section
      const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      setScrollProgress(progress);
    };

    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setSectionHeight(window.innerHeight - 65);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Separate useEffect for card tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const tiltX = (e.clientY - centerY) / 10;
      const tiltY = (centerX - e.clientX) / 10;
      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: -5, y: 8 }); // Return to default tilt
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Calculate which approach should be centered based on scroll
  const getActiveIndex = () => {
    // Adjusted thresholds to make "Learn in Public" display longer
    if (scrollProgress <= 0.2) return 0; // Start Messy: 0-20%
    if (scrollProgress < 0.4) return 1;  // Build Real Solutions: 20-40%
    if (scrollProgress < 0.6) return 2;  // Compound Your Skills: 40-60%
    return 3; // Learn in Public: 60-100% (longer display)
  };

  const activeIndex = getActiveIndex();

  return (
    <section 
      ref={sectionRef}
      id="image-section"
      className="bg-black snap-start relative"
      style={{ 
        height: 'calc((100vh - 65px) * 4)',
        minHeight: '100vh'
      }}
    >
      <div className="sticky top-0 w-full h-screen relative">
        {/* Light Rays Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ef4444"
            raysSpeed={1.5}
            lightSpread={0.6}
            rayLength={1.5}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>
        {/* Content */}
        <div className="relative z-10 w-full h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center pt-[65px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full h-full">
            {/* Left: Scroll Reveal Container - matches image height */}
            <div className="relative h-full flex items-center justify-center overflow-hidden" style={{ height: 'calc(100vh - 65px)' }}>
              <div className="relative w-full" style={{ height: 'calc((100vh - 65px) * 4)' }}>
                {approaches.map((approach, index) => {
                  const isActive = index === activeIndex;
                  // Each approach takes up 1/4 of the scroll height
                  const offset = (index - activeIndex) * sectionHeight;
                  
                  return (
                    <div
                      key={index}
                      className="absolute inset-0 flex items-center justify-center transition-opacity duration-500"
                      style={{
                        transform: `translateY(${offset}px)`,
                        opacity: isActive ? 1 : 0.3,
                        pointerEvents: isActive ? 'auto' : 'none' as const
                      }}
                    >
                      <div className="max-w-xl text-center px-4 space-y-6">
                        {isActive && (
                          <>
                            <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                              {approach.title}
                            </h3>
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {approach.description}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Image Card - fixed height matching scroll container */}
            <div className="hidden lg:flex relative w-full justify-end items-center h-full">
              <div className="relative w-full lg:w-auto lg:max-w-2xl">
                <div 
                  ref={cardRef}
                  className="relative rounded-2xl overflow-hidden transition-transform duration-300 ease-out cursor-pointer"
                  style={{
                    transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1, 1, 1)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Glowing border effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 via-red-400/30 to-red-600/50 rounded-2xl blur-xl opacity-50 transition-opacity duration-300 hover:opacity-75"></div>
                  
                  {/* Glassmorphism card */}
                  <div className="relative rounded-2xl overflow-hidden border border-red-600/30 bg-gradient-to-br from-gray-900/40 via-black/60 to-black backdrop-blur-xl shadow-2xl hover:border-red-500/50 transition-all duration-300"
                       style={{ 
                         boxShadow: '0 25px 50px -12px rgba(239, 68, 68, 0.25), 0 0 100px -20px rgba(239, 68, 68, 0.15)' 
                       }}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10"></div>
                    <img
                      src={imagePath}
                      alt={alt}
                      className="w-full lg:w-auto h-auto object-contain relative z-0"
                      style={{ 
                        maxHeight: 'calc(100vh - 100px)',
                        aspectRatio: '1188 / 1485',
                        maxWidth: '100%'
                      }}
                    />
                  </div>
                  
                  {/* Floating shadow */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-red-600/20 blur-2xl rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default ImageSection;

