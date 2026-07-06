import json
import os
import spacy

# Load spaCy model once when server starts
nlp = spacy.load("en_core_web_sm")


def load_skills() -> list[str]:

    # Reads skills_data.json and returns one flat list of all skills.
    # Called once at server startup, not on every request.
    # This builds the correct path no matter where you run the server from
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "skills_data.json")

    with open(json_path, "r") as f:
        data = json.load(f)

    # Flatten all categories into one list
    # {"frontend": ["react", "html"], "backend": ["fastapi"]}
    # becomes → ["react", "html", "fastapi"]
    all_skills = []
    for category, skills in data.items():
        all_skills.extend(skills)

    return all_skills


# Loaded ONCE when server starts — not on every request
TARGET_SKILLS = load_skills()


def extract_skills(cleaned_text: str) -> list[str]:
    
    # Uses spaCy to clean the text, then matches against TARGET_SKILLS.
    # Logic is identical to your original — just data source is now JSON.
    # spaCy processes the text (handles punctuation, edge cases)

    doc = nlp(cleaned_text.lower())
    processed_text = doc.text

    found_skills = set()

    for skill in TARGET_SKILLS:
        if skill in processed_text:
            found_skills.add(skill)

    return list(found_skills)


def extract_skills_by_category(cleaned_text: str) -> dict:
  
    # BONUS: Same matching but grouped by category.
    # Useful later when you want to show the frontend a richer breakdown.

    # Returns something like:
    # {
    #     "frontend": ["react", "html"],
    #     "backend": ["fastapi", "rest api"],
    #     "ai_and_ml": ["nlp", "machine learning"]
    # }

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    json_path = os.path.join(base_dir, "skills_data.json")

    with open(json_path, "r") as f:
        data = json.load(f)

    processed_text = nlp(cleaned_text.lower()).text

    result = {}
    for category, skills in data.items():
        matched = [s for s in skills if s in processed_text]
        if matched:                          # only include non-empty categories
            result[category] = matched

    return result