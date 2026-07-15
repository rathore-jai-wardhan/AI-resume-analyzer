from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.skills_extractor import extract_skills
import os
from google import genai

def calculate_ats_score(resume_text: str, job_description: str) -> int:
  
    if not resume_text or not job_description:
        return 0

    # TF-IDF converts both texts into numerical vectors
    # stop_words='english' ignores common words like "the", "is", "and"
    vectorizer = TfidfVectorizer(stop_words='english')
    vectors = vectorizer.fit_transform([resume_text, job_description])

    # cosine_similarity returns a value between 0 and 1
    # vectors[0] = resume, vectors[1] = job description
    score = cosine_similarity(vectors[0], vectors[1])[0][0]

    # Convert to 0-100 and round to a clean integer
    return round(score * 100)


def get_skill_gap(resume_text: str, job_description: str) -> dict:
   
    resume_skills = set(extract_skills(resume_text))
    job_skills = set(extract_skills(job_description))

    matching_skills = list(resume_skills & job_skills)  # intersection
    missing_skills = list(job_skills - resume_skills)   # difference

    return {
        "resume_skills": sorted(list(resume_skills)),
        "job_skills": sorted(list(job_skills)),
        "matching_skills": sorted(matching_skills),
        "missing_skills": sorted(missing_skills),
    }




client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

def generate_recommendations(resume_text: str, job_description: str,
                              missing_skills: list[str], ats_score: int) -> list[str]:

    prompt = f"""You are a career coach reviewing a resume against a job description.

ATS match score: {ats_score}/100
Missing skills: {', '.join(missing_skills) if missing_skills else 'none'}

Resume:
{resume_text}

Job description:
{job_description}

Give 3-5 short, specific, actionable recommendations to improve this resume
for this exact job. Return ONLY a plain list, one recommendation per line,
no numbering, no extra commentary."""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    # response.text is one big string — split it into a list of lines
    lines = [line.strip("-• ").strip() for line in response.text.split("\n") if line.strip()]
    return lines