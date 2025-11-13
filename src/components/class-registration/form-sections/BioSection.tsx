import React from 'react';

interface BioSectionProps {
  bio: string;
  isRecording: boolean;
  transcriptionText: string;
  isEnhancingBio: boolean;
  bioEnhanceError: string | null;
  onBioChange: (value: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEnhanceBio: () => void;
}

export const BioSection: React.FC<BioSectionProps> = ({
  bio,
  isRecording,
  transcriptionText,
  isEnhancingBio,
  bioEnhanceError,
  onBioChange,
  onStartRecording,
  onStopRecording,
  onEnhanceBio,
}) => {
  return (
    <div>
      <label
        htmlFor="bio"
        className="block text-xs text-gray-400 mb-1.5"
      >
        Bio <span className="text-red-500">*</span>
        <span className="text-gray-500 text-xs ml-2">
          (Tell us about your company and the services/products you
          offer - 2-3 short paragraphs)
        </span>
      </label>
      <div className="relative bg-zinc-900 rounded-lg border border-gray-700 flex flex-col focus-within:ring-2 focus-within:ring-red-600 focus-within:border-red-600 transition-all">
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          required
          rows={4}
          className="w-full bg-transparent text-white px-3 py-2 pb-2 text-sm focus:outline-none transition-all resize-y overflow-y-auto flex-1 min-h-[120px] seamless-scrollbar"
          placeholder="Tell us about your company, what services or products you offer, your background, and what makes you unique..."
        />
        {/* Footer with controls */}
        <div className="px-3 py-2 flex items-center justify-between gap-2">
          {/* Microphone button commented out temporarily */}
          {/* <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={isRecording ? onStopRecording : onStartRecording}
              className={`p-2 rounded-lg transition-all ${
                isRecording
                  ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                  : 'bg-zinc-800 hover:bg-zinc-700 border border-gray-700'
              }`}
              title={
                isRecording
                  ? 'Stop recording'
                  : 'Start voice recording'
              }
            >
              {isRecording ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="6"
                    y="6"
                    width="12"
                    height="12"
                    rx="2"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              )}
            </button>
            {isRecording && (
              <div className="px-2 py-1 bg-red-600/20 border border-red-600/50 rounded text-xs text-red-400 flex items-center gap-1.5">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Recording...</span>
              </div>
            )}
            {transcriptionText && !isRecording && (
              <div className="px-2 py-1 bg-green-600/20 border border-green-600/50 rounded text-xs text-green-400">
                Transcribing...
              </div>
            )}
          </div> */}
          {/* AI Enhance Button */}
          <button
            type="button"
            onClick={onEnhanceBio}
            disabled={isEnhancingBio}
            className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            title="Enhance bio with AI"
          >
            {isEnhancingBio ? (
              <>
                <svg
                  className="animate-spin h-3 w-3"
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
                <span>Enhancing...</span>
              </>
            ) : (
              <>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>AI Enhance</span>
              </>
            )}
          </button>
        </div>
      </div>
      {bioEnhanceError && (
        <p className="mt-2 text-sm text-red-400">
          {bioEnhanceError}
        </p>
      )}
    </div>
  );
};

