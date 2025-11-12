import { useState } from 'react';
import { trackButtonClick } from '@/lib/analytics';

interface EnhanceBioParams {
  name: string;
  title: string;
  location: string;
  bio: string;
  website: string;
  company: string;
  industry: string;
}

export const useBioEnhancement = () => {
  const [isEnhancingBio, setIsEnhancingBio] = useState(false);
  const [bioEnhanceError, setBioEnhanceError] = useState<string | null>(null);

  const enhanceBio = async (params: EnhanceBioParams, setBio: (bio: string) => void) => {
    const { name, title, location, bio, website, company, industry } = params;

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

  return {
    isEnhancingBio,
    bioEnhanceError,
    enhanceBio,
  };
};

