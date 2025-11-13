// Google Analytics event tracking utilities

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Check if gtag is available
 */
const isGtagAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.gtag === 'function';
};

/**
 * Track a custom event
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (!isGtagAvailable()) {
    console.warn('[Analytics] Google Analytics not loaded');
    return;
  }

  const eventParams = {
    ...params,
    event_category: params?.event_category || 'engagement',
  };

  console.log('[Analytics] Tracking event:', eventName, eventParams);
  
  try {
    window.gtag('event', eventName, eventParams);
    console.log('[Analytics] Event sent successfully:', eventName);
  } catch (error) {
    console.error('[Analytics] Error sending event:', eventName, error);
  }
};

/**
 * Track form submission
 */
export const trackFormSubmission = (
  formType: 'newsletter_signup' | 'waitlist_signup' | 'free_class_signup' | 'consulting_request' | 'cohort_signup',
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
 * Track video play
 */
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

