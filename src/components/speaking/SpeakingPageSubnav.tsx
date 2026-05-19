'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const NAV_ITEMS = [
  { label: 'Fit', href: '#fit' },
  { label: 'Talks', href: '#talks' },
  { label: 'Proof', href: '#proof' },
  { label: 'Stage', href: '#stage' },
  { label: 'Book', href: '#book' },
] as const;

const SpeakingPageSubnav = () => {
  const [activeHash, setActiveHash] = useState('');

  useEffect(() => {
    const syncHash = () => setActiveHash(window.location.hash);
    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-[65px] z-30 border-b border-white/[0.06] bg-[#040404]/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <ul className="flex list-none flex-wrap items-center justify-center gap-2 p-0 m-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70',
                    isActive
                      ? 'border-red-500/50 bg-red-500/15 text-white'
                      : 'border-white/10 bg-white/[0.03] text-zinc-400 hover:border-white/20 hover:bg-white/[0.06] hover:text-zinc-100'
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default SpeakingPageSubnav;
