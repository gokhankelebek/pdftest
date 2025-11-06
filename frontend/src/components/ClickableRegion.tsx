import { useState } from 'react';
import type { Region } from '../types';
import { Check } from 'lucide-react';

// Helper function to get RGBA color for transparent highlight
const getHighlightColor = (answerId: string): string => {
  const colorMap: { [key: string]: string } = {
    A: 'rgba(59, 130, 246, 0.35)', // blue-500 with opacity
    B: 'rgba(34, 197, 94, 0.35)',  // green-500 with opacity
    C: 'rgba(234, 179, 8, 0.35)',  // yellow-500 with opacity
    D: 'rgba(239, 68, 68, 0.35)',   // red-500 with opacity
    E: 'rgba(168, 85, 247, 0.35)',  // purple-500 with opacity
    F: 'rgba(236, 72, 153, 0.35)'   // pink-500 with opacity
  };
  return colorMap[answerId] || 'rgba(156, 163, 175, 0.35)'; // gray fallback
};

interface ClickableRegionProps {
  region: Region;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: (regionId: string, answerId: string) => void;
  disabled?: boolean;
}

const ANSWER_COLORS: { [key: string]: { bg: string; hover: string; selected: string; highlight: string } } = {
  A: { bg: 'hover:bg-blue-100', hover: 'hover:bg-blue-200', selected: 'bg-blue-400', highlight: 'bg-blue-400' },
  B: { bg: 'hover:bg-green-100', hover: 'hover:bg-green-200', selected: 'bg-green-400', highlight: 'bg-green-400' },
  C: { bg: 'hover:bg-yellow-100', hover: 'hover:bg-yellow-200', selected: 'bg-yellow-400', highlight: 'bg-yellow-400' },
  D: { bg: 'hover:bg-red-100', hover: 'hover:bg-red-200', selected: 'bg-red-400', highlight: 'bg-red-400' },
  E: { bg: 'hover:bg-purple-100', hover: 'hover:bg-purple-200', selected: 'bg-purple-400', highlight: 'bg-purple-400' },
  F: { bg: 'hover:bg-pink-100', hover: 'hover:bg-pink-200', selected: 'bg-pink-400', highlight: 'bg-pink-400' }
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
  const colors = ANSWER_COLORS[region.answerId] || { bg: 'hover:bg-gray-100', hover: 'hover:bg-gray-200', selected: 'bg-gray-400', highlight: 'bg-gray-400' };

  const handleClick = () => {
    if (!disabled) {
      console.log('ClickableRegion clicked:', region.id, region.answerId, 'Selected:', isSelected);
      onSelect(region.id, region.answerId);
    }
  };

  return (
    <div
      className={`
        absolute cursor-pointer transition-all duration-200 z-10
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${isSelected ? `${colors.selected} opacity-50 border-4 border-blue-600` : 'border-2 border-transparent'}
        ${!isSelected && !disabled ? colors.bg : ''}
      `}
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.width}%`,
        height: `${region.height}%`,
        pointerEvents: disabled ? 'none' : 'auto'
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Click event on region:', region.id, region.answerId);
        handleClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg">
          <Check className="w-6 h-6 text-blue-600" />
        </div>
      )}

      {/* Hover effect - transparent colored highlight */}
      {isHovered && !disabled && !isSelected && (
        <div 
          className="absolute inset-0 transition-opacity duration-200 flex items-center justify-center"
          style={{ backgroundColor: getHighlightColor(region.answerId) }}
        >
          <div className="bg-white px-3 py-1 rounded text-sm font-medium shadow-lg border-2 border-white">
            Select Choice {region.answerId}
          </div>
        </div>
      )}
      
      {/* Hover effect - when selected */}
      {isHovered && !disabled && isSelected && (
        <div className="absolute inset-0 bg-black bg-opacity-5 flex items-center justify-center">
          <div className="bg-white px-3 py-1 rounded text-sm font-medium shadow-lg border-2 border-blue-600">
            Selected
          </div>
        </div>
      )}
    </div>
  );
}
