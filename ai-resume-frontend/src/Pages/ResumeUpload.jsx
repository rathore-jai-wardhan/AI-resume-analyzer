import { useState } from 'react'
import Navbar from '../components/Navbar'
import FileUpload from '../components/FileUpload'
import axios from 'axios'

function ResumeUpload() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    // Basic validation before sending anything
    if (!resumeFile) {
      setError('Please upload your resume first.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please enter a job description.')
      return
    }

    setError('')
    setLoading(true)
    setResult(null)

    try {
      // FormData is how you send files + text together in one request
      const formData = new FormData()
      formData.append('resume', resumeFile)
      formData.append('job_description', jobDescription)

      const response = await axios.post(
        'http://localhost:8000/upload-resume',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )

      setResult(response.data)
    } catch (err) {
      setError('Something went wrong. Make sure your backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>Analyze Your Resume</h2>
        <p style={styles.subtext}>
          Upload your resume and paste the job description below
        </p>

        {/* Upload Grid */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <FileUpload
              label="📄 Your Resume (PDF)"
              onFileSelect={setResumeFile}
            />
          </div>
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

        {/* Error Message */}
        {error && <p style={styles.error}>{error}</p>}

        {/* Analyze Button */}
        <button
          style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
        </button>

        {/* Results Section */}
        {result && result.status === 'success' && (
          <div style={styles.resultsContainer}>

            {/* ATS Score */}
            <div style={styles.scoreCard}>
              <p style={styles.scoreLabel}>ATS Compatibility Score</p>
              <p style={{
                ...styles.scoreNumber,
                color: result.ats_score >= 75 ? '#16a34a'
                     : result.ats_score >= 50 ? '#d97706'
                     : '#dc2626'
              }}>
                {result.ats_score}/100
              </p>
            </div>

            {/* Recommendations */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>💡 Recommendations</h3>
              <ul style={styles.list}>
                {result.recommendations.map((rec, i) => (
                  <li key={i} style={styles.listItem}>{rec}</li>
                ))}
              </ul>
            </div>

            {/* Skills Grid */}
            <div style={styles.skillsGrid}>

              {/* Matching Skills */}
              <div style={styles.skillCard}>
                <h3 style={{ ...styles.sectionTitle, color: '#16a34a' }}>
                  ✅ Matching Skills
                </h3>
                {result.matching_skills.length > 0 ? (
                  <div style={styles.tagContainer}>
                    {result.matching_skills.map((skill, i) => (
                      <span key={i} style={styles.tagGreen}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyText}>No matching skills found</p>
                )}
              </div>

              {/* Missing Skills */}
              <div style={styles.skillCard}>
                <h3 style={{ ...styles.sectionTitle, color: '#dc2626' }}>
                  ❌ Missing Skills
                </h3>
                {result.missing_skills.length > 0 ? (
                  <div style={styles.tagContainer}>
                    {result.missing_skills.map((skill, i) => (
                      <span key={i} style={styles.tagRed}>{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyText}>No missing skills — great match!</p>
                )}
              </div>

            </div>

            {/* Your Resume Skills */}
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>🧠 Skills Found in Your Resume</h3>
              <div style={styles.tagContainer}>
                {result.resume_skills.length > 0
                  ? result.resume_skills.map((skill, i) => (
                      <span key={i} style={styles.tagBlue}>{skill}</span>
                    ))
                  : <p style={styles.emptyText}>No skills detected</p>
                }
              </div>
            </div>

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
    boxSizing: 'border-box',
  },
  error: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '12px',
    textAlign: 'center',
  },
  button: {
    display: 'block',
    margin: '0 auto 40px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: '600',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    textAlign: 'center',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  scoreLabel: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '8px',
  },
  scoreNumber: {
    fontSize: '64px',
    fontWeight: '800',
    margin: '0',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '16px',
  },
  list: {
    paddingLeft: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  listItem: {
    fontSize: '14px',
    color: '#475569',
    lineHeight: '1.6',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
  },
  skillCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  tagContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagGreen: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
  },
  tagRed: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
  },
  tagBlue: {
    backgroundColor: '#dbeafe',
    color: '#2563eb',
    padding: '4px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: '14px',
    color: '#94a3b8',
    fontStyle: 'italic',
  }
}

export default ResumeUpload