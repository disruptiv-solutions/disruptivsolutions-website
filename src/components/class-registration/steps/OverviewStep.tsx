import React from 'react';

interface OverviewStepProps {
  onNext: () => void;
}

export const OverviewStep: React.FC<OverviewStepProps> = ({ onNext }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">
        What we'll do today
      </h2>
      <ul className="list-disc list-inside text-gray-300 space-y-2">
        <li>Briefly learn how AI app development works.</li>
        <li>Record or type your professional bio and details.</li>
        <li>
          Use AI to enhance your bio and generate a custom prompt.
        </li>
        <li>
          Copy that prompt into <strong>Firebase Studio</strong> to
          build your site.
        </li>
        <li>Make a quick edit and deploy your site to the web!</li>
      </ul>
      <div className="pt-2">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
        >
          Start
        </button>
      </div>
    </div>
  );
};

