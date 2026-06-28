from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Resume Analyzer backend is running!"}

@app.get("/health")
def health_check():
    return {"status": "ok"}