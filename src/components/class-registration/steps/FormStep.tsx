import React, { useState } from 'react';
import { PersonalInfoSection } from '../form-sections/PersonalInfoSection';
import { AdditionalInfoSection } from '../form-sections/AdditionalInfoSection';
import { BioSection } from '../form-sections/BioSection';
import { ProfileImageSection } from '../form-sections/ProfileImageSection';
import { ColorPaletteSection } from '../form-sections/ColorPaletteSection';
import { uploadFileToStorage } from '@/lib/firebase';
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      onFormDataChange('profileImageFile', null);
      onImagePreviewChange(null);
      return;
    }

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

    onFormDataChange('profileImageFile', file);
    onFormDataChange('profileImageUrl', ''); // Clear URL if file is selected
    setImageUploadError(null);
    setIsUploadingImage(true);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onImagePreviewChange(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Firebase Storage
    try {
      const downloadURL = await uploadFileToStorage(file);
      onFormDataChange('profileImageUrl', downloadURL);
      setIsUploadingImage(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageUploadError(
        error instanceof Error ? error.message : 'Failed to upload image. Please try again.'
      );
      setIsUploadingImage(false);
      // Keep the file and preview so user can retry
    }
  };

  const handleRemoveImage = () => {
    onFormDataChange('profileImageFile', null);
    onFormDataChange('profileImageUrl', '');
    onImagePreviewChange(null);
    setImageUploadError(null);
    setIsUploadingImage(false);
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
        isUploadingImage={isUploadingImage}
        imageUploadError={imageUploadError}
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

