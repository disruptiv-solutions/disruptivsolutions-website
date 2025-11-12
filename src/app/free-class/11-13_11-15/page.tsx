'use client';

import React, { useState } from 'react';
import { trackButtonClick } from '@/lib/analytics';
import { Stepper } from '@/components/class-registration/Stepper';
import { OverviewStep } from '@/components/class-registration/steps/OverviewStep';
import { IntroductionStep } from '@/components/class-registration/steps/IntroductionStep';
import { WhyWorkshopStep } from '@/components/class-registration/steps/WhyWorkshopStep';
import { AIBasicsStep } from '@/components/class-registration/steps/AIBasicsStep';
import { FormStep } from '@/components/class-registration/steps/FormStep';
import { PromptStep } from '@/components/class-registration/steps/PromptStep';
import { FinishStep } from '@/components/class-registration/steps/FinishStep';
import { useAudioRecording } from '@/components/class-registration/hooks/useAudioRecording';
import { useBioEnhancement } from '@/components/class-registration/hooks/useBioEnhancement';
import { usePromptGeneration } from '@/components/class-registration/hooks/usePromptGeneration';
import type { FormData } from '@/components/class-registration/types';

export default function ClassRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    title: '',
    location: '',
    bio: '',
    email: '',
    phone: '',
    website: '',
    company: '',
    industry: '',
    socialLinks: [],
    profileImageUrl: '',
    profileImageFile: null,
    primaryColor: '#dc2626',
    secondaryColor: '#991b1b',
    tertiaryColor: '#fef2f2',
    textColor: '#000000',
  });

  const handleBioUpdate = (text: string | ((prev: string) => string)) => {
    setFormData((prev) => ({
      ...prev,
      bio: typeof text === 'function' ? text(prev.bio) : text,
    }));
  };

  const { isRecording, transcriptionText, startRecording, stopRecording } = useAudioRecording(handleBioUpdate);
  
  const { isEnhancingBio, bioEnhanceError, enhanceBio } = useBioEnhancement();
  const {
    generatedPrompt,
    copied,
    isGeneratingPrompt,
    promptError,
    generatePrompt,
    copyToClipboard,
  } = usePromptGeneration();

  const handleFormDataChange = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleStartRecording = async () => {
    try {
      await startRecording(formData.bio);
      trackButtonClick('start_audio_recording', 'class_registration_page');
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    trackButtonClick('stop_audio_recording', 'class_registration_page');
  };

  const handleEnhanceBio = () => {
    enhanceBio(
      {
        name: formData.name,
        title: formData.title,
        location: formData.location,
        bio: formData.bio,
        website: formData.website,
        company: formData.company,
        industry: formData.industry,
      },
      (bio) => handleFormDataChange('bio', bio)
    );
  };

  const handleGeneratePrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await generatePrompt(formData);
    if (success) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (step: number) => {
    const isFormValid = formData.name && formData.title && formData.location && formData.bio && formData.email;
    
    if (currentStep > step) {
      setCurrentStep(step);
      return;
    }
    
    if (step > 5 && !isFormValid) {
      setCurrentStep(5);
      return;
    }
    
    if (step > 6 && !generatedPrompt) {
      setCurrentStep(5);
      return;
    }
    
    if (step <= 7) {
      setCurrentStep(step);
    }
  };

  const handleNextSlide = async () => {
    if (currentStep === 5) {
      const success = await generatePrompt(formData);
      if (success) {
        setCurrentStep(6);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      handleStepClick(currentStep + 1);
    }
  };

  const handlePrevSlide = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  const isFormValid = formData.name && formData.title && formData.location && formData.bio && formData.email;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Slideshow Container */}
      <div className="relative h-screen flex flex-col">
        {/* Header with Logo/Title */}
        <header className="absolute left-0 right-0 z-10 px-8 py-6 flex items-center justify-between pointer-events-none top-16 md:top-[4.5rem]">
          <div className="pointer-events-auto">
            {currentStep === 1 && (
              <>
                <h1 className="text-2xl font-bold text-white">
                  Digital Business Card Generator
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                  AI-Powered Website Builder Workshop
                </p>
              </>
            )}
          </div>
          <div className="text-right pointer-events-auto">
            <div className="text-sm text-gray-400">
              Slide {currentStep} of 7
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 py-24">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Step 1: Overview */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                      Welcome! 👋
                    </h2>
                    <p className="text-xl md:text-2xl text-white mb-12">
                      Let's build your AI-powered website together
                    </p>
                    <div className="max-w-3xl mx-auto bg-zinc-900/60 rounded-3xl border border-gray-800 p-12">
                      <h3 className="text-2xl font-bold text-white mb-6">
                        What we'll do today
                      </h3>
                      <ul className="list-disc list-inside text-gray-300 space-y-3 text-left text-lg">
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
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Introduction */}
              {currentStep === 2 && (
                <div className="animate-fade-in pb-44">
                  <IntroductionStep />
                </div>
              )}

              {/* Step 3: Why Workshop */}
              {currentStep === 3 && (
                <div className="animate-fade-in">
                  <WhyWorkshopStep />
                </div>
              )}

              {/* Step 4: AI Basics */}
              {currentStep === 4 && (
                <div className="animate-fade-in">
                  <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                      Understanding AI Development
                    </h2>
                  </div>
                  <div className="max-w-4xl mx-auto bg-zinc-900/60 rounded-3xl border border-gray-800 p-12">
                    <AIBasicsStep />
                  </div>
                </div>
              )}

              {/* Step 5: Form */}
              {currentStep === 5 && (
                <div className="animate-fade-in pb-44">
                  <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-stretch">
                    <aside className="w-full lg:max-w-sm xl:max-w-md flex flex-col gap-6 pb-12">
                      <div className="space-y-3">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                          Your Information
                        </h2>
                        <p className="text-lg text-gray-400">
                          Fill in your details to generate your custom prompt.
                          These answers feed the AI so the more detailed you are,
                          the better your website will reflect you.
                        </p>
                      </div>

                      <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-6 flex-1 flex flex-col">
                        <div className="space-y-5">
                          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-300">
                            What to include
                          </h3>
                          <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
                            <li>
                              <span className="text-white font-semibold">Name &amp; Title</span>
                              <span className="block text-gray-400">
                                Introduce yourself so the prompt uses your professional identity.
                              </span>
                            </li>
                            <li>
                              <span className="text-white font-semibold">Location &amp; Email</span>
                              <span className="block text-gray-400">
                                Helps the AI tailor copy and add contact sections automatically.
                              </span>
                            </li>
                            <li>
                              <span className="text-white font-semibold">Bio</span>
                              <span className="block text-gray-400">
                                Share what you do, who you help, and what makes you unique.
                                Aim for 2–3 paragraphs.
                              </span>
                            </li>
                            <li>
                              <span className="text-white font-semibold">Optional Extras</span>
                              <span className="block text-gray-400">
                                Add phone, website, social links, and brand colors to personalize the output.
                              </span>
                            </li>
                          </ul>
                        </div>
                        <div className="pt-4 mt-auto border-t border-gray-800 text-sm text-gray-300">
                          Need a starting point? Start typing or press the microphone button to talk through your bio,
                          then use <span className="text-red-400 font-semibold">AI Enhance</span> to polish it.
                        </div>
                      </div>
                    </aside>

                    <div className="flex-1 w-full">
                      <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-8 lg:p-12 max-h-[calc(100vh-260px)] overflow-y-auto pb-24">
                        <FormStep
                          formData={formData}
                          imagePreview={imagePreview}
                          isRecording={isRecording}
                          transcriptionText={transcriptionText}
                          isEnhancingBio={isEnhancingBio}
                          bioEnhanceError={bioEnhanceError}
                          isGeneratingPrompt={isGeneratingPrompt}
                          promptError={promptError}
                          onFormDataChange={handleFormDataChange}
                          onImagePreviewChange={setImagePreview}
                          onStartRecording={handleStartRecording}
                          onStopRecording={handleStopRecording}
                          onEnhanceBio={handleEnhanceBio}
                          onSubmit={handleGeneratePrompt}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Prompt */}
              {currentStep === 6 && generatedPrompt && (
                <div className="animate-fade-in pb-44">
                  <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-stretch">
                    <aside className="w-full lg:max-w-sm xl:max-w-md space-y-4">
                      <h2 className="text-4xl md:text-5xl font-bold text-white">
                        Your Custom Prompt 🎉
                      </h2>
                      <p className="text-lg text-gray-400">
                        Copy this and paste it into Firebase Studio
                      </p>
                    </aside>
                    
                    <div className="flex-1 w-full">
                      <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-12 max-h-[calc(100vh-240px)] overflow-y-auto">
                        <PromptStep
                          generatedPrompt={generatedPrompt}
                          copied={copied}
                          onCopy={copyToClipboard}
                          onEdit={() => setCurrentStep(5)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Finish */}
              {currentStep === 7 && (
                <div className="animate-fade-in">
                  <div className="text-center mb-12">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                      You're All Set! 🚀
                    </h2>
                    <p className="text-xl text-white">
                      Ready to build your website in Firebase Studio
                    </p>
                  </div>
                  <div className="max-w-3xl mx-auto bg-zinc-900/60 rounded-3xl border border-gray-800 p-12">
                    <FinishStep
                      generatedPrompt={generatedPrompt}
                      copied={copied}
                      onCopy={copyToClipboard}
                      onBackToForm={() => setCurrentStep(5)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="absolute bottom-0 left-0 right-0 z-10 px-8 py-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-6xl mx-auto">
            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <button
                  key={step}
                  onClick={() => handleStepClick(step)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentStep === step
                      ? 'w-12 bg-red-600'
                      : currentStep > step
                      ? 'w-3 bg-red-600/40 hover:bg-red-600/60'
                      : 'w-3 bg-gray-700 hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${step}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handlePrevSlide}
                disabled={currentStep === 1}
                className={`group flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
                  currentStep === 1
                    ? 'opacity-30 cursor-not-allowed border-gray-700 text-gray-500'
                    : 'border-gray-700 text-gray-300 hover:bg-zinc-800 hover:border-gray-600'
                }`}
              >
                <svg
                  className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-semibold">Previous</span>
              </button>

              {/* Step Labels */}
              <div className="hidden md:flex items-center gap-4 text-sm">
                {[
                  { num: 1, label: 'Overview' },
                  { num: 2, label: 'Intro' },
                  { num: 3, label: 'Why' },
                  { num: 4, label: 'AI Basics' },
                  { num: 5, label: 'Your Info' },
                  { num: 6, label: 'Prompt' },
                  { num: 7, label: 'Finish' },
                ].map((step) => (
                  <button
                    key={step.num}
                    onClick={() => handleStepClick(step.num)}
                    className={`transition-colors ${
                      currentStep === step.num
                        ? 'text-white font-semibold'
                        : currentStep > step.num
                        ? 'text-red-400 hover:text-red-300'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.num}. {step.label}
                  </button>
                ))}
              </div>

              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={handleNextSlide}
                  disabled={
                    (currentStep === 5 && !isFormValid) || isGeneratingPrompt
                  }
                  className={`group flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold ${
                    (currentStep === 3 && !isFormValid) || isGeneratingPrompt
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30'
                  }`}
                >
                  {isGeneratingPrompt ? (
                    <>
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
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentStep === 1
                          ? 'Start'
                          : currentStep === 5
                          ? 'Generate & Next'
                          : currentStep === 6
                          ? 'Finish'
                          : 'Next'}
                      </span>
                      <svg
                        className="w-5 h-5 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <div className="w-[140px]"></div>
              )}
            </div>
          </div>
        </footer>

        {/* Keyboard Shortcuts Hint */}
        <div className="absolute bottom-24 right-8 text-xs text-gray-600 hidden lg:block">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 bg-zinc-800 rounded border border-gray-700">←</kbd>
            <kbd className="px-2 py-1 bg-zinc-800 rounded border border-gray-700">→</kbd>
            <span>to navigate</span>
          </div>
        </div>
      </div>

      {/* Add keyboard navigation */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        /* Custom scrollbar for form slide */
        .overflow-y-auto::-webkit-scrollbar {
          width: 8px;
        }

        .overflow-y-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.5);
          border-radius: 4px;
        }

        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.7);
        }
      `}</style>
    </div>
  );
}
