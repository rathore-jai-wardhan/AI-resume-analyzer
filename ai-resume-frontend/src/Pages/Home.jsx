import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  const navigate = useNavigate()

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.heading}>Analyze Your Resume With AI 🚀</h1>
          <p style={styles.subtext}>
            Upload your resume and a job description. Get an instant ATS
            compatibility score, see your skill gaps, and receive actionable
            suggestions to land more interviews.
          </p>
          <button
            style={styles.button}
            onClick={() => navigate('/analyze')}
          >
            Get Started →
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 64px)',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '60px 48px',
    maxWidth: '600px',
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  heading: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '16px',
  },
  subtext: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.7',
    marginBottom: '32px',
  },
  button: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    padding: '14px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  }
}

export default Home