
import { create } from 'zustand';

export type ResumeSuggestion = {
  strengths: string[];
  weaknesses: string[];
  improvementSuggestions: string[];
  recommendedSkills: string[];
  careerPathRecommendation: string;
};

type ResumeStore = {
  fileContent: string | null;
  fileName: string | null;
  isLoading: boolean;
  error: string | null;
  suggestion: ResumeSuggestion | null;
  setFileContent: (content: string | null, name: string | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setSuggestion: (suggestion: ResumeSuggestion | null) => void;
};

export const useResumeStore = create<ResumeStore>((set) => ({
  fileContent: null,
  fileName: null,
  isLoading: false,
  error: null,
  suggestion: null,
  setFileContent: (content, name) => set({ fileContent: content, fileName: name }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setSuggestion: (suggestion) => set({ suggestion }),
}));
