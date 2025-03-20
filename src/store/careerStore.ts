
import { create } from 'zustand';

export type FormData = {
  name: string;
  age: string;
  qualification: string;
  interestedSubjects: string;
  hackathonsAttended: string;
  extraCoursesCompleted: string;
  certifications: string;
  workshops: string;
  industryPreference: string;
  preferredRole: 'management' | 'technical';
};

export type CareerSuggestion = {
  suggestedJobRole: string;
  careerPath: string;
  certificationsRequired: string;
  expectedSalary: string;
};

type CareerStore = {
  formData: FormData | null;
  suggestion: CareerSuggestion | null;
  isLoading: boolean;
  error: string | null;
  setFormData: (data: FormData) => void;
  setSuggestion: (suggestion: CareerSuggestion | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useCareerStore = create<CareerStore>((set) => ({
  formData: null,
  suggestion: null,
  isLoading: false,
  error: null,
  setFormData: (data) => set({ formData: data }),
  setSuggestion: (suggestion) => set({ suggestion }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
