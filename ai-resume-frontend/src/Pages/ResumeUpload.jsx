import React, { useState } from 'react';

function ResumeUpload() {
  // State to hold our user inputs
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [status, setStatus] = useState("Waiting for input...");

  // Update state when a file is selected
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // Triggered when the user clicks "Analyze Resume"
  const handleUpload = async () => {
    if (!file) {
      setStatus("⚠️ Please select a PDF file first.");
      return;
    }

    setStatus("⏳ Uploading to server...");

    // Create the multipart envelope required for file transfers
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-resume", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      // Displays the response sent back from your FastAPI main.py
      setStatus(`✅ Success! Backend received: ${data.filename}`);
      
    } catch (error) {
      setStatus("❌ Error: Could not connect to the backend.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>AI Resume Analyzer</h2>
      
      <div style={styles.formGroup}>
        <label><strong>1. Upload Resume (PDF)</strong></label>
        <input 
          type="file" 
          accept=".pdf" 
          onChange={handleFileChange} 
          style={styles.input} 
        />
      </div>

      <div style={styles.formGroup}>
        <label><strong>2. Paste Job Description</strong></label>
        <textarea 
          rows="5" 
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          style={styles.textarea}
        />
      </div>
      
      <button onClick={handleUpload} style={styles.button}>
        Analyze Resume
      </button>
      
      <div style={styles.statusBox}>
        <strong>Status: </strong> {status}
      </div>
    </div>
  );
}

// Inline styling to maintain a clean UI
const styles = {
  container: { padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  input: { padding: '10px', border: '1px solid #ccc', borderRadius: '5px' },
  textarea: { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', resize: 'vertical' },
  button: { padding: '12px 20px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  statusBox: { marginTop: '20px', padding: '15px', backgroundColor: '#e2e8f0', borderRadius: '5px' }
}

export default ResumeUpload;