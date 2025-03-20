
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useResumeStore } from '@/store/resumeStore';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import ResumeFileUploader from './ResumeFileUploader';
import { isResumeContent } from '@/utils/resumeUtils.ts';
import { 
   
  validateResumeFile, 
  analyzeResumeContent 
} from '@/utils/resumeUtils.ts';

const ResumeUploader = () => {
  const { 
    fileContent, 
    fileName, 
    isLoading, 
    error,
    setFileContent,
    setIsLoading,
    setError,
    setSuggestion 
  } = useResumeStore();
  const { user } = useAuth();
  const [fileType, setFileType] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<number | null>(null);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isLoading) {
      console.log("Resume analysis started");
      // Set a timeout to automatically cancel loading after 30 seconds
      const id = window.setTimeout(() => {
        console.log("Analysis timeout triggered");
        setIsLoading(false);
        setError("Analysis is taking too long. Please try again.");
        toast({
          variant: "destructive",
          title: "Timeout",
          description: "The analysis is taking too long. Please try again.",
        });
      }, 30000);
      
      setTimeoutId(id);
      
      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId);
        }
      };
    } else if (timeoutId) {
      window.clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }, [isLoading, setError, setIsLoading, timeoutId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    console.log("File selected:", file.name, file.type, file.size);
    
    // Validate file
    const validation = validateResumeFile(file);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      toast({
        variant: "destructive",
        title: "Invalid file",
        description: validation.error,
      });
      return;
    }
    
    // Save the file type for later validation
    setFileType(file.type);
    
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      console.log("File read complete, content length:", content?.length);
      
      // For plain text files, validate if it looks like a resume
      if (file.type === 'text/plain') {
        if (!isResumeContent(content)) {
          setError('The uploaded file does not appear to be a resume. Please upload a valid resume.');
          toast({
            variant: "destructive",
            title: "Invalid content",
            description: "The file doesn't appear to be a resume. Please upload a valid resume document.",
          });
          return;
        }
      }
      
      setFileContent(content, file.name);
      setError(null);
      
      toast({
        title: "Resume uploaded",
        description: `Successfully uploaded ${file.name}`,
      });
    };
    
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
      setError('Error reading file');
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the file",
      });
    };
    
    // Read as text for TXT files, as DataURL for others
    if (file.type === 'text/plain') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const analyzeResume = async () => {
    if (!fileContent) {
      toast({
        variant: "destructive",
        title: "No file",
        description: "Please upload a resume first",
      });
      return;
    }
    
    console.log("Starting resume analysis for file:", fileName);
    
    // Extra validation for binary files (PDF, DOCX)
    if (fileType !== 'text/plain' && !fileName?.toLowerCase().includes('resume') && !fileName?.toLowerCase().includes('cv')) {
      // If the file name doesn't contain 'resume' or 'cv', show a confirmation
      if (!window.confirm("This file doesn't appear to be a resume. Are you sure you want to analyze it as a resume?")) {
        return;
      }
    }
    
    setIsLoading(true);
    setSuggestion(null);
    
    try {
      const suggestion = await analyzeResumeContent(fileContent, fileName, user?.id);
      console.log("Analysis complete, received suggestion:", !!suggestion);
      setSuggestion(suggestion);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-sm border-gray-100">
      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-medium">Upload Your Resume</CardTitle>
        <CardDescription>
          We'll analyze your resume and provide personalized suggestions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <ResumeFileUploader 
          onFileChange={handleFileChange}
          fileName={fileName}
          fileContent={fileContent}
        />
        
        <Button 
          onClick={analyzeResume}
          disabled={!fileContent || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Resume'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResumeUploader;
