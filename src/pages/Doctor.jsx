import React, { useState, useRef, useEffect, useContext } from "react";
import { Pencil, Trash2, Plus, Stethoscope, Mail, User, X } from "lucide-react";
import Calendar from 'react-calendar';
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid"; // or '24/outline'
import { ToastContainer, toast } from "react-toastify";
import {
  createDoctor,
  deleteDoctor,
  fetchDoctors,
} from "../stores/doctorSlice";
import * as XLSX from "xlsx";

const Doctor = () => {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors, error } = useSelector((state) => state.doctor);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [speciatly, setSpeciatly] = useState("");
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState("available");

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  console.log(doctors);

  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [isExporting, setIsExporting] = useState(false);
  const modalRef = useRef(null);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    setIsModalOpen(false);

    const newDoctor = {
      name: name,
      speciatly: speciatly,
      email: email,
      status: status,
      image: image,
    };
    
    try {
      await dispatch(createDoctor(newDoctor));
      dispatch(fetchDoctors());
      toast.success("Doctor created successfully!", { position: "top-right" });
      setName('');
      setEmail('');
      setSpeciatly('');
      setImage(null);
      setStatus('available');

    } catch (e) {
      toast.error(`Error creating doctor: ${e.message}`, {
        position: "top-right",
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    resetForm();
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const exportToExcel = () => {
    setIsExporting(true);

    try {
      // Prepare data with correct field names
      const data = doctors.map((doctor) => ({
        ID: doctor.id,
        Name: doctor.name,
        Specialty: doctor.specialty || doctor.speciatly,
        Email: doctor.email,
        Status: doctor.status,
        "Joined Date": doctor.joinedDate
          ? new Date(doctor.joinedDate).toLocaleDateString()
          : "N/A",
        "Image URL": doctor.image || "Not provided",
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      worksheet["!cols"] = [
        { width: 10 },
        { width: 25 },
        { width: 20 },
        { width: 30 },
        { width: 15 },
        { width: 15 },
        { width: 40 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Doctors");
      XLSX.writeFile(workbook, "Doctors_List.xlsx", { compression: true });
    } catch (error) {
      console.error("Export failed:", error);
      showAlert("Failed to export. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteDoctor(id));
      toast.success("Doctor deleted successfully!", { position: "top-right" });
      dispatch(fetchDoctors());
    } catch (e) {
      console.log(e);
    }
  };
  if (status === "loading") {
    return (
      <div
        className={`p-6 min-h-screen ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        Loading...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div
        className={`p-6 min-h-screen ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      className={`p-6 min-h-screen ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Doctor Management</h2>
        <div className="flex gap-4">
          <button
            onClick={() =>
              setViewMode(viewMode === "table" ? "cards" : "table")
            }
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-100"
            } border ${isDark ? "border-gray-600" : "border-gray-200"}`}
          >
            {viewMode === "table" ? "Card View" : "Table View"}
          </button>
          <button
            onClick={exportToExcel}
            disabled={isExporting || doctors.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isExporting
                ? "bg-gray-400 cursor-not-allowed"
                : isDark
                ? "bg-green-700 hover:bg-green-600"
                : "bg-green-600 hover:bg-green-700"
            } text-white transition-colors`}
          >
            {isExporting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Export to Excel
              </>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Doctor
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div
          className={`rounded-xl overflow-hidden shadow-sm ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } border`}
        >
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 ">
            <thead className={isDark ? "bg-teal-900/30" : "bg-teal-50"} >
              <tr className="">
                <th className=" border px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Doctor
                </th>
                <th className=" border px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Specialty
                </th>
                <th className=" border px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Contact
                </th>
                <th className=" border px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className=" border px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {doctors?.map((doc) => (
                <tr
                  key={doc.id}
                  className={`transition-colors ${
                    isDark ? "hover:bg-gray-700/50" : "hover:bg-teal-50/30"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap  border">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full object-cover border-2 border-white shadow"
                          src={
                            doc.image ||
                            `https://randomuser.me/api/portraits/${
                              Math.random() > 0.5 ? "men" : "women"
                            }/${Math.floor(Math.random() * 100)}.jpg`
                          }
                          alt={doc.name}
                        />
                      </div>
                      <div className="ml-4">
                        <div
                          className={`text-sm font-medium ${
                            isDark ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {doc.name}
                        </div>
                        <div
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          ID: {doc.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className=" border px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`p-2 rounded-full ${
                          isDark
                            ? "bg-teal-900/20 text-teal-300"
                            : "bg-teal-100 text-teal-800"
                        }`}
                      >
                        <Stethoscope size={16} />
                      </div>
                      <div className="ml-3">
                        <div
                          className={`text-sm font-medium ${
                            isDark ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {doc.speciatly}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className=" border px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Mail
                        size={16}
                        className={isDark ? "text-gray-400" : "text-gray-500"}
                      />
                      <span
                        className={`text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {doc.email}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap  border">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        doc.status === "Available"
                          ? isDark
                            ? "bg-green-900/30 text-green-300"
                            : "bg-green-100 text-green-800"
                          : isDark
                          ? "bg-amber-900/30 text-amber-300"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {doc.status || "Available"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium  border">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "text-teal-400 hover:bg-gray-700"
                            : "text-teal-600 hover:bg-gray-100"
                        }`}
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          isDark
                            ? "text-red-400 hover:bg-gray-700"
                            : "text-red-600 hover:bg-gray-100"
                        }`}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              } border ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div
                className={`h-2 ${
                  doc.status === "Available" ? "bg-teal-500" : "bg-amber-500"
                }`}
              ></div>
              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4">
                    <img
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      src={
                        doc.image ||
                        `https://randomuser.me/api/portraits/${
                          Math.random() > 0.5 ? "men" : "women"
                        }/${Math.floor(Math.random() * 100)}.jpg`
                      }
                      alt={doc.name}
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 p-2 rounded-full ${
                        isDark ? "bg-teal-800" : "bg-teal-100"
                      }`}
                    >
                      <Stethoscope
                        size={16}
                        className={isDark ? "text-teal-300" : "text-teal-600"}
                      />
                    </div>
                  </div>
                  <h3
                    className={`text-xl font-bold text-center ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {doc.name}
                  </h3>
                  <p
                    className={`mt-1 text-sm ${
                      isDark ? "text-teal-300" : "text-teal-600"
                    }`}
                  >
                    {doc.speciatly}
                  </p>
                </div>

                <div
                  className={`mt-6 space-y-3 text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="flex-shrink-0" />
                    <span className="truncate">{doc.email}</span>
                  </div>
                  
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      doc.status === "Available"
                        ? isDark
                          ? "bg-teal-900/30 text-teal-300"
                          : "bg-teal-100 text-teal-800"
                        : isDark
                        ? "bg-amber-900/30 text-amber-300"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {doc.status || "Available"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-teal-400 hover:bg-gray-700"
                          : "text-teal-600 hover:bg-gray-100"
                      }`}
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        isDark
                          ? "text-red-400 hover:bg-gray-700"
                          : "text-red-600 hover:bg-gray-100"
                      }`}
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          data-aos="fade-down"
        >
          <div
            ref={modalRef}
            className={`rounded-xl shadow-2xl w-full max-w-2xl ${
              isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <div
              className={`p-5 border-b ${
                isDark
                  ? "border-gray-700 bg-gray-900"
                  : "border-gray-200 bg-teal-50"
              } rounded-t-xl`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {editingId ? (
                    <>
                      <PencilSquareIcon className="w-5 h-5 text-teal-500" />
                      <span
                        className={isDark ? "text-teal-400" : "text-teal-700"}
                      >
                        Edit Doctor Profile
                      </span>
                    </>
                  ) : (
                    <>
                      <UserPlusIcon className="w-5 h-5 text-teal-500" />
                      <span
                        className={isDark ? "text-teal-400" : "text-teal-700"}
                      >
                        Register New Doctor
                      </span>
                    </>
                  )}
                </h3>
                <button
                  onClick={closeModal}
                  className={`p-1 rounded-full ${
                    isDark
                      ? "hover:bg-gray-700 text-gray-300"
                      : "hover:bg-gray-100 text-gray-500"
                  } transition-colors`}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name Field */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-opacity-50 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    }`}
                    required
                    autoFocus
                  />
                </div>

                {/* Specialty Field */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Specialty <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="speciatly"
                    value={speciatly}
                    onChange={(e) => setSpeciatly(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-opacity-50 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    }`}
                    required
                    placeholder="e.g. Orthodontist"
                  />
                </div>

                {/* Status Field */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-opacity-50 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-opacity-50 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-teal-500 focus:border-teal-500"
                        : "bg-white border-gray-300 focus:ring-teal-300 focus:border-teal-500"
                    }`}
                    required
                    placeholder="doctor@clinic.com"
                  />
                </div>

                {/* Image Field */}
                <div className="space-y-2 md:col-span-2">
                  <label
                    className={`block text-sm font-medium ${
                      isDark ? "text-teal-300" : "text-teal-700"
                    }`}
                  >
                    Profile Photo
                  </label>
                  <div
                    className={`p-3 rounded-lg border-dashed border-2 ${
                      isDark
                        ? "border-gray-600 bg-gray-700"
                        : "border-gray-300 bg-gray-50"
                    }`}
                  >
                    <input
                      type="file"
                      name="image"
                      onChange={handleImageChange}
                      className={`w-full text-sm ${
                        isDark ? "text-gray-300" : "text-gray-600"
                      } file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 ${
                        isDark
                          ? "file:bg-teal-600 file:hover:bg-teal-700 file:text-white"
                          : "file:bg-teal-500 file:hover:bg-teal-600 file:text-white"
                      } file:cursor-pointer`}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    JPG, PNG or WEBP (Max 2MB). Leave blank for default avatar.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-5 py-2.5 rounded-lg font-medium text-sm ${
                    isDark
                      ? "border border-gray-600 text-gray-200 hover:bg-gray-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm ${
                    isDark
                      ? "bg-teal-600 hover:bg-teal-700 text-white"
                      : "bg-teal-500 hover:bg-teal-600 text-white"
                  } transition-colors shadow-md`}
                >
                  {editingId ? "Update Doctor" : "Register Doctor"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
