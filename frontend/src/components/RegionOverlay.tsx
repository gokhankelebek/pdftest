import type { Region } from '../types';
import { X } from 'lucide-react';

interface RegionOverlayProps {
  regions: Region[];
  width: number;
  height: number;
  onRegionClick?: (region: Region) => void;
  onRegionDelete?: (regionId: string) => void;
  interactive?: boolean;
  selectedRegionId?: string;
}

const ANSWER_COLORS: { [key: string]: { bg: string; border: string; text: string } } = {
  A: { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-700' },
  B: { bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-700' },
  C: { bg: 'bg-yellow-500', border: 'border-yellow-600', text: 'text-yellow-700' },
  D: { bg: 'bg-red-500', border: 'border-red-600', text: 'text-red-700' },
  E: { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-700' },
  F: { bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-700' }
};

export default function RegionOverlay({
  regions,
  width,
  height,
  onRegionClick,
  onRegionDelete,
  interactive = false,
  selectedRegionId
}: RegionOverlayProps) {
  const getRegionColors = (answerId: string) => {
    return ANSWER_COLORS[answerId] || {
      bg: 'bg-gray-500',
      border: 'border-gray-600',
      text: 'text-gray-700'
    };
  };

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ width, height }}>
      {regions.map((region) => {
        const colors = getRegionColors(region.answerId);
        const isSelected = selectedRegionId === region.id;

        return (
          <div
            key={region.id}
            className={`
              absolute border-2 transition-all
              ${colors.border}
              ${interactive ? 'pointer-events-auto cursor-pointer hover:opacity-50' : ''}
              ${isSelected ? 'ring-4 ring-blue-300 opacity-60' : 'opacity-30'}
              ${colors.bg}
            `}
            style={{
              left: `${region.x}%`,
              top: `${region.y}%`,
              width: `${region.width}%`,
              height: `${region.height}%`
            }}
            onClick={() => interactive && onRegionClick && onRegionClick(region)}
          >
            {/* Answer label */}
            <div
              className={`
                absolute -top-6 left-0
                ${colors.bg}
                text-white text-xs font-bold
                px-2 py-1 rounded shadow-lg
                pointer-events-none
              `}
            >
              {region.answerId}
            </div>

            {/* Delete button (admin mode) */}
            {interactive && onRegionDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRegionDelete(region.id);
                }}
                className={`
                  absolute -top-6 -right-6
                  bg-red-500 hover:bg-red-600
                  text-white rounded-full p-1
                  pointer-events-auto
                  transition-colors
                  shadow-lg
                `}
                title="Delete region"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Hover info */}
            {interactive && (
              <div className="absolute bottom-full left-0 mb-1 hidden group-hover:block pointer-events-none">
                <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Answer {region.answerId} - Click to select
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
