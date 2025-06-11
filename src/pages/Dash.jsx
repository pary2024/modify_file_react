import React, { useContext, useEffect } from "react";
import Draggable from "react-draggable";
import { ThemeContext } from "../colors/Thems";
import {
  FaUserMd, FaUsers, FaFemale, FaBriefcaseMedical, FaFileAlt,
  FaFileInvoiceDollar, FaCalendarAlt, FaWheelchair, FaBaby,
  FaHandHoldingHeart, FaHospital, FaCapsules, FaChartBar, 
  FaTachometerAlt, FaBell, FaSearch, FaCog, FaUserCircle, FaProcedures,
   FaChartLine, FaTable,FaChartPie,FaDownload,FaHistory
} from 'react-icons/fa';
import { MdDescription, MdDashboard } from 'react-icons/md';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import useSelection from "antd/es/table/hooks/useSelection";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../stores/doctorSlice";
import { fetchPatients } from "../stores/patientSlice";

// ✅ Stats Data


// Extended stats for second row


// ✅ Chart Data
const patientData = [
  { name: 'Jan', patients: 30, admissions: 12 },
  { name: 'Feb', patients: 45, admissions: 18 },
  { name: 'Mar', patients: 60, admissions: 25 },
  { name: 'Apr', patients: 50, admissions: 22 },
  { name: 'May', patients: 70, admissions: 30 },
  { name: 'Jun', patients: 85, admissions: 35 },
  { name: 'Jul', patients: 65, admissions: 28 },
];

const departmentData = [
  { name: 'Cardiology', patients: 120 },
  { name: 'Neurology', patients: 85 },
  { name: 'Pediatrics', patients: 65 },
  { name: 'Orthopedics', patients: 45 },
  { name: 'Oncology', patients: 30 },
];

const genderData = [
  { name: 'Male', value: 45 },
  { name: 'Female', value: 55 },
];

const ageHistogramData = [
  { age: '0-10', count: 12 },
  { age: '11-20', count: 8 },
  { age: '21-30', count: 15 },
  { age: '31-40', count: 22 },
  { age: '41-50', count: 18 },
  { age: '51-60', count: 10 },
  { age: '61-70', count: 5 },
  { age: '71+', count: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// ✅ Line Chart Component
const PatientLineChart = () => {
  const { isDark } = useContext(ThemeContext);
  
  
  return (
    <div className={`w-full h-full p-6 rounded-2xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
        Patient Trends
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={patientData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4B5563" : "#E5E7EB"} />
            <XAxis 
              dataKey="name" 
              stroke={isDark ? "#9CA3AF" : "#6B7280"} 
              tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            />
            <YAxis 
              stroke={isDark ? "#9CA3AF" : "#6B7280"} 
              tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDark ? "#374151" : "#FFFFFF",
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                color: isDark ? "#F3F4F6" : "#111827",
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: isDark ? "#F3F4F6" : "#111827" 
              }}
            />
            <Line 
              type="monotone" 
              dataKey="patients" 
              stroke="#8884d8" 
              strokeWidth={3} 
              activeDot={{ r: 8 }} 
              name="Total Patients"
            />
            <Line 
              type="monotone" 
              dataKey="admissions" 
              stroke="#82ca9d" 
              strokeWidth={3} 
              activeDot={{ r: 8 }} 
              name="New Admissions"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ✅ Bar Chart Component
const DepartmentBarChart = () => {
  const { isDark } = useContext(ThemeContext);
  
  
  return (
    <div className={`w-full h-full p-6 rounded-2xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
        Patients by Department
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4B5563" : "#E5E7EB"} />
            <XAxis 
              dataKey="name" 
              stroke={isDark ? "#9CA3AF" : "#6B7280"} 
              tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            />
            <YAxis 
              stroke={isDark ? "#9CA3AF" : "#6B7280"} 
              tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDark ? "#374151" : "#FFFFFF",
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                color: isDark ? "#F3F4F6" : "#111827",
                borderRadius: '0.5rem',
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: isDark ? "#F3F4F6" : "#111827" 
              }}
            />
            <Bar 
              dataKey="patients" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]} 
              name="Patient Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ✅ Pie Chart Component
const GenderPieChart = () => {
  const { isDark } = useContext(ThemeContext);
  
  return (
    <div className={`w-full h-full p-6 rounded-2xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
        Patient Gender Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genderData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {genderData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDark ? "#374151" : "#FFFFFF",
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                color: isDark ? "#F3F4F6" : "#111827",
                borderRadius: '0.5rem',
              }}
            />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                color: isDark ? "#F3F4F6" : "#111827" 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ✅ Histogram Component
const AgeHistogram = () => {
  const { isDark } = useContext(ThemeContext);
  
  return (
    <div className={`w-full h-full p-6 rounded-2xl shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <h2 className={`text-xl font-semibold mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>
        Patient Age Distribution
      </h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={ageHistogramData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#4B5563" : "#E5E7EB"} />
            <XAxis 
              dataKey="age" 
              stroke={isDark ? "#9CA3AF" : "#6B7280"} 
              tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            />
            <YAxis 
              stroke={isDark ? "#9CA3AF" : "#6B7280"} 
              tick={{ fill: isDark ? "#9CA3AF" : "#6B7280" }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: isDark ? "#374151" : "#FFFFFF",
                borderColor: isDark ? "#4B5563" : "#E5E7EB",
                color: isDark ? "#F3F4F6" : "#111827",
                borderRadius: '0.5rem',
              }}
            />
            <Bar 
              dataKey="count" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]} 
              name="Patient Count"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ✅ Activity Item Component
const ActivityItem = ({ icon, title, time, status, isDark }) => (
  <div 
    className={`p-4 rounded-xl flex items-center transition-all hover:scale-[1.01] ${isDark ? "bg-gray-750 hover:bg-gray-700" : "bg-gray-50 hover:bg-gray-100"}`}
  >
    <div className={`p-3 rounded-xl ${isDark ? "bg-gray-700" : "bg-white"} shadow-sm`}>
      {icon}
    </div>
    <div className="ml-4 flex-1">
      <h3 className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
        {title}
      </h3>
      <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {time}
      </p>
    </div>
    <div className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-blue-900 text-blue-200" : "bg-blue-100 text-blue-800"}`}>
      {status}
    </div>
  </div>
);

// ✅ Main Dashboard Component
const Dash = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { doctors } = useSelector((state) => state.doctor);
  const { patients } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
  }, [dispatch]);

  const stats = [
    { 
      icon: <FaUserMd size={20} />, 
      label: "Doctors", 
      value: doctors?.length || 0,  
      bg: "bg-gradient-to-r from-teal-500 to-teal-600",
      trend: "up",
      change: "12%"
    },
    { 
      icon: <FaUsers size={20} />, 
      label: "Patients", 
      value: patients?.length, 
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: "up",
      change: "8%"
    },
    { 
      icon: <FaFileInvoiceDollar size={20} />, 
      label: "Invoices", 
      value: 48, 
      bg: "bg-gradient-to-r from-cyan-500 to-cyan-600",
      trend: "down",
      change: "3%"
    },
    { 
      icon: <FaCalendarAlt size={20} />, 
      label: "Appointments", 
      value: 29, 
      bg: "bg-gradient-to-r from-violet-500 to-violet-600",
      trend: "up",
      change: "15%"
    },
    { 
      icon: <FaProcedures size={20} />, 
      label: "Procedures", 
      value: 17, 
      bg: "bg-gradient-to-r from-purple-500 to-purple-600",
      trend: "steady",
      change: "0%"
    },
    { 
      icon: <FaChartLine size={20} />, 
      label: "Revenue", 
      value: "$24,580", 
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      trend: "up",
      change: "22%"
    }
  ];

  const recentActivities = [
    {
      icon: <FaUserMd className="text-blue-500" />,
      title: "New patient registration - John Doe",
      time: "30 minutes ago",
      status: "New",
      category: "patient"
    },
    {
      icon: <FaCalendarAlt className="text-purple-500" />,
      title: "Appointment scheduled with Dr. Smith",
      time: "2 hours ago",
      status: "Confirmed",
      category: "appointment"
    },
    {
      icon: <FaFileInvoiceDollar className="text-green-500" />,
      title: "Payment received for invoice #4587",
      time: "5 hours ago",
      status: "Completed",
      category: "finance"
    },
    {
      icon: <FaBriefcaseMedical className="text-red-500" />,
      title: "Prescription refill requested",
      time: "1 day ago",
      status: "Pending",
      category: "pharmacy"
    }
  ];

  return (
    <div className={`flex-1 p-4 sm:p-6 overflow-auto min-h-screen transition-colors duration-300 ${isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <MdDashboard className="mr-3 text-blue-500" /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              Medical Dashboard
            </span>
          </h1>
          <p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <div className={`relative rounded-lg px-3 py-2 flex items-center ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <FaSearch className={`mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`} />
            <input 
              type="text" 
              placeholder="Search..." 
              className={`bg-transparent outline-none w-32 sm:w-48 text-sm ${isDark ? "placeholder-gray-500" : "placeholder-gray-400"}`}
            />
          </div>
          <button className={`p-2 rounded-lg ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"} shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <div className="relative">
              <FaBell className={isDark ? "text-gray-300" : "text-gray-600"} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </div>
          </button>
          <div className={`p-2 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            <FaUserCircle className={isDark ? "text-blue-400" : "text-blue-600"} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 transition-all duration-300 hover:shadow-lg ${isDark ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="flex justify-between items-start">
              <div className={`${stat.bg} text-white p-2 rounded-lg flex items-center justify-center shadow-md`}>
                {stat.icon}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${stat.trend === "up" ? "bg-green-100 text-green-800" : stat.trend === "down" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                {stat.change} {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "→"}
              </span>
            </div>
            <div className="mt-3">
              <div className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-500"} uppercase tracking-wider`}>
                {stat.label}
              </div>
              <div className={`text-xl font-bold mt-1 ${isDark ? "text-white" : "text-gray-900"}`}>
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Patient Admissions</h3>
            <select className={`text-xs p-1 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <PatientLineChart />
        </div>
        
        <div className={`rounded-xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Department Distribution</h3>
            <select className={`text-xs p-1 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>
              <option>By Patients</option>
              <option>By Revenue</option>
              <option>By Procedures</option>
            </select>
          </div>
          <DepartmentBarChart />
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={`rounded-xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Patient Gender</h3>
            <div className="flex space-x-2">
              <button className={`text-xs p-1 px-2 rounded ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>
                <FaTable />
              </button>
              <button className={`text-xs p-1 px-2 rounded ${isDark ? "bg-blue-600 text-white" : "bg-blue-500 text-white"}`}>
                <FaChartPie />
              </button>
            </div>
          </div>
          <GenderPieChart />
        </div>
        
        <div className={`rounded-xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>Patient Age Distribution</h3>
            <button className={`text-xs p-1 px-2 rounded flex items-center ${isDark ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-800"}`}>
              <FaDownload className="mr-1" /> Export
            </button>
          </div>
          <AgeHistogram />
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`rounded-xl p-5 ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
          <div>
            <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-800"} flex items-center`}>
              <FaHistory className="mr-2 text-blue-500" /> Recent Activity
            </h2>
            <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}>
              Latest updates from your hospital management system
            </p>
          </div>
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <button className={`text-xs px-3 py-1.5 rounded-lg ${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"}`}>
              Filter
            </button>
            <button className={`text-xs px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white`}>
              View All
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg flex items-start ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"} transition-colors border ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} mr-3`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-800"}`}>
                    {activity.title}
                  </h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${activity.status === "Completed" ? "bg-green-100 text-green-800" : activity.status === "Pending" ? "bg-yellow-100 text-yellow-800" : activity.status === "New" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}>
                    {activity.status}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {activity.time} • {activity.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dash;