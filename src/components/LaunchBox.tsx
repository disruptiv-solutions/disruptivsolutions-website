'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const LaunchBox: React.FC = () => {
  const [scrollProgress, setScrollProgress] = React.useState(0);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  const handleWaitlist = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClass = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
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
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine which card should be expanded based on scroll progress
  const getActiveCard = () => {
    if (scrollProgress < 0.25) return 0;
    if (scrollProgress < 0.5) return 1;
    if (scrollProgress < 0.75) return 2;
    return 3;
  };

  return (
    <section 
      ref={sectionRef}
      id="launchbox"
      className="bg-black snap-start"
      style={{ height: 'calc((100vh - 65px) * 4)' }}
    >
      {/* Sticky Container - Stays in place while cards expand/collapse */}
      <div className="sticky top-[65px] w-full flex items-center px-6" style={{ height: 'calc(100vh - 65px)' }}>
        <div className="max-w-7xl mx-auto w-full h-full flex items-center">
          <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-red-700/60 shadow-[0_0_50px_rgba(220,38,38,0.4)]">
            <ScrollableHighlights onWaitlist={handleWaitlist} onClassInvite={handleClass} activeCard={getActiveCard()} />
          </div>
        </div>
      </div>
    </section>
  );
};

// Internal component with 4 equal subsections
interface ScrollableHighlightsProps {
  onWaitlist: () => void;
  onClassInvite: () => void;
  activeCard?: number;
}

const ScrollableHighlights: React.FC<ScrollableHighlightsProps> = ({ onWaitlist, onClassInvite, activeCard = 0 }) => {
  const [consultDate, setConsultDate] = React.useState('');
  const [consultTime, setConsultTime] = React.useState('12:00');
  const [consultLength, setConsultLength] = React.useState<'20' | '90'>('20');
  const [nlName, setNlName] = React.useState('');
  const [nlEmail, setNlEmail] = React.useState('');
  const [nlPhone, setNlPhone] = React.useState('');
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
        className={`${activeCard === 0 ? 'flex-1' : 'h-28'} bg-gradient-to-r from-red-900/40 via-red-900/30 to-red-800/20 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer`}
      >
        <div className={`h-full p-6 lg:p-10 flex items-center ${activeCard !== 0 ? 'justify-between' : ''}`}>
          <div className="w-full max-w-7xl mx-auto">
            {activeCard === 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Join the LaunchBox Waitlist</h3>
                  <p className="text-gray-100/90 mb-5">Be first to get invites, resources, and early builds.</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); onWaitlist(); }}
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl shadow-lg hover:from-red-700 hover:to-red-800 transition-colors"
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
                <h3 className="text-2xl md:text-3xl font-bold text-white">Join the LaunchBox Waitlist</h3>
                <span className="text-gray-400">→</span>
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
                    <p className="text-white font-medium">Monday, Nov 13</p>
                    <p className="text-sm text-gray-400">12:00 PM EST</p>
                  </div>
                </div>
                <div onClick={(e) => { e.stopPropagation(); onClassInvite(); }} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Saturday, Nov 18</p>
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
        className={`${activeCard === 2 ? 'flex-1' : 'h-28'} bg-zinc-900/40 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer p-6 lg:p-10 flex items-center`}
      >
        <div className="w-full max-w-7xl mx-auto">
          {activeCard === 2 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Left: Title + Content */}
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Ian's AI Newsletter</h3>
              <p className="text-gray-100/90 text-lg leading-relaxed mb-4">No fluff. Practical tips, small wins, and build-in-public notes—sent occasionally when there's something worth your time.</p>
              <p className="text-gray-400">You can unsubscribe anytime.</p>
            </div>

            {/* Right: Form */}
            <div className="w-full">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const body = `Newsletter signup%0AName: ${nlName}%0AEmail: ${nlEmail}%0APhone: ${nlPhone || 'N/A'}`;
                  const mail = `mailto:ian@ianmcdonald.me?subject=Newsletter%20Signup&body=${body}`;
                  window.location.href = mail;
                }}
                className="rounded-2xl border border-gray-800 bg-black/30 backdrop-blur-md px-6 py-5 space-y-3"
              >
                <div>
                  <label className="block text-sm text-gray-400 mb-1" htmlFor="nl-name">Your name</label>
                  <input
                    id="nl-name"
                    type="text"
                    value={nlName}
                    onChange={(e) => setNlName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
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
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
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
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    placeholder="(555) 555-5555"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button type="submit" className="inline-flex items-center gap-2 h-12 px-7 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-colors w-full sm:w-auto">
                    Subscribe
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

      {/* Section 4: Consulting With Ian */}
      <div
        className={`${activeCard === 3 ? 'flex-1' : 'h-28'} bg-zinc-900/30 overflow-hidden transition-all duration-700 ease-in-out cursor-pointer p-6 lg:p-10 flex items-center`}
      >
        <div className="w-full max-w-7xl mx-auto">
          {activeCard === 3 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Consulting With Ian</h3>
              <div className="flex gap-3 mb-6">
                <button 
                  onClick={(e) => { e.stopPropagation(); setConsultLength('20'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                    consultLength === '20' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  20 min - Free
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setConsultLength('90'); }}
                  className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
                    consultLength === '90' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="line-through text-gray-400 mr-2">$135</span>
                  $89 - 90 min
                </button>
              </div>
              <p className="text-gray-100/90 text-lg leading-relaxed mb-5">Book a 1:1 consult to review your AI product, unblock builds, or plan your launch.</p>
            </div>
            <div className="w-full">
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm px-6 py-5">
                <label className="block text-sm text-gray-400 mb-2">Choose a date</label>
                <input
                  type="date"
                  value={consultDate}
                  onChange={(e) => { e.stopPropagation(); setConsultDate(e.target.value); }}
                  className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Choose time (EST)</label>
                  <input
                    type="time"
                    value={consultTime}
                    step={900}
                    onChange={(e) => { e.stopPropagation(); setConsultTime(e.target.value); }}
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  />
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const body = `I'd like to book a ${consultLength === '20' ? '20 minute (free)' : '90 minute ($89)'} consult on ${consultDate || '[date]'} at ${consultTime} EST.`;
                      const mail = `mailto:ian@ianmcdonald.me?subject=Consulting%20Request&body=${encodeURIComponent(body)}`;
                      window.location.href = mail;
                    }}
                    className="inline-flex items-center gap-2 h-12 px-7 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-colors"
                  >
                    Request Session
                  </button>
                </div>
              </div>
            </div>
          </div>
          ) : (
            <div className="flex items-center justify-between">
              <h3 className="text-2xl md:text-3xl font-bold text-white">Consulting With Ian</h3>
              <span className="text-gray-400">→</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchBox;
