'use client';

/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect, useRef } from 'react';

const Portfolio: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const projects = [
    {
      title: "LaunchBox (Current Focus)",
      tag: "Tools + Training + Community - Launching Q1 2025",
      description: "Building in public: A platform where non-technical people learn to build AI-powered apps.",
      details: [
        "Working AI tools from day one (not just tutorials)",
        "Step-by-step builds you can actually finish",
        "Community of builders who support each other",
        "30-day promise: First app deployed or I help you fix it"
      ],
      traction: "50+ early members building together",
      tech: "Multi-model AI • Firebase/Firestore • Custom tooling",
      cta: "Join the Waitlist"
    },
    {
      title: "AI for Business Platform",
      tag: "Enterprise SaaS - Lead Architect",
      description: "Lead architect for multi-model AI workspace serving 1,500+ active users.",
      features: [
        "Multi-model chat (OpenAI, Anthropic, and more)",
        "Image and video generation tools",
        "Knowledge bases and super-prompt builder",
        "Brand voice and content tools"
      ],
      impact: "Became the centerpiece of a thriving subscription community serving 1,300+ members.",
      tech: "Multi-model AI • Firebase • React • Custom integrations"
    },
    {
      title: "ChatterCard",
      tag: "Engagement Tool",
      description: "Lightweight tool connecting content to clear actions.",
      lesson: "Simple. Focused. Built to prove a point: you don't need massive complexity to create value.",
      details: "Sometimes the best solutions are the simplest ones. Ship fast, test with real users, iterate.",
      tech: "Simple & Focused"
    },
    {
      title: "Disruptiv Solutions",
      tag: "Client Work & White-Label Builds",
      description: "Where it all started—rapid AI product development and white-label builds for founders who need to ship fast.",
      learnings: [
        "How to scope projects that actually ship",
        "Building for non-technical users",
        "The importance of clear communication over clever code"
      ],
      tech: "Multi-model AI • White-label Multi-tenant SaaS • Firebase/Firestore"
    },
    {
      title: "PokéScan",
      tag: "Weekend Project",
      description: "Built in a few hours using Cursor AI to organize my Pokémon card collection.",
      details: "Perfect? Nope. Useful? Absolutely.",
      lesson: "Don't wait for the perfect idea. Start building things that solve problems in your actual life. The skills you develop compound.",
      link: "Try it free: pokescan.replit.app"
    }
  ];

  // Detect which card is in the center of the viewport (desktop only)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    const detectCenterCard = () => {
      if (!scrollContainerRef.current) return;

      const containerRect = scrollContainerRef.current.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;
      const threshold = 100;

      let closestIndex = 0;
      let closestDistance = Infinity;
      let cardInCenterZone = false;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        const cardRect = card.getBoundingClientRect();
        const cardCenterY = cardRect.top + cardRect.height / 2;
        const distance = Math.abs(cardCenterY - centerY);

        if (distance < threshold) {
          cardInCenterZone = true;
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index % projects.length;
          }
        } else if (!cardInCenterZone && distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index % projects.length;
        }
      });

      if (cardInCenterZone && closestIndex !== activeIndex) {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveIndex(closestIndex);
          setIsTransitioning(false);
        }, 300);
      }
    };

    const interval = setInterval(detectCenterCard, 150);
    return () => clearInterval(interval);
  }, [activeIndex, projects.length]);

  // Auto-cycle through projects on mobile every 3 seconds
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
          setActiveIndex((prevIndex) => (prevIndex + 1) % projects.length);
          setIsTransitioning(false);
      }, 300);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [activeIndex, projects.length]);

  const activeProject = projects[activeIndex];

  return (
    <section id="work" className="min-h-screen bg-black overflow-hidden lg:relative snap-start snap-always">
      <div className="lg:h-screen">
        {/* Main Content Area */}
        <div className="lg:flex">
          <div className="max-w-7xl w-full mx-auto px-6 pb-20 lg:pb-0">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-12 lg:h-screen lg:items-start">
              {/* Left Side - Active Project Details */}
              <div className="flex items-center justify-center min-h-[400px] lg:pl-0 lg:self-center">
                <div 
                  className={`space-y-6 max-w-2xl transition-opacity duration-500 ${
                    isTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="mb-4">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
                      Things I've Built
                    </h2>
                    <p className="text-gray-400 text-lg max-w-3xl">
                      From side projects to enterprise platforms—each one taught me something for the next.
                    </p>
                  </div>
                  <div>
                    <span className="text-red-500 text-sm font-semibold">{activeProject.tag}</span>
                    <h3 className="text-2xl font-bold text-white mb-2 mt-1">
                      {activeProject.title}
                    </h3>
                  </div>

                  <p className="text-gray-300 leading-relaxed text-lg">
                    {activeProject.description}
                  </p>

                  {activeProject.details && Array.isArray(activeProject.details) && (
                    <div className="space-y-3">
                      {activeProject.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-400 flex items-start gap-3">
                          <span className="text-red-600">•</span>
                          <span>{detail}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {activeProject.features && (
                    <div className="space-y-3">
                      <p className="text-white font-semibold">What I built:</p>
                      {activeProject.features.map((feature, idx) => (
                        <p key={idx} className="text-gray-400 flex items-start gap-3">
                          <span className="text-red-600">•</span>
                          <span>{feature}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {activeProject.learnings && (
                    <div className="space-y-3">
                      <p className="text-white font-semibold">What I learned:</p>
                      {activeProject.learnings.map((learning, idx) => (
                        <p key={idx} className="text-gray-400 flex items-start gap-3">
                          <span className="text-red-600">•</span>
                          <span>{learning}</span>
                        </p>
                      ))}
                    </div>
                  )}

                  {activeProject.impact && (
                    <div className="border-l-4 border-red-600 pl-4">
                      <p className="text-gray-400 text-sm mb-1">Impact</p>
                      <p className="text-white font-medium">{activeProject.impact}</p>
                    </div>
                  )}

                  {activeProject.lesson && (
                    <p className="text-gray-400 italic">{activeProject.lesson}</p>
                  )}

                  {activeProject.details && !Array.isArray(activeProject.details) && (
                    <p className="text-gray-400">{activeProject.details}</p>
                  )}

                  {activeProject.traction && (
                    <div className="border-l-4 border-red-600 pl-4">
                      <p className="text-gray-400 text-sm mb-1">Current traction</p>
                      <p className="text-white font-medium">{activeProject.traction}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-2">Tech Stack</p>
                    <p className="text-red-500 font-medium">{activeProject.tech}</p>
                  </div>

                  {activeProject.link && (
                    <a 
                      href={`https://${activeProject.link}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block text-red-600 hover:text-red-500 underline"
                    >
                      {activeProject.link}
                    </a>
                  )}

                  {activeProject.cta && (
                    <button
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                      className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
                    >
                      {activeProject.cta}
                    </button>
                  )}
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
                    animation: scroll-continuous 30s linear infinite;
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
                            {project.tech?.split(' • ')[0]}
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

export default Portfolio;

