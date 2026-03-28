/** LaunchBox product site — CTAs from newsletter / brief templates point here */
export const LAUNCHBOX_SITE_URL = 'https://launchbox.space';

/** Spread on every `<a href={LAUNCHBOX_SITE_URL}>` so links always open in a new tab */
export const LAUNCHBOX_LINK_NEW_TAB = {
  target: '_blank' as const,
  rel: 'noopener noreferrer' as const,
};

/** Short promo blurb (sidebar cards) */
export const LAUNCHBOX_PROMO_SHORT =
  'Stop renting. Own your platform. A white-label AI workspace for creators, coaches, and communities — your brand, your courses, direct Stripe payouts.';

/** Longer promo (footer card) */
export const LAUNCHBOX_PROMO_LONG =
  'LaunchBox is a white-label AI workspace for creators, coaches, and communities. Your brand, your courses, your subscribers — one seamless home. Launch Kit: $39.99 first month, then $49.99/mo.';

export const LAUNCHBOX_CTA_LABEL = 'Start with Launch Kit';

/** Source repo for platform updates (e.g. weekly changelog newsletter via GitHub API) */
export const LAUNCHBOX_GITHUB_REPO_FULL_NAME = 'disruptiv-solutions/launchbox-unified1' as const;

export const LAUNCHBOX_GITHUB_REPO_URL =
  'https://github.com/disruptiv-solutions/launchbox-unified1' as const;
