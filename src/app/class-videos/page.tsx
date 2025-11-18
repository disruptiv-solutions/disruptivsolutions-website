'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FeedbackModal } from '@/components/class-registration/steps/FeedbackModal';
import { useAuth } from '@/contexts/AuthContext';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function ClassVideosPage() {
  const { user, signInWithGoogle } = useAuth();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    newsletter: true,
  });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitted'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hasManualAccess, setHasManualAccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isGateActive = !user && !hasManualAccess;

  useEffect(() => {
    if (user) {
      setFormStatus('idle');
      setHasManualAccess(false);
    }
  }, [user]);

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
      const googleUser = auth.currentUser;
      if (googleUser) {
        await setDoc(
          doc(db, 'users', googleUser.uid),
          {
            email: googleUser.email,
            name: googleUser.displayName,
            newsletter: true,
            launchboxWaitlist: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      setFormStatus('submitted');
      setHasManualAccess(false);
    } catch (error) {
      console.error('Google sign-in failed', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setSubmitError('Passwords must match.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        newsletter: formData.newsletter,
        launchboxWaitlist: true,
        createdAt: serverTimestamp(),
      });

      setFormStatus('submitted');
      setHasManualAccess(true);
    } catch (error) {
      console.error('Failed to create account', error);
      setSubmitError('Unable to create account. Please try again or use Google sign-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {isGateActive && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-xl bg-zinc-950 border border-gray-800 rounded-3xl p-6 space-y-6 text-left">
            <div>
              <p className="text-sm uppercase tracking-widest text-gray-400">Free Class Access</p>
              <h2 className="text-3xl font-bold text-white mt-2">
                Sign in or share a few details to continue
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                A free account unlocks these recordings. Sign in with Google or provide your info. Subscribing to the newsletter keeps you in the loop on upcoming events, news, and drops.
              </p>
            </div>

              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-black font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
                >
                  {isSubmitting ? 'Signing in…' : 'Sign in with Google & opt into newsletter'}
                </button>
                <p className="text-xs text-gray-500">
                  Google sign-in automatically keeps the newsletter checkbox checked.
                </p>
              </div>

            <div className="border-t border-gray-800 pt-4">
              <p className="text-sm font-semibold text-white mb-3">Or fill in your details</p>
              <form className="space-y-4" onSubmit={handleManualSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                    First Name *
                    <input
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      required
                      className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
                    />
                  </label>
                  <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                    Last Name *
                    <input
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                      }
                      required
                      className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                    Email *
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      required
                      className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
                    />
                  </label>
                  <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                    Phone (optional)
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                    Password *
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, password: e.target.value }))
                        }
                        required
                        className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10 10 0 0 1 6.06 6.06" />
                            <path d="M1 1l22 22" />
                            <path d="M9.53 9.53a3 3 0 1 0 4.24 4.24" />
                            <path d="M12 5c4.42 0 8.24 2.65 9.84 6a10 10 0 0 1-2.35 3.86" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>
                  <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                    Confirm password *
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        required
                        className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-400"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.94 17.94A10 10 0 0 1 6.06 6.06" />
                            <path d="M1 1l22 22" />
                            <path d="M9.53 9.53a3 3 0 1 0 4.24 4.24" />
                            <path d="M12 5c4.42 0 8.24 2.65 9.84 6a10 10 0 0 1-2.35 3.86" />
                          </svg>
                        ) : (
                          <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>
                </div>
                <label className="flex items-center gap-3 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, newsletter: e.target.checked }))
                    }
                    className="h-4 w-4 accent-red-600"
                  />
                  Subscribe to the newsletter (events, news, and updates)
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 rounded-2xl bg-red-600 text-white font-semibold hover:bg-red-500 transition-all disabled:opacity-60"
                >
                  {isSubmitting ? 'Creating account…' : 'Continue with Free Access'}
                </button>
                {submitError && <p className="text-xs text-yellow-400">{submitError}</p>}
                {formStatus === 'submitted' && (
                  <p className="text-xs text-green-400">
                    Thanks! Your spot is held and we will send access instructions shortly.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-black pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Free AI App Building Classes
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Watch recorded sessions from our AI app building workshops
            </p>
          </div>

          {/* Waitlist Banner */}
          <div className="mb-8 bg-gradient-to-r from-orange-600/20 via-orange-500/10 to-transparent border border-orange-600/30 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 5v2M12 17v2M6.343 6.343l1.414 1.414M16.243 16.243l1.414 1.414M5 12h2M17 12h2M6.343 17.657l1.414-1.414M16.243 7.757l1.414-1.414" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">
                    You're on the Launchbox waitlist
                  </p>
                  <p className="text-gray-300 text-sm">
                    Thanks for joining! You'll be first to know when Launchbox goes live.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFeedbackModalOpen(true)}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/40 whitespace-nowrap"
              >
                Share Feedback →
              </button>
            </div>
          </div>

          {/* Video 1: Nov 15th AI App building class */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Nov 15th AI App Building Class
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-gray-800 bg-zinc-900">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/BealDwGLVU8"
                title="Nov 15th AI App building class"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Video 2: 11/13/25 video */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              11/13/25 Class Recording
            </h2>
            <div className="aspect-video rounded-xl overflow-hidden border border-gray-800 bg-zinc-900">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/G8Jcyc3qWZo"
                title="11/13/25 Class Recording"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Link to free class */}
          <div className="text-center">
          <Link
            href="/free-class/1"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-lg shadow-red-600/40 text-lg"
          >
            <span>Follow along with the interactive presentation here</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
          </div>

          {/* Back to resources link */}
          <div className="mt-12 text-center">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back to Resources</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
      />
    </>
  );
}

