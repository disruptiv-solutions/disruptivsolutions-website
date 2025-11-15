'use client';

import React, { useState } from 'react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackFormData {
  name: string;
  rating: number | null;
  valuablePart: string;
  improvements: string;
  nextTopics: {
    complexApps: boolean;
    industryTools: boolean;
    chargingClients: boolean;
    marketing: boolean;
    passiveIncome: boolean;
    other: boolean;
    otherText: string;
  };
  cohortInterest: 'yes' | 'maybe' | 'no' | '';
  siteUrl: string;
  canFeature: 'yes' | 'no' | '';
  reviewPermission: boolean;
}

const STAR_ICON = (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const STAR_ICON_OUTLINE = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    rating: null,
    valuablePart: '',
    improvements: '',
    nextTopics: {
      complexApps: false,
      industryTools: false,
      chargingClients: false,
      marketing: false,
      passiveIncome: false,
      other: false,
      otherText: '',
    },
    cohortInterest: '',
    siteUrl: '',
    canFeature: '',
    reviewPermission: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRatingClick = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleNextTopicChange = (key: keyof FeedbackFormData['nextTopics'], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      nextTopics: {
        ...prev.nextTopics,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setSubmitError('Please provide your name');
      return;
    }
    
    if (!formData.rating) {
      setSubmitError('Please provide a rating');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Prepare next topics array
      const nextTopicsArray: string[] = [];
      if (formData.nextTopics.complexApps) nextTopicsArray.push('complex_apps');
      if (formData.nextTopics.industryTools) nextTopicsArray.push('industry_tools');
      if (formData.nextTopics.chargingClients) nextTopicsArray.push('charging_clients');
      if (formData.nextTopics.marketing) nextTopicsArray.push('marketing');
      if (formData.nextTopics.passiveIncome) nextTopicsArray.push('passive_income');
      if (formData.nextTopics.other && formData.nextTopics.otherText) {
        nextTopicsArray.push(`other: ${formData.nextTopics.otherText}`);
      }

      const payload = {
        name: formData.name,
        rating: formData.rating,
        valuable_part: formData.valuablePart || '',
        improvements: formData.improvements || '',
        next_topics: nextTopicsArray,
        next_topic_other: formData.nextTopics.other ? formData.nextTopics.otherText : '',
        cohort_interest: formData.cohortInterest,
        site_url: formData.canFeature === 'yes' ? formData.siteUrl : '',
        review_permission: formData.reviewPermission,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit feedback');
      }

      setIsSuccess(true);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSubmitError(null);
    setFormData({
      name: '',
      rating: null,
      valuablePart: '',
      improvements: '',
      nextTopics: {
        complexApps: false,
        industryTools: false,
        chargingClients: false,
        marketing: false,
        passiveIncome: false,
        other: false,
        otherText: '',
      },
      cohortInterest: '',
      siteUrl: '',
      canFeature: '',
      reviewPermission: false,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border-2 border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-2 z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Content */}
        <div className="p-6 md:p-8">
          {isSuccess ? (
            <div className="text-center space-y-4 py-8">
              <div className="text-6xl">✅</div>
              <h3 className="text-3xl font-bold text-white">Thank you for your feedback!</h3>
              <p className="text-lg text-gray-300">
                Your input helps me make these workshops better.
              </p>
              {formData.cohortInterest === 'yes' || formData.cohortInterest === 'maybe' ? (
                <p className="text-sm text-red-400 mt-4">
                  We&apos;ll send you cohort details via email!
                </p>
              ) : null}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Header */}
              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                  📋 Feedback Form - 5 Questions
                </h2>
                <p className="text-sm text-gray-400">Keep it SHORT. 2 minutes max.</p>
              </div>

              {/* Question 0: Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="block text-lg font-semibold text-white">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>

              {/* Question 1: Rating */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  How would you rate this workshop? <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`transition-all hover:scale-110 ${
                        formData.rating && star <= formData.rating
                          ? 'text-yellow-400'
                          : 'text-gray-600 hover:text-yellow-300'
                      }`}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      {formData.rating && star <= formData.rating ? STAR_ICON : STAR_ICON_OUTLINE}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Most Valuable Part */}
              <div className="space-y-2">
                <label htmlFor="valuable-part" className="block text-lg font-semibold text-white">
                  What was the most valuable part of this workshop?
                </label>
                <textarea
                  id="valuable-part"
                  value={formData.valuablePart}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setFormData((prev) => ({ ...prev, valuablePart: e.target.value }));
                    }
                  }}
                  placeholder="e.g., Seeing it actually work, Building something real..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 text-right">
                  {formData.valuablePart.length}/200 characters
                </p>
              </div>

              {/* Question 3: What to Improve */}
              <div className="space-y-2">
                <label htmlFor="improvements" className="block text-lg font-semibold text-white">
                  What was confusing or could be improved?
                </label>
                <textarea
                  id="improvements"
                  value={formData.improvements}
                  onChange={(e) => {
                    if (e.target.value.length <= 200) {
                      setFormData((prev) => ({ ...prev, improvements: e.target.value }));
                    }
                  }}
                  placeholder="e.g., Form section was rushed, Needed more time to deploy..."
                  rows={3}
                  className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-400 text-right">
                  {formData.improvements.length}/200 characters
                </p>
              </div>

              {/* Question 4: What They Want Next */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  What do you want to learn next? (Check all that apply)
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'complexApps', label: 'Building more complex apps (databases, user logins)' },
                    { key: 'industryTools', label: 'AI tools for specific industries (real estate, coaching, fitness, etc.)' },
                    { key: 'chargingClients', label: 'How to charge clients for apps you build' },
                    { key: 'marketing', label: 'Marketing and launching apps' },
                    { key: 'passiveIncome', label: 'Building apps that make passive income' },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={formData.nextTopics[key as keyof typeof formData.nextTopics] as boolean}
                        onChange={(e) =>
                          handleNextTopicChange(key as keyof FeedbackFormData['nextTopics'], e.target.checked)
                        }
                        className="w-5 h-5 rounded border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.nextTopics.other}
                        onChange={(e) =>
                          handleNextTopicChange('other', e.target.checked)
                        }
                        className="w-5 h-5 rounded border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        Other:
                      </span>
                    </label>
                    {formData.nextTopics.other && (
                      <input
                        type="text"
                        value={formData.nextTopics.otherText}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            setFormData((prev) => ({
                              ...prev,
                              nextTopics: {
                                ...prev.nextTopics,
                                otherText: e.target.value,
                              },
                            }));
                          }
                        }}
                        placeholder="Tell us what you want to learn..."
                        maxLength={100}
                        className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent ml-8"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Question 5: Cohort Interest */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Would you be interested in the 4-week Group Cohort? ($297, normally $497)
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'yes', label: 'Yes, I want to join (send me details)' },
                    { value: 'maybe', label: 'Maybe, tell me more' },
                    { value: 'no', label: 'No, not right now' },
                  ].map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="cohort-interest"
                        value={value}
                        checked={formData.cohortInterest === value}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cohortInterest: e.target.value as 'yes' | 'maybe' | 'no',
                          }))
                        }
                        className="w-5 h-5 border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                      />
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bonus Question: Site Feature */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold text-white">
                  Can we feature your site as an example?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="can-feature"
                      value="yes"
                      checked={formData.canFeature === 'yes'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          canFeature: e.target.value as 'yes',
                        }))
                      }
                      className="w-5 h-5 border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      Yes! Here&apos;s my site URL:
                    </span>
                  </label>
                  {formData.canFeature === 'yes' && (
                    <input
                      type="text"
                      value={formData.siteUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, siteUrl: e.target.value }))
                      }
                      placeholder="your-site.lovable.app"
                      className="w-full px-4 py-2 bg-zinc-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent ml-8"
                    />
                  )}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="can-feature"
                      value="no"
                      checked={formData.canFeature === 'no'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          canFeature: e.target.value as 'no',
                        }))
                      }
                      className="w-5 h-5 border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                    />
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      No thanks
                    </span>
                  </label>
                </div>
              </div>

              {/* Review Permission */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.reviewPermission}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        reviewPermission: e.target.checked,
                      }))
                    }
                    className="w-5 h-5 rounded border-gray-600 bg-zinc-800 text-red-600 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-zinc-900 cursor-pointer"
                  />
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    I&apos;m okay with you using my feedback as a review/testimonial
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4">
                  <p className="text-red-400 text-sm">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!formData.rating || isSubmitting}
                className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                  !formData.rating || isSubmitting
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/40'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Feedback'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


