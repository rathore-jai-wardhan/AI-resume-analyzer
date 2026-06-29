import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🤖 AI Resume Analyzer</div>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/analyze" style={styles.link}>Analyze Resume</Link>
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#2563eb',
  },
  links: {
    display: 'flex',
    gap: '24px',
  },
  link: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#555',
    transition: 'color 0.2s',
  }
}

export default Navbar