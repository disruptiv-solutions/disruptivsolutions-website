'use client';

import React, { useState } from 'react';
import Navigation from './Navigation';
import { trackFormSubmission, trackButtonClick } from '@/lib/analytics';

const CohortSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Calculate next Thursday
  const getNextThursday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 4 = Thursday
    const daysUntilThursday = (4 - dayOfWeek + 7) % 7 || 7;
    const nextThursday = new Date(today);
    nextThursday.setDate(today.getDate() + daysUntilThursday);
    return nextThursday.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

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
      type: 'cohort',
      timestamp: new Date().toISOString()
    };

    try {
      console.log('[CohortSignup] Form submission started');
      
      const response = await fetch('/api/cohort-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
      });

      console.log('[CohortSignup] API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[CohortSignup] API error:', errorData);
        throw new Error(errorData.error || 'Failed to submit signup. Please try again.');
      }

      console.log('[CohortSignup] Webhook success');
      setSubmitSuccess(true);
      
      // Track form submission
      trackFormSubmission('cohort_signup', {
        page_location: '/cohort',
      });

      // Track Meta Pixel CompleteRegistration event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'CompleteRegistration');
        console.log('[CohortSignup] Meta Pixel CompleteRegistration event tracked');
      }
      
      // Reset form after successful submission
      setName('');
      setEmail('');
      setPhone('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentClick = () => {
    trackButtonClick('cohort_payment', {
      page_location: '/cohort',
    });
    // Open payment link in new tab
    window.open('https://buy.stripe.com/your-payment-link', '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Navigation />
      <section className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Group Cohort
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">
              4-Week Intensive: Master AI App Development Fundamentals
            </p>
            <div className="inline-block bg-red-600/20 border border-red-500/40 rounded-lg px-4 py-2 mt-4">
              <p className="text-lg font-semibold text-red-400">
                First Cohort Begins: {getNextThursday()}
              </p>
            </div>
          </div>

          {/* Course Overview */}
          <div className="bg-gradient-to-br from-red-700/20 to-transparent border border-red-500/40 rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              What You'll Learn
            </h2>
            <p className="text-lg text-gray-300 mb-8 text-center">
              Master the 4 core fundamentals of AI app development through hands-on, interactive lessons and live cohort sessions.
            </p>

            {/* 4 Course Parts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Part 1 */}
              <div className="bg-zinc-900/60 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-white">Ideation & MVP Setting</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Learn how to identify viable app ideas, validate concepts quickly, and set up your minimum viable product framework.
                </p>
              </div>

              {/* Part 2 */}
              <div className="bg-zinc-900/60 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">
                    2
                  </div>
                  <h3 className="text-xl font-bold text-white">Development Principles</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Master authentication, user roles, pricing strategies, payment integration, and user support systems.
                </p>
              </div>

              {/* Part 3 */}
              <div className="bg-zinc-900/60 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">
                    3
                  </div>
                  <h3 className="text-xl font-bold text-white">Getting to Launch</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Navigate the final steps to launch: testing, deployment, marketing preparation, and go-live strategies.
                </p>
              </div>

              {/* Part 4 */}
              <div className="bg-zinc-900/60 border border-red-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold text-white">
                    4
                  </div>
                  <h3 className="text-xl font-bold text-white">Questions & Maintenance</h3>
                </div>
                <p className="text-gray-300 text-sm">
                  Post-launch support, handling user feedback, maintenance best practices, and scaling your app.
                </p>
              </div>
            </div>
          </div>

          {/* Course Structure */}
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Course Structure
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">4 Interactive Lessons</h3>
                  <p className="text-gray-300 text-sm">
                    Complete interactive presentations and hands-on work directly in the app. Each lesson builds on the previous one.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">💬</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">4 Live Cohort Calls</h3>
                  <p className="text-gray-300 text-sm">
                    Weekly 1-hour live sessions to review progress, answer questions, and provide direct feedback on your builds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">👥</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Small Group (Max 10 People)</h3>
                  <p className="text-gray-300 text-sm">
                    Get personalized attention and connect with other builders in an intimate, supportive environment. Collaborate, share ideas, and learn from each other's builds.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">🤝</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Peer Collaboration</h3>
                  <p className="text-gray-300 text-sm">
                    Work together with your cohort members, share progress, get feedback, and build lasting connections. You're not just learning—you're building a network of fellow creators.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-2xl">📧</div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">Email Communication</h3>
                  <p className="text-gray-300 text-sm">
                    You'll receive detailed follow-up emails with course materials, session recordings, and additional resources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gradient-to-br from-red-600/20 to-red-700/10 border-2 border-red-500/50 rounded-2xl p-8 mb-8 text-center">
            <div className="mb-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                <span className="text-gray-400 text-xl line-through">$497</span>
                <span className="text-5xl font-bold text-red-400">$297</span>
              </div>
              <p className="text-gray-300 text-sm">Workshop attendee pricing</p>
            </div>
            <p className="text-gray-300 mb-6">
              Includes all 4 interactive lessons, 4 live cohort calls, course materials, peer collaboration opportunities, and ongoing email support.
            </p>
            <button
              onClick={handlePaymentClick}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/40 text-lg"
            >
              Secure Your Spot →
            </button>
          </div>

          {/* Signup Form */}
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">
              Reserve Your Spot
            </h2>
            <p className="text-gray-300 text-center mb-6">
              Sign up below and we'll send you all the details via email. Payment link will be provided after signup. Join a community of builders who learn and grow together.
            </p>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-600/20 border border-green-500/40 rounded-lg text-green-400 text-center">
                Thank you! We'll be in touch soon with more information.
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-600/20 border border-red-500/40 rounded-lg text-red-400 text-center">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  placeholder="(555) 123-4567"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Join the Cohort'}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-4">
              By submitting this form, you agree to our Privacy Policy and consent to being contacted about the cohort.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default CohortSignup;

