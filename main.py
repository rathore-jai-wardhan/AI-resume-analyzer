from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Resume Analyzer",
    description="Backend API for analyzing resumes using AI",
    version="1.0.0"
)

# This fixes the React ↔ FastAPI communication issue
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React's address
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Existing endpoints (keep these) ---

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}


# --- New endpoint: Dummy resume upload ---
# This is what React will call when user hits "Analyze Resume"
# It doesn't do any AI yet, just confirms the file was received

@app.post("/upload-resume")
async def upload_resume():
    return {
        "status": "received",
        "message": "Resume received! AI analysis coming in Week 2.",
        "ats_score": None,
        "skills_found": [],
        "missing_skills": []
    }