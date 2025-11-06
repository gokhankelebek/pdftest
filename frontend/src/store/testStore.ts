import { create } from 'zustand';
import type { Test, Question, Region, SelectedAnswer, TestSession } from '../types';

interface TestStore {
  // Current test data
  currentTest: Test | null;
  currentQuestion: Question | null;
  currentPage: number;
  zoom: number;

  // Student answers
  selectedAnswers: SelectedAnswer[];

  // Admin region drawing
  drawingMode: boolean;
  currentRegions: Region[];

  // Session
  currentSession: TestSession | null;

  // Actions
  setCurrentTest: (test: Test | null) => void;
  setCurrentQuestion: (question: Question | null) => void;
  setCurrentPage: (page: number) => void;
  setZoom: (zoom: number) => void;

  // Student actions
  selectAnswer: (questionId: string, answerId: string) => void;
  clearAnswer: (questionId: string) => void;
  getSelectedAnswer: (questionId: string) => string | null;
  clearAllAnswers: () => void;

  // Admin actions
  toggleDrawingMode: () => void;
  addRegion: (region: Region) => void;
  removeRegion: (regionId: string) => void;
  updateRegion: (regionId: string, updates: Partial<Region>) => void;
  clearRegions: () => void;

  // Session actions
  setCurrentSession: (session: TestSession | null) => void;

  // Reset
  reset: () => void;
}

export const useTestStore = create<TestStore>((set, get) => ({
  // Initial state
  currentTest: null,
  currentQuestion: null,
  currentPage: 1,
  zoom: 1,
  selectedAnswers: [],
  drawingMode: false,
  currentRegions: [],
  currentSession: null,

  // Basic setters
  setCurrentTest: (test) => set({ currentTest: test }),
  setCurrentQuestion: (question) => set({ currentQuestion: question }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setZoom: (zoom) => set({ zoom }),

  // Student answer management
  selectAnswer: (questionId, answerId) => {
    const { selectedAnswers } = get();
    const existingIndex = selectedAnswers.findIndex(
      (a) => a.questionId === questionId
    );

    if (existingIndex >= 0) {
      // Update existing answer
      const newAnswers = [...selectedAnswers];
      newAnswers[existingIndex] = { questionId, answerId };
      set({ selectedAnswers: newAnswers });
    } else {
      // Add new answer
      set({
        selectedAnswers: [...selectedAnswers, { questionId, answerId }]
      });
    }
  },

  clearAnswer: (questionId) => {
    set({
      selectedAnswers: get().selectedAnswers.filter(
        (a) => a.questionId !== questionId
      )
    });
  },

  getSelectedAnswer: (questionId) => {
    const answer = get().selectedAnswers.find(
      (a) => a.questionId === questionId
    );
    return answer ? answer.answerId : null;
  },

  clearAllAnswers: () => set({ selectedAnswers: [] }),

  // Admin region management
  toggleDrawingMode: () => set({ drawingMode: !get().drawingMode }),

  addRegion: (region) => {
    set({
      currentRegions: [...get().currentRegions, region]
    });
  },

  removeRegion: (regionId) => {
    set({
      currentRegions: get().currentRegions.filter((r) => r.id !== regionId)
    });
  },

  updateRegion: (regionId, updates) => {
    set({
      currentRegions: get().currentRegions.map((r) =>
        r.id === regionId ? { ...r, ...updates } : r
      )
    });
  },

  clearRegions: () => set({ currentRegions: [] }),

  // Session management
  setCurrentSession: (session) => set({ currentSession: session }),

  // Reset all state
  reset: () =>
    set({
      currentTest: null,
      currentQuestion: null,
      currentPage: 1,
      zoom: 1,
      selectedAnswers: [],
      drawingMode: false,
      currentRegions: [],
      currentSession: null
    })
}));
