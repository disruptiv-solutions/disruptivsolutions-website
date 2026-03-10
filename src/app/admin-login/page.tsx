'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function AdminLoginPage() {
  const { user, loading, isAdmin, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSignInWithGoogle = async () => {
    setIsSigningIn(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Admin sign-in error:', err);
      setError('Sign-in failed. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  useEffect(() => {
    if (loading) return;
    if (user && isAdmin) {
      router.replace('/admin');
    }
  }, [user, loading, isAdmin, router]);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-black pt-24 pb-20 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-8 shadow-xl">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Admin Login
            </h1>
            <p className="text-gray-400 text-sm mb-8">
              Sign in with your admin Google account to access the dashboard.
            </p>

            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-400 mt-4">Checking authentication...</p>
              </div>
            ) : user && !isAdmin ? (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                  <p className="text-red-400 text-sm font-medium">
                    Access denied. This account does not have admin privileges.
                  </p>
                </div>
                <p className="text-gray-400 text-sm">
                  Signed in as <span className="text-white">{user.email}</span>
                </p>
                <Link
                  href="/"
                  className="block w-full px-6 py-3 text-center bg-zinc-800 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors"
                >
                  Go Home
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                <button
                  type="button"
                  onClick={handleSignInWithGoogle}
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  aria-label="Sign in with Google"
                >
                  {isSigningIn ? (
                    <>
                      <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-4 rounded-lg bg-red-900/20 border border-red-500/30">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Link
                  href="/"
                  className="block w-full px-6 py-3 text-center text-gray-400 text-sm hover:text-white transition-colors"
                >
                  ← Back to site
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
