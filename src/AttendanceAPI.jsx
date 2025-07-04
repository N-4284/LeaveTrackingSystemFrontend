import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';



import axios from 'axios';

export default function AttendanceAPI() {
  const [attendanceList, setAttendanceList] = useState([]);

  const navigate = useNavigate(); 
  
  // Get userID from localStorage (set this after login)
  const userId = localStorage.getItem('userID');


  useEffect(() => {
    fetchAttendance();
  }, []);


  const handleApplyLeave = () => {
    navigate('/LeaveRequestManager');
  };

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/Attendance?userID=${userId}`);
      setAttendanceList(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleMarkAttendance = async () => {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

    try {
      await axios.post('http://localhost:5000/Attendance', {
        userID: parseInt(userId),
        date: today,
      });

      alert('Attendance marked successfully!');
      fetchAttendance();
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert(error.response?.data?.error || 'Failed to mark attendance.');
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Attendance Management</h1>
      <div className="max-w-3xl mx-auto p-6 flex justify-between items-center">
        <button
          onClick={handleMarkAttendance}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Mark Attendance
        </button>
        
        <button
          onClick={handleApplyLeave}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply for Leave
        </button>
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Attendance Records:</h2>
      <ul className="space-y-2">
        {attendanceList.map((record) => (
          <li
            key={record.attendanceID}
            className="bg-gray-100 p-3 rounded flex justify-between items-center"
          >
            <span>
              <strong>User:</strong> {record.userID} | <strong>Date:</strong> {record.date} |{' '}
              <strong>Status:</strong> {record.status}
            </span>
          </li>
        ))}
      </ul>

    </div>
  );
}
