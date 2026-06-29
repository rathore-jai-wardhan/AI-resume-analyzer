import { useState } from 'react'

function FileUpload({ label, onFileSelect }) {
  const [fileName, setFileName] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setFileName(file.name)
      onFileSelect(file)
    } else {
      alert('Please upload a PDF file only.')
    }
  }

  const handleChange = (e) => {
    handleFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div style={styles.wrapper}>
      <p style={styles.label}>{label}</p>
      <label
        style={{
          ...styles.dropzone,
          borderColor: dragging ? '#2563eb' : '#cbd5e1',
          backgroundColor: dragging ? '#eff6ff' : '#f8fafc',
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <div style={styles.icon}>📄</div>
        {fileName ? (
          <p style={styles.fileName}>✅ {fileName}</p>
        ) : (
          <>
            <p style={styles.dropText}>Drag & drop your PDF here</p>
            <p style={styles.orText}>or click to browse</p>
          </>
        )}
      </label>
    </div>
  )
}

const styles = {
  wrapper: {
    width: '100%',
  },
  label: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '10px',
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed',
    borderRadius: '12px',
    padding: '36px 20px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    minHeight: '160px',
  },
  icon: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  dropText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#475569',
  },
  orText: {
    fontSize: '13px',
    color: '#94a3b8',
    marginTop: '4px',
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#16a34a',
  }
}

export default FileUpload