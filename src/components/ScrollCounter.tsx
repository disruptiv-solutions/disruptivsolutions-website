'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const approaches = [
  {
    number: 1,
    title: 'Start Messy',
    description: "There's nothing you can imagine that you can't start building. Not everything needs to be perfect or a billion-dollar idea. Ship something today."
  },
  {
    number: 2,
    title: 'Build Real Solutions',
    description: 'Products that non-technical people actually use. I ship features, fix bugs, and teach people to build real apps. No jargon, no fluff.'
  },
  {
    number: 3,
    title: 'Compound Your Skills',
    description: 'Every build teaches you something. Weekend projects become portfolio pieces. Portfolio pieces become confidence. Confidence becomes momentum.'
  },
  {
    number: 4,
    title: 'Learn in Public',
    description: 'From Disruptiv Solutions to ChatterCard to the Real AI platform to LaunchBox—every project taught me something I used in the next one. Share your journey. Help others avoid your mistakes.'
  }
];

const ScrollCounter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const approachElements = Array.from(containerRef.current.querySelectorAll('.approach-item'));
    const totalItems = approachElements.length;
    
    // Set initial states
    approachElements.forEach((el, index) => {
      gsap.set(el, {
        opacity: index === 0 ? 1 : 0,
        y: index === 0 ? 0 : 30,
        scale: index === 0 ? 1 : 0.95
      });
    });

    // Create ScrollTrigger that updates all items based on scroll progress
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress; // 0 to 1
        
        approachElements.forEach((el, index) => {
          // Determine if this is the active approach based on scroll progress
          // Map progress (0-1) to approach index (0-3) with equal distribution
          let currentActiveIndex;
          if (progress >= 0.75) {
            // Last quarter: show index 3 (Learn in Public)
            currentActiveIndex = 3;
          } else if (progress >= 0.5) {
            // Third quarter: show index 2 (Compound Your Skills)
            currentActiveIndex = 2;
          } else if (progress >= 0.25) {
            // Second quarter: show index 1 (Build Real Solutions)
            currentActiveIndex = 1;
          } else {
            // First quarter: show index 0 (Start Messy)
            currentActiveIndex = 0;
          }
          const isActive = index === currentActiveIndex;
          
          // Use set for immediate updates during scroll
          gsap.set(el, {
            opacity: isActive ? 1 : 0,
            y: 0,
            scale: isActive ? 1 : 0.95,
            zIndex: isActive ? 10 : 0,
          });
          
          // Set CSS properties directly for visibility
          (el as HTMLElement).style.visibility = isActive ? 'visible' : 'hidden';
          (el as HTMLElement).style.pointerEvents = isActive ? 'auto' : 'none';
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars?.trigger === sectionRef.current) {
          trigger.kill();
        }
      });
    };
  }, []);

  return (
    <div 
      ref={sectionRef}
      className="w-full bg-black flex items-center justify-center snap-start"
      style={{ height: '25vh' }}
    >
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        {approaches.map((approach, index) => (
          <div
            key={approach.number}
            className="approach-item absolute inset-0 flex items-center justify-center"
            style={{ 
              opacity: index === 0 ? 1 : 0,
              visibility: index === 0 ? 'visible' : 'hidden',
              pointerEvents: index === 0 ? 'auto' : 'none'
            }}
          >
            <div className="text-center px-6 max-w-4xl">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                {approach.title}
              </h3>
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                {approach.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollCounter;
