import React, { useContext } from "react";
import Draggable from "react-draggable";
import { ThemeContext } from "../colors/Thems";
import {
  FaUserMd, FaUsers, FaFemale, FaBriefcaseMedical, FaFileAlt,
  FaFileInvoiceDollar, FaCalendarAlt, FaWheelchair, FaBaby,
  FaHandHoldingHeart, FaHospital, FaCapsules, FaChartBar, FaTachometerAlt
} from 'react-icons/fa';
import { MdDescription } from 'react-icons/md';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// ✅ Stats Data
const stats = [
  { icon: <FaUserMd size={30} />, label: "Doctor", value: 3, bg: "bg-green-500" },
  { icon: <FaUsers size={30} />, label: "Patient", value: 14, bg: "bg-blue-500" },
  { icon: <FaFemale size={30} />, label: "Nurse", value: 2, bg: "bg-yellow-400" },
  { icon: <FaBriefcaseMedical size={30} />, label: "Pharmacist", value: 1, bg: "bg-green-500" },
  { icon: <FaFileAlt size={30} />, label: "Case History", value: 8, bg: "bg-blue-500" },
  { icon: <MdDescription size={30} />, label: "Documents", value: 3, bg: "bg-yellow-400" },
  { icon: <FaFileInvoiceDollar size={30} />, label: "Payment Invoice", value: 48, bg: "bg-blue-500" },
  { icon: <FaCalendarAlt size={30} />, label: "Appointment", value: 29, bg: "bg-yellow-400" },
  { icon: <FaWheelchair size={30} />, label: "Operation Report", value: 3, bg: "bg-green-500" },
  { icon: <FaBaby size={30} />, label: "Birth Report", value: 3, bg: "bg-blue-500" },
  { icon: <FaHandHoldingHeart size={30} />, label: "Donor", value: 2, bg: "bg-green-500" },
  { icon: <FaHospital size={30} />, label: "Total Bed", value: 3, bg: "bg-green-500" },
  { icon: <FaCapsules size={30} />, label: "Medicine", value: 6, bg: "bg-blue-500" },
  { icon: <FaChartBar size={30} />, label: "Total payment", value: "$ 44,8", bg: "bg-green-500" },
  { icon: <FaTachometerAlt size={30} />, label: "Departments", value: 18, bg: "bg-blue-500" },
];

// ✅ Chart Data
const chartData = [
  { name: 'Jan', patients: 30 },
  { name: 'Feb', patients: 45 },
  { name: 'Mar', patients: 60 },
  { name: 'Apr', patients: 50 },
  { name: 'May', patients: 70 },
];

// ✅ Line Chart Component
const LineChartExample = () => {
  return (
    <div className="w-full mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-lg">
      <h2 className="text-base sm:text-lg font-semibold mb-4">Monthly Patient Visits</h2>
      <ResponsiveContainer width="100%" height={300} minHeight={200}>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            contentStyle={{ fontSize: 12 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="patients"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// ✅ Main Dashboard Component
const Dash = () => {
  const { isDark } = useContext(ThemeContext); // 🟢 use dark mode state

  return (
    <div className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-h-screen ${isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-black"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Draggable key={index} bounds="parent" handle=".drag-handle">
            <div
              role="region"
              aria-label={stat.label}
              className={`rounded-lg shadow-md p-4 flex items-center cursor-move transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              <div className={`${stat.bg} text-white p-3 sm:p-4 rounded-l flex items-center justify-center drag-handle`}>
                {stat.icon}
              </div>
              <div className="ml-3 sm:ml-4 flex-1">
                <div className="text-xs sm:text-sm text-gray-400 truncate">{stat.label}</div>
                <div className="text-lg sm:text-2xl font-bold truncate">{stat.value}</div>
              </div>
            </div>
          </Draggable>
        ))}
      </div>

      {/* Line Chart */}
      <div className={`mt-6 p-4 sm:p-6 rounded-lg shadow-lg ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <h2 className="text-base sm:text-lg font-semibold mb-4">Monthly Patient Visits</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line
              type="monotone"
              dataKey="patients"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};


export default Dash;