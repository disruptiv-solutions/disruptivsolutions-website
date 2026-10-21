// Google Analytics event tracking utilities
export const GA_MEASUREMENT_ID = 'G-F7F28TQPBP';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Track a custom event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function () {
      // Google's command queue uses Arguments objects, including before gtag.js loads.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer.push(arguments);
    };
  }

  const eventParams = {
    ...params,
    event_category: params?.event_category || 'engagement',
    // Callers use section labels in `location`; GA's page_location is always a URL.
    page_location: window.location.href,
    transport_type: 'beacon',
    ...(new URLSearchParams(window.location.search).has('analytics_test')
      ? { debug_mode: true, test_run_id: new URLSearchParams(window.location.search).get('analytics_test')?.slice(0, 40) }
      : {}),
  };
  
  try {
    window.gtag('event', eventName, eventParams);
  } catch (error) {
    console.error('[Analytics] Error sending event:', eventName, error);
  }
};

/**
 * Track form submission
 */
export const trackFormSubmission = (
  formType: 'newsletter_signup' | 'waitlist_signup' | 'free_class_signup' | 'consulting_request' | 'cohort_signup' | 'speaking_inquiry',
  additionalData?: Record<string, unknown>
): void => {
  trackEvent(formType, {
    event_category: 'form',
    event_label: formType,
    ...additionalData,
  });
};

/**
 * Track button click
 */
export const trackButtonClick = (
  buttonName: string,
  locationOrData?: string | Record<string, unknown>
): void => {
  const extraData: Record<string, unknown> =
    typeof locationOrData === 'string'
      ? { location: locationOrData }
      : (locationOrData ?? {});

  const locationValue = typeof extraData.location === 'string'
    ? (extraData.location as string)
    : typeof locationOrData === 'string'
    ? locationOrData
    : 'unknown';

  trackEvent('button_click', {
    event_category: 'engagement',
    event_label: buttonName,
    button_name: buttonName,
    ...extraData,
    location: locationValue,
  });
};

/**
 * Track external link click
 */
export const trackExternalLink = (
  url: string,
  linkText?: string
): void => {
  trackEvent('external_link_click', {
    event_category: 'outbound',
    event_label: linkText || url,
    link_url: url,
    link_text: linkText,
  });
};

/**
 * Track a handoff to Disruptiv. This measures intent, not a completed inquiry.
 */
export const trackDisruptivVisit = (url: string, location: string): void => {
  trackEvent('disruptiv_visit', {
    event_category: 'outbound',
    link_url: url,
    link_location: location,
  });
};

/** Track video play. */
export const trackVideoPlay = (
  videoName: string
): void => {
  trackEvent('video_play', {
    event_category: 'engagement',
    event_label: videoName,
    video_name: videoName,
  });
};

/**
 * Track section view
 */
export const trackSectionView = (
  sectionName: string
): void => {
  trackEvent('section_view', {
    event_category: 'engagement',
    event_label: sectionName,
    section_name: sectionName,
  });
};

