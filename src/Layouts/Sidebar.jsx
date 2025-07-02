// src/layout/Sidebar.jsx
import React, { useContext, useEffect, useState } from "react";
import {
  FaUserMd,
  FaBriefcaseMedical,
  FaFileAlt,
  FaCapsules,
  FaUserGraduate,
} from "react-icons/fa";
import {
  MdDashboard,
  MdApartment,
  MdPerson,
  MdCalendarToday,
  MdPeopleAlt,
  MdAttachMoney,
  MdLocalPharmacy,
  MdSms,
  MdSettings,
  MdLogout,
  MdSchool,
  MdMap,
  MdHealing,
  MdBusiness,
  MdScience,
  MdBuild,
  MdBiotech,
  MdWork,
} from "react-icons/md";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../stores/authSlice";
import { ThemeContext } from "../Colors/Themes"; // Adjust path as needed
import {
  IoChevronDown,
  IoChevronUp,
  IoNotificationsOutline,
} from "react-icons/io5";
import { RiMedicineBottleLine } from "react-icons/ri";
import { fetchCompanies } from "../stores/companySlice";

const Sidebar = () => {
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);
  const [showAppointmentDropdown, setShowAppointmentDropdown] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const userRole = localStorage.getItem("roles") || "user";
  const { companies } = useSelector((state) => state.company);
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

  const imageCompany = localStorage.getItem("companyImage");
  const companyName = localStorage.getItem("company");

  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard />, href: "/admin" },
    // { label: "Departments", icon: <MdApartment />, href: "/admin/department" },
    { label: "Patient", icon: <MdPerson />, href: "/admin/list" },
    { label: "Duty", icon: <MdWork />, href: "/admin/dutyDoctor" },
    {
      label: "Doctor",
      icon: <FaUserMd />,
      href: "/admin/doctor",
    },
    {
      label: "Treatment",
      icon: <MdHealing />,
      href: "/admin/treat",
    },
    { label: "Material", icon: <MdBuild />, href: "/admin/material" }, // Material -> tools/building
    { label: "Lab", icon: <MdBiotech />, href: "/admin/lab" }, // Lab -> biotech/test
    { label: "Report", icon: <FaFileAlt />, href: "/admin/report" },

    // Admin-only routes
    {
      label: "User",
      icon: <RiMedicineBottleLine />,
      href: "/admin/user",
    },
    { label: "Method", icon: <MdScience />, href: "/admin/method" }, // Method -> science/research

    {
      label: "Province",
      icon: <MdMap />,
      href: "/admin/province",
    },
    {
      label: "Company",
      icon: <MdBusiness />,
      href: "/admin/company",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Call logout API and clear Redux state
      window.location.href = "/login"; // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
      // Clear localStorage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "/login";
    }
  };

  return (
    <div className={`flex h-screen font-sans ${isDark ? "dark" : ""}`}>
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-white-800 to-white-900 text-black p-4 overflow-y-auto flex flex-col shadow-xl">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="bg-white p-2 rounded-full shadow-lg mb-3">
            <img
              src={imageCompany || "/default-logo.png"}
              alt="Company Logo"
              className="w-[100px] h-[100px] rounded-full  object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-center">
            <span className="text-blue-300">{companyName}</span>{" "}
          </h1>
          <p className="text-xs text-blue-200 mt-1">Healthcare Management</p>
        </div>

        {/* Menu Items */}
        <ul className="space-y-1 flex-1">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  isActive(item.href)
                    ? "bg-blue-400 shadow-md"
                    : "hover:bg-blue-300 hover:shadow-md"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          {/* Appointment Dropdown */}
          <li>
            <button
              onClick={() => setShowAppointmentDropdown((prev) => !prev)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                location.pathname.includes("/admin/appoint")
                  ? "bg-blue-400 shadow-md"
                  : "hover:bg-blue-300 hover:shadow-md"
              }`}
            >
              <span className="flex items-center gap-3">
                <MdCalendarToday className="text-lg" />
                <span>Appointment</span>
              </span>
              {showAppointmentDropdown ? <IoChevronUp /> : <IoChevronDown />}
            </button>
            {showAppointmentDropdown && (
              <ul className="pl-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/admin/appoint/patient"
                    className={`flex items-center gap-3 p-2 pl-4 rounded-lg transition-all ${
                      isActive("/admin/appoint/patient")
                        ? "bg-blue-400 shadow"
                        : "hover:bg-blue-300 hover:shadow"
                    }`}
                  >
                    <span className="text-sm">Patient Appointments</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Payment Dropdown */}
          <li>
            <button
              onClick={() => setShowPaymentDropdown((prev) => !prev)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                location.pathname.includes("/admin/payment")
                  ? "bg-blue-400 shadow-md"
                  : "hover:bg-blue-300 hover:shadow-md"
              }`}
            >
              <span className="flex items-center gap-3">
                <MdLocalPharmacy className="text-lg" />
                <span>Payment</span>
              </span>
              {showPaymentDropdown ? <IoChevronUp /> : <IoChevronDown />}
            </button>
            {showPaymentDropdown && (
              <ul className="pl-8 mt-1 space-y-1">
                <li>
                  <Link
                    to="/admin/payment/patient"
                    className={`flex items-center gap-3 p-2 pl-4 rounded-lg transition-all ${
                      isActive("/admin/payment/patient")
                        ? "bg-blue-400 shadow"
                        : "hover:bg-blue-300 hover:shadow"
                    }`}
                  >
                    <span className="text-sm">Reception</span>
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Bottom Settings/Profile */}
        <div className="mt-auto pt-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-700 transition-all w-full"
          >
            <MdLogout className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <div className="bg-white dark:bg-gray-800 h-16 shadow-sm flex justify-between items-center px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
            <div className="relative">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                <IoNotificationsOutline className="text-xl" />
              </button>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <div className="text-sm font-semibold text-gray-700 dark:text-white">
                John Doe
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-300">
                {userRole === "admin" ? "Administrator" : "User"}
              </div>
            </div>
            <div className="relative group">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-blue-500 shadow cursor-pointer"
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
                <Link
                  to="/admin/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Your Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
