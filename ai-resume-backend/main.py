from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import re
import spacy
import json
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# ─────────────────────────────────────────
# APP SETUP
# ─────────────────────────────────────────

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

# ─────────────────────────────────────────
# LOAD MODELS ONCE (not on every request)
# ─────────────────────────────────────────

nlp = spacy.load("en_core_web_sm")

# Load skills from JSON file
def load_skills() -> list:
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "skills_data.json")
    with open(json_path, "r") as f:
        data = json.load(f)
    all_skills = []
    for category, skills in data.items():
        all_skills.extend(skills)
    return all_skills

TARGET_SKILLS = load_skills()

# ─────────────────────────────────────────
# HELPER FUNCTIONS
# ─────────────────────────────────────────

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extracts raw text from a PDF file."""
    try:
        pdf_file_obj = io.BytesIO(file_bytes)
        pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
        extracted_text = ""
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            extracted_text += page.extract_text() + "\n"
        return extracted_text
    except Exception as e:
        return ""


def clean_resume_text(text: str) -> str:
    """Cleans and normalizes raw resume text."""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b', '', text)
    text = re.sub(r'[^a-z0-9\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_skills(text: str) -> list:
    """Matches text against TARGET_SKILLS list."""
    doc = nlp(text.lower())
    processed_text = doc.text
    found_skills = set()
    for skill in TARGET_SKILLS:
        if skill in processed_text:
            found_skills.add(skill)
    return sorted(list(found_skills))


def calculate_ats_score(resume_text: str, job_description: str) -> int:
    """Calculates ATS score using TF-IDF + cosine similarity."""
    if not resume_text or not job_description:
        return 0
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume_text, job_description])
    score = cosine_similarity(vectors[0], vectors[1])[0][0]
    return round(score * 100)


def get_skill_gap(resume_text: str, job_description: str) -> dict:
    """Compares skills in resume vs job description."""
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_description))
    return {
        "resume_skills": sorted(list(resume_skills)),
        "job_skills": sorted(list(job_skills)),
        "matching_skills": sorted(list(resume_skills & job_skills)),
        "missing_skills": sorted(list(job_skills - resume_skills)),
    }


def generate_recommendations(missing_skills: list, ats_score: int) -> list:
    """Generates actionable suggestions based on score and missing skills."""
    recommendations = []

    if ats_score >= 75:
        recommendations.append(
            f"Strong match! Your resume scores {ats_score}/100 against this job."
        )
    elif ats_score >= 50:
        recommendations.append(
            f"Decent match at {ats_score}/100. A few targeted improvements will help."
        )
    else:
        recommendations.append(
            f"Low match at {ats_score}/100. Consider tailoring your resume more closely."
        )

    if not missing_skills:
        recommendations.append(
            "Great — your resume covers all key skills in this job description!"
        )
    else:
        for skill in missing_skills[:5]:
            recommendations.append(
                f"Consider adding '{skill}' to your resume if you have experience with it."
            )

    recommendations.append(
        "Mirror the exact keywords from the job description — ATS systems do exact matching."
    )
    return recommendations


# ─────────────────────────────────────────
# ENDPOINTS
# ─────────────────────────────────────────

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer backend is running!"}


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...),
    job_description: str = Form("")
):
    """
    Main endpoint — takes resume PDF + job description,
    returns full analysis including ATS score and skill gaps.
    """
    # Step 1: Read file bytes
    file_bytes = await resume.read()

    # Step 2: Extract text from PDF
    raw_text = extract_text_from_pdf(file_bytes)

    if not raw_text.strip():
        return {
            "status": "error",
            "message": "Could not extract text from this PDF. Try a different file."
        }

    # Step 3: Clean both texts
    resume_text = clean_resume_text(raw_text)
    cleaned_jd = clean_resume_text(job_description)

    # Step 4: Calculate ATS score
    ats_score = calculate_ats_score(resume_text, cleaned_jd)

    # Step 5: Get skill gap
    skill_data = get_skill_gap(resume_text, cleaned_jd)

    # Step 6: Generate recommendations
    recommendations = generate_recommendations(
        skill_data["missing_skills"],
        ats_score
    )

    # Step 7: Return everything
    return {
        "status": "success",
        "filename": resume.filename,
        "ats_score": ats_score,
        "resume_skills": skill_data["resume_skills"],
        "job_skills": skill_data["job_skills"],
        "matching_skills": skill_data["matching_skills"],
        "missing_skills": skill_data["missing_skills"],
        "recommendations": recommendations
    }