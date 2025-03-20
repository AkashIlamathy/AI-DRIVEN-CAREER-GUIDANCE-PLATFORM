
import { toast } from "@/hooks/use-toast";

// Since we can't directly connect to LinkedIn API from frontend (CORS and auth issues)
// we'll simulate the API calls with mock data for demonstration purposes
// In a real-world scenario, these would be proxied through a backend service

export const fetchJobTrends = async () => {
  console.log("Fetching job trends data");
  
  try {
    // Simulate API call with controlled timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    clearTimeout(timeoutId);
    
    // For now, return mock data
    return [
      { name: 'Software Development', growth: 24 },
      { name: 'Data Science', growth: 37 },
      { name: 'Cloud Computing', growth: 41 },
      { name: 'Cybersecurity', growth: 35 },
      { name: 'DevOps', growth: 29 },
      { name: 'AI/Machine Learning', growth: 48 },
      { name: 'Blockchain', growth: 19 },
      { name: 'UX/UI Design', growth: 22 },
      { name: 'Digital Marketing', growth: 15 },
      { name: 'Project Management', growth: 13 },
    ];
  } catch (error) {
    console.error("Error fetching job trends:", error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timeout, please try again');
    }
    throw error;
  }
};

export const fetchTopSkills = async () => {
  console.log("Fetching top skills data");
  
  try {
    // Simulate API call with controlled timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearTimeout(timeoutId);
    
    // Mock data
    return [
      { id: 1, name: 'Machine Learning', industry: 'Technology', growthRate: 120, demandLevel: 95 },
      { id: 2, name: 'Cloud Architecture', industry: 'Technology', growthRate: 95, demandLevel: 88 },
      { id: 3, name: 'Data Analysis', industry: 'Technology', growthRate: 85, demandLevel: 92 },
      { id: 4, name: 'Cybersecurity', industry: 'Technology', growthRate: 78, demandLevel: 90 },
      { id: 5, name: 'DevOps', industry: 'Technology', growthRate: 75, demandLevel: 85 },
      { id: 6, name: 'React.js', industry: 'Technology', growthRate: 68, demandLevel: 82 },
      { id: 7, name: 'Python', industry: 'Technology', growthRate: 62, demandLevel: 89 },
      { id: 8, name: 'Digital Marketing', industry: 'Marketing', growthRate: 55, demandLevel: 78 },
      { id: 9, name: 'UX/UI Design', industry: 'Design', growthRate: 48, demandLevel: 75 },
      { id: 10, name: 'Project Management', industry: 'Management', growthRate: 35, demandLevel: 80 }
    ];
  } catch (error) {
    console.error("Error fetching top skills:", error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timeout, please try again');
    }
    throw error;
  }
};

export const fetchIndustryInsights = async () => {
  console.log("Fetching industry insights data");
  
  try {
    // Simulate API call with controlled timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 1200));
    clearTimeout(timeoutId);
    
    // Mock data
    return [
      { id: 1, name: 'Technology', growthRate: 35, jobOpenings: 250000, topSkill: 'Software Development' },
      { id: 2, name: 'Healthcare', growthRate: 28, jobOpenings: 180000, topSkill: 'Patient Care' },
      { id: 3, name: 'Finance', growthRate: 22, jobOpenings: 120000, topSkill: 'Financial Analysis' },
      { id: 4, name: 'Education', growthRate: 18, jobOpenings: 90000, topSkill: 'Instructional Design' },
      { id: 5, name: 'Manufacturing', growthRate: 15, jobOpenings: 85000, topSkill: 'Process Optimization' },
      { id: 6, name: 'Renewable Energy', growthRate: 42, jobOpenings: 75000, topSkill: 'Sustainable Engineering' }
    ];
  } catch (error) {
    console.error("Error fetching industry insights:", error);
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timeout, please try again');
    }
    throw error;
  }
};

// This function would actually authenticate with LinkedIn API in a real implementation
export const authenticateLinkedIn = async () => {
  try {
    console.log("Attempting LinkedIn authentication");
    
    // Simulate authentication process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    toast({
      title: "LinkedIn API Note",
      description: "LinkedIn API authentication would happen here in a production environment.",
    });
    
    return true;
  } catch (error) {
    console.error("LinkedIn authentication error:", error);
    toast({
      variant: "destructive",
      title: "Authentication Error",
      description: "Failed to authenticate with LinkedIn API",
    });
    return false;
  }
};
