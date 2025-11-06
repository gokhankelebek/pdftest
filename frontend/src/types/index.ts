/**
 * Type definitions for the PDF MCQ Test application
 */

// Re-export utility types
export type { Rectangle, Point } from '../utils/coordinates';

export interface Region {
  id: string;
  questionId: string;
  answerId: string; // "A", "B", "C", "D", etc.
  x: number;        // Percentage
  y: number;        // Percentage
  width: number;    // Percentage
  height: number;   // Percentage
}

export interface Question {
  id: string;
  testId: string;
  questionNumber: number;
  pageNumber: number;
  correctAnswer: string;
  regions: Region[];
}

export interface Test {
  id: string;
  title: string;
  description?: string;
  pdfUrl: string;
  createdAt: string;
  questions: Question[];
}

export interface Answer {
  id: string;
  sessionId: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface TestSession {
  id: string;
  testId: string;
  studentName?: string;
  startTime: string;
  endTime?: string;
  score?: number;
  totalQuestions: number;
  answers: Answer[];
}

export interface TestResult {
  sessionId: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: Answer[];
  test: Test;
}

// UI State Types
export interface DrawingState {
  isDrawing: boolean;
  startPoint: { x: number; y: number } | null;
  currentRect: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

export interface SelectedAnswer {
  questionId: string;
  answerId: string;
}
