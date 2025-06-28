import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../colors/Thems";
import {
  FaUserMd, FaUsers, FaFileInvoiceDollar, FaCalendarAlt,
  FaProcedures, FaChartLine,FaSearch,FaBell,FaUserCircle
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctors } from "../stores/doctorSlice";
import { fetchPatients } from "../stores/patientSlice";
import { fetchAppointmentPatients } from "../stores/appointmentPatientSlice";
import { fetchInvoicePatients } from "../stores/invoicePatientSlice";
import { fetchDutys } from "../stores/dutyDoctorSlice";
import { fetchMaterials } from "../stores/materialSlice";
import { fetchLabs } from "../stores/labSlice";

const Dash = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { doctors } = useSelector((state) => state.doctor);
  const { patients } = useSelector((state) => state.patient);
  const { appointmentPatients } = useSelector((state) => state.appointmentPatient);
  const { invoicePatients } = useSelector((state) => state.invoicePatient);
  const {duties}  = useSelector((stats)=> stats.duty);
  const {materials} = useSelector((stats)=> stats.material);
  const {labs}   =  useSelector((stats)=> stats.lab);

  useEffect(() => {
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
    dispatch(fetchAppointmentPatients());
    dispatch(fetchInvoicePatients());
    dispatch(fetchDutys());
    dispatch(fetchMaterials());
    dispatch(fetchLabs());
  }, [dispatch]);

  
  const totalMaterial = materials.reduce((acc, material) => acc + material.total, 0);
  
  const totalLab = labs.reduce((acc, lab) => acc + lab.total, 0);



  
  
  

  const stats = [
    { 
      icon: <FaUserMd size={20} />, 
      label: "Doctors", 
      value: doctors?.length || 0,  
      bg: "bg-gradient-to-r from-teal-500 to-teal-600",
      trend: "up",
      change: "12%",
      path: "/admin/doctor"
    },
    { 
      icon: <FaUsers size={20} />, 
      label: "Patients", 
      value: patients?.length || 0, 
      bg: "bg-gradient-to-r from-blue-500 to-blue-600",
      trend: "up",
      change: "8%",
      path: "/admin/list"
    },
    { 
      icon: <FaFileInvoiceDollar size={20} />, 
      label: "Invoices", 
      value: invoicePatients?.length || 0, 
      bg: "bg-gradient-to-r from-cyan-500 to-cyan-600",
      trend: "down",
      change: "3%",
      path: "/admin/payment/patient"
    },
    { 
      icon: <FaCalendarAlt size={20} />, 
      label: "Appointments", 
      value: appointmentPatients?.length || 0, 
      bg: "bg-gradient-to-r from-violet-500 to-violet-600",
      trend: "up",
      change: "15%",
      path: "/admin/appoint/patient"
    },
    { 
      icon: <FaProcedures size={20} />, 
      label: "Duty Of Doctor", 
      value: duties.length, 
      bg: "bg-gradient-to-r from-purple-500 to-purple-600",
      trend: "steady",
      change: "0%",
      path: "/admin/procedures"
    },
    { 
      icon: <FaChartLine size={20} />, 
      label: "Material of Clinic", 
      value: materials.length, 
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      trend: "up",
      change: "22%",
      path: "/admin/revenue"
    },
    { 
      icon: <FaChartLine size={20} />, 
      label: "Lab Of clinic", 
      value: labs.length, 
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      trend: "up",
      change: "22%",
      path: "/admin/revenue"
    },
    { 
      icon: <FaChartLine size={20} />, 
      label: "Revenue", 
      value: totalMaterial, 
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      trend: "up",
      change: "22%",
      path: "/admin/revenue"
    },
    { 
      icon: <FaChartLine size={20} />, 
      label: "Revenue", 
      value: totalLab, 
      bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
      trend: "up",
      change: "22%",
      path: "/admin/revenue"
    },
    
  ];

  const handleStatClick = (path) => {
    navigate(path);
  };

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

      {/* Stats Grid - Now clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            onClick={() => handleStatClick(stat.path)}
            className={`rounded-xl p-4 transition-all duration-300 hover:shadow-lg cursor-pointer ${
              isDark ? "bg-gray-800 hover:bg-gray-750" : "bg-white hover:bg-gray-50"
            } border ${isDark ? "border-gray-700" : "border-gray-200"} flex flex-col`}
            style={{ minHeight: '120px' }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`${stat.bg} text-white p-2 rounded-lg flex items-center shadow-md`}>
                {stat.icon}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                stat.trend === "up" ? "bg-green-100 text-green-800" : 
                stat.trend === "down" ? "bg-red-100 text-red-800" : 
                "bg-gray-100 text-gray-800"
              }`}>
                {stat.change} {stat.trend === "up" ? "↑" : stat.trend === "down" ? "↓" : "→"}
              </span>
            </div>
            <div className="flex-1">
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
    </div>
  );
};

export default Dash;