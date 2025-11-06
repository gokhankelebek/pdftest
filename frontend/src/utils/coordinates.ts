/**
 * Coordinate system utilities for PDF region management
 * All coordinates are stored as percentages (0-100) for responsiveness
 */

export interface Point {
  x: number;
  y: number;
}

export interface Rectangle {
  x: number;      // Top-left X (percentage)
  y: number;      // Top-left Y (percentage)
  width: number;  // Width (percentage)
  height: number; // Height (percentage)
}

export interface PixelRectangle {
  x: number;      // Top-left X (pixels)
  y: number;      // Top-left Y (pixels)
  width: number;  // Width (pixels)
  height: number; // Height (pixels)
}

/**
 * Convert pixel coordinates to percentage coordinates
 */
export function pixelsToPercent(
  pixelRect: PixelRectangle,
  containerWidth: number,
  containerHeight: number
): Rectangle {
  return {
    x: (pixelRect.x / containerWidth) * 100,
    y: (pixelRect.y / containerHeight) * 100,
    width: (pixelRect.width / containerWidth) * 100,
    height: (pixelRect.height / containerHeight) * 100
  };
}

/**
 * Convert percentage coordinates to pixel coordinates
 */
export function percentToPixels(
  percentRect: Rectangle,
  containerWidth: number,
  containerHeight: number
): PixelRectangle {
  return {
    x: (percentRect.x / 100) * containerWidth,
    y: (percentRect.y / 100) * containerHeight,
    width: (percentRect.width / 100) * containerWidth,
    height: (percentRect.height / 100) * containerHeight
  };
}

/**
 * Convert point from pixels to percentage
 */
export function pointToPercent(
  point: Point,
  containerWidth: number,
  containerHeight: number
): Point {
  return {
    x: (point.x / containerWidth) * 100,
    y: (point.y / containerHeight) * 100
  };
}

/**
 * Convert point from percentage to pixels
 */
export function pointToPixels(
  point: Point,
  containerWidth: number,
  containerHeight: number
): Point {
  return {
    x: (point.x / 100) * containerWidth,
    y: (point.y / 100) * containerHeight
  };
}

/**
 * Check if a point is inside a rectangle
 */
export function isPointInRect(point: Point, rect: Rectangle): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * Create a rectangle from two points (drag operation)
 */
export function createRectFromPoints(start: Point, end: Point): Rectangle {
  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return { x, y, width, height };
}

/**
 * Normalize rectangle to ensure positive width/height
 */
export function normalizeRect(rect: Rectangle): Rectangle {
  return {
    x: rect.width < 0 ? rect.x + rect.width : rect.x,
    y: rect.height < 0 ? rect.y + rect.height : rect.y,
    width: Math.abs(rect.width),
    height: Math.abs(rect.height)
  };
}

/**
 * Scale rectangle by a zoom factor
 */
export function scaleRect(rect: PixelRectangle, scale: number): PixelRectangle {
  return {
    x: rect.x * scale,
    y: rect.y * scale,
    width: rect.width * scale,
    height: rect.height * scale
  };
}

/**
 * Check if two rectangles overlap
 */
export function rectsOverlap(rect1: Rectangle, rect2: Rectangle): boolean {
  return !(
    rect1.x + rect1.width < rect2.x ||
    rect2.x + rect2.width < rect1.x ||
    rect1.y + rect1.height < rect2.y ||
    rect2.y + rect2.height < rect1.y
  );
}

/**
 * Get the center point of a rectangle
 */
export function getRectCenter(rect: Rectangle): Point {
  return {
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2
  };
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Constrain rectangle to stay within bounds
 */
export function constrainRect(rect: Rectangle): Rectangle {
  return {
    x: clamp(rect.x, 0, 100 - rect.width),
    y: clamp(rect.y, 0, 100 - rect.height),
    width: clamp(rect.width, 0, 100 - rect.x),
    height: clamp(rect.height, 0, 100 - rect.y)
  };
}
