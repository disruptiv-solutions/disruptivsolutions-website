'use client';

import { usePathname } from 'next/navigation';

/**
 * Renders the global footer everywhere except the app-like workshop kit
 * builder, where a full-height tool + fixed mobile step bar make a marketing
 * footer out of place. The Learn hub and other lessons keep their footer.
 */
export default function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/learn/supplier-readiness-builder') return null;
  return <>{children}</>;
}
