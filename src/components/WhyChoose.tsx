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
              // Trigger animations when section is more than 50% visible
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
    <section 
      id="about" 
      className="min-h-screen bg-black pt-16"
    >
      <style jsx>{`
        .subsection {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }

        .section-visible .subsection {
          opacity: 1;
          transform: translateY(0);
        }

        .subsection:nth-child(1) {
          transition-delay: 0ms;
        }

        .subsection:nth-child(2) {
          transition-delay: 100ms;
        }

        .subsection:nth-child(3) {
          transition-delay: 200ms;
        }

        .subsection:nth-child(4) {
          transition-delay: 300ms;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {/* Who We Are */}
        <div 
          ref={(el) => { sectionRefs.current[0] = el; }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="w-full">
            <div className="flex items-center gap-4 mb-6 subsection">
              <div className="w-12 h-1 bg-red-600"></div>
              <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">Who We Are</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-4xl mb-10 subsection">
              Building AI Solutions That Actually Matter
            </h2>
            
            <div className="space-y-6 text-gray-400 text-lg md:text-xl leading-relaxed max-w-4xl subsection">
              <p>
                We specialize in building AI solutions that challenge conventional thinking and create meaningful impact. Our approach combines technical expertise with strategic insight to deliver results that matter.
              </p>
              
              <p>
                Every project is different. We take time to understand your specific challenges, your industry landscape, and your business objectives before proposing solutions. This ensures our work aligns with your goals and delivers measurable value.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div 
          ref={(el) => { sectionRefs.current[1] = el; }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="w-full">
            <div className="flex items-center gap-4 mb-10 subsection">
              <div className="w-12 h-1 bg-red-600"></div>
              <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">What We Do</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10 max-w-4xl">
              {/* AI Implementation */}
              <div className="subsection">
                <h3 className="text-white font-semibold text-xl mb-3">
                  AI Implementation
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Custom AI solutions designed for your specific use case and integrated into your existing workflows.
                </p>
              </div>
              
              {/* Strategic Consulting */}
              <div className="subsection">
                <h3 className="text-white font-semibold text-xl mb-3">
                  Strategic Consulting
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Help identifying opportunities where AI can drive real business value and competitive advantage.
                </p>
              </div>
              
              {/* System Architecture */}
              <div className="subsection">
                <h3 className="text-white font-semibold text-xl mb-3">
                  System Architecture
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Scalable, maintainable solutions built with modern technology stacks and best practices.
                </p>
              </div>
              
              {/* Ongoing Support */}
              <div className="subsection">
                <h3 className="text-white font-semibold text-xl mb-3">
                  Ongoing Support
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Long-term partnership to ensure your solutions continue to perform and evolve with your needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Approach */}
        <div 
          ref={(el) => { sectionRefs.current[2] = el; }}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="w-full">
            <div className="flex items-center gap-4 mb-10 subsection">
              <div className="w-12 h-1 bg-red-600"></div>
              <span className="text-red-600 text-sm font-semibold tracking-wider uppercase">Our Approach</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-8 max-w-4xl">
              {/* Discovery */}
              <div className="subsection">
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
              <div className="subsection">
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
              <div className="subsection">
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
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
