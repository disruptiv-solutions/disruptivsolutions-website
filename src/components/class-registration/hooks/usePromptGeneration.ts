import { useState } from 'react';
import { trackButtonClick } from '@/lib/analytics';
import type { FormData } from '../types';

const normalizeUrl = (url?: string) => {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
};

export const usePromptGeneration = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [promptError, setPromptError] = useState<string | null>(null);

  const generatePrompt = async (formData: FormData) => {
    const { name, title, location, bio, email, phone, website, company, industry, socialLinks, primaryColor, secondaryColor, tertiaryColor, textColor, profileImageUrl, profileImageFile } = formData;

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
          website: normalizeUrl(website),
          company,
          industry,
          socialLinks,
          primaryColor,
          secondaryColor,
          tertiaryColor,
          textColor,
          profileImageUrl,
          profileImageFile: profileImageFile ? '[File uploaded]' : null,
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
        return true;
      } else {
        throw new Error('No prompt received from server.');
      }
    } catch (error) {
      console.error('Error generating prompt:', error);
      setPromptError(
        error instanceof Error ? error.message : 'An error occurred. Please try again.',
      );
      return false;
    } finally {
      setIsGeneratingPrompt(false);
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

  return {
    generatedPrompt,
    copied,
    isGeneratingPrompt,
    promptError,
    generatePrompt,
    copyToClipboard,
  };
};

