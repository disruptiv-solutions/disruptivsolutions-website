import { useState, useRef } from 'react';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '../types';

export const useAudioRecording = (onTranscriptUpdate: (text: string | ((prev: string) => string)) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [speechRecognition, setSpeechRecognition] = useState<SpeechRecognition | null>(null);
  const [useWebSpeechAPI, setUseWebSpeechAPI] = useState(false);
  const finalTranscriptRef = useRef<string>('');
  const baseBioRef = useRef<string>('');
  const fallbackToOpenAIRef = useRef<((currentBio: string) => Promise<void>) | null>(null);

  const isChromeBrowser = (): boolean => {
    if (typeof window === 'undefined') return false;
    // Check if Chrome (Chromium-based browsers)
    const userAgent = window.navigator.userAgent.toLowerCase();
    return userAgent.includes('chrome') && !userAgent.includes('edge');
  };

  const isWebSpeechAPIAvailable = (): boolean => {
    if (typeof window === 'undefined') return false;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    return !!SpeechRecognition;
  };

  const startRecordingWithWebSpeech = (currentBio: string, fallbackFn?: (bio: string) => Promise<void>) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    finalTranscriptRef.current = '';
    baseBioRef.current = currentBio;

    recognition.onstart = () => {
      console.log('Speech recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;

        if (isFinal) {
          finalTranscriptRef.current += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const displayText = finalTranscriptRef.current + interimTranscript;
      if (displayText.trim() || finalTranscriptRef.current.trim()) {
        const newBio =
          baseBioRef.current + (baseBioRef.current ? ' ' : '') + displayText;
        onTranscriptUpdate(newBio);
      }
    };

    recognition.onerror = async (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error, event.message);
      setIsRecording(false);
      setSpeechRecognition(null);
      
      // Stop recognition to clean up
      try {
        recognition.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
      
      // Fall back to OpenAI transcription for any error
      if (fallbackFn) {
        console.log('Falling back to OpenAI transcription due to Web Speech API error');
        try {
          await fallbackFn(baseBioRef.current);
        } catch (err) {
          console.error('OpenAI transcription also failed:', err);
          setIsRecording(false);
        }
      } else if (fallbackToOpenAIRef.current) {
        console.log('Falling back to OpenAI transcription due to Web Speech API error');
        try {
          await fallbackToOpenAIRef.current(baseBioRef.current);
        } catch (err) {
          console.error('OpenAI transcription also failed:', err);
          setIsRecording(false);
        }
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
      const finalText = finalTranscriptRef.current.trim();
      if (finalText) {
        const finalBio =
          baseBioRef.current + (baseBioRef.current ? ' ' : '') + finalText;
        onTranscriptUpdate(finalBio);
      } else {
        onTranscriptUpdate(baseBioRef.current);
      }
      setTranscriptionText('');
      setSpeechRecognition(null);
      finalTranscriptRef.current = '';
      baseBioRef.current = '';
    };

    recognition.start();
    setSpeechRecognition(recognition);
    setIsRecording(true);
    setTranscriptionText('');
    setUseWebSpeechAPI(true);
  };

  const startRecordingWithOpenAI = async () => {
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

    recorder.start(1000);
    setMediaRecorder(recorder);
    setIsRecording(true);
    setTranscriptionText('');
    setUseWebSpeechAPI(false);
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
            if (line.startsWith('data: ')) {
              try {
                const dataStr = line.slice(6);
                if (dataStr === '[DONE]') {
                  break;
                }
                const data = JSON.parse(dataStr);

                if (data.type === 'transcript.text.delta' && data.delta) {
                  accumulatedText += data.delta;
                  setTranscriptionText(accumulatedText);
                } else if (data.type === 'transcript.text.done' && data.text) {
                  accumulatedText = data.text;
                  setTranscriptionText(accumulatedText);
                } else if (data.text && !data.type) {
                  accumulatedText = data.text;
                  setTranscriptionText(accumulatedText);
                }
              } catch (e) {
                console.warn('Failed to parse SSE data:', line);
              }
            }
          }
        }
      }

      if (accumulatedText) {
        const trimmed = accumulatedText.trim();
        if (trimmed) {
          onTranscriptUpdate((prevBio: string) => {
            return prevBio ? `${prevBio} ${trimmed}` : trimmed;
          });
        }
      }

      setTranscriptionText('');
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  };

  const startRecording = async (currentBio: string) => {
    try {
      const isChrome = isChromeBrowser();
      const isWebSpeechAvailable = isWebSpeechAPIAvailable();

      // Create fallback function
      const fallbackToOpenAI = async (bio: string) => {
        baseBioRef.current = bio;
        await startRecordingWithOpenAI();
      };
      fallbackToOpenAIRef.current = fallbackToOpenAI;

      // Use Web Speech API if Chrome and available
      if (isChrome && isWebSpeechAvailable) {
        try {
          console.log('Using Google Web Speech API (Chrome)');
          startRecordingWithWebSpeech(currentBio, fallbackToOpenAI);
        } catch (error) {
          console.error('Web Speech API failed, falling back to OpenAI:', error);
          // Fall back to OpenAI if Web Speech fails
          await fallbackToOpenAI(currentBio);
        }
      } else {
        // Use OpenAI transcription for non-Chrome browsers or if Web Speech not available
        if (!isChrome) {
          console.log('Not Chrome browser, using OpenAI transcription API');
        } else {
          console.log('Web Speech API not available, using OpenAI transcription API');
        }
        await startRecordingWithOpenAI();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      throw error;
    }
  };

  const stopRecording = () => {
    if (useWebSpeechAPI && speechRecognition) {
      speechRecognition.stop();
      setIsRecording(false);
    } else if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    transcriptionText,
    startRecording,
    stopRecording,
  };
};

