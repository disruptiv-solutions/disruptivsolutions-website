'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const SpeakingStickyCta = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const bookSection = document.getElementById('book');
      const bookTop = bookSection?.getBoundingClientRect().top ?? Infinity;
      setVisible(window.scrollY > 480 && bookTop > window.innerHeight * 0.35);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-zinc-950/95 p-3 backdrop-blur-md transition-transform duration-300 lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full pointer-events-none'
      )}
      aria-hidden={!visible}
    >
      <a
        href="#book"
        className="flex h-12 w-full items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-base font-semibold text-white shadow-lg shadow-red-600/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
      >
        Book Ian for your event
      </a>
    </div>
  );
};

export default SpeakingStickyCta;
