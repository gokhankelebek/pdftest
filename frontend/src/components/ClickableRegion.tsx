import { useState } from 'react';
import { Region } from '../types';
import { Check } from 'lucide-react';

interface ClickableRegionProps {
  region: Region;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: (regionId: string, answerId: string) => void;
  disabled?: boolean;
}

const ANSWER_COLORS: { [key: string]: { bg: string; hover: string; selected: string } } = {
  A: { bg: 'hover:bg-blue-100', hover: 'hover:bg-blue-200', selected: 'bg-blue-400' },
  B: { bg: 'hover:bg-green-100', hover: 'hover:bg-green-200', selected: 'bg-green-400' },
  C: { bg: 'hover:bg-yellow-100', hover: 'hover:bg-yellow-200', selected: 'bg-yellow-400' },
  D: { bg: 'hover:bg-red-100', hover: 'hover:bg-red-200', selected: 'bg-red-400' },
  E: { bg: 'hover:bg-purple-100', hover: 'hover:bg-purple-200', selected: 'bg-purple-400' },
  F: { bg: 'hover:bg-pink-100', hover: 'hover:bg-pink-200', selected: 'bg-pink-400' }
};

export default function ClickableRegion({
  region,
  width,
  height,
  isSelected,
  onSelect,
  disabled = false
}: ClickableRegionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = ANSWER_COLORS[region.answerId] || { bg: 'hover:bg-gray-100', hover: 'hover:bg-gray-200', selected: 'bg-gray-400' };

  const handleClick = () => {
    if (!disabled) {
      onSelect(region.id, region.answerId);
    }
  };

  return (
    <div
      className={`
        absolute cursor-pointer transition-all duration-200
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${isSelected ? `${colors.selected} opacity-50 border-4 border-blue-600` : 'border-2 border-transparent'}
        ${!isSelected && !disabled ? colors.bg : ''}
      `}
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.width}%`,
        height: `${region.height}%`
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
          <Check className="w-6 h-6 text-blue-600" />
        </div>
      )}

      {/* Hover effect */}
      {isHovered && !disabled && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
          <div className="bg-white px-3 py-1 rounded text-sm font-medium shadow-lg">
            {isSelected ? 'Selected' : `Click to select ${region.answerId}`}
          </div>
        </div>
      )}
    </div>
  );
}
