'use client';

import React, { useState } from 'react';
import Navigation from './Navigation';
import { trackFormSubmission, trackButtonClick } from '@/lib/analytics';

const LaunchboxWaitlist: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      setSubmitError('Please fill in your name and email.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const webhookData = {
      name,
      email,
      phone: phone || 'N/A',
      subscribeNewsletter,
      listType: 'launchbox_founding_member_waitlist',
      timestamp: new Date().toISOString(),
    };

    try {
      console.log('[LaunchboxWaitlist] Form submission started');
      console.log('[LaunchboxWaitlist] Sending webhook data:', webhookData);
      
      const response = await fetch('/api/waitlist-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });
      
      console.log('[LaunchboxWaitlist] API response status:', response.status);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please try again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to join waitlist. Please try again.' }));
        throw new Error(errorData.error || 'Failed to join waitlist. Please try again.');
      }

      console.log('[LaunchboxWaitlist] Webhook success');
      
      // Track waitlist signup
      console.log('[LaunchboxWaitlist] Tracking analytics event');
      trackFormSubmission('waitlist_signup', {
        with_newsletter: subscribeNewsletter,
        page_location: '/waitlist',
        list_type: 'launchbox_founding_member_waitlist',
      });

      // If newsletter checkbox is checked, also submit to newsletter webhook
      if (subscribeNewsletter) {
        console.log('[LaunchboxWaitlist] Also sending to newsletter webhook');
        try {
          const newsletterResponse = await fetch('/api/newsletter-signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData),
          });
          console.log('[LaunchboxWaitlist] Newsletter webhook response:', newsletterResponse.status);
          // Note: We don't fail the whole submission if newsletter signup fails
        } catch (newsletterError) {
          console.error('[LaunchboxWaitlist] Newsletter signup error:', newsletterError);
        }
      }

      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubscribeNewsletter(false);

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navigation />
      <section className="min-h-screen pt-[65px] px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src="/launchbox-no-text.png" 
                alt="Launchbox Logo" 
                className="h-20 md:h-24 w-auto"
              />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Join the Launchbox Founding Member List
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-4">
              Raise your hand early, lock in founding member pricing, and get first access when Launchbox goes live.
            </p>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
              No payment today. This just tells me you want to be first in line when I open the doors.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-zinc-900/60 rounded-2xl border border-gray-800 p-8 lg:p-12">
            {/* Quick expectations box */}
            <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-100">
              <p className="font-semibold mb-1">What this means:</p>
              <ul className="list-disc list-inside space-y-1 text-amber-50/90">
                <li>You&apos;ll get behind-the-scenes updates as I build Launchbox.</li>
                <li>You&apos;ll be first to hear when the platform is ready for private beta.</li>
                <li>You&apos;ll get access to the lowest founding member pricing when I launch paid plans.</li>
              </ul>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-2">Your Information</h2>
                
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm text-gray-400 mb-2">
                    Phone <span className="text-gray-500 text-xs">(optional)</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                    placeholder="(555) 555-5555"
                  />
                </div>

                {/* Newsletter Checkbox */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="newsletter-waitlist"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="mt-1 w-5 h-5 text-red-600 bg-zinc-900 border-gray-700 rounded focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                  />
                  <label htmlFor="newsletter-waitlist" className="text-gray-300 cursor-pointer text-sm">
                    I&apos;d also like to sign up for the newsletter
                  </label>
                </div>
              </div>

              {/* Success/Error Messages */}
              {submitSuccess && (
                <div className="p-4 rounded-lg bg-green-900/30 border border-green-600/50">
                  <p className="text-green-400 font-medium">
                    ✓ You&apos;re on the Launchbox founding member list! You&apos;ll get early access updates and the lowest pricing when Launchbox goes live.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="p-4 rounded-lg bg-red-900/30 border border-red-600/50">
                  <p className="text-red-400 font-medium">
                    {submitError}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (!isSubmitting) {
                      trackButtonClick('join_waitlist', 'waitlist_page');
                    }
                  }}
                  className="w-full px-8 py-4 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  style={{ backgroundColor: '#ea580c' }}
                >
                  {isSubmitting ? 'Joining...' : 'Join the Founding Member List'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  By joining, you&apos;ll be notified about Launchbox&apos;s private beta, launch timeline, and founding member pricing.
                  <br />
                  By submitting this form, you agree to our{' '}
                  <a href="/privacy" className="text-red-500 hover:text-red-400 underline" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                  </a>
                  {' '}and consent to being contacted for marketing purposes.
                </p>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center text-gray-400">
            <p className="mb-2">Questions? Email me at</p>
            <a 
              href="mailto:ian@ianmcdonald.ai" 
              className="text-red-500 hover:text-red-400 underline"
            >
              ian@ianmcdonald.ai
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default LaunchboxWaitlist;
