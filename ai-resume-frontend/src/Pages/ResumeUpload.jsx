import { useState } from 'react'
import Navbar from '../components/Navbar'
import FileUpload from '../components/FileUpload'
import React, { useState } from 'react';

function ResumeUpload() {
  // We use React State to remember the backend's response
  const [serverMessage, setServerMessage] = useState("Waiting to connect...");

  // This function triggers when the user clicks the button
  const testBackendConnection = async () => {
    setServerMessage("Sending request to backend...");
    
    try {
      // The fetch API sends a network request to your FastAPI server
      const response = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST", 
      });
      
      // We wait for the JSON dummy response you wrote in main.py
      const data = await response.json();
      
      // Update the UI with the success message
      setServerMessage(`✅ Connection Successful! Backend says: "${data.message}"`);
      
    } catch (error) {
      setServerMessage("❌ Error: Could not connect to the backend. Is Uvicorn running?");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Analyze Your Resume</h2>
      <p>This is where the file upload UI will go in Week 2.</p>
      
      <button onClick={testBackendConnection} style={styles.button}>
        Test Backend Connection
      </button>
      
      <div style={styles.statusBox}>
        <strong>Status: </strong> {serverMessage}
      </div>
    </div>
  );
}

// Simple inline styling to keep things clean
const styles = {
  container: { padding: '40px', maxWidth: '600px', margin: '0 auto' },
  button: { 
    padding: '10px 20px', 
    backgroundColor: '#2563eb', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px',
    cursor: 'pointer',
    marginTop: '20px'
  },
  statusBox: {
    marginTop: '30px',
    padding: '15px',
    backgroundColor: '#e2e8f0',
    borderRadius: '5px'
  }
}

export default ResumeUpload;

function ResumeUpload() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)

  const handleAnalyze = async () => {
    if (!resumeFile) {
      alert('Please upload your resume first.')
      return
    }
    if (!jobDescription.trim()) {
      alert('Please enter a job description.')
      return
    }

    // Week 2 will replace this with real API call
    setResult({ message: '✅ Connected to backend! Analysis coming in Week 2.' })
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Analyze Your Resume</h2>
        <p style={styles.subtext}>Upload your resume and paste the job description below</p>

        <div style={styles.grid}>
          {/* Left: Resume Upload */}
          <div style={styles.card}>
            <FileUpload
              label="📄 Your Resume (PDF)"
              onFileSelect={setResumeFile}
            />
          </div>

          {/* Right: Job Description */}
          <div style={styles.card}>
            <p style={styles.label}>📋 Job Description</p>
            <textarea
              style={styles.textarea}
              placeholder="Paste the job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Analyze Button */}
        <button style={styles.button} onClick={handleAnalyze}>
          🔍 Analyze Resume
        </button>

        {/* Results Area */}
        {result && (
          <div style={styles.result}>
            <p>{result.message}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtext: {
    fontSize: '15px',
    color: '#64748b',
    marginBottom: '32px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '28px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    height: '160px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    padding: '12px',
    fontSize: '14px',
    color: '#334155',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
  },
  button: {
    display: 'block',
    margin: '0 auto',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  result: {
    marginTop: '32px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '10px',
    padding: '20px',
    textAlign: 'center',
    color: '#15803d',
    fontSize: '15px',
    fontWeight: '500',
  }
}

export default ResumeUpload