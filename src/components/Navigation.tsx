'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { trackButtonClick } from '@/lib/analytics';
import { useAuth } from '@/contexts/AuthContext';

interface NavigationProps {
  activeSection?: string;
}

const Navigation = ({ activeSection = 'hero' }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin, signInWithGoogle, signOut } = useAuth();

  const navigationItems = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#who-this-is-for' },
    { name: 'Consulting', href: '#consulting' },
    { name: 'Highlights', href: '#launchbox' },
    { name: 'Work', href: '#work' },
    { name: 'Resources', href: '/resources' },
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
    } else if (href.startsWith('/')) {
      const navItem = navigationItems.find(item => item.href === href);
      trackButtonClick('nav_click', navItem?.name || href);
      router.push(href);
    }
    
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
      trackButtonClick('sign_in', 'Google');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsUserMenuOpen(false);
      trackButtonClick('sign_out', 'User Menu');
    } catch (error) {
      console.error('Sign out error:', error);
    }
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

              {/* Auth Button/User Menu */}
              {!loading && (
                <>
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className="relative">
                          <img
                            src={user.photoURL || '/default-avatar.svg'}
                            alt={user.displayName || 'User'}
                            className="w-8 h-8 rounded-full border-2 border-gray-700"
                          />
                          {isAdmin && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-black" title="Admin" />
                          )}
                        </div>
                      </button>

                      {/* User Dropdown Menu */}
                      {isUserMenuOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsUserMenuOpen(false)}
                          />
                          <div className="absolute right-0 mt-2 w-64 bg-zinc-900 border border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden">
                            <div className="p-4 border-b border-gray-800">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-white truncate">
                                  {user.displayName}
                                </p>
                                {isAdmin && (
                                  <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                                    ADMIN
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 truncate">
                                {user.email}
                              </p>
                            </div>
                            {isAdmin && (
                              <button
                                onClick={() => {
                                  router.push('/admin');
                                  setIsUserMenuOpen(false);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-800 transition-colors border-b border-gray-800 font-semibold"
                              >
                                Admin Dashboard →
                              </button>
                            )}
                            <button
                              onClick={handleSignOut}
                              className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-800 transition-colors"
                            >
                              Sign Out
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
                    >
                      Log In
                    </button>
                  )}
                </>
              )}
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

              {/* Auth Section - Mobile */}
              {!loading && (
                <div className="p-6 border-t border-gray-800">
                  {user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={user.photoURL || '/default-avatar.svg'}
                            alt={user.displayName || 'User'}
                            className="w-10 h-10 rounded-full border-2 border-gray-700"
                          />
                          {isAdmin && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-black" title="Admin" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-white truncate">
                              {user.displayName}
                            </p>
                            {isAdmin && (
                              <span className="px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => {
                            router.push('/admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
                        >
                          Admin Dashboard →
                        </button>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 bg-zinc-800 text-white text-sm font-medium rounded-lg hover:bg-zinc-700 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSignIn}
                      className="w-full px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-600/40"
                    >
                      Log In with Google
                    </button>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="px-6 pb-6">
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
