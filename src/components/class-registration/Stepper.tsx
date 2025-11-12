import React from 'react';

interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Overview' },
    { number: 2, label: 'AI Basics' },
    { number: 3, label: 'Your Info' },
    { number: 4, label: 'Prompt' },
    { number: 5, label: 'Finish' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isComplete = currentStep > step.number;
          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                onClick={() => onStepClick(step.number)}
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isActive
                    ? 'bg-red-600 text-white'
                    : isComplete
                    ? 'bg-red-600/20 text-red-400 border border-red-600/40 cursor-pointer'
                    : 'bg-zinc-800 text-gray-400 border border-gray-700 cursor-not-allowed'
                } ${
                  (isActive ||
                    step.number === currentStep + 1 ||
                    isComplete) &&
                  'cursor-pointer'
                }`}
                aria-label={`Go to step ${step.number}`}
                disabled={!isComplete && step.number > currentStep}
              >
                {isComplete ? (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </button>
              {step.number !== 5 && (
                <div
                  className={`h-0.5 flex-1 rounded ${
                    currentStep > step.number ? 'bg-red-600' : 'bg-gray-700'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        {steps.map((step) => (
          <span
            key={step.number}
            className={currentStep === step.number ? 'text-white' : ''}
          >
            {step.number}. {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};

