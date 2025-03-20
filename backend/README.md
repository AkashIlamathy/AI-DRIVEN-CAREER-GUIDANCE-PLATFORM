
# Career Path Advisor Backend

This is the backend service for the Career Path Advisor application. It's built with FastAPI and uses MongoDB for data storage and Google's Gemini API for generating career suggestions.

## Setup Instructions

### Prerequisites
- Python 3.8+
- MongoDB
- Google Gemini API key

### Environment Setup
1. Clone the repository
2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
3. Fill in your MongoDB connection string and Gemini API key in the `.env` file

### Installation
1. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### Running the Server
Start the server with:
```
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### Docker Deployment
To build and run using Docker:
```
docker build -t career-advisor-backend .
docker run -p 8000:8000 -e MONGODB_URL=your_mongodb_url -e GEMINI_API_KEY=your_gemini_api_key career-advisor-backend
```

## API Endpoints

### GET /
Returns a welcome message. Use this to check if the API is running.

### POST /api/career-suggestion
Accepts form data, stores it in MongoDB, generates career suggestions using Gemini API, and returns the suggestions.

Request body:
```json
{
  "name": "John Doe",
  "age": "25",
  "qualification": "Bachelor's in Computer Science",
  "interestedSubjects": "AI, Machine Learning, Web Development",
  "hackathonsAttended": "3",
  "extraCoursesCompleted": "Deep Learning Specialization",
  "certifications": "AWS Certified Developer",
  "workshops": "TensorFlow Workshop",
  "industryPreference": "technology",
  "preferredRole": "technical"
}
```

Response:
```json
{
  "suggestedJobRole": "Machine Learning Engineer",
  "careerPath": "Start as a Junior ML Engineer, progress to Senior ML Engineer in 3-4 years...",
  "certificationsRequired": "TensorFlow Developer Certificate, AWS Machine Learning Specialty...",
  "expectedSalary": "$80,000 - $150,000 annually depending on experience and location"
}
```
