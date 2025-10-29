'use client';

import React, { useState } from 'react';
import Navigation from './Navigation';

const NewsletterSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      setName('');
      setEmail('');
      setPhone('');

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
      <section className="min-h-screen pt-24 px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Join My Newsletter
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Weekly builds, lessons, and behind-the-scenes of building AI products. Get practical insights delivered to your inbox.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-zinc-900/60 rounded-2xl border border-gray-800 p-8 lg:p-12">
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
              </div>

              {/* Success/Error Messages */}
              {submitSuccess && (
                <div className="p-4 rounded-lg bg-green-900/30 border border-green-600/50">
                  <p className="text-green-400 font-medium">
                    ✓ Successfully subscribed! Check your email for confirmation.
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
                  className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  By subscribing, you&apos;ll receive weekly updates about building AI products and practical insights.
                </p>
              </div>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-center text-gray-400">
            <p className="mb-2">Questions? Email me at</p>
            <a 
              href="mailto:ian@ianmcdonald.me" 
              className="text-red-500 hover:text-red-400 underline"
            >
              ian@ianmcdonald.me
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsletterSignup;

