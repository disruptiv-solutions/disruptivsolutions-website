/**
 * Ian McDonald profile photo in `public/` (1:1 PNG). Use with `<img src={IAN_PROFILE_IMAGE_SRC} />`.
 */
export const IAN_PROFILE_IMAGE_SRC = '/ian-profile.png';

/** Absolute URL for emails and OG (pass site origin, no trailing slash). */
export const getIanProfileImageUrl = (siteOrigin: string): string => {
  const base = siteOrigin.replace(/\/$/, '');
  return `${base}${IAN_PROFILE_IMAGE_SRC}`;
};
