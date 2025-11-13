import React from 'react';

interface ColorPaletteSectionProps {
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  textColor: string;
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
  onTertiaryColorChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
}

export const ColorPaletteSection: React.FC<ColorPaletteSectionProps> = ({
  primaryColor,
  secondaryColor,
  tertiaryColor,
  textColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onTertiaryColorChange,
  onTextColorChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-2">
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
              onChange={(e) => onPrimaryColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={primaryColor}
              onChange={(e) => onPrimaryColorChange(e.target.value)}
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
              onChange={(e) => onSecondaryColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={secondaryColor}
              onChange={(e) => onSecondaryColorChange(e.target.value)}
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
              onChange={(e) => onTertiaryColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={tertiaryColor}
              onChange={(e) => onTertiaryColorChange(e.target.value)}
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
              onChange={(e) => onTextColorChange(e.target.value)}
              className="w-16 h-12 rounded-lg border border-gray-700 cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={textColor}
              onChange={(e) => onTextColorChange(e.target.value)}
              className="flex-1 bg-zinc-900 text-white rounded-lg border border-gray-700 h-12 px-4 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition-all font-mono text-sm"
              placeholder="#000000"
              pattern="^#[0-9A-Fa-f]{6}$"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

