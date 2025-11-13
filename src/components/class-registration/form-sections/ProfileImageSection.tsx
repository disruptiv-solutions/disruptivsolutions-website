import React from 'react';

interface ProfileImageSectionProps {
  profileImageUrl: string;
  profileImageFile: File | null;
  imagePreview: string | null;
  onUrlChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onRemoveImage: () => void;
}

export const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  profileImageUrl,
  profileImageFile,
  imagePreview,
  onUrlChange,
  onFileChange,
  onRemoveImage,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return;
      }

      onFileChange(file);
      onUrlChange(''); // Clear URL if file is selected
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">
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
            onChange={(e) => onUrlChange(e.target.value)}
            disabled={!!profileImageFile}
            className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              if (!profileImageUrl) {
                document
                  .getElementById('profileImageFileHidden')
                  ?.click();
              }
            }}
            className={`relative w-full h-12 bg-zinc-900 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
              profileImageUrl
                ? 'border-gray-700 opacity-50 cursor-not-allowed'
                : 'border-gray-700 hover:border-red-600 hover:bg-zinc-800'
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
                {profileImageFile
                  ? profileImageFile.name
                  : 'Click to upload'}
              </span>
            </div>
            <input
              id="profileImageFileHidden"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={!!profileImageUrl}
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
              Looking good! This will be used for your profile.
            </p>
          </div>
          <button
            type="button"
            onClick={onRemoveImage}
            className="text-gray-400 hover:text-red-400 transition-colors"
            title="Remove image"
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
  );
};

