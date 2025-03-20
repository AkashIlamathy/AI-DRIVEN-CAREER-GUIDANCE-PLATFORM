
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import ResumeUploader from '@/components/resume/ResumeUploader';
import ResumeSuggestionResults from '@/components/resume/ResumeSuggestionResults';
import { useResumeStore } from '@/store/resumeStore';
import { Button } from '@/components/ui/button';

const ResumeSuggestions = () => {
  const { suggestion, isLoading, setIsLoading } = useResumeStore();
  
  // Ensure we don't get stuck in loading state
  useEffect(() => {
    console.log("Resume page loaded, loading state:", isLoading);
    return () => {
      // Reset loading state when unmounting to prevent stuck loading states
      if (isLoading) {
        console.log("Cleaning up stuck loading state");
        setIsLoading(false);
      }
    };
  }, [isLoading, setIsLoading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Resume Analysis</h1>
            <p className="text-gray-600">
              Upload your resume to receive personalized suggestions and insights
            </p>
          </div>
          
          <div className="grid gap-8 grid-cols-1">
            <ResumeUploader />
            
            {suggestion && (
              <ResumeSuggestionResults />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResumeSuggestions;
