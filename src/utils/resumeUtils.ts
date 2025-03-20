import { toast } from '@/hooks/use-toast';
import { ResumeSuggestion } from '@/store/resumeStore';
import { supabase } from '@/integrations/supabase/client';

// Groq API key
const GROQ_API_KEY = "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";

/**
 * Check if the content is likely a resume by looking for resume-related keywords
 */
export const isResumeContent = (content: string): boolean => {
  const resumeKeywords = [
    'experience', 'education', 'skills', 'resume', 'cv', 'curriculum vitae',
    'work history', 'job', 'qualification', 'employment', 'projects', 'professional',
    'certification', 'objective', 'summary', 'career', 'degree', 'university',
    'bachelor', 'master', 'phd', 'references', 'contact', 'profile', 'accomplishments'
  ];
  return resumeKeywords.some(keyword => content.toLowerCase().includes(keyword));
};

/**
 * Validate file type and size
 */
export const validateResumeFile = (file: File): { isValid: boolean; error?: string } => {
  if (!['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)) {
    return { isValid: false, error: 'Please upload a PDF, TXT, or DOCX file' };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'File size should not exceed 5MB' };
  }
  return { isValid: true };
};

/**
 * Call Groq API for resume analysis
/**
 * Call Groq API for resume analysis
 */
export const callGroqAPI = async (resumeContent: string): Promise<ResumeSuggestion> => {
  console.log("📤 Calling Groq API with resume content...");
  try {
    const extractedText = resumeContent.substring(0, 5000);
    const requestBody = {
      model: "llama3-70b-8192",
      messages: [
        { role: "system", content: "You are a career counselor and resume expert. Analyze the resume content and provide structured feedback in JSON format. Do not include any extra text before or after the JSON output." },
        { role: "user", content: `Analyze this resume:\n${resumeContent.substring(0, 5000)}\n\nReturn a valid JSON with the following fields:\n{
          "strengths": ["strength1", "strength2", "strength3"],
          "weaknesses": ["weakness1", "weakness2", "weakness3"],
          "improvementSuggestions": ["suggestion1", "suggestion2", "suggestion3"],
          "recommendedSkills": ["skill1", "skill2", "skill3"],
          "careerPathRecommendation": "A detailed career path recommendation."
        }`}
      ],
      temperature: 0.7,
      max_tokens: 1000
    };
    

    console.log("📤 Sending API Request:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify(requestBody)
    });

    const responseData = await response.json();
    console.log("✅ Groq API Response Received:", responseData);

    if (!response.ok || !responseData.choices?.[0]?.message?.content) {
      console.error("🚨 Groq API Error:", responseData);
      throw new Error(`Groq API error: ${response.status} - ${responseData.error?.message || "Unknown error"}`);
    }

    // Parse the JSON response
    let suggestionData: ResumeSuggestion;
    try {
      suggestionData = JSON.parse(responseData.choices[0].message.content);
    } catch (error) {
      console.error("❌ JSON Parsing Error:", error, "Response Text:", responseData.choices[0].message.content);
      throw new Error("Groq API returned an invalid response format.");
    }

    // ✅ Ensure all required fields exist
    return {
      strengths: suggestionData.strengths || ["Strong educational background", "Relevant experience", "Technical skills"],
      weaknesses: suggestionData.weaknesses || ["Resume formatting could be improved", "Lack of quantifiable achievements"],
      improvementSuggestions: suggestionData.improvementSuggestions || ["Add measurable achievements", "Improve formatting"],
      recommendedSkills: suggestionData.recommendedSkills || ["Project Management", "Data Analysis", "Communication"],
      careerPathRecommendation: suggestionData.careerPathRecommendation || "Consider focusing on roles that leverage your strengths while developing complementary skills."
    };
  } catch (error) {
    console.error("🚨 Error calling Groq API:", error);
    throw error;
  }
};


/**
 * Analyze resume directly with Groq API
 */
export const analyzeResumeContent = async (fileContent: string, fileName: string | null, userId?: string): Promise<ResumeSuggestion> => {
  console.log("📤 Directly analyzing resume with Groq API...");
  const analysis = await callGroqAPI(fileContent);
  
  if (userId) {
    console.log("📥 Saving analysis to Supabase...");
    await supabase.from('resume_analyses').insert({ user_id: userId, file_name: fileName || 'unknown', result: analysis });
  }

  return analysis;
};
