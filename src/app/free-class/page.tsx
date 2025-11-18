'use client';

import React, { useState } from 'react';
import Script from 'next/script';
import ClassSignup from '@/components/ClassSignup';

export default function FreeClassPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    date: '11/4/25 12:00 PM EST',
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
        <div className="max-w-5xl mx-auto px-6 pt-12">
          <div className="bg-zinc-900 border border-gray-800 rounded-3xl p-6 space-y-6 mb-10">
            <p className="text-sm uppercase tracking-widest text-gray-400">Join the next free class</p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Choose your session &amp; lock in your spot
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Select either <strong>Nov 4th</strong> or <strong>Nov 6th at 12pm EST</strong> and we&apos;ll send the calendar invite plus reminders, updates, and bonus resources straight to your inbox.
            </p>
            <form className="space-y-4" onSubmit={handleSubmit} aria-label="Free class signup form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                  First name *
                  <input
                    value={formState.name}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, name: event.target.value }))
                    }
                    required
                    className="mt-1 px-3 py-2 rounded-xl bg-black border border-gray-700 text-white focus:border-red-500 outline-none"
                  />
                </label>
                <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                  Email *
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, email: event.target.value }))
                    }
                    required
                    className="mt-1 px-3 py-2 rounded-xl bg-black border border-gray-700 text-white focus:border-red-500 outline-none"
                  />
                </label>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-xs uppercase tracking-wide text-gray-400">Preferred session *</legend>
                <label className="flex items-center gap-3 text-sm text-gray-200">
                  <input
                    type="radio"
                    name="class-date"
                    value="11/4/25 12:00 PM EST"
                    checked={formState.date === '11/4/25 12:00 PM EST'}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, date: event.target.value }))
                    }
                    className="accent-red-600"
                  />
                  Nov 4th · 12:00 PM EST
                </label>
                <label className="flex items-center gap-3 text-sm text-gray-200">
                  <input
                    type="radio"
                    name="class-date"
                    value="11/6/25 12:00 PM EST"
                    checked={formState.date === '11/6/25 12:00 PM EST'}
                    onChange={(event) =>
                      setFormState((prev) => ({ ...prev, date: event.target.value }))
                    }
                    className="accent-red-600"
                  />
                  Nov 6th · 12:00 PM EST
                </label>
              </fieldset>

              <button
                type="submit"
                className="w-full rounded-2xl px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 font-semibold hover:from-red-700 hover:to-red-800 transition-all"
              >
                {submitted ? 'Request received' : 'Join the session'}
              </button>
              {submitted && (
                <p className="text-green-400 text-sm">
                  Thanks! Watch your inbox for the invite and reminders.
                </p>
              )}
            </form>
          </div>
        </div>

        <ClassSignup />
      </div>
    </>
  );
}

