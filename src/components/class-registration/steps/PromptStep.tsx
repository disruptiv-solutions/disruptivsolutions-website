import React from 'react';

interface PromptStepProps {
  generatedPrompt: string;
  copied: boolean;
  onCopy: () => void;
  onEdit: () => void;
}

export const PromptStep: React.FC<PromptStepProps> = ({
  generatedPrompt,
  copied,
  onCopy,
  onEdit,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          Generated Prompt
        </h2>
        <button
          onClick={onCopy}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-700 hover:bg-zinc-700 transition-colors flex items-center gap-2"
        >
          {copied ? (
            <>
              <svg
                className="w-5 h-5 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy Prompt</span>
            </>
          )}
        </button>
      </div>
      <div className="bg-black/50 rounded-lg border border-gray-700 p-6">
        <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {generatedPrompt}
        </pre>
      </div>
      <p className="text-sm text-gray-400 mt-4">
        Now, copy this prompt. We will go to{' '}
        <strong>Firebase Studio</strong> together and paste this in to
        build your website!
      </p>

      <div className="pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onEdit}
          className="w-full px-8 py-4 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all duration-300 border border-gray-700 hover:border-gray-600 text-lg"
        >
          Edit Form & Generate Again
        </button>
      </div>
    </div>
  );
};

