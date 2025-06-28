import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../colors/Thems';
import { Line, PolarArea, Doughnut, Bar,Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PolarAreaController,
  RadialLinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReports } from '../stores/reportSlice';

ChartJS.register(
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  PolarAreaController,
  RadialLinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title
);

const Report = () => {
  const { isDark } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const dispatch = useDispatch();
  const {data} = useSelector((state)=>state.report);
  useEffect(()=>{
    dispatch(fetchReports());
  },[dispatch])
  

  // Sample data - in a real app, this would come from an API
  const stats = {
    totalAppointments: 52,
    completed: 40,
    pending: 12,
    revenue: 2600,
    monthlyData: [12, 19, 15, 8, 10, 12, 15, 18, 14, 16, 20, 22],
    services: [
      { name: 'Cleaning', count: 18 },
      { name: 'Filling', count: 12 },
      { name: 'Extraction', count: 8 },
      { name: 'Checkup', count: 14 },
    ],
    patientAgeGroups: [
      { range: '0-18', count: 8 },
      { range: '19-30', count: 15 },
      { range: '31-45', count: 12 },
      { range: '46-60', count: 10 },
      { range: '60+', count: 7 },
    ],
  };

  const handleGenerateReport = () => {
    console.log('Generate report from', startDate, 'to', endDate);
    // In a real app, you would fetch data based on these dates
  };

  // Line Chart Data - Appointments Status
  const lineData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        label: 'Appointments',
        data: [stats.completed, stats.pending],
        backgroundColor: isDark ? '#4ade80' : '#10b981',
        borderColor: isDark ? '#4ade80' : '#10b981',
        pointBackgroundColor: isDark ? '#4ade80' : '#10b981',
        pointBorderColor: isDark ? '#1f2937' : '#fff',
        pointHoverBackgroundColor: isDark ? '#86efac' : '#34d399',
        pointHoverBorderColor: isDark ? '#1f2937' : '#fff',
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // Polar Area Chart Data - Appointments Distribution
  const polarData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [stats.completed, stats.pending],
        backgroundColor: [
          isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(59, 130, 246, 0.7)',
          isDark ? 'rgba(248, 113, 113, 0.7)' : 'rgba(239, 68, 68, 0.7)',
        ],
        borderColor: isDark ? '#1f2937' : '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Monthly Appointments Data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Appointments',
        data: stats.monthlyData,
        backgroundColor: isDark ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.5)',
        borderColor: isDark ? '#3b82f6' : '#1d4ed8',
        borderWidth: 2,
        borderRadius: 4,
        hoverBackgroundColor: isDark ? '#3b82f6' : '#2563eb',
      },
    ],
  };

  // Services Distribution Data
  const servicesData = {
    labels: stats.services.map(service => service.name),
    datasets: [
      {
        data: stats.services.map(service => service.count),
        backgroundColor: [
          isDark ? '#8b5cf6' : '#7c3aed',
          isDark ? '#ec4899' : '#db2777',
          isDark ? '#14b8a6' : '#0d9488',
          isDark ? '#f97316' : '#ea580c',
        ],
        borderColor: isDark ? '#1f2937' : '#fff',
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };

  // Patient Age Groups Data
  const ageGroupData = {
    labels: stats.patientAgeGroups.map(group => group.range),
    datasets: [
      {
        label: 'Patients by Age',
        data: stats.patientAgeGroups.map(group => group.count),
        backgroundColor: [
          isDark ? 'rgba(74, 222, 128, 0.7)' : 'rgba(16, 185, 129, 0.7)',
          isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(59, 130, 246, 0.7)',
          isDark ? 'rgba(248, 113, 113, 0.7)' : 'rgba(239, 68, 68, 0.7)',
          isDark ? 'rgba(245, 158, 11, 0.7)' : 'rgba(234, 88, 12, 0.7)',
          isDark ? 'rgba(168, 85, 247, 0.7)' : 'rgba(124, 58, 237, 0.7)',
        ],
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    ],
  };

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: isDark ? '#e5e7eb' : '#4b5563',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#fff',
        titleColor: isDark ? '#e5e7eb' : '#111827',
        bodyColor: isDark ? '#e5e7eb' : '#4b5563',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        usePointStyle: true,
      },
    },
  };

  const lineOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
    },
  };

  const polarOptions = {
    ...commonOptions,
    scales: {
      r: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          showLabelBackdrop: false,
          callback: (value) => value, // Explicitly return tick value to avoid callback error
        },
      },
    },
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: 'right',
      },
    },
  };

  const pieOptions = {
    ...commonOptions,
    plugins: {
      ...commonOptions.plugins,
      legend: {
        ...commonOptions.plugins.legend,
        position: 'right',
      },
    },
  };

  const monthlyOptions = {
    ...commonOptions,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        },
      },
    },
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h1 className="text-3xl font-bold mb-6">Dental Clinic Report</h1>

      {/* Date Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`border rounded p-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`border rounded p-2 ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          />
        </div>

        <button
          onClick={handleGenerateReport}
          className="mt-5 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Generate Report
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Appointments', value: stats.totalAppointments, icon: '📅', trend: '↑ 12%' },
          { label: 'Completed', value: stats.completed, icon: '✅', trend: '↑ 8%' },
          { label: 'Pending', value: stats.pending, icon: '⏳', trend: '↓ 5%' },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', trend: '↑ 15%' },
        ].map((item, index) => (
          <div
            key={index}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 transition-all hover:shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{item.label}</p>
                <p className="text-2xl font-semibold mt-1">{item.value}</p>
              </div>
              <div className="text-3xl">{item.icon}</div>
            </div>
            <p className={`text-sm mt-2 ${item.trend.includes('↑') ? 'text-green-500' : 'text-red-500'}`}>
              {item.trend} from last period
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Appointments Status Line Chart */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <h3 className="text-lg font-semibold mb-4">Appointments Status</h3>
          <div className="h-80">
            <Line data={lineData} options={lineOptions} />
          </div>
        </div>

        {/* Appointments Distribution Polar Area Chart */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <h3 className="text-lg font-semibold mb-4">Appointments Distribution</h3>
          <div className="h-80">
            <PolarArea data={polarData} options={polarOptions} />
          </div>
        </div>
      </div>

      {/* Second Row of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Monthly Appointments */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <h3 className="text-lg font-semibold mb-4">Monthly Appointments</h3>
          <div className="h-80">
            <Bar data={monthlyData} options={monthlyOptions} />
          </div>
        </div>

        {/* Services Distribution */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md`}>
          <h3 className="text-lg font-semibold mb-4">Services Distribution</h3>
          <div className="h-80">
            <Pie data={servicesData} options={pieOptions} />
          </div>
        </div>
      </div>

      {/* Third Row - Single Chart */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-xl shadow-md mb-6`}>
        <h3 className="text-lg font-semibold mb-4">Patient Age Groups</h3>
        <div className="h-96">
          <Bar data={ageGroupData} options={monthlyOptions} />
        </div>
      </div>
    </div>
  );
};

export default Report;