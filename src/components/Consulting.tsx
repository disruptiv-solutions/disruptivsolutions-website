'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const Consulting: React.FC = () => {
  const [consultDate, setConsultDate] = React.useState('');
  const [consultTime, setConsultTime] = React.useState('12:00');
  const [consultLength, setConsultLength] = React.useState<'20' | '90'>('20');

  return (
    <section 
      id="consulting"
      className="bg-black snap-start py-20 lg:py-0"
    >
      <div className="max-w-7xl mx-auto px-6 w-full lg:h-[calc(100vh-65px)]">
        <div className="lg:h-full flex items-center pt-16 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                Consulting With Ian
              </h2>
              <div className="flex flex-wrap gap-3 mb-8">
                <button 
                  onClick={() => setConsultLength('20')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    consultLength === '20' 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/5'
                  }`}
                >
                  20 min - Free
                </button>
                <button 
                  onClick={() => setConsultLength('90')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    consultLength === '90' 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/5'
                  }`}
                >
                  <span className="line-through text-gray-400 mr-2">$135</span>
                  $89 - 90 min
                </button>
              </div>
              <p className="text-gray-100/90 text-lg leading-relaxed mb-6">
                Book a 1:1 consult to review your AI product, unblock builds, or plan your launch.
              </p>
              <div className="space-y-3 text-gray-400">
                <p className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span>Get unstuck on your build</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span>Review your AI product strategy</span>
                </p>
                <p className="flex items-start gap-3">
                  <span className="text-red-600 font-bold mt-1">✓</span>
                  <span>Plan your launch roadmap</span>
                </p>
              </div>
            </div>
            
            <div className="w-full">
              <div className="rounded-2xl border border-red-600/20 bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm px-6 py-6 shadow-xl">
                <label className="block text-sm text-gray-400 mb-2">Choose a date</label>
                <input
                  type="date"
                  value={consultDate}
                  onChange={(e) => setConsultDate(e.target.value)}
                  className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 mb-4"
                />

                <div className="mt-4">
                  <label className="block text-sm text-gray-400 mb-2">Choose time (EST)</label>
                  <input
                    type="time"
                    value={consultTime}
                    step={900}
                    onChange={(e) => setConsultTime(e.target.value)}
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                  />
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => {
                      const body = `I'd like to book a ${consultLength === '20' ? '20 minute (free)' : '90 minute ($89)'} consult on ${consultDate || '[date]'} at ${consultTime} EST.`;
                      const mail = `mailto:ian@ianmcdonald.me?subject=Consulting%20Request&body=${encodeURIComponent(body)}`;
                      window.location.href = mail;
                    }}
                    className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:scale-105"
                  >
                    Request Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Consulting;

