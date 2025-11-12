import React from 'react';

interface FinishStepProps {
  generatedPrompt: string | null;
  copied: boolean;
  onCopy: () => void;
  onBackToForm: () => void;
}

export const FinishStep: React.FC<FinishStepProps> = ({
  generatedPrompt,
  copied,
  onCopy,
  onBackToForm,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">All set!</h2>
      <p className="text-gray-300">
        You've generated your prompt and are ready for the next
        stage: building in <strong>Firebase Studio</strong>.
        <br />
        You can go back to make edits or copy the prompt again.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBackToForm}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-700 hover:bg-zinc-700 transition"
        >
          Back to Form
        </button>
        {generatedPrompt && (
          <button
            type="button"
            onClick={onCopy}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            {copied ? 'Copied!' : 'Copy Prompt'}
          </button>
        )}
      </div>
    </div>
  );
};

