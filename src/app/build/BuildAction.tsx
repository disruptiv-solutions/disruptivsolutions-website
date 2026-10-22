"use client";

import type { ReactNode } from 'react';
import { trackDisruptivVisit } from '@/lib/analytics';

export default function BuildAction({ destination = 'project', location, className, children }: {
  destination?: 'project' | 'services';
  location: string;
  className?: string;
  children: ReactNode;
}) {
  const href = destination === 'project' ? 'https://www.disruptiv.solutions/contact' : 'https://www.disruptiv.solutions/';
  return <a href={href} className={className} onClick={() => trackDisruptivVisit(href, location)}>{children}<span aria-hidden="true">↗</span></a>;
}
