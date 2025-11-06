import { useState, useRef, useEffect } from 'react';
import { Rectangle } from '../types';
import { createRectFromPoints, pointToPercent, normalizeRect } from '../utils/coordinates';

interface RegionDrawerProps {
  width: number;
  height: number;
  onRegionComplete: (region: Rectangle) => void;
  existingRegions?: Rectangle[];
  enabled?: boolean;
  currentAnswerId?: string;
}

export default function RegionDrawer({
  width,
  height,
  onRegionComplete,
  existingRegions = [],
  enabled = true,
  currentAnswerId = 'A'
}: RegionDrawerProps) {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const getRelativeCoordinates = (clientX: number, clientY: number) => {
    if (!overlayRef.current) return { x: 0, y: 0 };

    const rect = overlayRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return pointToPercent({ x, y }, rect.width, rect.height);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enabled) return;

    const point = getRelativeCoordinates(e.clientX, e.clientY);
    setIsDrawing(true);
    setStartPoint(point);
    setCurrentRect(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;

    const currentPoint = getRelativeCoordinates(e.clientX, e.clientY);
    const rect = createRectFromPoints(startPoint, currentPoint);
    setCurrentRect(rect);
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentRect || !startPoint) {
      setIsDrawing(false);
      return;
    }

    // Only create region if it has meaningful size
    if (currentRect.width > 0.5 && currentRect.height > 0.5) {
      const normalizedRect = normalizeRect(currentRect);
      onRegionComplete(normalizedRect);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const handleMouseLeave = () => {
    if (isDrawing) {
      handleMouseUp();
    }
  };

  // Answer ID colors
  const getAnswerColor = (answerId: string) => {
    const colors: { [key: string]: string } = {
      A: 'bg-blue-500',
      B: 'bg-green-500',
      C: 'bg-yellow-500',
      D: 'bg-red-500',
      E: 'bg-purple-500',
      F: 'bg-pink-500'
    };
    return colors[answerId] || 'bg-gray-500';
  };

  return (
    <div
      ref={overlayRef}
      className="absolute inset-0 cursor-crosshair"
      style={{ width, height }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Existing regions */}
      {existingRegions.map((region, index) => (
        <div
          key={index}
          className={`absolute border-2 ${getAnswerColor(currentAnswerId)} opacity-30 pointer-events-none`}
          style={{
            left: `${region.x}%`,
            top: `${region.y}%`,
            width: `${region.width}%`,
            height: `${region.height}%`
          }}
        >
          <div className="absolute top-0 right-0 bg-white text-xs px-1 rounded-bl">
            {currentAnswerId}
          </div>
        </div>
      ))}

      {/* Current drawing rectangle */}
      {isDrawing && currentRect && (
        <div
          className={`absolute border-2 border-dashed ${getAnswerColor(currentAnswerId)} bg-opacity-20 pointer-events-none`}
          style={{
            left: `${currentRect.x}%`,
            top: `${currentRect.y}%`,
            width: `${currentRect.width}%`,
            height: `${currentRect.height}%`,
            backgroundColor: `${getAnswerColor(currentAnswerId).replace('bg-', 'rgba(')}`
          }}
        />
      )}

      {/* Instruction overlay when enabled */}
      {enabled && !isDrawing && existingRegions.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black bg-opacity-70 text-white px-6 py-3 rounded-lg">
            Click and drag to draw a region for answer {currentAnswerId}
          </div>
        </div>
      )}
    </div>
  );
}
