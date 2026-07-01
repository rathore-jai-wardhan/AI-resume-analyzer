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