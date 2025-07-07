import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';

export default function LeaveRequestManager() {
  const [leaveTypeName, setLeaveTypeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const { fetchUser, user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.userID) {
      fetchRequests();
    }
  }, [user]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/LeaveRequest/My?userID=${user.userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('User not loaded yet.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/LeaveRequestByName', {
        name: user.name,
        leaveTypeName,
        startDate,
        endDate,
        reason,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Leave request submitted successfully!');
      fetchRequests();
    } catch (error) {
      console.error('Error submitting leave request:', error);
      alert(error.response?.data?.message || 'Failed to submit leave request.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/LeaveRequest/Delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchRequests(); 
    } catch (error) {
      console.error('Error deleting leave request:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Request</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <select
          className="border p-2 w-full"
          value={leaveTypeName}
          onChange={e => setLeaveTypeName(e.target.value)}
          required
        >
          <option value="">Select Leave Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Vacation">Vacation</option>
          <option value="Work From Home">Work From Home</option>
        </select>
        <input className="border p-2 w-full" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <input className="border p-2 w-full" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <textarea className="border p-2 w-full" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} required />

        <div className="flex justify-between">
          <button 
          type="submit" 
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500 transition">
            Submit
          </button>
          <button 
          type="button" 
          onClick={() => navigate('/Attendance')} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
            Back
          </button>
        </div>
      </form>

      <h2 className="text-xl font-semibold mt-8">Your Leave Requests</h2>
      <ul className="mt-4 space-y-2">
        {requests.map(r => (
          <li key={r.RequestID} className="p-4 border rounded bg-gray-100">
            <p><strong>Type:</strong> {r.leaveTypeName}</p>
            <p><strong>From:</strong> {r.startDate} → <strong>To:</strong> {r.endDate}</p>
            <p><strong>Status:</strong> {r.processedStatusID === 0 ? 'Pending' : r.processedStatusID === 1 ? 'Approved' : 'Rejected'}</p>
            <p><strong>Reason:</strong> {r.reason}</p>

            {r.processedStatusID === 0 && (
              <div className="mt-4 flex justify-end space-x-2">
                <button onClick={() => handleDelete(r.RequestID)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500 transition">
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
