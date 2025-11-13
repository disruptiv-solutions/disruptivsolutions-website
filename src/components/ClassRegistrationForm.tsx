'use client';

import React, { useState, useRef } from 'react';
import Navigation from '@/components/Navigation';
import { trackButtonClick } from '@/lib/analytics';
import { uploadFileToStorage } from '@/lib/firebase';

// TypeScript definitions for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

const ClassRegistrationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#dc2626'); // Default red
  const [secondaryColor, setSecondaryColor] = useState('#991b1b'); // Default dark red
  const [tertiaryColor, setTertiaryColor] = useState('#fef2f2'); // Default light red
  const [textColor, setTextColor] = useState('#000000'); // Default black
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);
  const [isEnhancingBio, setIsEnhancingBio] = useState(false);
  const [bioEnhanceError, setBioEnhanceError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [speechRecognition, setSpeechRecognition] =
    useState<SpeechRecognition | null>(null);
  const [useWebSpeechAPI, setUseWebSpeechAPI] = useState(false);
  const finalTranscriptRef = useRef<string>('');
  const baseBioRef = useRef<string>('');
  // [NEW] 5-step flow
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Overview, 2: AI Basics, 3: Form, 4: Prompt, 5: Finish
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [company, setCompany] = useState('');
  const [industry, setIndustry] = useState('');
  const [socialLinks, setSocialLinks] = useState<
    Array<{ platform: string; url: string }>
  >([]);
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setImageUploadError('Please select a valid image file.');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageUploadError('File size must be less than 5MB.');
        return;
      }

      setProfileImageFile(file);
      setProfileImageUrl(''); // Clear URL if file is selected
      setImageUploadError(null);
      setIsUploadingImage(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Firebase Storage
      try {
        const downloadURL = await uploadFileToStorage(file);
        setProfileImageUrl(downloadURL);
        setIsUploadingImage(false);
        trackButtonClick('upload_profile_image', 'class_registration_page');
      } catch (error) {
        console.error('Error uploading image:', error);
        setImageUploadError(
          error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
        );
        setIsUploadingImage(false);
        // Keep the file and preview so user can retry
      }
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProfileImageUrl(url);
    if (url) {
      setProfileImageFile(null);
      setImagePreview(null);
    }
  };

  // [RESTORED] Your original AI-powered prompt generation
  const generatePrompt = async () => {
    if (!name || !title || !location || !bio || !email) {
      setPromptError(
        'Please fill in all required fields (name, title, location, bio, email).',
      );
      return;
    }

    setIsGeneratingPrompt(true);
    setPromptError(null);
    trackButtonClick(
      'generate_business_card_prompt',
      'class_registration_page',
    );

    try {
      const response = await fetch('/api/optimize-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          title,
          location,
          bio,
          email,
          phone,
          website,
          company,
          industry,
          socialLinks,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          textColor,
          profileImageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to generate prompt. Please try again.' }));
        throw new Error(
          errorData.error || 'Failed to generate prompt. Please try again.',
        );
      }

      const data = await response.json();
      if (data.optimizedPrompt) {
        setGeneratedPrompt(data.optimizedPrompt);
        setCopied(false);
        // [NEW] Advance to step 4
        setCurrentStep(4);

        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error('No prompt received from server.');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      setPromptError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.',
      );
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  // Check if Web Speech API is available (Chrome/Edge)
  const isWebSpeechAPIAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognition;
  };

  const startRecording = async () => {
    try {
      // Check if Web Speech API is available (Chrome/Edge)
      const isAvailable = isWebSpeechAPIAvailable();
      console.log('Web Speech API available:', isAvailable);

      if (isAvailable) {
        console.log('Using Web Speech API for real-time transcription');
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        finalTranscriptRef.current = '';
        baseBioRef.current = bio; // Store the current bio value

        recognition.onstart = () => {
          console.log('Speech recognition started');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          console.log('Speech recognition result:', event);
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const isFinal = event.results[i].isFinal;
            console.log(
              `Transcript [${isFinal ? 'FINAL' : 'INTERIM'}]:`,
              transcript,
            );

            if (isFinal) {
              finalTranscriptRef.current += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          // Update bio textarea in real-time with transcription
          const displayText = finalTranscriptRef.current + interimTranscript;
          console.log('Setting transcription text:', displayText);

          // Update bio with base text + final transcript + interim transcript
          if (displayText.trim() || finalTranscriptRef.current.trim()) {
            const newBio =
              baseBioRef.current + (baseBioRef.current ? ' ' : '') + displayText;
            setBio(newBio);
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error, event.message);
          if (event.error === 'no-speech' || event.error === 'audio-capture') {
            setBioEnhanceError(
              'Microphone not detected. Please check your microphone permissions.',
            );
          } else if (event.error === 'not-allowed') {
            setBioEnhanceError(
              'Microphone permission denied. Please allow microphone access.',
            );
          } else {
            console.log(
              'Falling back to OpenAI transcription due to error:',
              event.error,
            );
            setBioEnhanceError(
              'Speech recognition error. Falling back to OpenAI transcription.',
            );
            // Fall back to OpenAI method
            recognition.stop();
            startRecordingWithOpenAI();
            return;
          }
        };

        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsRecording(false);
          // Finalize bio with base + final transcript (remove any interim text)
          const finalText = finalTranscriptRef.current.trim();
          console.log('Final transcript:', finalText);
          if (finalText) {
            const finalBio =
              baseBioRef.current + (baseBioRef.current ? ' ' : '') + finalText;
            setBio(finalBio);
          } else {
            // If no final transcript, restore original bio
            setBio(baseBioRef.current);
          }
          setTranscriptionText('');
          setSpeechRecognition(null);
          finalTranscriptRef.current = '';
          baseBioRef.current = '';
        };

        try {
          recognition.start();
          setSpeechRecognition(recognition);
          setIsRecording(true);
          setTranscriptionText('');
          setUseWebSpeechAPI(true);
          trackButtonClick('start_audio_recording', 'class_registration_page');
        } catch (startError) {
          console.error('Error starting recognition:', startError);
          setBioEnhanceError(
            'Failed to start speech recognition. Falling back to OpenAI.',
          );
          await startRecordingWithOpenAI();
        }
      } else {
        console.log('Web Speech API not available, using OpenAI fallback');
        // Fall back to OpenAI transcription for non-Chrome browsers
        await startRecordingWithOpenAI();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setBioEnhanceError(
        'Failed to start recording. Please check microphone permissions.',
      );
    }
  };

  const startRecordingWithOpenAI = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(1000); // Collect data every second for streaming
      setMediaRecorder(recorder);
      setIsRecording(true);
      setTranscriptionText('');
      setUseWebSpeechAPI(false);
      trackButtonClick('start_audio_recording', 'class_registration_page');
    } catch (error) {
      console.error('Error starting recording:', error);
      setBioEnhanceError(
        'Failed to start recording. Please check microphone permissions.',
      );
    }
  };

  const stopRecording = () => {
    if (useWebSpeechAPI && speechRecognition) {
      // Stop Web Speech API recognition
      speechRecognition.stop();
      setIsRecording(false);
      trackButtonClick('stop_audio_recording', 'class_registration_page');
    } else if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      // Stop MediaRecorder (OpenAI fallback)
      mediaRecorder.stop();
      setIsRecording(false);
      trackButtonClick('stop_audio_recording', 'class_registration_page');
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let accumulatedText = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            // Handle server-sent events format
            if (line.startsWith('data: ')) {
              try {
                const dataStr = line.slice(6);
                if (dataStr === '[DONE]') {
                  break;
                }
                const data = JSON.parse(dataStr);

                // Handle transcript.text.delta events (incremental updates)
                if (data.type === 'transcript.text.delta' && data.delta) {
                  accumulatedText += data.delta;
                  setTranscriptionText(accumulatedText);
                }
                // Handle transcript.text.done event (final text)
                else if (data.type === 'transcript.text.done' && data.text) {
                  accumulatedText = data.text;
                  setTranscriptionText(accumulatedText);
                }
                // Fallback: handle direct text property
                else if (data.text && !data.type) {
                  accumulatedText = data.text;
                  setTranscriptionText(accumulatedText);
                }
              } catch (e) {
                // Skip invalid JSON
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      }

      // Final update - append to bio
      if (accumulatedText) {
        const trimmed = accumulatedText.trim();
        if (trimmed) {
          setBio((prevBio) => {
            return prevBio ? `${prevBio} ${trimmed}` : trimmed;
          });
        }
      }

      setTranscriptionText('');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setBioEnhanceError('Failed to transcribe audio. Please try again.');
    }
  };

  // [RESTORED] Your original AI-powered bio enhancement
  const enhanceBio = async () => {
    if (!name || !title || !location || !bio) {
      setBioEnhanceError('Please fill in name, title, location, and bio first.');
      return;
    }

    setIsEnhancingBio(true);
    setBioEnhanceError(null);
    trackButtonClick('enhance_bio', 'class_registration_page');

    try {
      const response = await fetch('/api/enhance-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          title,
          location,
          bio,
          website,
          company,
          industry,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Failed to enhance bio. Please try again.' }));
        throw new Error(
          errorData.error || 'Failed to enhance bio. Please try again.',
        );
      }

      const data = await response.json();
      if (data.enhancedBio) {
        setBio(data.enhancedBio);
      } else {
        throw new Error('No enhanced bio received.');
      }
    } catch (error) {
      setBioEnhanceError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.',
      );
    } finally {
      setIsEnhancingBio(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedPrompt) {
      try {
        await navigator.clipboard.writeText(generatedPrompt);
        setCopied(true);
        trackButtonClick(
          'copy_business_card_prompt',
          'class_registration_page',
        );
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const isFormValid = name && title && location && bio && email;

  // Helper function to handle step navigation
  const handleStepClick = (step: number) => {
    // Allow navigation only to completed steps or current/next
    if (currentStep > step) {
      setCurrentStep(step);
      return;
    }
    // Don't allow skipping past form if invalid
    if (step > 3 && !isFormValid) {
      setCurrentStep(3); // Go to form
      setPromptError('Please fill out the form first.');
      return;
    }
    // Don't allow skipping to Finish if prompt not generated
    if (step > 4 && !generatedPrompt) {
      setCurrentStep(3); // Go to form
      setPromptError('Please generate a prompt first.');
      return;
    }
    // Otherwise, allow navigation
    if (step <= 5) {
      setCurrentStep(step);
    }
  };

  return (
    <>
      <Navigation />
      <section className="min-h-screen pt-24 px-6 py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Digital Business Card Generator
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
              Follow the steps to generate a custom prompt for your AI-powered
              website
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-zinc-900/60 rounded-2xl border border-gray-800 p-8 lg:p-12">
            {/* Stepper Header --- [NEW] 5 STEPS --- */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                {[1, 2, 3, 4, 5].map((step) => {
                  const isActive = currentStep === step;
                  const isComplete = currentStep > step;
                  return (
                    <React.Fragment key={step}>
                      <button
                        type="button"
                        onClick={() => handleStepClick(step)}
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                          isActive
                            ? 'bg-red-600 text-white'
                            : isComplete
                            ? 'bg-red-600/20 text-red-400 border border-red-600/40 cursor-pointer'
                            : 'bg-zinc-800 text-gray-400 border border-gray-700 cursor-not-allowed'
                        } ${
                          // Make current and next steps clickable
                          (isActive ||
                            step === currentStep + 1 ||
                            isComplete) &&
                          'cursor-pointer'
                        }`}
                        aria-label={`Go to step ${step}`}
                        // Disable clicking steps that aren't complete or next
                        disabled={!isComplete && step > currentStep}
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
                          step
                        )}
                      </button>
                      {step !== 5 && (
                        <div
                          className={`h-0.5 flex-1 rounded ${
                            currentStep > step ? 'bg-red-600' : 'bg-gray-700'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
                <span className={currentStep === 1 ? 'text-white' : ''}>
                  1. Overview
                </span>
                <span className={currentStep === 2 ? 'text-white' : ''}>
                  2. AI Basics
                </span>
                <span className={currentStep === 3 ? 'text-white' : ''}>
                  3. Your Info
                </span>
                <span className={currentStep === 4 ? 'text-white' : ''}>
                  4. Prompt
                </span>
                <span className={currentStep === 5 ? 'text-white' : ''}>
                  5. Finish
                </span>
              </div>
            </div>

            {/* Step 1: Overview (Was Intro) --- [NEW] Updated Content --- */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">
                  What we’ll do today
                </h2>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Briefly learn how AI app development works.</li>
                  <li>Record or type your professional bio and details.</li>
                  <li>
                    Use AI to enhance your bio and generate a custom prompt.
                  </li>
                  <li>
                    Copy that prompt into <strong>Lovable's app building platform</strong> to
                    build your site.
                  </li>
                  <li>Make a quick edit and deploy your site to the web!</li>
                </ul>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition"
                  >
                    Start
                  </button>
                </div>
              </div>
            )}

            {/* --- [NEW] Step 2: AI Basics --- */}
            {currentStep === 2 && (
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <h2 className="text-2xl font-bold text-white">
                  The "Magic": AI & App Dev Basics
                </h2>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    The "Old Way" (Traditional Development)
                  </h3>
                  <p>
                    Normally, to build a website, you'd have to write hundreds
                    of lines of code in languages like HTML, CSS, and
                    JavaScript. You'd also need to learn frameworks, databases,
                    and how to set up a server. It's powerful, but has a very
                    steep learning curve.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    The "New Way" (AI-Powered Development)
                  </h3>
                  <p>
                    Today, we're using a new approach. We will use AI to{' '}
                    <strong>be</strong> our developer. We'll describe{' '}
                    <strong>what</strong> we want in plain English (our
                    "prompt"), and an AI platform like{' '}
                    <strong>Lovable's app building platform</strong> will write all that complex
                    code <strong>for</strong> us.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What We Are (and Aren't) Building
                  </h3>
                  <p>
                    Our site today is a simple "static" site—it just displays
                    information. More complex apps might need a{' '}
                    <strong>database</strong> (to store user signups) or{' '}
                    <strong>authentication</strong> (to let users log in). We
                    aren't doing that today, but it's good to know those are the
                    "next steps" in app development.
                  </p>
                </div>
              </div>
            )}

            {/* Form Tab Content --- [NEW] Now Step 3 --- */}
            {currentStep === 3 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  generatePrompt();
                }}
                className="space-y-8"
              >
                {/* Personal Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Your Information
                  </h2>

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="Software Engineer, Product Manager, etc."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Location <span className="text-red-500">*</span>
                      <span className="text-gray-500 text-xs ml-2">
                        (City, State/Region)
                      </span>
                    </label>
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="New York, NY or London, UK"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Additional Information
                  </h2>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Phone{' '}
                      <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="(555) 555-5555"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Website{' '}
                      <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      id="website"
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Company Name{' '}
                      <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="industry"
                      className="block text-sm text-gray-400 mb-2"
                    >
                      Industry{' '}
                      <span className="text-gray-500 text-xs">(optional)</span>
                    </label>
                    <input
                      id="industry"
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
                      placeholder="Technology, Healthcare, Finance, etc."
                    />
                  </div>

                  {/* Social Media Links */}
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">
                      Social Media Links{' '}
                      <span className="text-gray-500 text-xs">(optional)</span>
                    </label>

                    {/* Existing Social Links */}
                    {socialLinks.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {socialLinks.map((social, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 bg-zinc-800/50 rounded-lg border border-gray-700"
                          >
                            <span className="text-white font-medium text-sm flex-1">
                              {social.platform}
                            </span>
                            <a
                              href={social.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-red-400 hover:text-red-300 text-sm truncate max-w-xs"
                            >
                              {social.url}
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = socialLinks.filter(
                                  (_, i) => i !== index,
                                );
                                setSocialLinks(updated);
                              }}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                              title="Remove"
                            >
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
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Social Button / Form */}
                    {!showAddSocial ? (
                      <button
                        type="button"
                        onClick={() => setShowAddSocial(true)}
                        className="w-full px-4 py-2 bg-zinc-800/50 text-gray-300 rounded-lg border border-gray-700 hover:bg-zinc-800 hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
                      >
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        <span>Add Social</span>
                      </button>
                    ) : (
                      <div className="p-4 bg-zinc-800/50 rounded-lg border border-gray-700 space-y-3">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Platform
                          </label>
                          <select
                            value={newSocialPlatform}
                            onChange={(e) =>
                              setNewSocialPlatform(e.target.value)
                            }
                            className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm"
                          >
                            <option value="">Select platform...</option>
                            <option value="LinkedIn">LinkedIn</option>
                            <option value="Twitter">Twitter</option>
                            <option value="Instagram">Instagram</option>
                            <option value="Facebook">Facebook</option>
                            <option value="GitHub">GitHub</option>
                            <option value="YouTube">YouTube</option>
                            <option value="TikTok">TikTok</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            URL
                          </label>
                          <input
                            type="url"
                            value={newSocialUrl}
                            onChange={(e) => setNewSocialUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all text-sm"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (newSocialPlatform && newSocialUrl) {
                                setSocialLinks([
                                  ...socialLinks,
                                  {
                                    platform: newSocialPlatform,
                                    url: newSocialUrl,
                                  },
                                ]);
                                setNewSocialPlatform('');
                                setNewSocialUrl('');
                                setShowAddSocial(false);
                              }
                            }}
                            disabled={!newSocialPlatform || !newSocialUrl}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold"
                          >
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddSocial(false);
                              setNewSocialPlatform('');
                              setNewSocialUrl('');
                            }}
                            className="px-4 py-2 bg-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-600 transition-colors text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bio Section */}
                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm text-gray-400 mb-2"
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
                        onChange={(e) => setBio(e.target.value)}
                        required
                        rows={6}
                        className="w-full bg-transparent text-white px-4 py-3 pb-3 focus:outline-none transition-all resize-y overflow-y-auto flex-1 min-h-[150px] seamless-scrollbar"
                        placeholder="Tell us about your company, what services or products you offer, your background, and what makes you unique..."
                      />
                      {/* Footer with controls */}
                      <div className="px-3 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Pause/Stop Button */}
                          <button
                            type="button"
                            onClick={isRecording ? stopRecording : startRecording}
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
                          {/* Recording Indicator - Next to pause button */}
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
                        </div>
                        {/* AI Enhance Button */}
                        <button
                          type="button"
                          onClick={enhanceBio}
                          disabled={
                            isEnhancingBio || !name || !title || !location || !bio
                          }
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
                </div>

                {/* Profile Image */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Profile Image (Optional)
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Upload a square 1:1 headshot (recommended 1024×1024, minimum
                    512×512), preferably of yourself. Max file size 5MB.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Image URL Input */}
                    <div className="space-y-2">
                      <label
                        htmlFor="profileImageUrl"
                        className="block text-sm font-medium text-gray-300"
                      >
                        Image URL
                      </label>
                      <input
                        id="profileImageUrl"
                        type="url"
                        value={profileImageUrl}
                        onChange={handleUrlChange}
                        disabled={!!profileImageFile || isUploadingImage}
                        className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-300">
                        Upload File
                      </label>
                      <div
                        onClick={() => {
                          if (!profileImageUrl && !isUploadingImage) {
                            document
                              .getElementById('profileImageFileHidden')
                              ?.click();
                          }
                        }}
                        className={`relative w-full h-12 bg-zinc-900 rounded-lg border-2 border-dashed transition-all ${
                          profileImageUrl || isUploadingImage
                            ? 'border-gray-700 opacity-50 cursor-not-allowed'
                            : 'border-gray-700 hover:border-red-600 hover:bg-zinc-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center justify-center h-full px-4 gap-2">
                          <svg
                            className="w-5 h-5 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span className="text-sm text-gray-300 truncate">
                            {isUploadingImage
                              ? 'Uploading...'
                              : profileImageFile
                              ? profileImageFile.name
                              : 'Click to upload'}
                          </span>
                          {isUploadingImage && (
                            <svg
                              className="animate-spin h-4 w-4 text-red-600"
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
                          )}
                        </div>
                        <input
                          id="profileImageFileHidden"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={!!profileImageUrl || isUploadingImage}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preview */}
                  {imagePreview && (
                    <div className="flex items-center gap-4 p-4 bg-zinc-900/50 rounded-lg border border-gray-700">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-red-600 flex-shrink-0">
                        <img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Image Preview
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {isUploadingImage
                            ? 'Uploading to Firebase Storage...'
                            : profileImageUrl
                            ? 'Uploaded! This will be used for your profile.'
                            : 'Looking good! This will be used for your profile.'}
                        </p>
                        {imageUploadError && (
                          <p className="text-xs text-red-400 mt-1">
                            {imageUploadError}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImageFile(null);
                          setProfileImageUrl('');
                          setImagePreview(null);
                          setImageUploadError(null);
                          setIsUploadingImage(false);
                        }}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Remove image"
                        disabled={isUploadingImage}
                      >
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                {/* Color Palette */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Color Palette
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Choose your color scheme (hex codes will be included in the
                    prompt)
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="primaryColor"
                        className="block text-sm text-gray-400 mb-2"
                      >
                        Primary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="primaryColor"
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="flex-1 bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all font-mono text-sm"
                          placeholder="#dc2626"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="secondaryColor"
                        className="block text-sm text-gray-400 mb-2"
                      >
                        Secondary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="secondaryColor"
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="flex-1 bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all font-mono text-sm"
                          placeholder="#991b1b"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="tertiaryColor"
                        className="block text-sm text-gray-400 mb-2"
                      >
                        Tertiary Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="tertiaryColor"
                          type="color"
                          value={tertiaryColor}
                          onChange={(e) => setTertiaryColor(e.target.value)}
                          className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={tertiaryColor}
                          onChange={(e) => setTertiaryColor(e.target.value)}
                          className="flex-1 bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all font-mono text-sm"
                          placeholder="#fef2f2"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="textColor"
                        className="block text-sm text-gray-400 mb-2"
                      >
                        Text Color
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          id="textColor"
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all font-mono text-sm"
                          placeholder="#000000"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!isFormValid || isGeneratingPrompt}
                    className="w-full px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-600/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
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
                        <span>Generating Optimized Prompt...</span>
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
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>Generate AI Prompt</span>
                      </>
                    )}
                  </button>
                  {promptError && (
                    <p className="mt-2 text-sm text-red-400">{promptError}</p>
                  )}
                </div>
              </form>
            )}

            {/* Prompt Tab Content --- [NEW] Now Step 4 --- */}
            {currentStep === 4 && generatedPrompt && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-white">
                    Generated Prompt
                  </h2>
                  <button
                    onClick={copyToClipboard}
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
                {/* --- [NEW] Updated Help Text --- */}
                <p className="text-sm text-gray-400 mt-4">
                  Now, copy this prompt. We will go to{' '}
                  <strong>Lovable's app building platform</strong> together and paste this in to
                  build your website!
                </p>

                {/* Edit Form Button */}
                <div className="pt-4 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)} // [NEW] Go back to step 3
                    className="w-full px-8 py-4 bg-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-700 transition-all duration-300 border border-gray-700 hover:border-gray-600 text-lg"
                  >
                    Edit Form & Generate Again
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: Finish --- [NEW] Now Step 5 --- */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">All set!</h2>
                <p className="text-gray-300">
                  You've generated your prompt and are ready for the next
                  stage: building in <strong>Lovable's app building platform</strong>.
                  <br />
                  You can go back to make edits or copy the prompt again.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)} // [NEW] Go back to step 3
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg border border-gray-700 hover:bg-zinc-700 transition"
                  >
                    Back to Form
                  </button>
                  {generatedPrompt && (
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      {copied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Footer Controls --- [NEW] Updated Logic for 5 Steps --- */}
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                className={`px-4 py-2 rounded-lg border transition ${
                  currentStep === 1
                    ? 'opacity-30 cursor-not-allowed border-gray-700 text-gray-500'
                    : 'border-gray-700 text-gray-300 hover:bg-zinc-800'
                }`}
                disabled={currentStep === 1}
              >
                Back
              </button>

              {/* Show Next/Finish button for all steps except the last one */}
              {currentStep < 5 && (
                <button
                  type="button"
                  onClick={async () => {
                    if (currentStep === 3) {
                      // Trigger generation on "Next" from form step
                      await generatePrompt();
                    } else {
                      handleStepClick(currentStep + 1);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg transition ${'bg-red-600 text-white hover:bg-red-700'}
                  ${
                    // Special style for "Generate" on Form step
                    currentStep === 3
                      ? 'disabled:opacity-50 disabled:cursor-not-allowed'
                      : ''
                  }
                  `}
                  // Disable on Form step if invalid or generating
                  disabled={
                    (currentStep === 3 && !isFormValid) || isGeneratingPrompt
                  }
                >
                  {currentStep === 3
                    ? 'Generate & Next'
                    : currentStep === 4
                    ? 'Finish'
                    : 'Next'}
                </button>
              )}
            </div>
          </div>

          {/* Instructions --- [NEW] Updated Text --- */}
          <div className="mt-12 bg-zinc-900/40 rounded-2xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-4">How to Use</h2>
            <ol className="space-y-3 text-gray-300 list-decimal list-inside">
              <li>
                Follow the steps above to add your info and learn the basics.
              </li>
              <li>
                Fill in all your information on the <strong>"Your Info"</strong>{' '}
                page (Step 3).
              </li>
              <li>
                Click &quot;Generate AI Prompt&quot; to create your custom
                instructions.
              </li>
              <li>
                On the <strong>"Prompt"</strong> page (Step 4), click "Copy
                Prompt".
              </li>
              <li>
                We will then go to <strong>Lovable's app building platform</strong> together and
                paste this prompt to build your website!
              </li>
            </ol>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClassRegistrationForm;