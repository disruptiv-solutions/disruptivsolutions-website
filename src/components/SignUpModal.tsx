'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface ModalOptions {
  force?: boolean;
}

type ModalState = {
  open: boolean;
  options: ModalOptions;
};

type SetModalState = React.Dispatch<React.SetStateAction<ModalState>>;
let globalSetModal: SetModalState | null = null;

export const openSignUpModal = (options: ModalOptions = {}) => {
  globalSetModal?.({ open: true, options });
};

export const closeSignUpModal = () => {
  globalSetModal?.((prev) => ({ ...prev, open: false }));
};

const SignUpModal: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    options: {},
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    newsletter: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    globalSetModal = setModalState;
    return () => {
      if (globalSetModal === setModalState) {
        globalSetModal = null;
      }
    };
  }, []);

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
    closeSignUpModal();
  };

  const isForceMode = modalState.options.force === true;

  if (!modalState.open) {
    return null;
  }

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
      closeModal();
    } catch (error) {
      console.error('Google sign-in failed', error);
      setSubmitError('Google sign-in failed. Try again or use the form below.');
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
      const credential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      await updateProfile(credential.user, {
        displayName: `${formData.firstName} ${formData.lastName}`.trim(),
      });
      await setDoc(doc(db, 'users', credential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        newsletter: formData.newsletter,
        launchboxWaitlist: true,
        createdAt: serverTimestamp(),
      });
      closeModal();
    } catch (error) {
      console.error('Sign-up failed', error);
      setSubmitError('Unable to create account. Please check your info or try Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4 py-8"
      onClick={!isForceMode ? closeModal : undefined}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-950 border border-gray-800 rounded-3xl p-6 space-y-6"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={closeModal}
          className="absolute right-6 top-6 text-gray-500 hover:text-white"
          aria-label="Close sign up modal"
        >
          ×
        </button>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Launchbox Access</p>
          <h2 className="text-3xl font-bold text-white mt-2">Create your free account</h2>
          <p className="text-gray-400 text-sm mt-2">
            Sign up via Google or email/password and stay on the waitlist for Launchbox announcements.
          </p>
        </div>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-black font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting ? 'Signing in…' : 'Sign in with Google & opt into newsletter'}
        </button>
        <div className="border-t border-gray-700 pt-4">
          <form className="space-y-4" onSubmit={handleManualSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                First name *
                <input
                  value={formData.firstName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                  required
                  className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
                />
              </label>
              <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                Last name *
                <input
                  value={formData.lastName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                  required
                  className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
                />
              </label>
            </div>
            <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
              Email *
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col text-xs uppercase tracking-wide text-gray-400">
                Password *
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    required
                    className="mt-1 px-3 py-2 rounded-xl bg-zinc-900 border border-gray-700 text-white focus:border-red-500 outline-none w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400"
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
                    className="absolute inset-y-0 right-2 flex items-center text-gray-400"
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
                onChange={(e) => setFormData((prev) => ({ ...prev, newsletter: e.target.checked }))}
                className="h-4 w-4 accent-red-600"
              />
              Subscribe to the newsletter (events, news, updates)
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl px-6 py-3 text-white bg-gradient-to-r from-red-600 to-red-700 font-semibold hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-60"
            >
              {isSubmitting ? 'Creating account…' : 'Sign up with email'}
            </button>
            {submitError && <p className="text-xs text-yellow-400">{submitError}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;

