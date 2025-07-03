import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export default function MonthlyAttendanceReport() {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [report, setReport] = useState([]);

  const fetchReport = async () => {
    const response = await axios.get(`http://localhost:5000/MonthlyAttendance`, {
      params: { month, year },
    });
    setReport(response.data);
  };

  const getDaysInMonth = (year, month) => new Date(year, month, 0).getDate();

  const generatePivotData = () => {
    const days = getDaysInMonth(year, month);
    const userMap = {};

    report.forEach(({ name, date, status }) => {
      const day = new Date(date).getDate();
      if (!userMap[name]) userMap[name] = {};
      userMap[name][day] = status === 'Present' ? '✔️' : '❌';
    });

    const pivotRows = Object.keys(userMap).map(name => {
      const row = { Name: name };
      for (let day = 1; day <= days; day++) {
        row[day] = userMap[name][day] || '-';
      }
      return row;
    });

    return pivotRows;
  };

  const exportToExcel = () => {
    const data = generatePivotData();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'AttendanceReport.xlsx');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Monthly Attendance Report</h1>

      <div className="flex gap-4 mb-4">
        <input type="number" placeholder="Year" value={year} onChange={e => setYear(e.target.value)} className="border p-2 rounded" />
        <input type="number" placeholder="Month" value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded" />
        <button onClick={fetchReport} className="bg-blue-600 text-white px-4 py-2 rounded">Load Report</button>
        <button onClick={exportToExcel} className="bg-green-600 text-white px-4 py-2 rounded">Export to Excel</button>
      </div>

      <table className="w-full text-left border text-sm">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            {Array.from({ length: getDaysInMonth(year, month) }, (_, i) => (
              <th key={i + 1} className="border p-2">{i + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {generatePivotData().map((row, idx) => (
            <tr key={idx}>
              <td className="border p-2">{row.Name}</td>
              {Array.from({ length: getDaysInMonth(year, month) }, (_, day) => (
                <td key={day + 1} className="border p-2">{row[day + 1] || '-'}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
