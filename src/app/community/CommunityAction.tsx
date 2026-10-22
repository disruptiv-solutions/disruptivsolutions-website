"use client";

import type { ReactNode } from 'react';
import { trackCommunityVisit, trackExternalLink } from '@/lib/analytics';
import { IAN_COMMUNITY_URL } from '@/lib/ian-community';

export default function CommunityAction({ action = 'join', location, className, children }: {
  action?: 'join' | 'build';
  location: string;
  className?: string;
  children: ReactNode;
}) {
  const href = action === 'join' ? IAN_COMMUNITY_URL : 'https://www.launchbox.space/build';
  return <a href={href} className={className} onClick={() => {
    if (action === 'join') trackCommunityVisit(location);
    else trackExternalLink(href, 'Build my community preview');
  }}>{children}<span aria-hidden="true">↗</span></a>;
}
