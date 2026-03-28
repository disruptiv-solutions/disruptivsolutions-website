/**
 * External URLs in markdown / content should open in a new tab with rel for security.
 */
export const isExternalHref = (href: string | undefined | null): boolean => {
  if (!href || href === '#') return false;
  const t = href.trim().toLowerCase();
  return t.startsWith('http://') || t.startsWith('https://') || t.startsWith('//');
};

export const getExternalLinkProps = (
  href: string | undefined | null
): { target?: '_blank'; rel?: string } => {
  if (!isExternalHref(href)) return {};
  return { target: '_blank', rel: 'noopener noreferrer' };
};
