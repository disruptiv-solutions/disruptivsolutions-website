'use client';

import React, { useEffect, useRef } from 'react';

const WhyChoose: React.FC = () => {
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionRefs.current.forEach((section, index) => {
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              entry.target.classList.add('section-visible');
            }
          });
        },
        {
          threshold: [0.5, 0.75, 1.0],
        }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <>
      {/* About.1 - Who We Are */}
      <section 
        id="about-1"
        className="min-h-screen flex items-center justify-center bg-black pt-16 snap-start snap-always"
        style={{ scrollMarginTop: '80px' }}
      >
        <div 
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="max-w-7xl mx-auto px-6 py-20 w-full"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-1 bg-red-600"></div>
            <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">Who We Are</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mb-10">
            Ian McDonald & Disruptiv Solutions
          </h2>
          
          <div className="space-y-8 text-gray-400 text-lg leading-relaxed max-w-4xl">
            <div className="border-l-4 border-red-600 pl-6">
              <p className="text-white font-semibold text-xl mb-2">$100k+ MRR Enabled</p>
              <p>Lead architect of the AI for Business app that anchors a 1,300-member subscription.</p>
            </div>
            
            <div className="border-l-4 border-red-600 pl-6">
              <p className="text-white font-semibold text-xl mb-2">0→$2,450 MRR in 90 Days</p>
              <p>Built and monetized Launch Box, a tools-plus-training community for career-changers.</p>
            </div>
            
            <div className="border-l-4 border-red-600 pl-6">
              <p className="text-white font-semibold text-xl mb-2">Hands-on, Not Hype</p>
              <p>I ship features, fix bugs, and teach people to build real apps—no jargon, no fluff.</p>
            </div>
            
            <div className="border-l-4 border-red-600 pl-6">
              <p className="text-white font-semibold text-xl mb-2">Stack</p>
              <p>Multi-model AI (OpenAI/Anthropic/etc.), Firebase/Firestore, custom tooling for image/video/newsletters, white-label multi-tenant SaaS.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About.2 - What I'm Building Now */}
      <section 
        id="about-2"
        className="min-h-screen flex items-center justify-center bg-black snap-start snap-always"
        style={{ scrollMarginTop: '80px' }}
      >
        <div 
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="max-w-7xl mx-auto px-6 py-20 w-full"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-1 bg-red-600"></div>
            <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">What I'm Building Now</span>
          </div>
          
          <div className="max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Launch Box — Tools + Training + Community
            </h2>
            
            <p className="text-gray-300 text-xl mb-8">
              <span className="font-semibold text-white">Tagline:</span> Build AI-powered business apps without a CS degree.
            </p>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Members get working AI tools (image, video, chat, newsletter), step-by-step builds, and a supportive community.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-sm text-gray-500 mb-1">Members</p>
                <p className="text-2xl font-bold text-white">50+</p>
                <p className="text-sm text-gray-400">and growing</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">MRR</p>
                <p className="text-2xl font-bold text-white">$2,450</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Promise</p>
                <p className="text-lg font-semibold text-white">First working app in 30 days</p>
                <p className="text-sm text-gray-400">or I help you fix it</p>
              </div>
            </div>
            
            <a
              href="https://launchbox.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
            >
              Join Launch Box
            </a>
          </div>
        </div>
      </section>

      {/* About.3 - Our Approach */}
      <section 
        id="about-3"
        className="min-h-screen flex items-center justify-center bg-black snap-start snap-always"
        style={{ scrollMarginTop: '80px' }}
      >
        <div 
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="max-w-7xl mx-auto px-6 py-20 w-full"
        >
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-1 bg-red-600"></div>
            <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">Our Approach</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8 max-w-4xl">
            {/* Discovery */}
            <div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-red-600 text-2xl font-bold">01</span>
                <h3 className="text-white font-semibold text-xl">
                  Discovery
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Understanding your challenges and objectives
              </p>
            </div>
            
            {/* Strategy */}
            <div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-red-600 text-2xl font-bold">02</span>
                <h3 className="text-white font-semibold text-xl">
                  Strategy
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Designing solutions aligned with your goals
              </p>
            </div>
            
            {/* Execution */}
            <div>
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-red-600 text-2xl font-bold">03</span>
                <h3 className="text-white font-semibold text-xl">
                  Execution
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Building and delivering measurable results
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyChoose;
