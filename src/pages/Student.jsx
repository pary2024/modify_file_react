import { useContext, useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaFileExport,
  FaIdCard,
} from "react-icons/fa";
import { ThemeContext } from "../colors/Thems";
import {
  IdentificationIcon,
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  UsersIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { createStudent, fetchStudents } from "../stores/studentSlice";
import { fetchSchools } from "../stores/schoolSlice";

export default function Student() {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { students } = useSelector((state) => state.student || {});
  const { schools } = useSelector((state) => state.school || {});

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchSchools());
  }, [dispatch]);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("male");
  const [birth_day, setBirthday] = useState("");
  const [parents, setParent] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("active");
  const [NewStudent , setNewStudent] = useState(false);
   const [alertMessage, setAlertMessage] = useState(null); 
  const [cardDesign, setCardDesign] = useState({
    backgroundColor: "#ffffff",
    textColor: "#000000",
    borderColor: "#0000ff",
    logo: null,
  });
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

 

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      name,
      age:age,
      school_id: school,
      gender:gender,
      birth_day:birth_day,
      parents: parents,
      grade:grade,
      status:status,
    };
    try {
      await dispatch(createStudent(data));
            dispatch(fetchStudents());
      Swal.fire({
              icon: "success",
              title: "Province created successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-center",
            });
      setShowModal(false);
      setName("");
      setAge("");
      setSchool("");
      setGender("male");
      setBirthday("");
      setParent("");
      setGrade("");
      setStatus("active");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCardDesignChange = (e) => {
    const { name, value } = e.target;
    setCardDesign((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCardDesign((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrintCard = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Dental Clinic Student ID Card</title>
          <style>
            @media print {
              body { 
                margin: 0;
                background: #f5f5f5;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
              }
              .id-card {
                width: 3.375in;
                height: 2.125in;
                border: 1px solid #e0e0e0;
                background: white;
                color: #333;
                padding: 0;
                font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
                display: flex;
                flex-direction: column;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                border-radius: 10px;
                position: relative;
                overflow: hidden;
              }
              
              /* Card Header */
              .card-header {
                background: ${cardDesign.headerColor || '#1a73e8'};
                color: white;
                padding: 8px 12px;
                font-size: 12px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              
              .clinic-name {
                font-size: 13px;
              }
              
              .card-type {
                background: white;
                color: ${cardDesign.headerColor || '#1a73e8'};
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 10px;
                font-weight: bold;
              }
              
              /* Card Body */
              .card-body {
                display: flex;
                padding: 12px;
                flex-grow: 1;
              }
              
              .student-info {
                flex: 1;
                font-size: 10px;
                line-height: 1.5;
              }
              
              .info-row {
                display: flex;
                margin-bottom: 4px;
              }
              
              .info-label {
                font-weight: 600;
                color: ${cardDesign.labelColor || '#1a73e8'};
                width: 80px;
                flex-shrink: 0;
              }
              
              .info-value {
                flex-grow: 1;
              }
              
              .patient-id {
                font-weight: bold;
                color: #d32f2f;
              }
              
              /* Photo Section */
              .photo-section {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 10px;
                width: 80px;
              }
              
              .student-photo {
                width: 70px;
                height: 70px;
                object-fit: cover;
                border-radius: 5px;
                border: 2px solid #f5f5f5;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                margin-bottom: 5px;
              }
              
              .clinic-logo {
                width: 50px;
                height: 50px;
                object-fit: contain;
              }
              
              /* Card Footer */
              .card-footer {
                background: #f5f5f5;
                padding: 6px 12px;
                font-size: 8px;
                text-align: center;
                border-top: 1px solid #e0e0e0;
                display: flex;
                justify-content: space-between;
                align-items: center;
              }
              
              .emergency-contact {
                color: #d32f2f;
                font-weight: 600;
              }
              
              .issue-date {
                color: #666;
              }
              
              /* Dental Theme Elements */
              .dental-pattern {
                position: absolute;
                bottom: 5px;
                right: 5px;
                opacity: 0.05;
                font-size: 60px;
                z-index: 0;
              }
              
              .barcode {
                height: 20px;
                background: repeating-linear-gradient(90deg, #000, #000 1px, transparent 1px, transparent 10px);
                margin-top: 2px;
              }
            }
          </style>
        </head>
        <body>
          <div class="id-card">
            <!-- Header Section -->
            <div class="card-header">
              <div class="clinic-name">
                ${schools.find((s) => s.id === selectedStudent.school_id)?.name || "School"} Dental Clinic
              </div>
              <div class="card-type">
                STUDENT ID
              </div>
            </div>
            
            <!-- Body Section -->
            <div class="card-body">
              <div class="student-info">
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value">${selectedStudent.name}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Patient ID:</div>
                  <div class="info-value patient-id">DC-${String(students.indexOf(selectedStudent) + 1).padStart(4, '0')}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Grade/Class:</div>
                  <div class="info-value">${selectedStudent.grade}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Date of Birth:</div>
                  <div class="info-value">${new Date(selectedStudent.birth_day).toLocaleDateString("en-US")}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Last Visit:</div>
                  <div class="info-value">${new Date().toLocaleDateString("en-US")}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Next Checkup:</div>
                  <div class="info-value">${new Date(new Date().setMonth(new Date().getMonth() + 6)).toLocaleDateString("en-US")}</div>
                </div>
              </div>
              
              <div class="photo-section">
                ${selectedStudent.image ? `<img src="${selectedStudent.image}" class="student-photo" />` : '<div class="student-photo" style="background: #e0e0e0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 8px;">PHOTO</div>'}
                ${cardDesign.logo ? `<img src="${cardDesign.logo}" class="clinic-logo" />` : '<div class="clinic-logo" style="background: #f5f5f5; display: flex; align-items: center; justify-content: center; color: #999; font-size: 8px;">LOGO</div>'}
              </div>
            </div>
            
            <!-- Footer Section -->
            <div class="card-footer">
              <div class="emergency-contact">
                EMERGENCY: (123) 456-7890
              </div>
              <div class="issue-date">
                Issued: ${new Date().toLocaleDateString("en-US")}
              </div>
            </div>
            
            <!-- Decorative Elements -->
            <div class="dental-pattern">🦷🦷🦷</div>
            <div class="barcode"></div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              setTimeout(() => window.close(), 100);
            }, 100);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const exportToExcel = () => {
    const dataForExport = students.map((student, index) => ({
      ID: `DS0000${index + 1}`,
      Name: student.name,
      Age: student.age,
      birth_day: new Date(student.birth_day).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      Gender: student.gender,
      Grade: student.grade,
      School: schools.find((s) => s.id === student.school_id)?.name || "N/A",
      Parent: student.parents,
      Status: "Active",
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students_data.xlsx");
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
     

      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Student Dentists
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Manage your student records efficiently
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 w-full md:w-auto">
            <div
              className={`relative flex items-center rounded-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-sm`}
            >
              <FaSearch
                className={`absolute left-3 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 focus:ring-blue-500"
                    : "bg-white focus:ring-blue-300"
                }`}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={exportToExcel}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all shadow-md ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                <FaFileExport className="text-sm" />
                Export Excel
              </button>

              <button
                onClick={() => {
                  setIsEditMode(false);
                  setShowModal(true);
                }}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
              >
                <FaPlus className="text-sm" />
                Add New Student
              </button>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl overflow-hidden shadow-lg ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead
                className={`${
                  isDark ? "bg-gray-700" : "bg-gray-100"
                } text-left`}
              >
                <tr>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <IdentificationIcon className="w-5 h-5" />
                      ID Card
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      Name
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Age
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5" />
                      Birthday
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <UserIcon className="w-5 h-5" />
                      Gender
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <AcademicCapIcon className="w-5 h-5" />
                      Grade
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <BuildingLibraryIcon className="w-5 h-5" />
                      School
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="w-5 h-5" />
                      Parent
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      <CheckCircleIcon className="w-5 h-5" />
                      Status
                    </div>
                  </th>
                  <th className="px-6 py-4 font-medium text-center">
                    <div className="flex items-center gap-2 justify-center">
                      <Cog6ToothIcon className="w-5 h-5" />
                      Actions
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students
                  .filter((s) =>
                    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((s, index) => (
                    <tr
                      key={s.id}
                      className={`hover:${
                        isDark ? "bg-gray-750" : "bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-9 py-4 font-medium">
                        DS0000{index + 1}
                      </td>
                      <td className="px-8 py-4">{s.name}</td>
                      <td className="px-12 py-4">{s.age}</td>
                      <td className="px-7 py-4">
                        {new Date(s.birth_day).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-12 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            s.gender === "Male"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200"
                          }`}
                        >
                          {s.gender}
                        </span>
                      </td>
                      <td className="px-12 py-4">{s.grade}</td>
                      <td className="px-6 py-4">
                        {schools.find((school) => school.id === s.school_id)?.name || "N/A"}
                      </td>
                      <td className="px-9 py-4">{s.parents}</td>
                      <td className="px-11 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          Active
                        </span>
                      </td>
                      <td className="px-9 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedStudent(s);
                              setShowCardModal(true);
                            }}
                            className={`p-2 rounded-full ${
                              isDark
                                ? "hover:bg-gray-700 text-green-400 hover:text-green-300"
                                : "hover:bg-gray-100 text-green-600 hover:text-green-800"
                            }`}
                            title="Create ID Card"
                          >
                            <FaIdCard />
                          </button>
                          <button
                            onClick={() => handleEdit(s)}
                            className={`p-2 rounded-full ${
                              isDark
                                ? "hover:bg-gray-700 text-blue-400 hover:text-blue-300"
                                : "hover:bg-gray-100 text-blue-600 hover:text-blue-800"
                            }`}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className={`p-2 rounded-full ${
                              isDark
                                ? "hover:bg-gray-700 text-red-400 hover:text-red-300"
                                : "hover:bg-gray-100 text-red-600 hover:text-red-800"
                            }`}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div
              className={`p-12 text-center ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <svg
                  className={`w-16 h-16 mb-4 ${
                    isDark ? "text-gray-600" : "text-gray-400"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-lg font-medium mb-1">No students found</h3>
                <p
                  className={`mb-4 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Get started by adding a new student
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Add Student
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className={`rounded-xl shadow-2xl w-full max-w-md ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
           data-aos="zoom-in">
            <div className="p-6" >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditMode ? "Edit Student" : "Add New Student"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Age
                    </label>
                    <input
                      name="age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      type="number"
                      placeholder="16"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                          : "bg-white border-gray-300 focus:ring-blue-300"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Birthday
                    </label>
                    <input
                      name="birth_day"
                      value={birth_day}
                      onChange={(e) => setBirthday(e.target.value)}
                      type="date"
                      required
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                          : "bg-white border-gray-300 focus:ring-blue-300"
                      }`}
                    />
                  </div>
                </div>

                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                      : "bg-white border-gray-300 focus:ring-blue-300"
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>

                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    isDark
                      ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                      : "bg-white border-gray-300 focus:ring-blue-300"
                  }`}
                >
                  <option value="">Select Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Grade
                  </label>
                  <input
                    name="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="10th"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    School Name
                  </label>
                  <select
                    name="school_id"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select school
                    </option>
                    {schools.map((school) => (
                      <option key={school.id} value={school.id}>
                        {school.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Parent Name
                  </label>
                  <input
                    name="parents"
                    value={parents}
                    onChange={(e) => setParent(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-300"
                    }`}
                  />
                </div>

               

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={`px-4 py-2 rounded-lg border ${
                      isDark
                        ? "border-gray-600 hover:bg-gray-700"
                        : "border-gray-300 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all shadow-md"
                  >
                    {isEditMode ? "Update Student" : "Add Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

     {showCardModal && selectedStudent && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className={`rounded-xl shadow-2xl w-full max-w-lg ${isDark ? "bg-gray-800" : "bg-white"}`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Design Dental Clinic ID Card</h2>
          <button
            onClick={() => setShowCardModal(false)}
            className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Header Color
            </label>
            <input
              type="color"
              name="headerColor"
              value={cardDesign.headerColor || '#1a73e8'}
              onChange={handleCardDesignChange}
              className="w-full h-10 rounded-lg"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Text Color
            </label>
            <input
              type="color"
              name="textColor"
              value={cardDesign.textColor || '#333333'}
              onChange={handleCardDesignChange}
              className="w-full h-10 rounded-lg"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Label Color
            </label>
            <input
              type="color"
              name="labelColor"
              value={cardDesign.labelColor || '#1a73e8'}
              onChange={handleCardDesignChange}
              className="w-full h-10 rounded-lg"
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              School Logo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                isDark
                  ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                  : "bg-white border-gray-300 focus:ring-blue-300"
              }`}
            />
          </div>

          {/* Updated Preview Card */}
          <div className="flex justify-center">
            <div className="id-card-preview" style={{
              width: "3.375in",
              height: "2.125in",
              background: "white",
              color: cardDesign.textColor || '#333',
              padding: "0",
              fontFamily: "'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              borderRadius: "10px",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Header */}
              <div style={{
                background: cardDesign.headerColor || '#1a73e8',
                color: "white",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: "600",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ fontSize: "13px" }}>
                  {schools.find((s) => s.id === selectedStudent.school_id)?.name || "School"} Dental Clinic
                </div>
                <div style={{
                  background: "white",
                  color: cardDesign.headerColor || '#1a73e8',
                  padding: "2px 6px",
                  borderRadius: "10px",
                  fontSize: "10px",
                  fontWeight: "bold"
                }}>
                  STUDENT ID
                </div>
              </div>
              
              {/* Body */}
              <div style={{ display: "flex", padding: "12px", flexGrow: 1 }}>
                <div style={{ flex: 1, fontSize: "10px", lineHeight: "1.5" }}>
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ 
                      fontWeight: "600", 
                      color: cardDesign.labelColor || '#1a73e8',
                      width: "80px",
                      flexShrink: 0
                    }}>Name:</div>
                    <div>{selectedStudent.name}</div>
                  </div>
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ 
                      fontWeight: "600", 
                      color: cardDesign.labelColor || '#1a73e8',
                      width: "80px",
                      flexShrink: 0
                    }}>Patient ID:</div>
                    <div style={{ fontWeight: "bold", color: "#d32f2f" }}>
                      DC-{String(students.indexOf(selectedStudent) + 1).padStart(4, '0')}
                    </div>
                  </div>
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ 
                      fontWeight: "600", 
                      color: cardDesign.labelColor || '#1a73e8',
                      width: "80px",
                      flexShrink: 0
                    }}>Grade/Class:</div>
                    <div>{selectedStudent.grade}</div>
                  </div>
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ 
                      fontWeight: "600", 
                      color: cardDesign.labelColor || '#1a73e8',
                      width: "80px",
                      flexShrink: 0
                    }}>Date of Birth:</div>
                    <div>{new Date(selectedStudent.birth_day).toLocaleDateString("en-US")}</div>
                  </div>
                  <div style={{ display: "flex", marginBottom: "4px" }}>
                    <div style={{ 
                      fontWeight: "600", 
                      color: cardDesign.labelColor || '#1a73e8',
                      width: "80px",
                      flexShrink: 0
                    }}>Last Visit:</div>
                    <div>{new Date().toLocaleDateString("en-US")}</div>
                  </div>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: "10px", width: "80px" }}>
                  {selectedStudent.image ? (
                    <img 
                      src={selectedStudent.image} 
                      style={{ 
                        width: "70px", 
                        height: "70px", 
                        objectFit: "cover", 
                        borderRadius: "5px",
                        border: "2px solid #f5f5f5",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        marginBottom: "5px"
                      }} 
                      alt="Student" 
                    />
                  ) : (
                    <div style={{ 
                      width: "50px", 
                      height: "50px", 
                      background: "#e0e0e0", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      color: "#999", 
                      fontSize: "8px",
                      borderRadius: "5px",
                      marginBottom: "5px"
                    }}>
                      PHOTO
                    </div>
                  )}
                  {cardDesign.logo ? (
                    <img 
                      src={cardDesign.logo} 
                      style={{ 
                        width: "70px", 
                        height: "70px", 
                        objectFit: "contain", 
                        border:"15px"
                      }} 
                      alt="Clinic Logo" 
                    />
                  ) : (
                    <div style={{ 
                      width: "40px", 
                      height: "40px", 
                      background: "#f5f5f5", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      color: "#999", 
                      fontSize: "8px",
                      border:"15px"

                    }}>
                      LOGO
                    </div>
                  )}
                </div>
              </div>
              
              {/* Footer */}
              <div style={{
                background: "#f5f5f5",
                padding: "6px 12px",
                fontSize: "8px",
                textAlign: "center",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <div style={{ color: "#d32f2f", fontWeight: "600" }}>EMERGENCY: (123) 456-7890</div>
                <div style={{ color: "#666" }}>Issued: {new Date().toLocaleDateString("en-US")}</div>
              </div>
              
              {/* Decorative Elements */}
              <div style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                opacity: "0.05",
                fontSize: "60px",
                zIndex: "0"
              }}>🦷🦷🦷</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowCardModal(false)}
              className={`px-4 py-2 rounded-lg border ${
                isDark
                  ? "border-gray-600 hover:bg-gray-700"
                  : "border-gray-300 hover:bg-gray-50"
              } transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handlePrintCard}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transition-all shadow-md"
            >
              Print Card
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}