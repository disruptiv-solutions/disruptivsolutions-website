'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { trackButtonClick } from '@/lib/analytics';
import { AboutMeStep } from '@/components/class-registration/steps/AboutMeStep';
import { ParticipantIntroductionStep } from '@/components/class-registration/steps/ParticipantIntroductionStep';
import { AIKnowledgePollStep } from '@/components/class-registration/steps/AIKnowledgePollStep';
import { WhyWorkshopStep1 } from '@/components/class-registration/steps/WhyWorkshopStep1';
import { WhyWorkshopStep2 } from '@/components/class-registration/steps/WhyWorkshopStep2';
import { WhyWorkshopStep3 } from '@/components/class-registration/steps/WhyWorkshopStep3';
import { TheConceptStep } from '@/components/class-registration/steps/TheConceptStep';
import { WhatYoullDoStep } from '@/components/class-registration/steps/WhatYoullDoStep';
import { WhatToExpectStep } from '@/components/class-registration/steps/WhatToExpectStep';
import { FormStep } from '@/components/class-registration/steps/FormStep';
import { PromptStep } from '@/components/class-registration/steps/PromptStep';
import { CelebrationStep } from '@/components/class-registration/steps/CelebrationStep';
import { WhatsNextStep } from '@/components/class-registration/steps/WhatsNextStep';
import { GoDeeperStep } from '@/components/class-registration/steps/GoDeeperStep';
import { ThankYouStep } from '@/components/class-registration/steps/ThankYouStep';
import { useAudioRecording } from '@/components/class-registration/hooks/useAudioRecording';
import { useBioEnhancement } from '@/components/class-registration/hooks/useBioEnhancement';
import { usePromptGeneration } from '@/components/class-registration/hooks/usePromptGeneration';
import type { FormData } from '@/components/class-registration/types';

export default function ClassRegistrationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionFadingOut, setTransitionFadingOut] = useState(false);
  
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
      setCurrentStep(13);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = useCallback((step: number) => {
    const isFormValid = formData.name && formData.title && formData.location && formData.bio && formData.email;
    
    // Reset transition state when navigating away
    if (showTransition) {
      setShowTransition(false);
      setTransitionFadingOut(false);
    }
    
    if (currentStep > step) {
      setCurrentStep(step);
      return;
    }
    
    if (step > 12 && !isFormValid) {
      setCurrentStep(12);
      return;
    }
    
    if (step > 13 && !generatedPrompt) {
      setCurrentStep(12);
      return;
    }
    
    if (step <= 17) {
      setCurrentStep(step);
    }
  }, [currentStep, formData, generatedPrompt, showTransition]);

  const handleNextSlide = useCallback(async () => {
    if (currentStep === 12) {
      const success = await generatePrompt(formData);
      if (success) {
        setCurrentStep(13);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (currentStep === 3) {
      // Show transition animation before moving to slide 4
      setShowTransition(true);
      setTransitionFadingOut(false);
      
      // After 2 seconds, start fade out
      setTimeout(() => {
        setTransitionFadingOut(true);
        // After fade out completes, move to slide 4
        setTimeout(() => {
          setShowTransition(false);
          setTransitionFadingOut(false);
          handleStepClick(4);
        }, 500); // Wait for fade out animation to complete
      }, 2000); // Show message for 2 seconds before fading out
    } else {
      handleStepClick(currentStep + 1);
    }
  }, [currentStep, formData, generatePrompt, handleStepClick, setCurrentStep]);

  const handlePrevSlide = useCallback(() => {
    // Reset transition state when going back
    if (currentStep === 4) {
      setShowTransition(false);
      setTransitionFadingOut(false);
    }
    setCurrentStep((s) => Math.max(1, s - 1));
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        const isFormElement =
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          target.isContentEditable;
        if (isFormElement) {
          return;
        }
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        void handleNextSlide();
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextSlide, handlePrevSlide]);

  const isFormValid = formData.name && formData.title && formData.location && formData.bio && formData.email;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Slideshow Container */}
      <div className="relative h-screen flex flex-col">
        {/* Header with Logo/Title */}
        <header className="absolute left-0 right-0 z-10 px-8 py-6 flex items-center justify-between pointer-events-none top-16 md:top-[4.5rem]">
          <div className="pointer-events-auto" />
          <div className="text-right pointer-events-auto">
            <div className="text-sm text-gray-400">
              Slide {currentStep} of 16
            </div>
          </div>
        </header>

        {/* Main Slide Content */}
        <main className="flex-1 flex items-center justify-center px-8 py-12 md:py-16 overflow-y-auto">
          <div className="w-full max-w-7xl">
            {/* Slide Transition Container */}
            <div className="transition-all duration-500 ease-in-out">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="animate-fade-in">
                  <div className="text-center max-w-4xl mx-auto space-y-6">
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                      Welcome! 👋
                    </h2>
                    <p className="text-xl md:text-2xl text-white">
                      Let&apos;s build your AI-powered website together
                    </p>
                    <div className="pt-8">
                      <div className="inline-block bg-red-600/20 border-2 border-red-500/50 rounded-xl px-6 py-4 backdrop-blur-sm">
                        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-red-400 font-mono tracking-wide">
                          ianmcdonald.ai/free-class/1
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Agenda */}
              {currentStep === 2 && (
                <div className="animate-fade-in">
                  <div className="text-center max-w-5xl mx-auto">
                    <h2 className="text-5xl md:text-6xl font-bold text-white mb-12">
                      What we&apos;ll do today
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <img src="/icons/brain.png" alt="Brain" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Learn AI Basics</h3>
                        <p className="text-gray-400 text-sm">
                          Understand how AI app development works
                        </p>
                      </div>
                      
                      <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <img src="/icons/pencil.png" alt="Pencil" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Share Your Story</h3>
                        <p className="text-gray-400 text-sm">
                          Record or type your professional bio and details
                        </p>
                      </div>
                      
                      <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <img src="/icons/stars.png" alt="Stars" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">AI Enhancement</h3>
                        <p className="text-gray-400 text-sm">
                          Let AI enhance your bio and generate a custom prompt
                        </p>
                      </div>
                      
                      <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <img src="/icons/rocket.png" alt="Rocket" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Build Your Site</h3>
                        <p className="text-gray-400 text-sm">
                          Copy the prompt into Lovable&apos;s platform
                        </p>
                      </div>
                      
                      <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <img src="/icons/eisel.png" alt="Easel" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Quick Edit</h3>
                        <p className="text-gray-400 text-sm">
                          Make a quick edit to personalize your site
                        </p>
                      </div>
                      
                      <div className="bg-zinc-900/40 border border-gray-800 rounded-2xl p-6 text-center hover:border-gray-700 transition-colors">
                        <div className="w-16 h-16 mx-auto mb-4">
                          <img src="/icons/globe.png" alt="Globe" className="w-full h-full object-contain" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Deploy Live</h3>
                        <p className="text-gray-400 text-sm">
                          Publish your site to the web instantly
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Transition Animation between Slide 3 and 4 */}
              {showTransition && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
                  <div
                    className={`transition-opacity duration-500 ${
                      transitionFadingOut ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center animate-fade-in">
                      If I can do it you can too.
                    </h2>
                  </div>
                </div>
              )}

              {/* Step 3: About Me */}
              {currentStep === 3 && !showTransition && (
                <div className="animate-fade-in">
                  <AboutMeStep />
                </div>
              )}

              {/* Step 4: Participant Introduction */}
              {currentStep === 4 && !showTransition && (
                <div className="animate-fade-in">
                  <ParticipantIntroductionStep />
                </div>
              )}

              {/* Step 5: AI Knowledge Poll */}
              {currentStep === 5 && (
                <div className="animate-fade-in">
                  <AIKnowledgePollStep />
                </div>
              )}

              {/* Step 6: Why Workshop - Part 1 */}
              {currentStep === 6 && (
                <div className="animate-fade-in">
                  <WhyWorkshopStep1 />
                </div>
              )}

              {/* Step 7: Why Workshop - Part 2 */}
              {currentStep === 7 && (
                <div className="animate-fade-in">
                  <WhyWorkshopStep2 />
                </div>
              )}

              {/* Step 8: The Concept */}
              {currentStep === 8 && (
                <div className="animate-fade-in">
                  <TheConceptStep />
                </div>
              )}

              {/* Step 9: Why Workshop - Part 3 */}
              {currentStep === 9 && (
                <div className="animate-fade-in">
                  <WhyWorkshopStep3 />
                </div>
              )}

              {/* Step 10: What You'll Do Today */}
              {currentStep === 10 && (
                <div className="animate-fade-in">
                  <WhatYoullDoStep />
                </div>
              )}

              {/* Step 11: What to Expect */}
              {currentStep === 11 && (
                <div className="animate-fade-in">
                  <WhatToExpectStep />
                </div>
              )}

              {/* Step 12: Form */}
              {currentStep === 12 && (
                <div className="animate-fade-in">
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch">
                    <aside className="w-full lg:max-w-xs xl:max-w-sm flex flex-col gap-4">
                      <div className="space-y-2">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                          Your Information
                        </h2>
                        <p className="text-base text-gray-400">
                          Fill in your details to generate your custom prompt.
                          These answers feed the AI so the more detailed you are,
                          the better your website will reflect you.
                        </p>
                      </div>

                      <div className="bg-zinc-900/60 border border-gray-800 rounded-2xl p-5 flex-1 flex flex-col">
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                            What to include
                          </h3>
                          <ul className="space-y-2.5 text-gray-300 text-xs leading-relaxed">
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
                        <div className="pt-3 mt-auto border-t border-gray-800 text-xs text-gray-300">
                          Need a starting point? Start typing or press the microphone button to talk through your bio,
                          then use <span className="text-red-400 font-semibold">AI Enhance</span> to polish it.
                        </div>
                      </div>
                    </aside>

                    <div className="flex-1 w-full">
                      <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-6 lg:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <FormStep
                          formData={formData}
                          imagePreview={imagePreview}
                          isRecording={isRecording}
                          transcriptionText={transcriptionText}
                          isEnhancingBio={isEnhancingBio}
                          bioEnhanceError={bioEnhanceError}
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

              {/* Step 13: Prompt */}
              {currentStep === 13 && generatedPrompt && (
                <div className="animate-fade-in">
                  <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-stretch">
                    <aside className="w-full lg:max-w-xs xl:max-w-sm space-y-4 flex flex-col justify-center">
                      <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Your Custom Prompt 🎉
                      </h2>
                      <div className="space-y-3">
                        <p className="text-base text-gray-400">
                          Copy this prompt and paste it into{' '}
                          <a 
                            href="https://lovable.dev" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-red-400 hover:text-red-300 underline font-semibold"
                          >
                            lovable.dev
                          </a>
                          {' '}to build your website.
                        </p>
                        <p className="text-sm text-gray-500">
                          We&apos;ll walk through this together in the next step.
                        </p>
                      </div>
                    </aside>
                    
                    <div className="flex-1 w-full">
                      <div className="bg-zinc-900/60 rounded-3xl border border-gray-800 p-6 lg:p-8 max-h-[calc(100vh-200px)] overflow-y-auto">
                        <PromptStep
                          generatedPrompt={generatedPrompt}
                          copied={copied}
                          onCopy={copyToClipboard}
                          onEdit={() => setCurrentStep(12)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 14: Celebration */}
              {currentStep === 14 && (
                <div className="animate-fade-in">
                  <CelebrationStep />
                </div>
              )}

              {/* Step 15: What's Next */}
              {currentStep === 15 && (
                <div className="animate-fade-in">
                  <WhatsNextStep />
                </div>
              )}

              {/* Step 16: Go Deeper */}
              {currentStep === 16 && (
                <div className="animate-fade-in">
                  <GoDeeperStep />
                </div>
              )}

              {/* Step 17: Thank You */}
              {currentStep === 17 && (
                <div className="animate-fade-in">
                  <ThankYouStep />
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer Navigation */}
        <footer className="absolute bottom-0 left-0 right-0 z-10 px-8 py-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-6xl mx-auto">
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

              {/* Progress Dots - Centered */}
              <div className="flex items-center justify-center gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((step) => (
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

              {currentStep < 17 ? (
                <button
                  type="button"
                  onClick={handleNextSlide}
                  disabled={
                    (currentStep === 12 && !isFormValid) || isGeneratingPrompt
                  }
                  className={`group flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-semibold ${
                    (currentStep === 12 && !isFormValid) || isGeneratingPrompt
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
                          : currentStep === 12
                          ? 'Generate & Next'
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
