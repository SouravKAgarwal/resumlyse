import axios from 'axios';
import { AnalysisResult } from '../types';

const api = axios.create({
  baseURL: '/api',
});

// Backend returns { id, filename, analysis: AnalysisResult }
// Note: id is always 0 since we removed history functionality
interface AnalyzeApiResponse {
  id: number;
  filename: string;
  analysis: AnalysisResult;
}

/**
 * Upload resume to backend for stateless parsing & AI evaluation.
 * No history storage since we removed database/persistence.
 */
export const analyzeResume = async (
  file: File,
  jobDescription?: string
): Promise<{ id: number; filename: string; analysis: AnalysisResult }> => {
  const formData = new FormData();
  formData.append('file', file);
  if (jobDescription) {
    formData.append('job_description', jobDescription);
  }

  // Stateless evaluation from backend
  const response = await api.post<AnalyzeApiResponse>('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return {
    id: response.data.id,
    filename: response.data.filename,
    analysis: response.data.analysis,
  };
};

/**
 * Generate a PDF report directly from the provided data via stateless backend generator.
 */
export const exportPDF = async (
  payload: { filename: string; analysis: AnalysisResult }
): Promise<Blob> => {
  const { filename, analysis } = payload;

  const response = await api.post(
    '/export',
    { filename, analysis },
    { responseType: 'blob' }
  );
  return response.data;
};
