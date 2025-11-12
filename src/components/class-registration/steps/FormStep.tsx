import React from 'react';
import { PersonalInfoSection } from '../form-sections/PersonalInfoSection';
import { AdditionalInfoSection } from '../form-sections/AdditionalInfoSection';
import { BioSection } from '../form-sections/BioSection';
import { ProfileImageSection } from '../form-sections/ProfileImageSection';
import { ColorPaletteSection } from '../form-sections/ColorPaletteSection';
import type { FormData, SocialLink } from '../types';

interface FormStepProps {
  formData: FormData;
  imagePreview: string | null;
  isRecording: boolean;
  transcriptionText: string;
  isEnhancingBio: boolean;
  bioEnhanceError: string | null;
  isGeneratingPrompt: boolean;
  promptError: string | null;
  onFormDataChange: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
  onImagePreviewChange: (preview: string | null) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onEnhanceBio: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const FormStep: React.FC<FormStepProps> = ({
  formData,
  imagePreview,
  isRecording,
  transcriptionText,
  isEnhancingBio,
  bioEnhanceError,
  isGeneratingPrompt,
  promptError,
  onFormDataChange,
  onImagePreviewChange,
  onStartRecording,
  onStopRecording,
  onEnhanceBio,
  onSubmit,
}) => {
  const handleFileChange = (file: File | null) => {
    onFormDataChange('profileImageFile', file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImagePreviewChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImagePreviewChange(null);
    }
  };

  const handleRemoveImage = () => {
    onFormDataChange('profileImageFile', null);
    onFormDataChange('profileImageUrl', '');
    onImagePreviewChange(null);
  };

  const isFormValid = formData.name && formData.title && formData.location && formData.bio && formData.email;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <PersonalInfoSection
        name={formData.name}
        title={formData.title}
        location={formData.location}
        email={formData.email}
        onNameChange={(value) => onFormDataChange('name', value)}
        onTitleChange={(value) => onFormDataChange('title', value)}
        onLocationChange={(value) => onFormDataChange('location', value)}
        onEmailChange={(value) => onFormDataChange('email', value)}
      />

      <AdditionalInfoSection
        phone={formData.phone}
        website={formData.website}
        company={formData.company}
        industry={formData.industry}
        socialLinks={formData.socialLinks}
        onPhoneChange={(value) => onFormDataChange('phone', value)}
        onWebsiteChange={(value) => onFormDataChange('website', value)}
        onCompanyChange={(value) => onFormDataChange('company', value)}
        onIndustryChange={(value) => onFormDataChange('industry', value)}
        onSocialLinksChange={(links) => onFormDataChange('socialLinks', links)}
      />

      <BioSection
        bio={formData.bio}
        isRecording={isRecording}
        transcriptionText={transcriptionText}
        isEnhancingBio={isEnhancingBio}
        bioEnhanceError={bioEnhanceError}
        onBioChange={(value) => onFormDataChange('bio', value)}
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onEnhanceBio={onEnhanceBio}
      />

      <ProfileImageSection
        profileImageUrl={formData.profileImageUrl}
        profileImageFile={formData.profileImageFile}
        imagePreview={imagePreview}
        onUrlChange={(value) => onFormDataChange('profileImageUrl', value)}
        onFileChange={handleFileChange}
        onRemoveImage={handleRemoveImage}
      />

      <ColorPaletteSection
        primaryColor={formData.primaryColor}
        secondaryColor={formData.secondaryColor}
        tertiaryColor={formData.tertiaryColor}
        textColor={formData.textColor}
        onPrimaryColorChange={(value) => onFormDataChange('primaryColor', value)}
        onSecondaryColorChange={(value) => onFormDataChange('secondaryColor', value)}
        onTertiaryColorChange={(value) => onFormDataChange('tertiaryColor', value)}
        onTextColorChange={(value) => onFormDataChange('textColor', value)}
      />

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
  );
};

