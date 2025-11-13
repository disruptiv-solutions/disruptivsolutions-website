import React, { useState } from 'react';

interface SubmitSiteStepProps {
  onSubmit: (url: string, description: string) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  hasSubmitted: boolean;
}

export const SubmitSiteStep: React.FC<SubmitSiteStepProps> = ({
  onSubmit,
  isSubmitting,
  submitError,
  hasSubmitted,
}) => {
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim() || !description.trim()) {
      return;
    }

    await onSubmit(url.trim(), description.trim());
  };

  const isValidUrl = (urlString: string) => {
    try {
      const urlObj = new URL(urlString);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const isFormValid = url.trim() && description.trim() && isValidUrl(url);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-5xl md:text-6xl font-bold text-white">
          Share Your Site! 🚀
        </h2>
        <p className="text-xl md:text-2xl text-gray-300">
          You just deployed your site. Let's celebrate together!
        </p>
      </div>

      {hasSubmitted ? (
        <div className="bg-green-600/20 border-2 border-green-500/50 rounded-3xl p-8 text-center space-y-4">
          <div className="text-6xl">✅</div>
          <h3 className="text-3xl font-bold text-white">Site Submitted!</h3>
          <p className="text-lg text-gray-300">
            Your site will appear on the next slide with everyone else's builds.
          </p>
          <p className="text-sm text-gray-400">
            Click "Next" to see the showcase!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-zinc-900/60 border border-gray-800 rounded-3xl p-8 space-y-6">
            <div className="space-y-3">
              <label htmlFor="site-url" className="block text-lg font-semibold text-white">
                Your Site URL *
              </label>
              <input
                id="site-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-site.lovable.app"
                className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-400">
                Paste your deployed site URL from Lovable
              </p>
            </div>

            <div className="space-y-3">
              <label htmlFor="site-description" className="block text-lg font-semibold text-white">
                What does your site do? *
              </label>
              <input
                id="site-description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Personal portfolio, Business card, Consulting site..."
                maxLength={60}
                className="w-full px-4 py-3 bg-zinc-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              />
              <p className="text-sm text-gray-400">
                {description.length}/60 characters
              </p>
            </div>

            {submitError && (
              <div className="bg-red-600/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 text-sm">{submitError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`w-full px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                !isFormValid || isSubmitting
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
                'Submit My Site'
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-400">
            <p>Your site will be displayed in a showcase with other participants.</p>
            <p className="mt-1">You can skip this step if you prefer not to share.</p>
          </div>
        </form>
      )}
    </div>
  );
};

