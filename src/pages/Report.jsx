import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';

const Report = () => {
  const { isDark } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const stats = {
    totalAppointments: 52,
    completed: 40,
    pending: 12,
    revenue: 2600,
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-4">Clinic Visit Report</h2>

      {/* Date Range Picker */}
      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={`border p-2 rounded ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={`border p-2 rounded ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow rounded p-4`}>
          <h4 className="text-gray-400">Total Appointments</h4>
          <p className="text-xl font-semibold">{stats.totalAppointments}</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow rounded p-4`}>
          <h4 className="text-gray-400">Completed</h4>
          <p className="text-xl font-semibold">{stats.completed}</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow rounded p-4`}>
          <h4 className="text-gray-400">Pending</h4>
          <p className="text-xl font-semibold">{stats.pending}</p>
        </div>
        <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow rounded p-4`}>
          <h4 className="text-gray-400">Total Revenue</h4>
          <p className="text-xl font-semibold">${stats.revenue}</p>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} shadow rounded p-4 mb-6`}>
        <p className="text-sm mb-2">[Chart goes here – use Chart.js or Recharts]</p>
      </div>

      {/* Detailed Table Placeholder */}
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} overflow-x-auto shadow rounded p-4`}>
        <table className="min-w-full">
          <thead>
            <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Patient</th>
              <th className="p-2 text-left">Doctor</th>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Fee</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-300 dark:border-gray-600">
              <td className="p-2">1</td>
              <td className="p-2">John Doe</td>
              <td className="p-2">Dr. Smith</td>
              <td className="p-2">2025-05-10</td>
              <td className="p-2">Completed</td>
              <td className="p-2">$50.00</td>
            </tr>
            {/* More rows can be added here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Report;
