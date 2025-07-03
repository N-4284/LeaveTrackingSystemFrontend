import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AttendanceAPI() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [userId, setUserId] = useState('');
  const [date, setDate] = useState('');
  const [attendanceStatusId, setAttendanceStatusId] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Attendance');
      setAttendanceList(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/Attendance', {
        userID: parseInt(userId),
        date,

      });

      alert('Attendance marked successfully!');
      fetchAttendance();
      setUserId('');
      setDate('');
    } catch (error) {
      console.error('Error marking attendance:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error);
      } else {
        alert('Failed to mark attendance.');
      }

    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Attendance Management</h1>

      {/* Attendance Form */}
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">
        <div>
          <label className="block mb-1 font-semibold">User ID:</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Mark Attendance
        </button>
      </form>

      {/* Attendance List */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Attendance Records:</h2>
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
