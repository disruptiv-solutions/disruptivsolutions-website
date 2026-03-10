'use client';

import Script from 'next/script';

const GA_ID = 'G-F7F28TQPBP';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
        onError={() => {
          // Silently fail - don't block layout
          if (typeof window !== 'undefined') {
            (window as unknown as { gtag?: () => void }).gtag = () => {};
          }
        }}
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
