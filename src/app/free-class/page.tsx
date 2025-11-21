'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import ClassSignup from '@/components/ClassSignup';

export default function FreeClassPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    date: '12/4/25 12:00 PM EST',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Meta Pixel Code */}
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '2095551517874917');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src="https://www.facebook.com/tr?id=2095551517874917&ev=PageView&noscript=1"
          alt=""
        />
      </noscript>
      {/* End Meta Pixel Code */}

      <div className="min-h-screen bg-black">
        <ClassSignup />

        <div className="max-w-5xl mx-auto px-6 pt-12 pb-12">
          <div className="bg-zinc-900 border border-gray-800 rounded-3xl p-6 space-y-6 mb-10">
            <p className="text-sm uppercase tracking-widest text-gray-400">Join the next free class</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Choose your session &amp; lock in your spot
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Select either <strong>Dec 4th</strong> or <strong>Dec 6th at 12pm EST</strong> and we&apos;ll send the calendar invite plus reminders, updates, and bonus resources straight to your inbox.
            </p>
            <p className="text-sm text-gray-500">
              Use the form above to sign up for the class, choose your preferred session, and make sure you&apos;re subscribed to updates.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

