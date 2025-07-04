import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LeaveRequestManager() {
  const [name, setName] = useState('');
  const [leaveTypeName, setLeaveTypeName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [userID, setUserID] = useState('');
  const navigate = useNavigate();



  const fetchRequests = async () => {
    if (!userID) return;
    const res = await axios.get(`http://localhost:5000/LeaveRequest/My?userID=${userID}`);
    setRequests(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/LeaveRequestByName', {
      name, leaveTypeName, startDate, endDate, reason,
    });
    alert(res.data.message);
    fetchRequests();
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/LeaveRequest/Delete/${id}`);
    fetchRequests();
  };

  const getUserID = async () => {
    const res = await axios.get(`http://localhost:5000/LeaveRequest?name=${name}`);
    if (res.data.length > 0) setUserID(res.data[0].userID);
  };

  useEffect(() => {
    if (name) getUserID();
  }, [name]);

  useEffect(() => {
    if (userID) fetchRequests();
  }, [userID]);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Leave Request</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
        <input className="border p-2 w-full" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
        <input className="border p-2 w-full" placeholder="Leave Type (e.g. Sick Leave)" value={leaveTypeName} onChange={e => setLeaveTypeName(e.target.value)} required />
        <input className="border p-2 w-full" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
        <input className="border p-2 w-full" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
        <textarea className="border p-2 w-full" placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} required />
        <div className='mt-6 flex justify-between'>
          <button 
            type="submit" 
            className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
              Submit
          </button>
          <button
            onClick={() => navigate('/Attendance')}
            className ="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition">
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
              <button 
              onClick={() => 
              handleDelete(r.RequestID)} 
              className="mt-2 text-sm text-red-600 hover:underline">
                Delete
              </button>
              
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
