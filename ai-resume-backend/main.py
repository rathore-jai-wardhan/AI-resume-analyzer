from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import re
import spacy
from fastapi import APIRouter, File, UploadFile, Form
from services.pdf_extractor import extract_text_from_pdf, clean_text
from services.ats_scorer import calculate_ats_score, get_skill_gap, generate_recommendations

router = APIRouter(
    prefix="/resume",
    tags=["Resume"]
)


@router.post("/analyze")
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...)
):
    """
    Main endpoint — takes a PDF resume + job description text,
    returns ATS score, skill analysis, and recommendations.
    """

    # Step 1: Read raw bytes from the uploaded PDF
    file_bytes = await file.read()

    # Step 2: Extract text from PDF
    raw_text = extract_text_from_pdf(file_bytes)

    if not raw_text:
        return {
            "status": "error",
            "message": "Could not extract text from this PDF. Try a different file."
        }

    # Step 3: Clean the text
    resume_text = clean_text(raw_text)

    # Step 4: Calculate ATS score
    ats_score = calculate_ats_score(resume_text, job_description)

    # Step 5: Get skill gap analysis
    skill_data = get_skill_gap(resume_text, job_description)

    # Step 6: Generate recommendations
    recommendations = generate_recommendations(
        skill_data["missing_skills"],
        ats_score
    )

    # Step 7: Return the complete analysis to React
    return {
        "status": "success",
        "ats_score": ats_score,
        "resume_skills": skill_data["resume_skills"],
        "job_skills": skill_data["job_skills"],
        "matching_skills": skill_data["matching_skills"],
        "missing_skills": skill_data["missing_skills"],
        "recommendations": recommendations
    }

app = FastAPI(
    title="AI Resume Analyzer",
    description="Backend API for analyzing resumes using AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# --- New Helper Function ---
def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Takes raw PDF bytes and extracts all readable text from every page.
    """
    try:
        # Convert the raw bytes into a format PyPDF2 can read
        pdf_file_obj = io.BytesIO(file_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
        
        extracted_text = ""
        # Loop through every page in the PDF and pull the text
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            extracted_text += page.extract_text() + "\n"
            
        return extracted_text
    except Exception as e:
        return f"Error extracting text: {str(e)}"
    

def clean_resume_text(text: str) -> str:
    """
    Cleans raw resume text by removing URLs, special characters, 
    and extra whitespace, returning a standardized lowercase string.
    """
    # 1. Convert to lowercase so "Python" and "python" match exactly
    text = text.lower()
    
    # 2. Remove URLs (http/https/www)
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # 3. Remove email addresses 
    text = re.sub(r'\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b', '', text)
    
    # 4. Remove all special characters and punctuation (keep only letters, numbers, and spaces)
    # The ^ inside the brackets means "NOT". So this says: Replace anything that is NOT a-z, 0-9, or whitespace with a space.
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    
    # 5. Collapse multiple spaces, tabs, and newlines into a single space
    text = re.sub(r'\s+', ' ', text).strip()
    
    return text    


# --- Upgraded Endpoint ---
@app.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...), 
    job_description: str = Form("")
):
    # 1. Read the actual file bytes into memory
    file_bytes = await resume.read()
    
    # 2. Extract the raw text
    raw_text = extract_text_from_pdf(file_bytes)
    
    # 3. Clean the text using RegEx
    cleaned_text = clean_resume_text(raw_text)
    
    # Optional: Clean the job description too!
    cleaned_jd = clean_resume_text(job_description)
    
    # 4. Return the cleaned data
    return {
        "status": "success",
        "filename": resume.filename,
        "cleaned_resume": cleaned_text,
        "cleaned_jd": cleaned_jd
    }