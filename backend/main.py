from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import motor.motor_asyncio
import os
from dotenv import load_dotenv
import json
import google.generativeai as genai

# Load environment variables
load_dotenv(".env.example")

# Configure API keys
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyAEs7PRf3IgLtkY40WqIEbiuJAIJ50Hiic")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "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")

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)

# Initialize FastAPI app
app = FastAPI(title="Career Path Advisor API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB
client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.career_advisor
user_profiles = db.user_profiles
career_suggestions = db.career_suggestions

# Define data models
class FormData(BaseModel):
    name: str
    age: str
    qualification: str
    interestedSubjects: str
    hackathonsAttended: str
    extraCoursesCompleted: str
    certifications: str
    workshops: str
    industryPreference: str
    preferredRole: str

class CareerSuggestion(BaseModel):
    suggestedJobRole: str
    careerPath: str
    certificationsRequired: str
    expectedSalary: str

class ResumeRequest(BaseModel):
    resumeContent: str
    fileName: Optional[str]

class ResumeAnalysisResponse(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    improvementSuggestions: list[str]
    recommendedSkills: list[str]
    careerPathRecommendation: str

@app.post("/api/resume-analysis", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeRequest):
    if not request.resumeContent:
        raise HTTPException(status_code=400, detail="Resume content is required")
    
    return ResumeAnalysisResponse(
        strengths=["Strong technical skills", "Good work experience"],
        weaknesses=["Lacks leadership experience", "Needs more certifications"],
        improvementSuggestions=["Improve formatting", "Add measurable achievements"],
        recommendedSkills=["Project Management", "Data Analysis"],
        careerPathRecommendation="Based on your profile, consider roles in software engineering."
    )



async def generate_career_suggestion(form_data: FormData) -> CareerSuggestion:
    """Generate career suggestions using Google's Gemini API"""
    
    # Create a prompt for the API
    prompt = f"""
    Based on the following user profile, suggest an appropriate career path:
    
    Name: {form_data.name}
    Age: {form_data.age}
    Qualification: {form_data.qualification}
    Interested Subjects: {form_data.interestedSubjects}
    Hackathons Attended: {form_data.hackathonsAttended}
    Extra Courses Completed: {form_data.extraCoursesCompleted}
    Certifications: {form_data.certifications}
    Workshops: {form_data.workshops}
    Industry Preference: {form_data.industryPreference}
    Preferred Role: {form_data.preferredRole}
    
    Please provide a JSON response with these fields:
    1. suggestedJobRole - A specific job role that would be suitable
    2. careerPath - A detailed career progression path for 5-10 years
    3. certificationsRequired - 3-5 certifications that would be beneficial
    4. expectedSalary - A realistic salary range for this career path
    
    Format your response as valid JSON like this:
    {{
      "suggestedJobRole": "Software Developer",
      "careerPath": "Detailed career path description...",
      "certificationsRequired": "List of certifications...",
      "expectedSalary": "$70,000 - $120,000 depending on location and experience level"
    }}
    """
    
    try:
        # Using Google Gemini API
        model = genai.GenerativeModel('gemini-1.5-pro')
        
        # Make the API request
        response = model.generate_content(prompt)
        
        # Process the response
        ai_response = response.text
        
        # Extract JSON if possible
        try:
            if "```json" in ai_response:
                json_text = ai_response.split("```json")[1].split("```")[0].strip()
                suggestion_data = json.loads(json_text)
            elif "```" in ai_response:
                json_text = ai_response.split("```")[1].split("```")[0].strip()
                suggestion_data = json.loads(json_text)
            else:
                suggestion_data = json.loads(ai_response)
                
        except Exception as e:
            print(f"Error parsing JSON: {str(e)}")
            print(f"Raw response: {ai_response}")
            suggestion_data = {
                "suggestedJobRole": "Career Specialist Recommendation",
                "careerPath": ai_response,
                "certificationsRequired": "Based on your profile, consider certifications in your domain of interest.",
                "expectedSalary": "Varies based on location, experience, and industry"
            }
        
        return CareerSuggestion(
            suggestedJobRole=suggestion_data.get("suggestedJobRole", "Specialist based on your profile"),
            careerPath=suggestion_data.get("careerPath", ai_response),
            certificationsRequired=suggestion_data.get("certificationsRequired", "Recommended certifications in your field of interest"),
            expectedSalary=suggestion_data.get("expectedSalary", "$60,000 - $150,000 depending on experience and location")
        )
    except Exception as e:
        print(f"Error generating career suggestion: {str(e)}")
        return CareerSuggestion(
            suggestedJobRole="Technical Specialist",
            careerPath="Based on your profile, a career path in technology would be appropriate. Start with junior roles to gain experience, then move to mid-level positions in 2-3 years. Aim for senior or specialized roles within 5-7 years.",
            certificationsRequired="Cloud certifications (AWS/Azure/GCP), Programming certifications, Project Management certifications (PMP, Agile), Industry-specific certifications",
            expectedSalary="$60,000 - $150,000 depending on experience, location, and specialization"
        )

# API endpoints
@app.get("/")
async def read_root():
    return {"message": "Welcome to Career Path Advisor API"}

@app.post("/api/career-suggestion")
async def get_career_suggestion(form_data: FormData):
    try:
        user_profile_id = await user_profiles.insert_one(form_data.dict())
        suggestion = await generate_career_suggestion(form_data)
        suggestion_dict = suggestion.dict()
        suggestion_dict["user_profile_id"] = user_profile_id.inserted_id
        await career_suggestions.insert_one(suggestion_dict)
        return suggestion
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)