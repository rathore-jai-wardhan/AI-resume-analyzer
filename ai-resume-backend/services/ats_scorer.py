from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from services.skill_extractor import extract_skills


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


def generate_recommendations(missing_skills: list[str], ats_score: int) -> list[str]:
  
    recommendations = []

    # Score-based general advice
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
            f"Low match at {ats_score}/100. Consider tailoring your resume more closely to this role."
        )

    # Skill-specific advice
    if not missing_skills:
        recommendations.append(
            "Great news — your resume covers all the key skills in this job description!"
        )
    else:
        # Only show top 5 missing skills so it doesn't overwhelm the user
        for skill in missing_skills[:5]:
            recommendations.append(
                f"Consider adding '{skill}' to your resume if you have experience with it."
            )

    # Always add this general tip
    recommendations.append(
        "Mirror the exact keywords from the job description in your resume — ATS systems do exact matching."
    )

    return recommendations