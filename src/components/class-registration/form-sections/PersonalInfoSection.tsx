import React from 'react';

interface PersonalInfoSectionProps {
  name: string;
  title: string;
  location: string;
  email: string;
  onNameChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onEmailChange: (value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  name,
  title,
  location,
  email,
  onNameChange,
  onTitleChange,
  onLocationChange,
  onEmailChange,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="Jane Doe"
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          required
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="Software Engineer, Product Manager, etc."
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-xs text-gray-400 mb-1.5"
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
          onChange={(e) => onLocationChange(e.target.value)}
          required
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="New York, NY or London, UK"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs text-gray-400 mb-1.5"
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="w-full bg-zinc-900 text-white rounded-lg border border-gray-700 h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all"
          placeholder="jane@example.com"
        />
      </div>
    </div>
  );
};

