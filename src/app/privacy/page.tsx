'use client';

import React from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <section className="min-h-screen pt-24 px-6 py-12 lg:py-20 bg-black">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <p className="text-sm text-gray-400 mb-8">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">1. Introduction</h2>
              <p>
                Disruptiv Solutions LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates this website 
                (the &quot;Service&quot;). This Privacy Policy informs you of our policies regarding the collection, 
                use, and disclosure of personal information when you use our Service.
              </p>
              <p>
                By using our Service and providing your information, you agree to the collection and use of 
                information in accordance with this policy.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">2. Information We Collect</h2>
              <p>We collect the following types of personal information when you interact with our Service:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Contact Information:</strong> Name, email address, and phone number (optional)</li>
                <li><strong>Event Information:</strong> Session preferences, class selections, and attendance details</li>
                <li><strong>Usage Data:</strong> Information about how you access and use our Service, including page views, 
                  clicks, and interactions (collected via Google Analytics)</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Event Management:</strong> To register you for events, classes, and sessions, and to send 
                  you confirmations and event-related communications</li>
                <li><strong>Lead Generation:</strong> To contact you about our services, products, and opportunities 
                  that may be of interest to you</li>
                <li><strong>Marketing Communications:</strong> To send you newsletters, updates, promotional materials, 
                  and information about Launchbox, consulting services, and other offerings (with your consent where required)</li>
                <li><strong>Service Improvement:</strong> To analyze usage patterns and improve our Service</li>
                <li><strong>Customer Support:</strong> To respond to your inquiries and provide customer service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">4. Data Sharing and Storage</h2>
              <p>We use third-party services to process and store your information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Make.com:</strong> We use Make.com webhooks to process form submissions and manage 
                  your contact information</li>
                <li><strong>Google Analytics:</strong> We use Google Analytics to track website usage and behavior 
                  (see Google&apos;s Privacy Policy for details)</li>
                <li><strong>Vercel:</strong> Our website is hosted on Vercel, which may process and store data 
                  in connection with website operations</li>
              </ul>
              <p className="mt-4">
                We do not sell your personal information to third parties. We may share your information only 
                as necessary to provide our services, comply with legal obligations, or protect our rights.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">5. Your Rights</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to the personal information we hold about you</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time by clicking 
                  the unsubscribe link in our emails or contacting us directly</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format</li>
              </ul>
              <p className="mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:ian@ianmcdonald.ai" className="text-red-500 hover:text-red-400 underline">
                  ian@ianmcdonald.ai
                </a>
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our Service and hold certain 
                information. You can instruct your browser to refuse all cookies or to indicate when a cookie is 
                being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">7. Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. However, no method of 
                transmission over the Internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">8. Children&apos;s Privacy</h2>
              <p>
                Our Service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13. If you are a parent or guardian and believe your 
                child has provided us with personal information, please contact us.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">9. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white mt-8 mb-4">10. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-zinc-900/50 p-4 rounded-lg mt-4">
                <p className="mb-2">
                  <strong className="text-white">Disruptiv Solutions LLC</strong>
                </p>
                <p>
                  Email:{' '}
                  <a href="mailto:ian@ianmcdonald.ai" className="text-red-500 hover:text-red-400 underline">
                    ian@ianmcdonald.ai
                  </a>
                </p>
                <p>Location: Pensacola, FL</p>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/"
              className="text-red-500 hover:text-red-400 underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

