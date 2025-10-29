'use client';

/* eslint-disable react/no-unescaped-entities */
import React from 'react';

const Consulting: React.FC = () => {
  const [consultName, setConsultName] = React.useState('');
  const [consultEmail, setConsultEmail] = React.useState('');
  const [consultDate, setConsultDate] = React.useState('');
  const [consultTime, setConsultTime] = React.useState('12:00');
  const [consultLength, setConsultLength] = React.useState<'20' | '90'>('20');
  const [showForm, setShowForm] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  return (
    <section 
      id="consulting"
      className="bg-black snap-start pt-[65px] pb-20 lg:py-0 min-h-screen"
    >
      <div className="max-w-7xl mx-auto px-6 w-full h-[calc(100vh-65px)] lg:h-[calc(100vh-65px)]">
        <div className="h-full flex items-center justify-center pt-0 lg:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
            {/* Left: Content or Form based on state */}
            <div className="space-y-6">
              {!showForm ? (
                <>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    Consulting With Ian
                  </h2>
                  <div className="flex flex-row gap-3 mb-8">
                    <button 
                      onClick={() => setConsultLength('20')}
                      className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                        consultLength === '20' 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/5'
                      }`}
                    >
                      20 min - Free
                    </button>
                    <button 
                      onClick={() => setConsultLength('90')}
                      className={`flex-1 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
                        consultLength === '90' 
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/50' 
                          : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/5'
                      }`}
                    >
                      $89 - 90 min
                    </button>
                  </div>
                  <p className="text-gray-100/90 text-lg leading-relaxed mb-6">
                    Book a 1:1 consult to review your AI product, unblock builds, or plan your launch.
                  </p>
                  <div className="space-y-3 text-gray-400 mb-6">
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
                </>
              ) : (
                <>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                    Book Your Session
                  </h2>
                  <div className="rounded-2xl border border-red-600/20 bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm px-4 sm:px-6 py-6 shadow-xl space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Your name</label>
                      <input
                        type="text"
                        value={consultName}
                        onChange={(e) => setConsultName(e.target.value)}
                        required
                        className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                        placeholder="Jane Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Your email</label>
                      <input
                        type="email"
                        value={consultEmail}
                        onChange={(e) => setConsultEmail(e.target.value)}
                        required
                        className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                        placeholder="you@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Choose a date</label>
                      <input
                        type="date"
                        value={consultDate}
                        onChange={(e) => setConsultDate(e.target.value)}
                        required
                        className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Choose time (EST)</label>
                      <input
                        type="time"
                        value={consultTime}
                        step={900}
                        onChange={(e) => setConsultTime(e.target.value)}
                        required
                        className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                      />
                    </div>
                    {/* Success/Error Messages */}
                    {submitSuccess && (
                      <div className="p-3 rounded-lg bg-green-900/30 border border-green-600/50">
                        <p className="text-green-400 text-sm font-medium">
                          ✓ Successfully requested session! You'll receive a confirmation email shortly.
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

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setSubmitSuccess(false);
                          setSubmitError(null);
                        }}
                        className="flex-1 h-12 px-6 border-2 border-gray-600 text-white text-base font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!consultName || !consultEmail || !consultDate || !consultTime) {
                            setSubmitError('Please fill in all required fields');
                            return;
                          }

                          setIsSubmitting(true);
                          setSubmitError(null);

                          const webhookData = {
                            name: consultName,
                            email: consultEmail,
                            date: consultDate,
                            time: consultTime,
                            sessionLength: consultLength === '20' ? '20 minutes (free)' : '90 minutes ($89)',
                            timestamp: new Date().toISOString()
                          };

                          try {
                            const response = await fetch('/api/consulting', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                              },
                              body: JSON.stringify(webhookData),
                            });

                            const contentType = response.headers.get('content-type');
                            if (!contentType || !contentType.includes('application/json')) {
                              throw new Error('Server returned an invalid response. Please try again.');
                            }

                            if (!response.ok) {
                              const errorData = await response.json().catch(() => ({ error: 'Failed to submit consulting request. Please try again.' }));
                              throw new Error(errorData.error || 'Failed to submit consulting request. Please try again.');
                            }

                            setSubmitSuccess(true);
                            setConsultName('');
                            setConsultEmail('');
                            setConsultDate('');
                            setConsultTime('12:00');

                            setTimeout(() => {
                              setSubmitSuccess(false);
                              setShowForm(false);
                            }, 5000);
                          } catch (error) {
                            setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
                          } finally {
                            setIsSubmitting(false);
                          }
                        }}
                        disabled={isSubmitting}
                        className="flex-1 h-12 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Request Session'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            {/* Right: Pick a time button (mobile) or form (desktop) */}
            <div className="w-full">
              {showForm ? null : (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full lg:hidden h-12 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50"
                >
                  Pick a Time
                </button>
              )}
              {/* Desktop form */}
              <div className="hidden lg:block">
                <div className="rounded-2xl border border-red-600/20 bg-gradient-to-br from-zinc-900/50 to-black/50 backdrop-blur-sm px-6 py-6 shadow-xl space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your name</label>
                    <input
                      type="text"
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Your email</label>
                    <input
                      type="email"
                      value={consultEmail}
                      onChange={(e) => setConsultEmail(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                      placeholder="you@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Choose a date</label>
                    <input
                      type="date"
                      value={consultDate}
                      onChange={(e) => setConsultDate(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Choose time (EST)</label>
                    <input
                      type="time"
                      value={consultTime}
                      step={900}
                      onChange={(e) => setConsultTime(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                  {/* Success/Error Messages */}
                  {submitSuccess && (
                    <div className="p-3 rounded-lg bg-green-900/30 border border-green-600/50">
                      <p className="text-green-400 text-sm font-medium">
                        ✓ Successfully requested session! You'll receive a confirmation email shortly.
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

                  <div className="pt-2 flex justify-center">
                    <button
                      type="button"
                      onClick={async () => {
                        if (!consultName || !consultEmail || !consultDate || !consultTime) {
                          setSubmitError('Please fill in all required fields');
                          return;
                        }

                        setIsSubmitting(true);
                        setSubmitError(null);

                        const webhookData = {
                          name: consultName,
                          email: consultEmail,
                          date: consultDate,
                          time: consultTime,
                          sessionLength: consultLength === '20' ? '20 minutes (free)' : '90 minutes ($89)',
                          timestamp: new Date().toISOString()
                        };

                        try {
                          const response = await fetch('/api/consulting', {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(webhookData),
                          });

                          const contentType = response.headers.get('content-type');
                          if (!contentType || !contentType.includes('application/json')) {
                            throw new Error('Server returned an invalid response. Please try again.');
                          }

                          if (!response.ok) {
                            const errorData = await response.json().catch(() => ({ error: 'Failed to submit consulting request. Please try again.' }));
                            throw new Error(errorData.error || 'Failed to submit consulting request. Please try again.');
                          }

                          setSubmitSuccess(true);
                          setConsultName('');
                          setConsultEmail('');
                          setConsultDate('');
                          setConsultTime('12:00');

                          setTimeout(() => {
                            setSubmitSuccess(false);
                          }, 5000);
                        } catch (error) {
                          setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-red-600 to-red-700 text-white text-base font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Submitting...' : 'Request Session'}
                    </button>
                  </div>
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

