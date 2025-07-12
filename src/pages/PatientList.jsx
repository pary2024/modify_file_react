import { useContext, useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  PlusIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  PhoneIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  ClockIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { FaSearch } from "react-icons/fa";
import { ThemeContext } from "../Colors/Themes";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import { ToastContainer, toast } from "react-toastify";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../stores/patientSlice";
import Swal from "sweetalert2";
import { fetchProvinces } from "../stores/provinceSlice";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function PatientList() {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { patients, status, error } = useSelector((state) => state.patient);
  const { provinces } = useSelector((state) => state.province);

  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [patient, setPatient] = useState("");
  const [age, setAge] = useState("");
  const [province, setProvince] = useState("");
  const [phone, setPhone] = useState("");
  const [career, setCareer] = useState("");
  const [statusState, setStatus] = useState("active");
  const [gender, setGender] = useState("male");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(7);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchProvinces());
  }, [dispatch]);

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const filteredPatients = patients.filter((p) =>
    `${p.name} DT${p.id} ${p.phone}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Generate page numbers for display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(maxPagesToShow / 2) - 1;
      startPage = currentPage - maxPagesBeforeCurrent;
      endPage = currentPage + maxPagesAfterCurrent;

      if (startPage <= 0) {
        startPage = 1;
        endPage = maxPagesToShow;
      }
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = totalPages - maxPagesToShow + 1;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newPatient = {
      name: patient,
      age: age,
      province_id: province,
      phone: phone,
      career: career,
      status: statusState,
      gender: gender,
    };
    try {
      await dispatch(createPatient(newPatient)).unwrap();
      dispatch(fetchPatients());
      setShowCreateModal(false);
      toast.success("Patient created successfully!", { position: "top-right" });
      setPatient("");
      setAge("");
      setProvince("");
      setPhone("");
      setCareer("");
      setStatus("active");
      setGender("male");
    } catch (e) {
      toast.error(`Error creating patient: ${e.message}`, {
        position: "top-right",
      });
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setPatient(p.name);
    setAge(p.age);
    setProvince(p.province_id || "");
    setPhone(p.phone);
    setCareer(p.career);
    setStatus(p.status);
    setGender(p.gender);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedPatient = {
      id: editingId,
      name: patient,
      age: age,
      province_id: province,
      phone: phone,
      career: career,
      status: statusState,
      gender: gender,
    };
    try {
      await dispatch(updatePatient(updatedPatient)).unwrap();
      dispatch(fetchPatients());
      setShowEditModal(false);
      setPatient("");
      setAge("");
      setProvince("");
      setPhone("");
      setCareer("");
      setStatus("active");
      setGender("male");
    } catch (e) {
      console.error("Error updating patient:", e);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePatient(id));
      dispatch(fetchPatients());
      toast.success("patient deleted successfully!", { position: "top-right" });
      if (currentPatients.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (e) {
      toast.error(`Error delete patient: ${e.message}`, {
        position: "top-right",
      });
    }
  };

  // Pass full patient list and current patient to this function
  const handlePrintWaitingNumber = (patient) => {
  const waitingNumber = patient.daily_number || "#";

  const date = dayjs(patient.created_at || new Date()).format("YYYY-MM-DD HH:mm");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to print.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Waiting Number</title>
        <style>
          * { box-sizing: border-box; }
          html, body {
            height: 100%;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
          }
          .waiting-box {
            border: 2px dashed #333;
            padding: 40px 20px;
            max-width: 300px;
            width: 100%;
          }
          .clinic-name {
            font-size: 18px;
            margin-bottom: 10px;
            color: #555;
          }
          .waiting-number {
            font-size: 64px;
            font-weight: bold;
            margin: 30px 0;
            color: #000;
          }
          .timestamp {
            font-size: 14px;
            color: #888;
          }
          @media print {
            @page { size: A4 portrait; margin: 0; }
            html, body {
              height: 100vh;
              width: 100vw;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .waiting-box {
              border: none;
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <div class="waiting-box">
          <div class="clinic-name">BrightSmile Dental Clinic</div>
          <div class="waiting-number">${waitingNumber}</div>
          <div class="timestamp">${date}</div>
        </div>
        <script>
          window.onload = function () {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};


  const exportToExcel = () => {
    const dataForExport = filteredPatients.map((patient) => ({
      ID: `DT${patient.id.toString().slice(-6)}`,
      Name: patient.name,
      Age: patient.age,
      Gender: patient.gender,
      Phone: patient.phone,
      Career: patient.career,
      Status: patient.status,
      Registered:
        patient.create_at || patient.created_at
          ? new Date(patient.create_at || patient.created_at).toLocaleString()
          : "",
      Province_id: patient.province?.name || patient.province,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "patients_data.xlsx");
  };

  // Bar chart data preparation
  const getAgeDistribution = () => {
    const ageRanges = [
      { range: "0-20", min: 0, max: 20, count: 0 },
      { range: "21-40", min: 21, max: 40, count: 0 },
      { range: "41-60", min: 41, max: 60, count: 0 },
      { range: "61+", min: 61, max: Infinity, count: 0 },
    ];

    filteredPatients.forEach((patient) => {
      const age = parseInt(patient.age);
      for (const range of ageRanges) {
        if (age >= range.min && age <= range.max) {
          range.count += 1;
          break;
        }
      }
    });

    return {
      labels: ageRanges.map((r) => r.range),
      datasets: [
        {
          label: "Number of Patients",
          data: ageRanges.map((r) => r.count),
          backgroundColor: isDark
            ? "rgba(246, 59, 59, 0.6)"
            : "rgba(250, 122, 10, 0.6)",
          borderColor: isDark ? "rgb(246, 59, 59)" : "rgb(235, 133, 37)",
          borderWidth: 4,
          hoverBackgroundColor: isDark
            ? "rgba(249, 91, 0, 0.8)"
            : "rgba(247, 136, 0, 0.8)",
        },
      ],
    };
  };

  // Pie chart data preparation
  const getGenderDistribution = () => {
    const genderCounts = { male: 0, female: 0 };
    filteredPatients.forEach((patient) => {
      if (
        patient.gender &&
        genderCounts.hasOwnProperty(patient.gender.toLowerCase())
      ) {
        genderCounts[patient.gender.toLowerCase()] += 1;
      }
    });
    const total = genderCounts.male + genderCounts.female;
    const malePercentage =
      total > 0 ? ((genderCounts.male / total) * 100).toFixed(1) : 0;
    const femalePercentage =
      total > 0 ? ((genderCounts.female / total) * 100).toFixed(1) : 0;

    return {
      labels: [`Male (${malePercentage}%)`, `Female (${femalePercentage}%)`],
      datasets: [
        {
          label: "Gender Distribution",
          data: [genderCounts.male, genderCounts.female],
          backgroundColor: [
            isDark ? "rgba(59, 130, 246, 0.6)" : "rgba(37, 99, 235, 0.6)", // Blue for male
            isDark ? "rgba(236, 72, 153, 0.6)" : "rgba(219, 39, 119, 0.6)", // Pink for female
          ],
          borderColor: [
            isDark ? "rgb(59, 130, 246)" : "rgb(37, 99, 235)",
            isDark ? "rgb(236, 72, 153)" : "rgb(219, 39, 119)",
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            isDark ? "rgba(59, 130, 246, 0.8)" : "rgba(37, 99, 235, 0.8)",
            isDark ? "rgba(236, 72, 153, 0.8)" : "rgba(219, 39, 119, 0.8)",
          ],
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: "Patient Age Distribution",
        color: isDark ? "#e5e7eb" : "#374151",
        font: {
          size: 20,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(31, 41, 55, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#e5e7eb" : "#374151",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#4b5563" : "#d1d5db",
        borderWidth: 4,
      },
    },
    scales: {
      x: {
        ticks: {
          color: isDark ? "#e5e7eb" : "#374151",
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: isDark ? "#e5e7eb" : "#374151",
          stepSize: 1,
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 20,
          },
        },
      },
      title: {
        display: true,
        text: "Patient Gender Distribution",
        color: isDark ? "#e5e7eb" : "#374151",
        font: {
          size: 20,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(31, 41, 55, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#e5e7eb" : "#374151",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#4b5563" : "#d1d5db",
        borderWidth: 4,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />
      <div
        className={`mx-auto rounded-xl overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`p-6 ${
            isDark ? "bg-gray-700" : "bg-white-600"
          } text-white`}
        >
          <h1 className="text-3xl text-black font-bold flex items-center gap-3">
            <UserCircleIcon className="w-8 h-8" />
            Patient Management System
          </h1>
          <p className="mt-2 opacity-90">Register and manage patient records</p>
        </div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center w-full md:w-auto">
              <div
                className={`relative flex items-center rounded-lg ${
                  isDark ? "bg-gray-800" : "bg-white"
                } w-full md:w-64`}
              >
                <FaSearch
                  className={`absolute left-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-800 text-gray-100 focus:ring-blue-500"
                      : "bg-white text-gray-800 focus:ring-blue-300"
                  }`}
                />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <button
                onClick={() => setShowCreateModal(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-blue-600 hover:bg-blue-500 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                } transition`}
              >
                <PlusIcon className="w-5 h-5" />
                Create New Patient
              </button>
              <button
                onClick={exportToExcel}
                disabled={filteredPatients.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark
                    ? filteredPatients.length === 0
                      ? "bg-gray-600 text-gray-400"
                      : "bg-gray-600 hover:bg-gray-500 text-gray-100"
                    : filteredPatients.length === 0
                    ? "bg-gray-200 text-gray-400"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                } transition`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export to Excel
              </button>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg scrollbar-hide">
            <table className="min-w-full divide-y divide-gray-200">
              <thead
                className={`${
                  isDark
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  border"
                  >
                    <div className="flex items-center gap-2">
                      <IdentificationIcon className="w-4 h-4" />
                      ID Code
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  border"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Name
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  border"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Age
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  border"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Gender
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  border"
                  >
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      Phone
                    </div>
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider  border"
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase  border"
                  >
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Registered
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase  border"
                  >
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Career
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase  border"
                  >
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      Province
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase  border"
                  >
                    <div className="flex items-center gap-2">
                      <Cog6ToothIcon className="w-4 h-4" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y divide-gray-200 ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                {status === "loading" && (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center text-sm  border">
                      <div
                        className={`p-8 text-center ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <p>Loading patients...</p>
                      </div>
                    </td>
                  </tr>
                )}
                {status === "failed" && (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center text-sm  border">
                      <div
                        className={`p-8 text-center ${
                          isDark ? "text-red-400" : "text-red-500"
                        }`}
                      >
                        <p>Error: {error || "Failed to load patients"}</p>
                      </div>
                    </td>
                  </tr>
                )}
                {status === "succeeded" && currentPatients.length > 0 ? (
                  currentPatients.map((p) => (
                    <tr
                      key={p.id}
                      className={`hover:${
                        isDark ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium  border">
                        DT{p.id}
                      </td>
                      <td className="px-9 py-4 whitespace-nowrap text-sm  border">
                        {p.name}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm  border">
                        {p.age || "Unknown"}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm  border">
                        {p.gender}
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap text-sm  border">
                        {p.phone}
                      </td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm  border">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            p.status === "active"
                              ? isDark
                                ? "bg-green-900 text-green-200"
                                : "bg-green-100 text-green-800"
                              : p.status === "recovered"
                              ? isDark
                                ? "bg-blue-900 text-blue-200"
                                : "bg-blue-100 text-blue-800"
                              : p.status === "chronic"
                              ? isDark
                                ? "bg-orange-900 text-orange-200"
                                : "bg-orange-100 text-orange-800"
                              : isDark
                              ? "bg-gray-900 text-gray-200"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-11 py-4 whitespace-nowrap text-sm  border">
                        {p.created_at
                          ? dayjs(p.created_at).format("YYYY-MM-DD HH:mm:ss")
                          : ""}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm  border">
                        {p.career}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm  border">
                        {p.province?.name || p.province}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium  border">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(p)}
                            className={`p-2 rounded-full ${
                              isDark
                                ? "text-blue-400 hover:bg-gray-700"
                                : "text-blue-600 hover:bg-blue-50"
                            } transition`}
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handlePrintWaitingNumber(p)
                            }
                            className={`p-2 rounded-full ${
                              isDark
                                ? "text-green-400 hover:bg-gray-700"
                                : "text-green-600 hover:bg-green-50"
                            } transition`}
                            title="Print Waiting Number"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className={`p-2 rounded-full ${
                              isDark
                                ? "text-red-400 hover:bg-gray-700"
                                : "text-red-600 hover:bg-red-50"
                            } transition`}
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : status === "succeeded" && currentPatients.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center text-sm">
                      {searchTerm
                        ? "No patients match your search."
                        : "No patients found."}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {status === "succeeded" && filteredPatients.length > 0 && (
            <div className="mt-6 flex flex-col items-end gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full ${
                    currentPage === 1
                      ? isDark
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 cursor-not-allowed"
                      : isDark
                      ? "text-gray-100 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  aria-label="Previous page"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                {getPageNumbers().map((number) => (
                  <button
                    key={number}
                    onClick={() => handlePageChange(number)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === number
                        ? isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600 text-white"
                        : isDark
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition`}
                    aria-current={currentPage === number ? "page" : undefined}
                  >
                    {number}
                  </button>
                ))}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-4 py-2">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 1 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className={`px-4 py-2 rounded-lg ${
                      isDark
                        ? "text-gray-100 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    } transition`}
                  >
                    {totalPages}
                  </button>
                )}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full ${
                    currentPage === totalPages
                      ? isDark
                        ? "text-gray-600 cursor-not-allowed"
                        : "text-gray-400 cursor-not-allowed"
                      : isDark
                      ? "text-gray-100 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  } transition`}
                  aria-label="Next page"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, filteredPatients.length)} of{" "}
                {filteredPatients.length} patients
              </p>
            </div>
          )}

          {/* Charts Section */}
          {status === "succeeded" && filteredPatients.length > 0 && (
            <div className="mt-8">
              <div
                className={`rounded-xl p-6 ${
                  isDark ? "bg-gray-800" : "bg-white"
                } shadow-md flex flex-col md:flex-row gap-6`}
              >
                <div className="flex-1 h-80">
                  <Bar
                    data={getAgeDistribution()}
                    options={chartOptions}
                    aria-label="Patient Age Distribution Bar Chart"
                  />
                </div>
                <div className="flex-1 h-80">
                  <Pie
                    data={getGenderDistribution()}
                    options={pieChartOptions}
                    aria-label="Patient Gender Distribution Pie Chart"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          data-aos="fade-down"
          role="dialog"
          aria-labelledby="createModalTitle"
          aria-modal="true"
        >
          <div
            className={`rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 ease-in-out ${
              isDark ? "bg-gray-800" : "bg-white"
            } max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
          >
            <div
              className={`p-5 border-b rounded-t-xl ${
                isDark
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-200 bg-teal-50"
              } flex justify-between items-center sticky top-0 z-10`}
            >
              <h2
                id="createModalTitle"
                className="text-xl font-bold flex items-center gap-3"
              >
                <PlusIcon className="w-5 h-5 text-teal-600" />
                <span className={isDark ? "text-teal-400" : "text-teal-800"}>
                  New Patient Registration
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className={`rounded-full p-1 focus:outline-none focus:ring-2 ${
                  isDark
                    ? "focus:ring-teal-500 text-gray-300 hover:text-white"
                    : "focus:ring-teal-300 text-gray-500 hover:text-gray-700"
                }`}
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name Field */}
                <div className="space-y-1 col-span-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition placeholder-gray-400`}
                    autoFocus
                    aria-required="true"
                  />
                </div>

                {/* Age Field */}
                <div className="space-y-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                    min="1"
                    max="120"
                    required
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition placeholder-gray-400`}
                    aria-required="true"
                  />
                </div>

                {/* Gender Field */}
                <div className="space-y-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition`}
                    aria-required="true"
                  >
                    <option value="" disabled>
                      Select gender
                    </option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Phone Field */}
                <div className="space-y-1 col-span-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    required
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition placeholder-gray-400`}
                    aria-required="true"
                  />
                </div>

                {/* Treatment Field */}

                {/* Career Field */}
                <div className="space-y-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="Dentist"
                    required
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition placeholder-gray-400`}
                    aria-required="true"
                  />
                </div>

                {/* Status Field */}
                <div className="space-y-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={statusState}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition`}
                    aria-required="true"
                  >
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="active">Active</option>
                    <option value="recovered">Recovered</option>
                    <option value="chronic">Chronic</option>
                  </select>
                </div>

                {/* Province Field */}
                <div className="space-y-1 col-span-1">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Province <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    } transition`}
                    aria-required="true"
                  >
                    <option value="" disabled>
                      Select province
                    </option>
                    {Array.isArray(provinces) &&
                      provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-5 py-2 rounded-lg font-medium text-sm ${
                    isDark
                      ? "border border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } transition focus:outline-none focus:ring-2 focus:ring-teal-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !patient ||
                    !age ||
                    !gender ||
                    !phone ||
                    !career ||
                    !statusState ||
                    !province
                  }
                  className={`px-5 py-2 rounded-lg font-semibold text-sm ${
                    isDark
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  } transition focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-md`}
                >
                  Register Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          role="dialog"
          aria-labelledby="editModalTitle"
          aria-modal="true"
        >
          <div
            className={`rounded-xl shadow-2xl w-full max-w-4xl transform transition-all duration-300 ease-in-out ${
              isDark ? "bg-gray-800" : "bg-white"
            } max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200`}
          >
            <div
              className={`p-5 border-b rounded-t-xl ${
                isDark
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-200 bg-teal-50"
              } flex justify-between items-center sticky top-0 z-10`}
            >
              <h2
                id="editModalTitle"
                className="text-xl font-bold flex items-center gap-3"
              >
                <PencilIcon className="w-5 h-5 text-teal-600" />
                <span className={isDark ? "text-teal-400" : "text-teal-800"}>
                  Edit Patient Record
                </span>
              </h2>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className={`rounded-full p-1 focus:outline-none focus:ring-2 ${
                  isDark
                    ? "focus:ring-teal-500 text-gray-300 hover:text-white"
                    : "focus:ring-teal-300 text-gray-500 hover:text-gray-700"
                }`}
                aria-label="Close modal"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-5">
              {/* Same form fields as create modal */}
              {/* ... */}

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={`px-5 py-2 rounded-lg font-medium text-sm ${
                    isDark
                      ? "border border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } transition focus:outline-none focus:ring-2 focus:ring-teal-300`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    !patient ||
                    !age ||
                    !gender ||
                    !phone ||
                    !career ||
                    !statusState ||
                    !province
                  }
                  className={`px-5 py-2 rounded-lg font-semibold text-sm ${
                    isDark
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  } transition focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-md`}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
