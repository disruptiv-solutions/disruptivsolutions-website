'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/components/site/PublicPage.module.css';
import { trackFormSubmission, trackButtonClick } from '@/lib/analytics';

const NewsletterSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || submitSuccess) return;
    
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

      const result = await response.json();
      if (result.status !== 'subscribed') throw new Error('Subscription could not be confirmed. Please try again.');
      if (result.newSignup) {
        trackFormSubmission('newsletter_signup', { form_location: 'newsletter_page' });
      }
      setSuccessMessage(result.newSignup ? 'You’re subscribed. Thanks for joining!' : 'You’re already subscribed. Thanks for checking!');

      setSubmitSuccess(true);
      setName('');
      setEmail('');
      setPhone('');

    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.page}>
      <div className={styles.split}>
        <header>
          <p className={styles.eyebrow}>From Ian’s workbench</p>
          <h1>What I’m building.<br />What I’m learning.</h1>
          <p className={styles.intro}>Practical notes on AI, products, and the work behind them. The useful lessons, including the things that didn’t go to plan.</p>
          <p className={styles.meta}>Weekly. Written from experience.</p>
          <Link className={styles.textLink} href="/newsletter-directory">Read a past issue →</Link>
        </header>
        <div className={styles.panel}>
          <h2>Get the next note.</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <label htmlFor="name">Name<input id="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} required disabled={isSubmitting || submitSuccess} placeholder="Your name" /></label>
            <label htmlFor="email">Email<input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting || submitSuccess} placeholder="you@example.com" /></label>
            <label htmlFor="phone">Phone <span>(optional)</span><input id="phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={isSubmitting || submitSuccess} placeholder="Your phone number" /></label>
            {submitSuccess && <p role="status" className={styles.success}>{successMessage}</p>}
            {submitError && <p role="alert">{submitError}</p>}
            <button type="submit" disabled={isSubmitting || submitSuccess} onClick={() => { if (!isSubmitting && !submitSuccess) trackButtonClick('subscribe_newsletter', 'newsletter_page'); }} className={styles.button}>{isSubmitting ? 'Subscribing…' : submitSuccess ? 'You’re subscribed' : 'Send me the notes →'}</button>
            <p className={styles.finePrint}>By subscribing, you’ll receive weekly updates about building AI products and practical insights. You agree to the <Link href="/privacy">Privacy Policy</Link> and consent to being contacted for marketing purposes.</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
