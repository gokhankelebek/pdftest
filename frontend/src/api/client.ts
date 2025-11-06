import axios from 'axios';
import type { Test, TestSession, Question, Region } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

// Test endpoints
export const getTests = async (): Promise<Test[]> => {
  const response = await apiClient.get('/tests');
  return response.data;
};

export const getTest = async (testId: string): Promise<Test> => {
  const response = await apiClient.get(`/tests/${testId}`);
  return response.data;
};

export const createTest = async (data: {
  title: string;
  description?: string;
  pdfFile: File;
}): Promise<Test> => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.description) {
    formData.append('description', data.description);
  }
  formData.append('pdf', data.pdfFile);

  const response = await apiClient.post('/tests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateTest = async (
  testId: string,
  data: Partial<Test>
): Promise<Test> => {
  const response = await apiClient.put(`/tests/${testId}`, data);
  return response.data;
};

export const deleteTest = async (testId: string): Promise<void> => {
  await apiClient.delete(`/tests/${testId}`);
};

// Question endpoints
export const createQuestion = async (
  testId: string,
  data: {
    questionNumber: number;
    pageNumber: number;
    correctAnswer: string;
  }
): Promise<Question> => {
  const response = await apiClient.post(`/tests/${testId}/questions`, data);
  return response.data;
};

export const updateQuestion = async (
  questionId: string,
  data: Partial<Question>
): Promise<Question> => {
  const response = await apiClient.put(`/questions/${questionId}`, data);
  return response.data;
};

export const deleteQuestion = async (questionId: string): Promise<void> => {
  await apiClient.delete(`/questions/${questionId}`);
};

// Region endpoints
export const createRegion = async (
  questionId: string,
  data: {
    answerId: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }
): Promise<Region> => {
  const response = await apiClient.post(`/questions/${questionId}/regions`, data);
  return response.data;
};

export const updateRegion = async (
  regionId: string,
  data: Partial<Region>
): Promise<Region> => {
  const response = await apiClient.put(`/regions/${regionId}`, data);
  return response.data;
};

export const deleteRegion = async (regionId: string): Promise<void> => {
  await apiClient.delete(`/regions/${regionId}`);
};

// Session endpoints
export const createSession = async (data: {
  testId: string;
  studentName?: string;
}): Promise<TestSession> => {
  const response = await apiClient.post('/sessions', data);
  return response.data;
};

export const submitSession = async (
  sessionId: string,
  answers: { questionId: string; selectedAnswer: string }[]
): Promise<TestSession> => {
  const response = await apiClient.post(`/sessions/${sessionId}/submit`, {
    answers
  });
  return response.data;
};

export const getSession = async (sessionId: string): Promise<TestSession> => {
  const response = await apiClient.get(`/sessions/${sessionId}`);
  return response.data;
};

export const getTestSessions = async (testId: string): Promise<TestSession[]> => {
  const response = await apiClient.get(`/tests/${testId}/sessions`);
  return response.data;
};

export default apiClient;
