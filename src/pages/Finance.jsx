import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';

const Finance = () => {
  const { isDark } = useContext(ThemeContext);

  const [records] = useState([
    {
      id: 1,
      type: 'Income',
      source: 'Appointment',
      amount: 50,
      date: '2025-05-16',
      method: 'Cash',
    },
    {
      id: 2,
      type: 'Expense',
      source: 'Clinic Supplies',
      amount: 30,
      date: '2025-05-15',
      method: 'Cash',
    },
  ]);

  const totalIncome = records
    .filter((r) => r.type === 'Income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === 'Expense')
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-4">Finance Dashboard</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className={`${isDark ? 'bg-green-800 text-green-100' : 'bg-green-100 text-green-900'} p-4 rounded shadow`}>
          <h3 className="font-semibold">Total Income</h3>
          <p className="text-xl font-bold">${totalIncome}</p>
        </div>
        <div className={`${isDark ? 'bg-red-800 text-red-100' : 'bg-red-100 text-red-900'} p-4 rounded shadow`}>
          <h3 className="font-semibold">Total Expenses</h3>
          <p className="text-xl font-bold">${totalExpense}</p>
        </div>
        <div className={`${isDark ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-900'} p-4 rounded shadow`}>
          <h3 className="font-semibold">Net Profit</h3>
          <p className="text-xl font-bold">${totalIncome - totalExpense}</p>
        </div>
      </div>

      {/* Table */}
      <div className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} overflow-x-auto rounded shadow`}>
        <table className="min-w-full text-sm text-left">
          <thead className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Type</th>
              <th className="p-3">Source</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Method</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-3">{r.id}</td>
                <td className="p-3">{r.type}</td>
                <td className="p-3">{r.source}</td>
                <td className="p-3">${r.amount}</td>
                <td className="p-3">{r.method}</td>
                <td className="p-3">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Finance;
