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
      className="pointer-events-none sticky top-[65px] z-30 -mb-2 hidden sm:block px-4 pt-2 sm:px-6"
    >
      <div className="mx-auto flex max-w-7xl justify-center">
        <ul className="pointer-events-auto flex list-none flex-wrap items-center justify-center gap-2 p-0 m-0">
          {NAV_ITEMS.map((item) => {
            const isActive = activeHash === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={cn(
                    'inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium shadow-lg shadow-black/40 backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500/70',
                    isActive
                      ? 'border-red-500/50 bg-zinc-950/90 text-white shadow-red-950/50'
                      : 'border-white/10 bg-zinc-950/75 text-zinc-300 hover:border-white/25 hover:bg-zinc-900/90 hover:text-white'
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
