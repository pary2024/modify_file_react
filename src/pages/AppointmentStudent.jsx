import React, { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../colors/Thems';
import { FaPrint, FaPlus, FaSearch, FaCalendarAlt, FaUserMd, FaUser, FaClock, FaInfoCircle } from 'react-icons/fa';
import { MdCancel, MdCheckCircle, MdAccessTime } from 'react-icons/md';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAppointmentStudents } from '../stores/appointmentStudentSlice';
import { fetchDoctors } from '../stores/doctorSlice';
import { fetchStudents } from '../stores/studentSlice';

const AppointmentStudent = () => {
  const { isDark } = useContext(ThemeContext);
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const {studentAppoits} = useSelector((state)=> state.appointmentStudent);
  const {doctors} = useSelector((state)=> state.doctor);
  const {students} = useSelector((state)=>state.student);
  const [form, setForm] = useState({
    user_id: '',
    student_id: '',
    doctor_id: '',
    date: '',
    time_in: '',
    time_out: '',
    status: 'Pending',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [expandedAppointment, setExpandedAppointment] = useState(null);
 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch appointments and doctors on component mount
  useEffect(() => {
    dispatch(fetchAppointmentStudents());
    dispatch(fetchDoctors());
    dispatch(fetchStudents());

  }, [dispatch]);

 

  

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { user_id, student_id, doctor_id, date, time_in, time_out } = form;
    if (user_id && student_id && doctor_id && date && time_in && time_out) {
      try {
        const response = await axios.post('/api/appointments', {
          ...form,
          status: 'Pending',
        });
        setAppointments([...appointments, response.data.appointment]);
        setForm({
          user_id: '',
          student_id: '',
          doctor_id: '',
          date: '',
          time_in: '',
          time_out: '',
          status: 'Pending',
        });
        setSuccess('Appointment scheduled successfully!');
        setError(null);
      } catch (err) {
        setError(err.response?.data?.errors || 'Failed to schedule appointment');
        setSuccess(null);
      }
    } else {
      setError('Please fill in all required fields');
      setSuccess(null);
    }
  };

  const handlePrint = (appointment) => {
    const doctor = doctors.find(d => d.id === appointment.doctor_id) || {};
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const html = `
      <html>
        <head>
          <title>Appointment Receipt #${appointment.id}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, sans-serif;
              padding: 30px;
              background: #f4f4f4;
              font-size: ${fontSize}px;
              margin: 0;
            }
            .receipt-box {
              width: 800px;
              margin: auto;
              background: white;
              padding: 20px 30px;
              border: 1px solid #ddd;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #002D62;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #002D62;
              margin: 10px 0 5px 0;
            }
            .header p {
              margin: 5px 0;
              color: #555;
            }
            .info-section {
              display: flex;
              justify-content: space-between;
              margin: 20px 0;
            }
            .info-box {
              width: 48%;
            }
            .info-box h3 {
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              color: #002D62;
            }
            .info-row {
              display: flex;
              margin: 8px 0;
            }
            .info-label {
              font-weight: bold;
              width: 120px;
            }
            .info-value {
              flex: 1;
            }
            .appointment-details {
              margin: 25px 0;
            }
            .appointment-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
            }
            .appointment-table th, .appointment-table td {
              border: 1px solid #ddd;
              padding: 10px;
              text-align: left;
            }
            .appointment-table th {
              background-color: #002D62;
              color: white;
            }
            .status-badge {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 0.9em;
              font-weight: bold;
            }
            .pending {
              background-color: #FFF3CD;
              color: #856404;
            }
            .confirmed {
              background-color: #D4EDDA;
              color: #155724;
            }
            .completed {
              background-color: #D1ECF1;
              color: #0C5460;
            }
            .cancelled {
              background-color: #F8D7DA;
              color: #721C24;
            }
            .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 0.9em;
              color: #777;
              border-top: 1px solid #ddd;
              padding-top: 15px;
            }
            @media print {
              body {
                background: none;
                padding: 0;
              }
              .receipt-box {
                border: none;
                box-shadow: none;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-box">
            <div class="header">
              <h1>UNIVERSITY HEALTH CENTER</h1>
              <p>123 Campus Drive, University Town, 12345</p>
              <p>Phone: (123) 456-7890 | Email: healthcenter@university.edu</p>
            </div>
            
            <div class="info-section">
              <div class="info-box">
                <h3>Student Information</h3>
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value">${appointment.user?.name || 'N/A'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Student ID:</div>
                  <div class="info-value">${appointment.student.name || 'N/A'}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Appointment ID:</div>
                  <div class="info-value">${appointment.id}</div>
                </div>
              </div>
              
              <div class="info-box">
                <h3>Appointment Details</h3>
                <div class="info-row">
                  <div class="info-label">Date:</div>
                  <div class="info-value">${new Date(appointment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Status:</div>
                  <div class="info-value"><span class="status-badge ${appointment.status.toLowerCase()}">${appointment.status}</span></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Issued On:</div>
                  <div class="info-value">${new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
            
            <div class="appointment-details">
              <h3>Appointment Summary</h3>
              <table class="appointment-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>${doctor.name || 'N/A'}</td>
                    <td>${doctor.speciatly || 'General'}</td>
                    <td>${appointment.date}</td>
                    <td>${appointment.time_in} - ${appointment.time_out}</td>
                    <td>${calculateDuration(appointment.time_in, appointment.time_out)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div class="footer">
              <p>Please bring this receipt and your student ID to your appointment</p>
              <p>Cancel at least 24 hours in advance to avoid no-show fees</p>
              <p>Thank you for using University Health Services</p>
            </div>
          </div>
          
          <script>
            window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const calculateDuration = (timeIn, timeOut) => {
    const [inHours, inMinutes] = timeIn.split(':').map(Number);
    const [outHours, outMinutes] = timeOut.split(':').map(Number);
    
    const totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    return `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`;
  };

  const toggleAppointmentDetails = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

const filteredAppointments = Array.isArray(studentAppoits)
  ? studentAppoits.filter(appt =>
      (appt.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (appt.doctor?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (appt.student_id?.toString().toLowerCase() || '').includes(searchTerm.toLowerCase())
    )
  : [];


  const getStatusIcon = (status) => {
    switch(status) {
      case 'Confirmed':
        return <MdCheckCircle className="text-green-500" />;
      case 'Completed':
        return <MdCheckCircle className="text-blue-500" />;
      case 'Cancelled':
        return <MdCancel className="text-red-500" />;
      default:
        return <MdAccessTime className="text-yellow-500" />;
    }
  };

  return (
    <div className={`p-6 min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Student Health Appointments</h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Manage and schedule your medical appointments
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFontSize((prev)=> Math.max(12, prev - 2))}
                className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                title="Decrease font size"
              >
                <span className="font-bold">A-</span>
              </button>
              <button
                onClick={() => setFontSize((prev) => Math.min(30, prev + 2))}
                className={`p-2 rounded-full ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                title="Increase font size"
              >
                <span className="font-bold">A+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {typeof error === 'object' ? JSON.stringify(error) : error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Search and Filter */}
        <div className={`p-4 rounded-lg shadow mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student, doctor, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'bg-white border-gray-300 focus:border-blue-400'}`}
              />
            </div>
          </div>
        </div>

        {/* Appointment Form */}
        <div className={`p-6 rounded-lg shadow mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaPlus /> Schedule New Appointment
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Student Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="user_id"
                  placeholder="Enter student ID or select"
                  value={form.user_id}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Student ID</label>
              <input
                type="text"
                name="student_id"
                placeholder="STU-001"
                value={form.student_id}
                onChange={handleChange}
                className={`px-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Doctor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUserMd className="text-gray-400" />
                </div>
                <select
                  name="doctor_id"
                  value={form.doctor_id}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                >
                  <option value="">Select a doctor</option>
                  {/* {doctors?.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} ({doctor.department})
                    </option>
                  ))} */}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCalendarAlt className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Time In</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="time_in"
                    value={form.time_in}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Time Out</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="text-gray-400" />
                  </div>
                  <input
                    type="time"
                    name="time_out"
                    value={form.time_out}
                    onChange={handleChange}
                    className={`pl-10 pr-4 py-2 w-full rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <FaPlus /> Schedule Appointment
              </button>
            </div>
          </form>
        </div>

        {/* Appointments List */}
        <div className={`rounded-lg shadow overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appt) => (
                    <React.Fragment key={appt.id}>
                      <tr className={`hover:${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                        <td className="px-6 py-4 whitespace-nowrap">#{appt.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          
                          <div className="text-sm opacity-75">{appt.student.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium">{appt.doctor?.name || 'N/A'}</div>
                          <div className="text-sm opacity-75">{appt.doctor?.department || 'General'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>{new Date(appt.date).toLocaleDateString()}</div>
                          <div className="text-sm opacity-75">{appt.time_in} - {appt.time_out}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(appt.status)}
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              appt.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePrint(appt)}
                              className={`p-2 rounded-lg flex items-center gap-1 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                              title="Print Receipt"
                            >
                              <FaPrint className="text-blue-500" />
                            </button>
                            <button
                              onClick={() => toggleAppointmentDetails(appt.id)}
                              className={`p-2 rounded-lg flex items-center gap-1 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                              title="View Details"
                            >
                              <FaInfoCircle className="text-purple-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedAppointment === appt.id && (
                        <tr>
                          <td colSpan="6" className={`px-6 py-4 ${isDark ? 'bg-gray-750' : 'bg-gray-50'}`}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2">Appointment Details</h4>
                                <div className="space-y-2">
                                  <p><span className="font-medium">Duration:</span> {calculateDuration(appt.time_in, appt.time_out)}</p>
                                  <p><span className="font-medium">Created:</span> {new Date(appt.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center">
                      No appointments found. Schedule a new one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentStudent;