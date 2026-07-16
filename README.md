# AI-resume-analyzer
AI Resume Analyzer

A full-stack web app that compares a resume against a job description, scores the match, and gives AI-generated improvement suggestions.

Upload a resume (PDF) and paste a job description → get an ATS-style compatibility score, matching/missing skills, and tailored recommendations from Gemini.

Tech Stack

Frontend: React (Vite), React Router, Axios
Backend: FastAPI, Uvicorn
AI / NLP: PyPDF2 (text extraction), spaCy (text processing), scikit-learn (TF-IDF + cosine similarity for scoring), Gemini API (recommendation generation)

How It Works


User uploads a resume PDF and a job description on the /analyze page.
The frontend sends both to the FastAPI backend as a multipart/form-data request.
The backend extracts and cleans the resume text, then:

Scores resume-vs-job similarity using TF-IDF + cosine similarity
Matches known skills (from skills_data.json) against both texts to find overlaps and gaps
Sends the score, gaps, and text to Gemini to generate specific recommendations



The results are returned as JSON and rendered on the page.

PROJECT STRUCTURE 

ai-resume-backend/
  main.py                  # FastAPI app + endpoints
  skills_data.json         # known skills reference list
  services/
    ats_scorer.py          # scoring + recommendation logic
    skills_extractor.py    # skill matching logic

ai-resume-frontend/
  src/
    Pages/                 # Home, ResumeUpload
    Components/             # Navbar, FileUpload
    App.jsx                # routes
    main.jsx                # React entry point

Setup

Backend

bashcd ai-resume-backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
python -m spacy download en_core_web_sm

Create a .env file in ai-resume-backend/:

GEMINI_API_KEY=your-key-here

Get a key from Google AI Studio.

Run the server:

bashuvicorn main:app --reload

Backend runs at http://localhost:8000.

Frontend

bashcd ai-resume-frontend
npm install
npm run dev

Frontend runs at http://localhost:5173.

API

Method         Endpoint                  Description
1.GET           /health                  Health check
2.POST         /upload-resume            Takes a resume file + job description, returns score, skills, and recommendations
