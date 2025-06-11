import { useContext, useEffect, useState } from "react";
import {
  PencilIcon,
  TrashIcon,
  MapPinIcon,
  PlusIcon,
  PrinterIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
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
import { ThemeContext } from "../colors/Thems";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import {
  fetchPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../stores/patientSlice";
import Swal from 'sweetalert2';
import { fetchProvinces } from "../stores/provinceSlice";
import { fetchTreats } from "../stores/treatSlice";

export default function PatientList() {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { patients, status, error } = useSelector((state) => state.patient);
  const { provinces } = useSelector((state) => state.province);
  const { treats } = useSelector((state) => state.treat);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [patient, setPatient] = useState("");
  const [age, setAge] = useState("");
  const [province, setProvince] = useState("");
  const [treat, setTreat] = useState("");
  const [phone, setPhone] = useState("");
  const [career, setCareer] = useState("");
  const [statusState, setStatus] = useState("active");
  const [gender, setGender] = useState("male");
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [alertMessage, setAlertMessage] = useState(null); // or { type, text }

   

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchProvinces());
    dispatch(fetchTreats());
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
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);

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
      treat_id: treat,
      phone: phone,
      career: career,
      status: statusState,
      gender: gender,
    };
    try {
      await dispatch(createPatient(newPatient)).unwrap();
      dispatch(fetchPatients());
      setShowCreateModal(false);
      Swal.fire({
        icon: "success",
        title: "Patient created successfully!",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
      setPatient("");
      setAge("");
      setProvince("");
      setTreat("");
      setPhone("");
      setCareer("");
      setStatus("active");
      setGender("male");
      
    } catch (e) {
      console.error("Error creating patient:", e);
       Swal.fire({
        icon: "error",
        title: "Failed to create patient",
        text: "Something went wrong.",
      });
    }
  };



  const handleEdit = (p) => {
    setEditingId(p.id);
    setPatient(p.name);
    setAge(p.age);
    setProvince(p.province_id || "");
    setTreat(p.treat_id || "");
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
      treat_id: treat,
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
      setTreat("");
      setPhone("");
      setCareer("");
      setStatus("active");
      setGender("male");
     
    } catch (e) {
      console.error("Error updating patient:", e);
      setSuccessMessage("Failed to update patient.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deletePatient(id));
      dispatch(fetchPatients());
       Swal.fire({
        icon: "success",
        title: "Patient deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
      // Adjust current page if necessary
      if (currentPatients.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (e) {
      console.error("Error deleting patient:", e);
      
    }
  };
   useEffect(() => {
  if (alertMessage) {
    Swal.fire({
      icon: alertMessage.type,
      title: alertMessage.text,
      showConfirmButton: false,
      timer: 1500,
      position: "top-end",
    });
    setAlertMessage(null); // clear after showing
  }
}, [alertMessage]);

  const handlePrintInvoice = (patient, settings = {}) => {
   
  const {
    paperSize = 'A4',
    orientation = 'portrait'
  } = settings;

  

  const provinceName = provinces.find((prov) => prov.id === patient.province_id)?.name || patient.province || "N/A";
  const treatmentName = treats.find((t) => t.id === patients.treat_id)?.name || patient.disease || "N/A";
  const rawDate = patient.created_at || patient.create_at || new Date().toISOString();
  const invoiceDate = dayjs(rawDate).format("YYYY-MM-DD HH:mm:ss");

  // Define paper size dimensions
  const paperSizes = {
    A4: { width: "210mm", height: "297mm" },
    Letter: { width: "215.9mm", height: "279.4mm" },
  };
  const selectedPaper = paperSizes[paperSize] || paperSizes.A4;

  const invoiceWindow = window.open("", "_blank");
  invoiceWindow.document.write(`
    <html>
      <head>
        <title>Dental Invoice - DT${patient.id}</title>
        <style>
          :root {
            --primary-color: #2c7be5;
            --secondary-color: #6c757d;
            --border-color: #e9ecef;
            --light-bg: #f8f9fa;
          }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0;
            color: #333;
            line-height: 1.6;
          }
          .invoice-container { 
            max-width: ${orientation === "landscape" ? "297mm" : "210mm"}; 
            width: ${selectedPaper.width};
            height: ${selectedPaper.height};
            margin: 10mm auto; 
            padding: 15mm;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            box-sizing: border-box;
          }
          .header { 
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
          }
          .clinic-info h1 {
            color: var(--primary-color);
            margin: 0;
            font-size: 28px;
          }
          .clinic-info p {
            margin: 5px 0;
            color: var(--secondary-color);
          }
          .invoice-meta {
            text-align: right;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 5px;
          }
          .invoice-number {
            color: var(--secondary-color);
            font-size: 16px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--border-color);
          }
          .patient-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .detail-item {
            margin-bottom: 10px;
          }
          .detail-label {
            font-weight: 600;
            display: block;
            margin-bottom: 3px;
            color: var(--secondary-color);
          }
          .detail-value {
            font-size: 16px;
          }
          .treatment-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          .treatment-table th {
            background-color: var(--primary-color);
            color: white;
            padding: 12px;
            text-align: left;
          }
          .treatment-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border-color);
          }
          .treatment-table tr:nth-child(even) {
            background-color: var(--light-bg);
          }
          .total-section {
            text-align: right;
            margin-top: 20px;
          }
          .total-amount {
            font-size: 20px;
            font-weight: 600;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid var(--border-color);
            text-align: center;
            color: var(--secondary-color);
            font-size: 14px;
          }
          .action-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 30px;
          }
          .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s;
          }
          .btn-print {
            background-color: var(--primary-color);
            color: white;
          }
          .btn-close {
            background-color: var(--secondary-color);
            color: white;
          }
          .btn:hover {
            opacity: 0.9;
            transform: translateY(-2px);
          }
          @media print {
            @page {
              size: ${paperSize} ${orientation};
              margin: 10mm;
            }
            .action-buttons {
              display: none;
            }
            body {
              padding: 0;
              margin: 0;
            }
            .invoice-container {
              box-shadow: none;
              margin: 0;
              padding: 10mm;
              width: 100%;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="clinic-info">
              <h1>BrightSmile Dental Clinic</h1>
              <p>123 Dental Street, Health District</p>
              <p>Phone: (123) 456-7890 | Email: info@brightsmile.com</p>
            </div>
            <div class="invoice-meta">
              <div class="invoice-title">Treatment Invoice</div>
              <div class="invoice-number">#DT${patient.id}</div>
              <div>Date: ${invoiceDate}</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="patient-details">
              <div class="detail-item">
                <span class="detail-label">Full Name</span>
                <span class="detail-value">${patient.name}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Age</span>
                <span class="detail-value">${patient.age}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Gender</span>
                <span class="detail-value">${patient.gender}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phone Number</span>
                <span class="detail-value">${patient.phone}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Occupation</span>
                <span class="detail-value">${patient.career}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Province</span>
                <span class="detail-value">${provinceName}</span>
              </div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">Treatment Details</div>
            <table class="treatment-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${treatmentName}</td>
                  <td>${patient.status}</td>
                  <td>$150.00</td>
                </tr>
              </tbody>
            </table>
            <div class="total-section">
              <div class="total-amount">Total: $150.00</div>
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing BrightSmile Dental Clinic</p>
            <p>Please bring this invoice for your next appointment</p>
            <p>For any inquiries, please contact our office</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-print" onclick="window.print()">Print Invoice</button>
            <button class="btn btn-close" onclick="window.close()">Close Window</button>
          </div>
        </div>
      </body>
    </html>
  `);
  invoiceWindow.document.close();
};


  const exportToExcel = () => {
    const dataForExport = filteredPatients.map((patient) => ({
      ID: `DT${patient.id.toString().slice(-6)}`,
      Name: patient.name,
      Age: patient.age,
      Gender: patient.gender,
      Phone: patient.phone,
      treat_id: patient.treat?.name || patient.disease,
      Career: patient.career,
      Status: patient.status,
      Registered: patient.create_at || patient.created_at
        ? new Date(patient.create_at || patient.created_at).toLocaleString()
        : "",
      Province_id: patient.province?.name || patient.province,
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataForExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "patients_data.xlsx");
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      
      <div
        className={`mx-auto rounded-xl  overflow-hidden ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`p-6 ${isDark ? "bg-gray-700" : "bg-blue-600"} text-white`}
        >
          <h1 className="text-3xl font-bold flex items-center gap-3">
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
                }  w-full md:w-64`}
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
          <div className="overflow-x-auto rounded-lg   scrollbar-hide">
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
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <IdentificationIcon className="w-4 h-4" />
                      ID Code
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Name
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Age
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-4 h-4" />
                      Gender
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      Phone
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <HeartIcon className="w-4 h-4" />
                      Disease
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <ClipboardDocumentListIcon className="w-4 h-4" />
                      Status
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Registered
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      Career
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase"
                  >
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      Province
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase"
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
                    <td colSpan="11" className="px-6 py-4 text-center text-sm">
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
                    <td colSpan="11" className="px-6 py-4 text-center text-sm">
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium">
                        DT{p.id}
                      </td>
                      <td className="px-9 py-4 whitespace-nowrap text-sm">
                        {p.name}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm">
                        {p.age}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm">
                        {p.gender}
                      </td>
                      <td className="px-7 py-4 whitespace-nowrap text-sm">
                        {p.phone}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm">
                        {p.treat?.name || p.disease}
                      </td>
                      <td className="px-10 py-4 whitespace-nowrap text-sm">
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
                      <td className="px-11 py-4 whitespace-nowrap text-sm">
                        {p.created_at ? dayjs(p.created_at).format("YYYY-MM-DD HH:mm:ss") : ""}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm">
                        {p.career}
                      </td>
                      <td className="px-12 py-4 whitespace-nowrap text-sm">
                        {p.province?.name || p.province}
                      </td>
                      <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
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
                           onClick={() => handlePrintInvoice(p)}
                            className={`p-2 rounded-full ${
                              isDark
                                ? "text-green-400 hover:bg-gray-700"
                                : "text-green-600 hover:bg-green-50"
                            } transition`}
                            title="Print Invoice"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>handleDelete(p.id)}
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
        </div>
      </div>
      {showCreateModal && (
        <div  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" data-aos="fade-down">
          <div
            className={`rounded-xl shadow-xl w-full max-w-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDark
                  ? "border-gray-700 bg-gray-700"
                  : "border-gray-200 bg-blue-50"
              }`}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PlusIcon className="w-5 h-5" />
                Create New Patient
              </h2>
            </div>
            <form onSubmit={handleSave} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Treatment
                  </label>
                  <select
                    value={treat}
                    onChange={(e) => setTreat(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="">Select a Treatment</option>
                    {Array.isArray(treats) &&
                      treats.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Career
                  </label>
                  <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="Engineer"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={statusState}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="active">Active</option>
                    <option value="recovered">Recovered</option>
                    <option value="chronic">Chronic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="">Select Province</option>
                    {Array.isArray(provinces) &&
                      provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={`px-4 py-2 rounded-lg border ${
                    isDark
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100"
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition flex items-center gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Create Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className={`rounded-xl shadow-xl w-full max-w-2xl ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDark
                  ? "border-gray-700 bg-gray-700"
                  : "border-gray-200 bg-blue-50"
              }`}
            >
              <h2 className="text-xl font-bold flex items-center gap-2">
                <PencilIcon className="w-5 h-5" />
                Edit Patient
              </h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={patient}
                    onChange={(e) => setPatient(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="35"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1234567890"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Treatment
                  </label>
                  <select
                    value={treat}
                    onChange={(e) => setTreat(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="">Select a Treatment</option>
                    {Array.isArray(treats) &&
                      treats.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Career
                  </label>
                  <input
                    type="text"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    placeholder="Engineer"
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={statusState}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="active">Active</option>
                    <option value="recovered">Recovered</option>
                    <option value="chronic">Chronic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Province
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    required
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "text-gray-100 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } transition`}
                  >
                    <option value="">Select Province</option>
                    {Array.isArray(provinces) &&
                      provinces.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className={`px-4 py-2 rounded-lg border ${
                    isDark
                      ? "border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border-gray-300 text-gray-800 hover:bg-gray-100"
                  } transition`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition flex items-center gap-2"
                >
                  <PencilIcon className="w-4 h-4" />
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