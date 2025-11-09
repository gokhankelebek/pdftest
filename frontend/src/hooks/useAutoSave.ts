import { useEffect, useRef } from 'react';

interface AutoSaveOptions {
  key: string;
  data: any;
  enabled?: boolean;
  delay?: number;
}

/**
 * Custom hook for auto-saving data to localStorage
 */
export function useAutoSave({ key, data, enabled = true, delay = 1000 }: AutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!enabled) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        console.log('Auto-saved to localStorage:', key);
      } catch (error) {
        console.error('Error auto-saving to localStorage:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [key, data, enabled, delay]);
}

/**
 * Load saved data from localStorage
 */
export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return defaultValue;
}

/**
 * Clear saved data from localStorage
 */
export function clearFromLocalStorage(key: string) {
  try {
    localStorage.removeItem(key);
    console.log('Cleared from localStorage:', key);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
