import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      type: 'Income',
      source: 'Consultation',
      amount: 75,
      date: '2025-05-17',
      method: 'Credit Card',
    },
    {
      id: 3,
      type: 'Expense',
      source: 'Clinic Supplies',
      amount: 30,
      date: '2025-05-15',
      method: 'Cash',
    },
    {
      id: 4,
      type: 'Expense',
      source: 'Equipment',
      amount: 120,
      date: '2025-05-18',
      method: 'Bank Transfer',
    },
    {
      id: 5,
      type: 'Income',
      source: 'Appointment',
      amount: 60,
      date: '2025-05-19',
      method: 'Cash',
    },
  ]);

  // Calculate totals
  const totalIncome = records
    .filter((r) => r.type === 'Income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === 'Expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Prepare data for charts
  const incomeBySource = records
    .filter(r => r.type === 'Income')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.source);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.source, value: curr.amount });
      }
      return acc;
    }, []);

  const expenseBySource = records
    .filter(r => r.type === 'Expense')
    .reduce((acc, curr) => {
      const existing = acc.find(item => item.name === curr.source);
      if (existing) {
        existing.value += curr.amount;
      } else {
        acc.push({ name: curr.source, value: curr.amount });
      }
      return acc;
    }, []);

  const monthlyData = [
    { name: 'Jan', income: 1200, expense: 800 },
    { name: 'Feb', income: 1500, expense: 900 },
    { name: 'Mar', income: 1800, expense: 1000 },
    { name: 'Apr', income: 1400, expense: 950 },
    { name: 'May', income: totalIncome, expense: totalExpense },
  ];

  // Color palette
  const COLORS = {
    income: isDark ? '#4ade80' : '#16a34a',
    expense: isDark ? '#f87171' : '#dc2626',
    background: isDark ? '#1e293b' : '#f8fafc',
    card: isDark ? '#334155' : '#ffffff',
    text: isDark ? '#f8fafc' : '#1e293b',
  };

  const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <h2 className="text-3xl font-bold mb-6">Finance Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div 
          className={`p-6 rounded-xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-green-900/80' : 'bg-green-50 border border-green-100'}`}
        >
          <h3 className="font-semibold text-lg mb-2">Total Income</h3>
          <p className="text-3xl font-bold">${totalIncome.toLocaleString()}</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-green-200' : 'text-green-600'}`}>
            +12% from last month
          </p>
        </div>
        
        <div 
          className={`p-6 rounded-xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-red-900/80' : 'bg-red-50 border border-red-100'}`}
        >
          <h3 className="font-semibold text-lg mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold">${totalExpense.toLocaleString()}</p>
          <p className={`text-sm mt-2 ${isDark ? 'text-red-200' : 'text-red-600'}`}>
            +5% from last month
          </p>
        </div>
        
        <div 
          className={`p-6 rounded-xl shadow-lg transition-all hover:shadow-xl ${isDark ? 'bg-blue-900/80' : 'bg-blue-50 border border-blue-100'}`}
        >
          <h3 className="font-semibold text-lg mb-2">Net Profit</h3>
          <p className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${netProfit.toLocaleString()}
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
            {netProfit >= 0 ? 'Profitable' : 'Operating at loss'}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Income vs Expenses */}
        <div 
          className={`p-6 rounded-xl shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold text-lg mb-4">Monthly Income vs Expenses</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={isDark ? 0.3 : 0.5} />
                <XAxis dataKey="name" stroke={COLORS.text} />
                <YAxis stroke={COLORS.text} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDark ? '#334155' : '#ffffff',
                    borderColor: isDark ? '#475569' : '#e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                />
                <Legend />
                <Bar dataKey="income" fill={COLORS.income} name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill={COLORS.expense} name="Expense" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Sources */}
        <div 
          className={`p-6 rounded-xl shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold text-lg mb-4">Income Sources</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeBySource}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {incomeBySource.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Amount']}
                  contentStyle={{
                    backgroundColor: isDark ? '#334155' : '#ffffff',
                    borderColor: isDark ? '#475569' : '#e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div 
        className={`p-6 rounded-xl shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <h3 className="font-semibold text-lg mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={isDark ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-left">Method</th>
              </tr>
            </thead>
            <tbody>
              {records.sort((a, b) => new Date(b.date) - new Date(a.date)).map((r) => (
                <tr 
                  key={r.id} 
                  className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'}`}
                >
                  <td className="p-3">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      r.type === 'Income' 
                        ? (isDark ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-800') 
                        : (isDark ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800')
                    }`}>
                      {r.type}
                    </span>
                  </td>
                  <td className="p-3">{r.source}</td>
                  <td className={`p-3 text-right font-medium ${
                    r.type === 'Income' 
                      ? (isDark ? 'text-green-400' : 'text-green-600') 
                      : (isDark ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {r.type === 'Income' ? '+' : '-'}${r.amount}
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {r.method}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Finance;