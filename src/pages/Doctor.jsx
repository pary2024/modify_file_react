import React, { useState, useRef, useEffect, useContext } from "react";
import { Pencil, Trash2, Plus, Stethoscope, Mail, User, X } from "lucide-react";
import { ThemeContext } from "../colors/Thems";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { createDoctor, deleteDoctor, fetchDoctors } from "../stores/doctorSlice";
import * as XLSX from "xlsx";

const Doctor = () => {
  const { isDark } = useContext(ThemeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { doctors,  error } = useSelector((state) => state.doctor);
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [speciatly , setSpeciatly] = useState("");
  const [image , setImage] = useState(null);
  const [status , setStatus] = useState('available');
  const [alertMessage, setAlertMessage] = useState(null); 

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);
  console.log(doctors);
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
  

  const [editingId , setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
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
    // Here you would typically dispatch an action to update/add a doctor
    // For now, we'll just show an alert
    setTimeout(() => setAlert(null), 3000);
    setEditingId(null);
    setIsModalOpen(false);

    const newDoctor ={
      name:name,
      speciatly: speciatly,
      email: email,
      status : status,
      image: image
    }
    try{
      await dispatch(createDoctor(newDoctor));
      dispatch(fetchDoctors());
             Swal.fire({
              icon: "success",
              title: "Doctore created successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });
    }catch(e){
      
             Swal.fire({
              icon: "success",
              title: "doctore is warning!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });
    }
  };

  const showAlert = (message) => {
    setAlert(message);
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
      const data = doctors.map(doctor => ({
        ID: doctor.id,
        Name: doctor.name,
        Specialty: doctor.specialty || doctor.speciatly,
        Email: doctor.email,
        Status: doctor.status,
        'Joined Date': doctor.joinedDate 
          ? new Date(doctor.joinedDate).toLocaleDateString() 
          : "N/A",
        'Image URL': doctor.image || "Not provided"
      }));
      const worksheet = XLSX.utils.json_to_sheet(data);
      worksheet["!cols"] = [
        { width: 10 },
        { width: 25 }, 
        { width: 20 }, 
        { width: 30 }, 
        { width: 15 }, 
        { width: 15 }, 
        { width: 40 }  
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
  const handleDelete = async (id) =>{
    try{
      await dispatch(deleteDoctor(id))
      showAlert("doctor was delete successfully")
      dispatch(fetchDoctors());
    }catch(e){
      console.log(e);
    }
  }
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
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
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

      {alert && (
        <div
          className={`mb-6 p-3 rounded-lg shadow-md w-full max-w-2xl mx-auto flex items-center justify-between ${
            isDark
              ? "bg-green-900/80 text-green-100 border border-green-800"
              : "bg-green-100 text-green-800 border border-green-200"
          }`}
        >
          <span>{alert}</span>
          <button
            onClick={() => setAlert(null)}
            className="text-gray-500 hover:text-gray-300"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {viewMode === "table" ? (
        <div
          className={`rounded-xl shadow-md overflow-hidden ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <table className="min-w-full">
            <thead className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Doctor</th>
                <th className="p-4 text-left">Specialty</th>
                <th className="p-4 text-left">Contact</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors?.map((doc) => (
                <tr
                  key={doc.id}
                  className={`border-t ${
                    isDark
                      ? "border-gray-700 hover:bg-gray-700/50"
                      : "border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <td className="p-4">{doc.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          doc.image ||
                          `https://randomuser.me/api/portraits/${
                            Math.random() > 0.5 ? "men" : "women"
                          }/${Math.floor(Math.random() * 100)}.jpg`
                        }
                        alt={doc.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Joined:{" "}
                          {doc.joinedDate
                            ? new Date(doc.joinedDate).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope
                        size={16}
                        className={isDark ? "text-blue-400" : "text-blue-600"}
                      />
                      {doc.speciatly}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Mail
                          size={16}
                          className={isDark ? "text-gray-400" : "text-gray-500"}
                        />
                        <span className="text-sm">{doc.email}</span>
                      </div>
                     
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        doc.status === "Available"
                          ? isDark
                            ? "bg-green-900/50 text-green-300"
                            : "bg-green-100 text-green-800"
                          : isDark
                          ? "bg-red-900/50 text-red-300"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {doc.status || "Available"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className={`p-2 rounded-lg ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        title="Edit"
                      >
                        <Pencil
                          size={18}
                          className={isDark ? "text-blue-400" : "text-blue-600"}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className={`p-2 rounded-lg ${
                          isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                        }`}
                        title="Delete"
                      >
                        <Trash2
                          size={18}
                          className={isDark ? "text-red-400" : "text-red-600"}
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className={`rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className={`p-1 ${
                  doc.status === "Available" ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <img
                    src={
                      doc.image ||
                      `https://randomuser.me/api/portraits/${
                        Math.random() > 0.5 ? "men" : "women"
                      }/${Math.floor(Math.random() * 100)}.jpg`
                    }
                    alt={doc.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <h3 className="mt-4 text-xl font-bold text-center">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-blue-500">
                    <Stethoscope size={16} />
                    <span>{doc.speciatly}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail
                      size={16}
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    />
                    <span className="text-sm">{doc.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <User
                      size={16}
                      className={isDark ? "text-gray-400" : "text-gray-500"}
                    />
                    <span className="text-sm">
                      Joined:{" "}
                      {doc.joinedDate
                        ? new Date(doc.joinedDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      doc.status === "Available"
                        ? isDark
                          ? "bg-green-900/50 text-green-300"
                          : "bg-green-100 text-green-800"
                        : isDark
                        ? "bg-red-900/50 text-red-300"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {doc.status || "Available"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(doc)}
                      className={`p-2 rounded-lg ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                      title="Edit"
                    >
                      <Pencil
                        size={18}
                        className={isDark ? "text-blue-400" : "text-blue-600"}
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className={`p-2 rounded-lg ${
                        isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                      }`}
                      title="Delete"
                    >
                      <Trash2
                        size={18}
                        className={isDark ? "text-red-400" : "text-red-600"}
                      />
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div
            ref={modalRef}
            className={`rounded-xl shadow-2xl w-full max-w-md ${
              isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <div
              className={`p-4 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">
                  {editingId ? "Edit Doctor" : "Add New Doctor"}
                </h3>
                <button
                  onClick={closeModal}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e)=>setName(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Speciatly
                  </label>
                  <input
                    type="text"
                    name="speciatly"
                    value={speciatly}
                    onChange={(e)=>setSpeciatly(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label
                    className={`block mb-1 text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Status
                  </label>
                  <select
                    name="status"
                    value={status}
                    onChange={(e)=>setStatus(e.target.value)}
                    className={`w-full p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                        : "bg-white border-gray-300 focus:border-blue-500"
                    }`}
                  >
                    <option value="Available">Available</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  }`}
                  required
                />
              </div>


              <div>
                <label
                  className={`block mb-1 text-sm font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Profile Image URL (optional)
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleImageChange}
                  placeholder="Leave blank for random image"
                  className={`w-full p-3 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:border-blue-500"
                      : "bg-white border-gray-300 focus:border-blue-500"
                  }`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  {editingId ? "Update Doctor" : "Add Doctor"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                >
                  Cancel
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
