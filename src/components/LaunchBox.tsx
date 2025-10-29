'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const LaunchBox: React.FC = () => {
  const [activeCard, setActiveCard] = React.useState(0);
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const lastProgressRef = React.useRef(0);

  const handleWaitlist = () => {
    // Navigate to waitlist signup page
    window.location.href = '/waitlist';
  };

  const handleClass = () => {
    // Navigate to free class signup page
    window.location.href = '/free-class';
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
      
      if (scrollingDown) {
        // Scrolling down: higher thresholds to prevent premature switching
        if (isMobile) {
          // Mobile: much slower progression
          if (progress < 0.6) {
            newCard = 0;  // First 60% = card 0 (hold longer)
          } else if (progress < 0.9) {
            newCard = 1;  // Next 30% = card 1 (hold longer)
          } else {
            newCard = 2; // Final 10% = card 2 (hold longer)
          }
        } else {
          // Desktop: original thresholds
          if (progress < 0.5) {
            newCard = 0;  // First 50% = card 0 (hold)
          } else if (progress < 0.85) {
            newCard = 1;  // Next 35% = card 1 (hold)
          } else {
            newCard = 2; // Final 15% = card 2 (hold)
          }
        }
      } else {
        // Scrolling up: lower thresholds for easier back navigation
        if (isMobile) {
          // Mobile: slower back navigation too
          if (progress < 0.4) {
            newCard = 0;
          } else if (progress < 0.8) {
            newCard = 1;
          } else {
            newCard = 2;
          }
        } else {
          // Desktop: original thresholds
          if (progress < 0.35) {
            newCard = 0;
          } else if (progress < 0.75) {
            newCard = 1;
          } else {
            newCard = 2;
          }
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
      style={{ height: 'calc(100vh * 3)' }}
      data-snap-section
    >
      {/* Sticky Container - Stays in place while cards expand/collapse */}
      <div className="sticky w-full flex items-center px-6" style={{ height: 'calc(100vh - 65px)', top: '65px' }}>
        <div className="max-w-7xl mx-auto w-full h-full flex items-center">
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-red-700/60 shadow-[0_0_50px_rgba(220,38,38,0.4)] flex flex-col">
            <ScrollableHighlights onWaitlist={handleWaitlist} onClassInvite={handleClass} activeCard={getActiveCard()} />
          </div>
        </div>
      </div>
    </section>
  );
};

// Internal component with 3 equal subsections
interface ScrollableHighlightsProps {
  onWaitlist: () => void;
  onClassInvite: () => void;
  activeCard?: number;
}

const ScrollableHighlights: React.FC<ScrollableHighlightsProps> = ({ onWaitlist, onClassInvite, activeCard = 0 }) => {
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
      {/* Section 1: LaunchBox Waitlist */}
      <div
        className={`${activeCard === 0 ? 'flex-1' : 'h-28'} bg-white overflow-hidden transition-all duration-700 ease-in-out cursor-pointer`}
      >
        <div className={`h-full p-6 lg:p-10 flex items-center ${activeCard !== 0 ? 'justify-between' : ''}`}>
          <div className="w-full max-w-7xl mx-auto">
            {activeCard === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-black mb-3">Join the LaunchBox Waitlist</h3>
                  <p className="text-gray-700 mb-5">Be first to get invites, resources, and early builds.</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onWaitlist(); }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: '#ea580c' }}
                  >
                    Join the Waitlist
                  </button>
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
                      alt="LaunchBox"
                      className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_10px_30px_rgba(220,38,38,0.35)]"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <h3 className="text-2xl md:text-3xl font-bold text-black">Join the LaunchBox Waitlist</h3>
                <span className="text-gray-600">→</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Free AI App Building Class */}
      <div
        className={`${activeCard === 1 ? 'flex-1' : 'h-28'} bg-zinc-900/60 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer p-6 lg:p-10 flex items-center`}
      >
        <div className="w-full max-w-7xl mx-auto">
          {activeCard === 1 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left: Title + Description */}
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Free AI App Building Class</h3>
                <p className="text-gray-100/90 text-lg leading-relaxed">Live session on shipping your first working AI app. Free • 1 hour.</p>
              </div>

              {/* Right: Dates */}
              <div className="w-full">
                <p className="text-lg text-gray-300 mb-4 font-semibold">Upcoming sessions</p>
                <div className="space-y-2">
                  <div onClick={(e) => { e.stopPropagation(); onClassInvite(); }} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Thursday, Nov 13</p>
                    <p className="text-sm text-gray-400">12:00 PM EST</p>
                  </div>
                </div>
                <div onClick={(e) => { e.stopPropagation(); onClassInvite(); }} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Saturday, Nov 15</p>
                    <p className="text-sm text-gray-400">12:00 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
            ) : (
              <div className="flex items-center justify-between">
                <h3 className="text-2xl md:text-3xl font-bold text-white">Free AI App Building Class</h3>
                <span className="text-gray-400">→</span>
              </div>
            )}
        </div>
      </div>

      {/* Section 3: Ian's AI Newsletter */}
      <div
        className={`${activeCard === 2 ? 'flex-1 overflow-y-auto' : 'h-28'} bg-zinc-900/40 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer p-4 sm:p-6 lg:p-10 flex ${activeCard === 2 ? 'items-start lg:items-center' : 'items-center'} ${activeCard === 2 ? 'min-h-0' : ''}`}
      >
        <div className="w-full max-w-7xl mx-auto">
          {activeCard === 2 ? (
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
                    const response = await fetch('/api/newsletter-signup', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(webhookData),
                    });

                    // Check if response is actually JSON
                    const contentType = response.headers.get('content-type');
                    if (!contentType || !contentType.includes('application/json')) {
                      throw new Error('Server returned an invalid response. Please try again.');
                    }

                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({ error: 'Failed to subscribe. Please try again.' }));
                      throw new Error(errorData.error || 'Failed to subscribe. Please try again.');
                    }

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
                    className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 px-6 sm:px-7 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
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

export default LaunchBox;
