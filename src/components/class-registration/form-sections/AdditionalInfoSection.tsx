import React, { useState } from 'react';
import type { SocialLink } from '../types';

interface AdditionalInfoSectionProps {
  phone: string;
  website: string;
  company: string;
  industry: string;
  socialLinks: SocialLink[];
  onPhoneChange: (value: string) => void;
  onWebsiteChange: (value: string) => void;
  onCompanyChange: (value: string) => void;
  onIndustryChange: (value: string) => void;
  onSocialLinksChange: (links: SocialLink[]) => void;
}

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  phone,
  website,
  company,
  industry,
  socialLinks,
  onPhoneChange,
  onWebsiteChange,
  onCompanyChange,
  onIndustryChange,
  onSocialLinksChange,
}) => {
  const [showAddSocial, setShowAddSocial] = useState(false);
  const [newSocialPlatform, setNewSocialPlatform] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');

  const handleAddSocial = () => {
    if (newSocialPlatform && newSocialUrl) {
      onSocialLinksChange([
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
  };

  const handleRemoveSocial = (index: number) => {
    const updated = socialLinks.filter((_, i) => i !== index);
    onSocialLinksChange(updated);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">
        Additional Information
      </h2>

      <div>
        <label
          htmlFor="phone"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Phone{' '}
          <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="(555) 555-5555"
        />
      </div>

      <div>
        <label
          htmlFor="website"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Website{' '}
          <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          id="website"
          type="url"
          value={website}
          onChange={(e) => onWebsiteChange(e.target.value)}
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div>
        <label
          htmlFor="company"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Company Name{' '}
          <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          id="company"
          type="text"
          value={company}
          onChange={(e) => onCompanyChange(e.target.value)}
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="Acme Inc."
        />
      </div>

      <div>
        <label
          htmlFor="industry"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Industry{' '}
          <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <input
          id="industry"
          type="text"
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value)}
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
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
                  onClick={() => handleRemoveSocial(index)}
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
                onChange={(e) => setNewSocialPlatform(e.target.value)}
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
                onClick={handleAddSocial}
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
    </div>
  );
};

