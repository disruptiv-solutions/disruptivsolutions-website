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

  return (
    <form onSubmit={onSubmit} className="space-y-5">
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

      {promptError && (
        <p className="text-sm text-red-400">{promptError}</p>
      )}
    </form>
  );
};

