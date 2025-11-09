import { useState, useEffect } from 'react';
import { Region } from '../types';
import { Check, Circle } from 'lucide-react';

interface EnhancedClickableRegionProps {
  region: Region;
  width: number;
  height: number;
  isSelected: boolean;
  onSelect: (regionId: string, answerId: string) => void;
  disabled?: boolean;
  showLabel?: boolean;
}

const ANSWER_COLORS: { [key: string]: {
  bg: string;
  hover: string;
  selected: string;
  border: string;
  text: string;
} } = {
  A: {
    bg: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    selected: 'bg-blue-500',
    border: 'border-blue-300',
    text: 'text-blue-700'
  },
  B: {
    bg: 'bg-green-50',
    hover: 'hover:bg-green-100',
    selected: 'bg-green-500',
    border: 'border-green-300',
    text: 'text-green-700'
  },
  C: {
    bg: 'bg-yellow-50',
    hover: 'hover:bg-yellow-100',
    selected: 'bg-yellow-500',
    border: 'border-yellow-300',
    text: 'text-yellow-700'
  },
  D: {
    bg: 'bg-red-50',
    hover: 'hover:bg-red-100',
    selected: 'bg-red-500',
    border: 'border-red-300',
    text: 'text-red-700'
  },
  E: {
    bg: 'bg-purple-50',
    hover: 'hover:bg-purple-100',
    selected: 'bg-purple-500',
    border: 'border-purple-300',
    text: 'text-purple-700'
  },
  F: {
    bg: 'bg-pink-50',
    hover: 'hover:bg-pink-100',
    selected: 'bg-pink-500',
    border: 'border-pink-300',
    text: 'text-pink-700'
  }
};

export default function EnhancedClickableRegion({
  region,
  width,
  height,
  isSelected,
  onSelect,
  disabled = false,
  showLabel = true
}: EnhancedClickableRegionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [ripple, setRipple] = useState(false);
  const colors = ANSWER_COLORS[region.answerId] || {
    bg: 'bg-gray-50',
    hover: 'hover:bg-gray-100',
    selected: 'bg-gray-500',
    border: 'border-gray-300',
    text: 'text-gray-700'
  };

  useEffect(() => {
    if (ripple) {
      const timer = setTimeout(() => setRipple(false), 600);
      return () => clearTimeout(timer);
    }
  }, [ripple]);

  const handleClick = () => {
    if (!disabled) {
      setRipple(true);
      onSelect(region.id, region.answerId);
    }
  };

  return (
    <div
      className={`
        absolute cursor-pointer transition-all duration-300 ease-out
        ${disabled ? 'cursor-not-allowed opacity-50' : ''}
        ${isSelected
          ? `${colors.selected} opacity-70 border-4 border-white shadow-2xl scale-105 ring-4 ring-opacity-50 ${colors.border.replace('border-', 'ring-')}`
          : `${colors.bg} border-2 ${colors.border} opacity-80`
        }
        ${!isSelected && !disabled ? colors.hover : ''}
        ${isHovered && !disabled ? 'shadow-xl scale-102 z-10' : 'shadow-md'}
        rounded-lg overflow-hidden
      `}
      style={{
        left: `${region.x}%`,
        top: `${region.y}%`,
        width: `${region.width}%`,
        height: `${region.height}%`,
        transform: `scale(${isHovered && !disabled ? 1.02 : 1})`,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Answer ${region.answerId}${isSelected ? ' - Selected' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Ripple effect */}
      {ripple && (
        <div className="absolute inset-0 animate-ping bg-white opacity-50 rounded-lg" />
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                       bg-white rounded-full p-2 shadow-lg animate-scale-in">
          <Check className="w-6 h-6 text-blue-600 font-bold" strokeWidth={3} />
        </div>
      )}

      {/* Unselected indicator */}
      {!isSelected && showLabel && (
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                        transition-all duration-200 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          <div className={`${colors.bg} border-2 ${colors.border} rounded-full p-2 shadow-md`}>
            <Circle className={`w-5 h-5 ${colors.text}`} strokeWidth={2} />
          </div>
        </div>
      )}

      {/* Answer label */}
      <div className={`absolute top-2 left-2 bg-white rounded-full px-2 py-1 shadow-md
                      text-xs font-bold ${colors.text} transition-all duration-200
                      ${isHovered ? 'scale-110' : 'scale-100'}`}>
        {region.answerId}
      </div>

      {/* Hover tooltip */}
      {isHovered && !disabled && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2
                       bg-gray-900 text-white px-3 py-1 rounded-lg text-xs font-medium
                       shadow-lg whitespace-nowrap animate-fade-in">
          {isSelected ? '✓ Selected' : `Press ${region.answerId} or Click`}
        </div>
      )}
    </div>
  );
}
