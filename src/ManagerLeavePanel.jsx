import React, { useEffect, useState } from 'react';
import axios from 'axios';

const token = localStorage.getItem('authToken');

export default function ManagerLeavePanel() {
  const [name, setName] = useState('');
  const [requests, setRequests] = useState([]);

  const fetchTeamRequests = async () => {
    if (!name) return;
    const res = await axios.get(`http://localhost:5000/LeaveRequest?name=${name}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRequests(res.data);
  };

  const handleAction = async (requestID, statusName) => {
    await axios.put('http://localhost:5000/LeaveRequest/Process', {
      requestID,
      statusName,
      approvedBy: 2 // hardcoded for now; in real app, fetch from auth
    },{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    fetchTeamRequests();
  };

  useEffect(() => {
    fetchTeamRequests();
  }, [name]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Panel</h1>
      <input className="border p-2 w-full mb-4" placeholder="Manager Name" value={name} onChange={e => setName(e.target.value)} />

      <ul className="space-y-4">
        {requests.map(r => (
          <li key={r.RequestID} className="p-4 bg-white shadow rounded">
            <p><strong>Employee:</strong> {r.name}</p>
            <p><strong>Leave:</strong> {r.leaveTypeName}</p>
            <p><strong>Date:</strong> {r.startDate} → {r.endDate}</p>
            <p><strong>Reason:</strong> {r.reason}</p>
            <p><strong>Status:</strong> {r.processedStatusID === 0 ? 'Pending' : r.processedStatusID === 1 ? 'Approved' : 'Rejected'}</p>
            {r.processedStatusID === 0 && (
              <div className="mt-2 space-x-2">
                <button onClick={() => handleAction(r.RequestID, 'Approved')} className="bg-green-600 text-white px-3 py-1 rounded">Approve</button>
                <button onClick={() => handleAction(r.RequestID, 'Rejected')} className="bg-red-600 text-white px-3 py-1 rounded">Reject</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
