import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCareerStore, FormData } from '@/store/careerStore';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { formSchema, FormValues } from './careerForm/formSchema';
import PersonalDetailsFields from './careerForm/PersonalDetailsFields';
import EducationFields from './careerForm/EducationFields';
import ExperienceFields from './careerForm/ExperienceFields';
import PreferenceFields from './careerForm/PreferenceFields';

// Groq API key
const GROQ_API_KEY = "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";

const CareerForm = () => {
  const { setFormData, setIsLoading, setError, setSuggestion } = useCareerStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '',
      qualification: '',
      interestedSubjects: '',
      hackathonsAttended: '',
      extraCoursesCompleted: '',
      certifications: '',
      workshops: '',
      industryPreference: '',
      preferredRole: 'technical',
    },
  });

  // Function to fetch career suggestions from Groq API
  const callGroqAPI = async (formData: FormValues) => {
    try {
      const prompt = `
        Based on the following user profile, suggest an appropriate career path:
        
        Name: ${formData.name}
        Age: ${formData.age}
        Qualification: ${formData.qualification}
        Interested Subjects: ${formData.interestedSubjects}
        Hackathons Attended: ${formData.hackathonsAttended}
        Extra Courses Completed: ${formData.extraCoursesCompleted}
        Certifications: ${formData.certifications}
        Workshops: ${formData.workshops}
        Industry Preference: ${formData.industryPreference}
        Preferred Role: ${formData.preferredRole}
        
        Please provide a JSON response with these fields:
        1. suggestedJobRole - A specific job role
        2. careerPath - A detailed career progression path
        3. certificationsRequired - List 3-5 certifications
        4. expectedSalary - Salary range in Indian Rupees (INR) per annum

        Format your response as valid JSON:
        {
          "suggestedJobRole": "Software Developer",
          "careerPath": "Detailed career path description...",
          "certificationsRequired": "Certification 1, Certification 2",
          "expectedSalary": "$70,000 - $120,000"
        }
      `;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a career advisor. Always respond with valid JSON."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2048
        })
      });

      if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

      const responseData = await response.json();
      console.log('Groq API Response:', responseData);

      let text = responseData?.choices?.[0]?.message?.content || "";
      let suggestionData = JSON.parse(text.includes("```json") ? text.split("```json")[1].split("```")[0].trim() : text);

      return {
        suggestedJobRole: suggestionData.suggestedJobRole || "Career Specialist",
        careerPath: suggestionData.careerPath || "Career path not available",
        certificationsRequired: suggestionData.certificationsRequired || "Certifications not available",
        expectedSalary: suggestionData.expectedSalary || "Salary information not available"
      };
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      setFormData(data as FormData);
      setSuggestion(null);
      setError(null);

      const careerSuggestions = await callGroqAPI(data);
      setSuggestion(careerSuggestions);

      toast({ title: "Success!", description: "Career suggestions generated successfully." });
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unknown error occurred");
      toast({ variant: "destructive", title: "Error!", description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalDetailsFields control={form.control} />
        <EducationFields control={form.control} />
        <ExperienceFields control={form.control} />
        <PreferenceFields control={form.control} />
        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? 'Submitting...' : 'Get Career Suggestions'}
        </Button>
      </form>
    </Form>
  );
};

export default CareerForm;
