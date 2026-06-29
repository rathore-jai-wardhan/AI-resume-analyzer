import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ResumeUpload from './pages/ResumeUpload'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<ResumeUpload />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App