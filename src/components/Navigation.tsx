'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { trackButtonClick } from '@/lib/analytics';

interface NavigationProps {
  activeSection?: string;
}

const Navigation = ({ activeSection = 'hero' }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#who-this-is-for' },
    { name: 'Consulting', href: '#consulting' },
    { name: 'Highlights', href: '#launchbox' },
    { name: 'Work', href: '#work' },
  ];

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const targetId = href.substring(1);
      
      // Track navigation button click
      const navItem = navigationItems.find(item => item.href === href);
      trackButtonClick('nav_click', navItem?.name || targetId);
      
      // If not on root page, navigate to root with hash, then scroll
      if (pathname !== '/') {
        // Navigate to root page with hash
        router.push(`/#${targetId}`);
        
        // Wait for navigation, then scroll to section
        setTimeout(() => {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            const headerOffset = 80; // Height of fixed header
            const elementPosition = targetElement.offsetTop;
            const offsetPosition = targetId === 'hero' ? 0 : elementPosition - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        // Already on root page, just scroll to section
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          const headerOffset = 80; // Height of fixed header
          const elementPosition = targetElement.offsetTop;
          const offsetPosition = targetId === 'hero' ? 0 : elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    }
    
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 h-16">
        <div className="max-w-7xl mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo with Image */}
            <button
              onClick={() => handleNavClick('#hero')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <img 
                src="/DS-Logo.svg" 
                alt="Ian McDonald" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-white">
                Ian <span className="text-gray-400 font-normal">McDonald</span>
              </span>
            </button>

            {/* Navigation Links - Desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive 
                        ? 'text-red-600' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-white transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMobileMenuOpen ? (
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  ) : (
                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-sm border-l border-gray-800 transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <button
                  onClick={() => {
                    handleNavClick('#hero');
                  }}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <img 
                    src="/DS-Logo.svg" 
                    alt="Ian McDonald" 
                    className="h-6 w-auto"
                  />
                  <span className="text-lg font-bold text-white">
                    Ian <span className="text-gray-400 font-normal">McDonald</span>
                  </span>
                </button>
                <button 
                  onClick={toggleMobileMenu}
                  className="text-gray-300 hover:text-white transition-colors p-2"
                  aria-label="Close mobile menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-6 py-8">
                <div className="space-y-2">
                  {navigationItems.map((item) => {
                    const isActive = activeSection === item.href.substring(1);
                    
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleNavClick(item.href)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${
                          isActive 
                            ? 'text-red-600 bg-red-600/10' 
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-6 border-t border-gray-800">
                <p className="text-sm text-gray-400">
                  Practical AI products
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
