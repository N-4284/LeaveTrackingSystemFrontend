import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Login from './Login.jsx'
import Logout from './Logout.jsx'
import Attendance from './Attendance.jsx'
import MonthlyAttendanceReport from './MonthlyAttendanceReport.jsx'
import LeaveRequestManager from './LeaveRequestManager.jsx'
import ManagerLeavePanel from './ManagerLeavePanel.jsx'
import AdminDashboard from './AdminDashboard.jsx'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));
  const location = useLocation();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("authToken"));
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Logout" element={<Logout />} />
        <Route path="/Attendance" element={<Attendance />} />
        <Route path="/MonthlyAttendanceReport" element={<MonthlyAttendanceReport />} />
        <Route path="/Manager" element={<ManagerLeavePanel />} />
        <Route path="/LeaveRequestManager" element={<LeaveRequestManager />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <a href="/" style={{ margin: '0 10px' }}>Login</a>
        <a href="/Login" style={{ margin: '0 10px' }}>The c<strong>🕶️</strong>ler Login</a>
        {isLoggedIn && (
          <a href="/Logout" style={{ margin: '0 10px' }}>Logout</a>
        )}
      </div>
    </>
  );
}