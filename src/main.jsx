import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login  from './Login.jsx'
import Attendance from './Attendance.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<div>404 Not Found</div>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Attendance" element={<Attendance/>} />
        </Routes>
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <a href="/" style={{ margin: '0 10px' }}>Login</a>
          <a href="/Login" style={{ margin: '0 10px' }}>The c<strong>🕶️</strong>ler Login</a>
          
        </div>

      </>
    </BrowserRouter>
  </StrictMode>
)
