'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { IAN_SOCIAL_URLS } from '@/lib/ian-social-links';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Hide footer on class-2 slide pages
  if (pathname?.startsWith('/resources/classes/class-2/slide-')) {
    return null;
  }

  if (pathname?.startsWith('/launchbox-weekly')) {
    return null;
  }

  return (
    <footer className="bg-black border-t border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="text-center md:text-left">
            <span className="text-xl font-bold text-white">
              Ian McDonald
            </span>
            <p className="text-gray-500 text-sm mt-1">
              Disruptiv Solutions LLC
            </p>
            <p className="text-gray-500 text-sm">
              Building AI solutions that matter
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-gray-400 text-sm">
            <a href="#hero" className="hover:text-white transition-colors">
              Home
            </a>
            <a href="#mystory" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#work" className="hover:text-white transition-colors">
              Work
            </a>
            <a href="#launchbox" className="hover:text-white transition-colors">
              Launchbox
            </a>
            <a href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
          </div>

          {/* Contact Info */}
          <div className="text-gray-500 text-sm text-center md:text-right">
            <p>
              <a href="mailto:ian@ianmcdonald.ai" className="hover:text-white transition-colors">
                ian@ianmcdonald.ai
              </a>
            </p>
            <p className="mt-1">Pensacola, FL</p>
            <p className="text-gray-600 text-xs mt-2">
              © {currentYear} Disruptiv Solutions. All rights reserved.
            </p>
          </div>
        </div>
        <nav aria-label="Follow Ian" className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-gray-800 pt-4 text-sm text-gray-400">
          <span>Follow Ian</span>
          {Object.entries(IAN_SOCIAL_URLS).map(([name, href]) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center hover:text-white focus-visible:underline">{name}</a>)}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;



