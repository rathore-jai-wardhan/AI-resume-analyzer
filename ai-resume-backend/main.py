from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io

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

# --- Upgraded Endpoint ---
@app.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...), 
    job_description: str = Form("")
):
    # 1. Read the actual file bytes into memory
    file_bytes = await resume.read()
    
    # 2. Pass the bytes to our new helper function
    raw_text = extract_text_from_pdf(file_bytes)
    
    # 3. Return the extracted text to React
    return {
        "status": "success",
        "filename": resume.filename,
        "extracted_text": raw_text,
        "job_description_received": job_description
    }