'use client';

import React, { useState, useEffect, useRef } from 'react';

const OurWork: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const projects = [
    {
      title: "AI for Business App",
      description: "All-in-one AI workspace for entrepreneurs — Lead Architect",
      tech: "Multi-model AI • Firebase • React",
      details: "All-in-one AI workspace for entrepreneurs: multi-model chat, image/video generation, knowledge bases, super-prompt builder, and brand/voice tools. Became the centerpiece of a $100k+/mo membership bundle serving 1,300+ users.",
      industry: "Enterprise SaaS",
      impact: "1,300+ paying users powered by this platform"
    },
    {
      title: "Launch Box",
      description: "Tools + Training + Community for career-changers",
      tech: "Multi-model AI • Firebase/Firestore • Custom Tooling",
      details: "A tools-plus-training community for career-changers. Members get working AI tools (image, video, chat, newsletter), step-by-step builds, and a supportive community. Hit $2,450 MRR in 90 days with 50+ members and growing.",
      industry: "Education & Community SaaS",
      impact: "$2,450 MRR in 90 days"
    },
    {
      title: "ChatterCard",
      description: "Lightweight engagement tool connecting content to clear actions",
      tech: "Simple & Focused • Built to Prove a Point",
      details: "Lightweight engagement tool connecting content to clear actions. Built to prove a point: simple > fancy when you want clicks, leads, and replies.",
      industry: "Marketing Tools",
      impact: "Proof that simple > fancy for engagement"
    },
    {
      title: "Disruptiv Solutions",
      description: "Rapid AI product development and white-label builds",
      tech: "Multi-model AI • White-label Multi-tenant SaaS",
      details: "My studio for rapid AI product development and white-label builds. We ship quickly, document cleanly, and leave teams better than we found them. Hands-on development without the overhead of big agencies.",
      industry: "Dev Studio / Consultancy",
      impact: "Rapid prototypes to production"
    }
  ];

  // Detect which card is in the center of the viewport (desktop only)
  useEffect(() => {
    // Only run on desktop
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    const detectCenterCard = () => {
      if (!scrollContainerRef.current) return;

      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;
      
      // Define a threshold zone around the center (e.g., ±100px)
      const threshold = 100;

      let closestIndex = 0;
      let closestDistance = Infinity;
      let cardInCenterZone = false;

      // Check ALL cards (including duplicates for seamless infinite loop)
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const distance = Math.abs(cardCenterY - centerY);

        // Check if this card is within the center threshold zone
        if (distance < threshold) {
          cardInCenterZone = true;
          if (distance < closestDistance) {
            closestDistance = distance;
            // Map back to original project index (handle duplicates)
            closestIndex = index % projects.length;
          }
        } else if (!cardInCenterZone && distance < closestDistance) {
          // Fallback: if no card is in center zone, track the closest one
          closestDistance = distance;
          // Map back to original project index (handle duplicates)
          closestIndex = index % projects.length;
        }
      });

      // Only update if:
      // 1. A card is actually in the center zone, AND
      // 2. It's different from the current active index
      if (cardInCenterZone && closestIndex !== activeIndex) {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveIndex(closestIndex);
          setIsTransitioning(false);
        }, 300);
      }
    };

    // Check every 150ms which card is in center (more responsive)
    const interval = setInterval(detectCenterCard, 150);
    
    return () => clearInterval(interval);
  }, [activeIndex, projects.length]);

  // Auto-cycle through projects on mobile every 3 seconds
  useEffect(() => {
    // Only run on mobile (when scroll container is hidden)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % projects.length);
        setIsTransitioning(false);
      }, 300);
    }, 3000); // Cycle every 3 seconds
    
    return () => clearInterval(interval);
  }, [activeIndex, projects.length]);

  const activeProject = projects[activeIndex];

  return (
    <section id="work" className="min-h-screen bg-black overflow-hidden lg:relative pt-16">
      <div className="lg:h-screen">
        {/* Header Section - Top */}
        <div className="py-8 px-6 lg:py-12 lg:relative lg:z-10">
          <div className="max-w-7xl w-full mx-auto">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Our Work
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl">
              A selection of projects I've built that power real businesses and communities.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:absolute lg:inset-0 lg:flex lg:items-center">
          <div className="max-w-7xl w-full mx-auto px-6 pb-20 lg:pb-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-12 lg:h-screen lg:items-center">
              {/* Left Side - Active Project Details */}
              <div className="flex items-center justify-center min-h-[400px] lg:pl-0">
                <div 
                  className={`space-y-6 max-w-2xl transition-opacity duration-500 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {activeProject.title}
                    </h3>
                    <p className="text-gray-500 text-sm">{activeProject.industry}</p>
                  </div>

                  <p className="text-gray-300 leading-relaxed text-lg">
                    {activeProject.details}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Technologies</p>
                      <p className="text-red-500 font-medium">{activeProject.tech}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Impact</p>
                      <p className="text-white font-medium">{activeProject.impact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Infinite Scroll Showcase (Desktop Only) */}
              <div 
                ref={scrollContainerRef}
                className="hidden lg:block relative h-[600px] lg:h-screen overflow-hidden px-4"
              >
            <style jsx>{`
              @keyframes scroll-continuous {
                0% {
                  transform: translateY(0);
                }
                100% {
                  transform: translateY(-50%);
                }
              }

              .scroll-animation {
                animation: scroll-continuous 24s linear infinite;
              }

              .scroll-animation:hover {
                animation-play-state: paused;
              }
            `}</style>

                <div className="scroll-animation">
                  {/* Render cards twice for seamless loop */}
                  {[...projects, ...projects].map((project, index) => {
                    const actualIndex = index % projects.length;
                    const isActive = actualIndex === activeIndex;
                    
                    return (
                      <div
                        key={index}
                        ref={(el) => {
                          cardsRef.current[index] = el;
                        }}
                        className="mb-4 px-2 transition-all duration-500"
                      >
                        <div 
                          className={`bg-zinc-900/50 border rounded-xl p-6 backdrop-blur-sm transition-all duration-500 ${
                            isActive 
                              ? 'border-red-600 opacity-100 scale-105' 
                              : 'border-gray-800 opacity-50 scale-100'
                          }`}
                        >
                          <h3 className="text-xl font-semibold text-white mb-3">
                            {project.title}
                          </h3>
                          <p className="text-gray-400 mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          <p className="text-sm text-red-500 font-medium">
                            {project.tech}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurWork;

