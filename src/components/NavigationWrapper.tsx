'use client';

import { useEffect, useState, useRef } from 'react';
import Navigation from './Navigation';
import { trackSectionView } from '@/lib/analytics';

const NavigationWrapper = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const lastTrackedSection = useRef<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Sections in order they appear on the page
      const sections = [
        'hero',
        'who-this-is-for',
        'image-section',
        'consulting',
        'launchbox',
        'work'
      ];
      
      const headerHeight = 65; // Height of fixed header
      const scrollPosition = window.scrollY + headerHeight + 100; // Offset for better detection

      // Find which section is currently in view
      let currentSection = 'hero'; // Default to hero
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionId = sections[i];
        const element = document.getElementById(sectionId);
        
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          // Check if scroll position is within this section
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = sectionId;
            break;
          }
          // Also check if we've scrolled past the top of this section
          else if (scrollPosition >= elementTop) {
            currentSection = sectionId;
            break;
          }
        }
      }
      
      // Track section view if section changed (avoid duplicate tracking)
      if (currentSection !== lastTrackedSection.current && currentSection) {
        trackSectionView(currentSection);
        lastTrackedSection.current = currentSection;
      }
      
      setActiveSection(currentSection);
    };

    // Initial check
    handleScroll();

    // Add scroll listener with throttling for better performance
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return <Navigation activeSection={activeSection} />;
};

export default NavigationWrapper;