'use client';

import { usePathname } from 'next/navigation';

/**
 * Renders the global footer everywhere except the app-like workshop kit
 * builder routes (/kits/<slug>), where a full-height tool + fixed mobile step
 * bar make a marketing footer out of place. The /kits index keeps its footer.
 */
export default function ConditionalFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/' || pathname?.startsWith('/kits/')) return null;
  return <>{children}</>;
}
