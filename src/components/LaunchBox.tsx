'use client';

import React from 'react';
import { trackFormSubmission, trackButtonClick } from '@/lib/analytics';

const Launchbox: React.FC = () => {
  const [activeCard, setActiveCard] = React.useState(0);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const lastProgressRef = React.useRef(0);

  const handleWaitlist = () => {
    // Track button click
    trackButtonClick('join_waitlist', 'launchbox_card');
    // Navigate to founders page
    window.location.href = 'https://launchbox.space/founders';
  };

  React.useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight - windowHeight;
      
      // Calculate scroll progress: 0 to 1 through the section
      const progress = Math.max(0, Math.min(1, -rect.top / sectionHeight));
      // Note: scrollProgress is tracked but used via activeCard state instead

      // Determine which card should be expanded based on scroll progress
      // Use hysteresis: different thresholds for scrolling up vs down to prevent rapid switching
      const scrollingDown = progress > lastProgressRef.current;
      lastProgressRef.current = progress;

      let newCard: number;
      
      // Check if mobile for slower scrolling
      const isMobile = window.innerWidth < 1024;
      
      // 2 cards: LaunchBox (0) and Newsletter (1)
      if (scrollingDown) {
        if (isMobile) {
          newCard = progress < 0.7 ? 0 : 1;
        } else {
          newCard = progress < 0.55 ? 0 : 1;
        }
      } else {
        if (isMobile) {
          newCard = progress < 0.5 ? 0 : 1;
        } else {
          newCard = progress < 0.45 ? 0 : 1;
        }
      }

      // Only update if card actually changed
      if (newCard !== activeCard) {
        setActiveCard(newCard);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeCard]);

  // Determine which card should be expanded based on scroll progress
  const getActiveCard = () => activeCard;

  return (
    <section 
      ref={sectionRef}
      id="launchbox"
      className="bg-black snap-start"
      style={{ height: 'calc(100vh * 2)' }}
      data-snap-section
    >
      {/* Sticky Container - Stays in place while cards expand/collapse */}
      <div className="sticky w-full flex items-center px-6" style={{ height: 'calc(100vh - 65px)', top: '65px' }}>
        <div className="max-w-7xl mx-auto w-full h-full flex items-center">
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-red-700/60 shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col">
            <ScrollableHighlights onWaitlist={handleWaitlist} activeCard={getActiveCard()} />
          </div>
        </div>
      </div>
    </section>
  );
};

// Internal component with 3 equal subsections
interface ScrollableHighlightsProps {
  onWaitlist: () => void;
  activeCard?: number;
}

const ScrollableHighlights: React.FC<ScrollableHighlightsProps> = ({ onWaitlist, activeCard = 0 }) => {
  const [nlName, setNlName] = React.useState('');
  const [nlEmail, setNlEmail] = React.useState('');
  const [nlPhone, setNlPhone] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  const [rocketFrame, setRocketFrame] = React.useState<0 | 1>(0);
  // Toggle rocket frame continuously (only between rocket and rocket2, box stays static)
  React.useEffect(() => {
    const id = setInterval(() => setRocketFrame((f) => (f === 0 ? 1 : 0)), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Section 1: Launchbox Waitlist */}
      <div
        className={`${activeCard === 0 ? 'flex-1' : 'h-28'} bg-white overflow-hidden transition-all duration-700 ease-in-out cursor-pointer`}
      >
        <div className={`h-full p-6 lg:p-10 flex items-center ${activeCard !== 0 ? 'justify-between' : ''}`}>
          <div className="w-full max-w-7xl mx-auto">
            {activeCard === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-3">Learn more about LaunchBox</h3>
                  <p className="text-gray-700 mb-2">Build your community</p>
                  <p className="text-gray-700 mb-2">Deliver courses</p>
                  <p className="text-gray-700 mb-2">AI included</p>
                  <p className="text-gray-700 mb-5">Your brand. Your community. Your courses. Your members paying you.</p>
                  <a
                    href="https://launchbox.space/white-label"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#ea580c' }}
                  >
                    Learn more about LaunchBox
                  </a>
                </div>
                <div className="hidden lg:flex items-center justify-center">
                  <div className="relative w-44 h-44 md:w-56 md:h-56">
                    <img
                      src="/box.png"
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    <img
                      src={rocketFrame === 0 ? '/rocket.png' : '/rocket2.png'}
                      alt="Launchbox"
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(220,38,38,0.35)]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <a
                href="https://launchbox.space/white-label"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-4 hover:opacity-90 transition-opacity"
              >
                <h3 className="text-2xl md:text-3xl font-bold text-black">Learn more about LaunchBox</h3>
                <span className="text-gray-600">→</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Ian's AI Newsletter */}
      <div
        className={`${activeCard === 1 ? 'flex-1 overflow-y-auto' : 'h-28'} bg-zinc-900/40 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer p-4 sm:p-6 lg:p-10 flex ${activeCard === 1 ? 'items-start lg:items-center' : 'items-center'} ${activeCard === 1 ? 'min-h-0' : ''}`}
      >
        <div className="w-full max-w-7xl mx-auto">
          {activeCard === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start lg:items-center w-full h-full min-h-0">
              {/* Left: Title + Content */}
              <div className="min-w-0">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">Ian's AI Newsletter</h3>
              <p className="text-gray-100/90 text-base sm:text-lg leading-relaxed mb-4">No fluff. Practical tips, small wins, and build-in-public notes—sent occasionally when there's something worth your time.</p>
              <p className="text-sm sm:text-base text-gray-400">You can unsubscribe anytime.</p>
            </div>

            {/* Right: Form */}
            <div className="w-full min-w-0">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  if (!nlName || !nlEmail) {
                    setSubmitError('Please fill in your name and email.');
                    return;
                  }

                  setIsSubmitting(true);
                  setSubmitError(null);

                  const webhookData = {
                    name: nlName,
                    email: nlEmail,
                    phone: nlPhone || 'N/A',
                    timestamp: new Date().toISOString()
                  };

                  try {
                    console.log('[Launchbox:Newsletter] Form submission started');
                    console.log('[Launchbox:Newsletter] Sending webhook data:', webhookData);
                    
                    const response = await fetch('/api/newsletter-signup', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(webhookData),
                    });
                    
                    console.log('[Launchbox:Newsletter] API response status:', response.status);

                    // Check if response is actually JSON
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                      throw new Error('Server returned an invalid response. Please try again.');
                    }

                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({ error: 'Failed to subscribe. Please try again.' }));
                      throw new Error(errorData.error || 'Failed to subscribe. Please try again.');
                    }

                    console.log('[Launchbox:Newsletter] Webhook success');
                    
                    // Track newsletter signup from Launchbox card
                    console.log('[Launchbox:Newsletter] Tracking analytics event');
                    trackFormSubmission('newsletter_signup', {
                      page_location: '/',
                      source: 'launchbox_card',
                    });

                    setSubmitSuccess(true);
                    setNlName('');
                    setNlEmail('');
                    setNlPhone('');

                    setTimeout(() => {
                      setSubmitSuccess(false);
                    }, 5000);
                  } catch (error) {
                    setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
                className="rounded-2xl border border-gray-800 bg-black/30 backdrop-blur-md px-4 sm:px-6 py-4 sm:py-5 space-y-3"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="nl-name">Your name</label>
                  <input
                    id="nl-name"
                    type="text"
                    value={nlName}
                    onChange={(e) => setNlName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-11 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="nl-email">Email</label>
                  <input
                    id="nl-email"
                    type="email"
                    value={nlEmail}
                    onChange={(e) => setNlEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-11 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="nl-phone">Phone (optional)</label>
                  <input
                    id="nl-phone"
                    type="tel"
                    value={nlPhone}
                    onChange={(e) => setNlPhone(e.target.value)}
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-11 sm:h-12 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    placeholder="(555) 555-5555"
                  />
                </div>

                {/* Success/Error Messages */}
                {submitSuccess && (
                  <div className="p-3 rounded-lg bg-green-900/30 border border-green-600/50">
                    <p className="text-green-400 text-sm font-medium">
                      ✓ Successfully subscribed! Check your email for confirmation.
                    </p>
                  </div>
                )}

                {submitError && (
                  <div className="p-3 rounded-lg bg-red-900/30 border border-red-600/50">
                    <p className="text-red-400 text-sm font-medium">
                      {submitError}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    onClick={() => {
                      if (!isSubmitting) {
                        trackButtonClick('subscribe_newsletter', 'launchbox_card');
                      }
                    }}
                    className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 sm:px-7 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    By submitting, you agree to our{' '}
                    <a href="/privacy" className="text-red-500 hover:text-red-400 underline" target="_blank" rel="noopener noreferrer">
                      Privacy Policy
                    </a>
                    {' '}and consent to marketing communications.
                  </p>
                </div>
              </form>
            </div>
          </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Ian's AI Newsletter</h3>
              <span className="text-gray-400">→</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Launchbox;
