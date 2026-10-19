'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { GA_MEASUREMENT_ID, trackEvent } from '@/lib/analytics';

export default function GoogleAnalytics() {
  useEffect(() => {
    const trackBooking = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.hostname === 'calendar.app.google' ||
          (url.hostname === 'calendar.google.com' && url.pathname.includes('/appointments/'))) {
        // This is booking intent. Only the calendar can confirm a completed appointment.
        trackEvent('booking_open', { booking_provider: 'google_calendar', link_url: url.origin + url.pathname });
      }
    };
    document.addEventListener('click', trackBooking);
    return () => document.removeEventListener('click', trackBooking);
  }, []);

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
