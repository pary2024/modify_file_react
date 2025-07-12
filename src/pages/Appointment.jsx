import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import { createAppointmentPatient, fetchAppointmentPatients } from "../stores/appointmentPatientSlice";
import { fetchDoctors } from "../stores/doctorSlice";
import { fetchPatients } from "../stores/patientSlice";
import { ToastContainer,  toast } from 'react-toastify';

const Appointment = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { appointmentPatients, loading, error } = useSelector(
    (state) => state.appointmentPatient
  );
  const { doctors } = useSelector((state) => state.doctor);
  const { patients } = useSelector((state) => state.patient);
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientId , setPatientId] = useState('');
  const [doctorId , setDoctorId] = useState('');
  const [date , setDate] = useState('');
  const [time_in , setTimeIn] = useState('');
  const [time_out , setTimeOut] = useState('');
  const [status , setStatus] = useState('comfirmed');
 
  useEffect(() => {
    dispatch(fetchAppointmentPatients());
    dispatch(fetchDoctors());
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleSave =async(e)=>{
    e.preventDefault();

    const data = {
      patient_id: patientId,
      doctor_id: doctorId,
      date: date,
      time_in: time_in,
      time_out: time_out,
      status: status

    }
    if (!patientId || !doctorId || !date || !time_in || !time_out || !status) {
    console.log("Error: All fields are required");
    return;
  }
    try {
      await dispatch(createAppointmentPatient(data)); 
      dispatch(fetchAppointmentPatients());
      toast.success('Appointment created successfully!', { position: "top-right" });
      setPatientId('');
      setDoctorId('');
      setDate('');
      setTimeIn('');
      setTimeOut('');
      setStatus('');

    }catch(e){
      toast.error(`Error creating appointment: ${e.message}`, { position: "top-right" });
      
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseDetails = () => {
    setSelectedAppointment(null);
  };

  const handlePrintInvoice = (appointment) => {
    // Handle services (optional, not in $fillable)
    const services = Array.isArray(appointment.services)
      ? appointment.services
      : [];
    const servicesTotal = services.reduce(
      (sum, service) =>
        sum + Number(service.price || 0) * Number(service.qty || 0),
      0
    );

    // Use fields from $fillable directly
    const userName = appointment.user?.name || "Unknown";
    const patientName = appointment.patient?.name || "Unknown";
    const doctorName = appointment.doctor?.name || "Unknown";
    const date = appointment.date || "N/A";
    const timeIn = appointment.time_in || "N/A";
    const timeOut = appointment.time_out || "N/A";
    const status = appointment.status || "N/A";

    // Optional fields (not in $fillable, provide fallbacks)
    const patientAge = appointment.patient_age || "N/A";
    const patientPhone = appointment.patient_phone || "N/A";
    const diagnosis = appointment.diagnosis || "N/A";
    const treatment = appointment.treatment || "N/A";

    const printWindow = window.open("", "_blank", "width=900,height=700");
    const html = `
      <html>
        <head>
          <title>Dental Invoice #${appointment.id}</title>
          <style>
            body {
              font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #ffffff;
              color: #1a1a1a;
              line-height: 1.5;
              font-size: 14px;
            }
            .invoice-box {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              border: 1px solid #d1d5db;
              border-radius: 12px;
              background: #ffffff;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 3px solid #2563eb;
              padding-bottom: 15px;
              margin-bottom: 25px;
            }
            .header-left {
              max-width: 50%;
            }
            .header-left img.logo {
              max-width: 180px;
              height: auto;
              margin-bottom: 10px;
            }
            .header-right {
              text-align: right;
            }
            .header-right h1 {
              margin: 0;
              color: #2563eb;
              font-size: 2em;
              font-weight: 700;
            }
            .info-section {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 25px;
              font-size: 0.95em;
            }
            .info-section p {
              margin: 4px 0;
              color: #374151;
            }
            .info-section strong {
              color: #1f2937;
              font-weight: 600;
            }
            h3 {
              color: #2563eb;
              font-size: 1.3em;
              font-weight: 600;
              margin: 25px 0 15px;
              text-align: center;
              text-transform: uppercase;
              letter-spacing: 0.05em;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 0.9em;
            }
            th, td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid #e5e7eb;
            }
            th {
              background: #2563eb;
              color: #ffffff;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 0.85em;
            }
            td {
              background: #f9fafb;
              color: #374151;
            }
            .totals {
              float: right;
              width: 35%;
              margin-top: 20px;
              font-size: 0.95em;
            }
            .totals table {
              margin: 0;
            }
            .totals td {
              text-align: right;
              padding: 8px 12px;
              color: #1f2937;
            }
            .totals tr:last-child td {
              font-weight: 700;
              border-top: 2px solid #2563eb;
              padding-top: 12px;
            }
            .signature-section {
              display: flex;
              justify-content: space-between;
              margin-top: 60px;
              font-size: 0.9em;
              color: #4b5563;
            }
            .signature-section div {
              width: 45%;
              text-align: center;
              border-top: 1px solid #d1d5db;
              padding-top: 12px;
            }
            .footer-note {
              margin-top: 30px;
              text-align: center;
              font-size: 0.85em;
              color: #6b7280;
            }
            .footer-note p {
              margin: 5px 0;
            }
            .no-services {
              text-align: center;
              color: #6b7280;
              font-style: italic;
              padding: 20px;
            }
            @media print {
              body {
                padding: 0;
                background: none;
              }
              .invoice-box {
                border: none;
                box-shadow: none;
                padding: 20px;
              }
              .no-print {
                display: none;
              }
            }
            @media screen and (max-width: 600px) {
              .header {
                flex-direction: column;
                align-items: flex-start;
                gap: 15px;
              }
              .header-right {
                text-align: left;
              }
              .info-section {
                grid-template-columns: 1fr;
              }
              .totals {
                width: 100%;
              }
              .invoice-box {
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="header-left">
                <img src="https://via.placeholder.com/180x60?text=Logo" alt="Dental Care Clinic Logo" class="logo">
                <p style="font-weight: 700; font-size: 1.2em;">Dental Care Clinic</p>
                <p>123 Street Name, Phnom Penh, Cambodia</p>
                <p>Phone: 012 345 678 | Email: info@dentalcare.com</p>
              </div>
              <div class="header-right">
                <h1>INVOICE</h1>
                <p><strong>Invoice #:</strong> ${appointment.id}</p>
                <p><strong>Date:</strong> ${date}</p>
                <p><strong>Status:</strong> ${status}</p>
              </div>
            </div>

            <div class="info-section">
              <div>
                <p><strong>Patient:</strong> ${patientName} (ID: ${
      appointment.patient_id || "N/A"
    })</p>
                <p><strong>Age:</strong> ${patientAge}</p>
                <p><strong>Phone:</strong> ${patientPhone}</p>
              </div>
              <div>
                <p><strong>Dentist:</strong> ${doctorName} (ID: ${
      appointment.doctor_id || "N/A"
    })</p>
                <p><strong>Appointment Time:</strong> ${timeIn} - ${timeOut}</p>
                <p><strong>User:</strong> ${userName} (ID: ${
      appointment.user_id || "N/A"
    })</p>
              </div>
            </div>

            ${
              diagnosis !== "N/A" || treatment !== "N/A"
                ? `
                  <div>
                    <p><strong>Diagnosis:</strong> ${diagnosis}</p>
                    <p><strong>Treatment:</strong> ${treatment}</p>
                  </div>
                `
                : ""
            }

         <h3>Appointments</h3>
<h3>Appointment Summary</h3>
<table>
  <thead>
    <tr>
      <th>Patient</th>
      <th>Doctor</th>
      <th>Date</th>
      <th>Time In</th>
      <th>Time Out</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>${patientName}</td>
      <td>${doctorName}</td>
      <td>${date}</td>
      <td>${timeIn}</td>
      <td>${timeOut}</td>
      <td>${status}</td>
    </tr>
  </tbody>
</table>



            ${
              services.length > 0
                ? `
                  <div class="totals">
                    <table>
                      <tr>
                        <td>Subtotal:</td>
                        <td>$${servicesTotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td>Discount:</td>
                        <td>$0.00</td>
                      </tr>
                      <tr>
                        <td>Total:</td>
                        <td>$${servicesTotal.toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>
                  <div style="clear: both;"></div>
                `
                : ""
            }

            <div class="signature-section">
              <div>
                <p>Patient's Signature</p>
              </div>
              <div>
                <p>Dentist's Signature</p>
              </div>
            </div>

            <div class="footer-note">
              <p><strong>Thank you for choosing Dental Care Clinic!</strong></p>
              <p>Please schedule your next checkup in 6 months.</p>
              <p class="no-print">This is a digital copy. Print or save as needed.</p>
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
 

 

 return (
  <div
    className={`min-h-screen p-4 md:p-8 transition-colors duration-200 ${
      isDark ? "bg-gray-900 text-gray-100" : "bg-blue-50 text-gray-800"
    }`}
    
  >
    <ToastContainer position="top-center" autoClose={3000} theme={isDark ? "dark" : "light"} />
    
    <div className=" mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Dental Appointment Manager
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Manage patient appointments and schedules
          </p>
        </div>
         
        
         
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-8">

        <button
          className={`py-3 px-6 font-medium transition-all duration-200 relative ${
            activeTab === "appointments"
              ? isDark
                ? "text-teal-400"
                : "text-teal-600"
              : isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
          {activeTab === "appointments" && (
            <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? "bg-teal-400" : "bg-teal-600"}`}></span>
          )}
        </button>
        <button
          className={`py-3 px-6 font-medium transition-all duration-200 relative ${
            activeTab === "new"
              ? isDark
                ? "text-teal-400"
                : "text-teal-600"
              : isDark
              ? "text-gray-400 hover:text-gray-200"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("new")}
        >
          New Appointment
          {activeTab === "new" && (
            <span className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDark ? "bg-teal-400" : "bg-teal-600"}`}></span>
          )}
        </button>
      </div>

      {activeTab === "appointments" ? (
        <div
          className={`rounded-xl shadow-lg overflow-hidden border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="overflow-x-auto">
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={isDark ? "bg-gray-700" : "bg-blue-50"}>
                <tr>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">ID</th>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">Patient</th>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">Doctor</th>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">Date</th>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">Time</th>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-left font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
                {appointmentPatients.map((appt) => (
                  <tr
                    key={appt.id}
                    className={`transition ${isDark ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}
                  >
                    <td className="py-4 px-6 whitespace-nowrap">{appt.id}</td>
                    <td className="py-4 px-6">{appt.patient?.name || "N/A"}</td>
                    <td className="py-4 px-6">{appt.doctor?.name || "N/A"}</td>
                    <td className="py-4 px-6 whitespace-nowrap">{appt.date}</td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {appt.time_in} - {appt.time_out}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          appt.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : appt.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(appt)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          View
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(appt)}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-lg text-sm flex items-center transition"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                            />
                          </svg>
                          Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-xl shadow-lg p-6 border ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2 text-teal-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Dental Appointment
          </h2>
         
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block mb-2 font-medium">Patient</label>
                <select
                  name="patient_id"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select a patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Dentist</label>
                <select
                  name="doctor_id"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                >
                  <option value="">Select a dentist</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Date</label>
                <input
                  type="date"
                  name="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Start Time</label>
                <input
                  type="time"
                  name="time_in"
                  value={time_in}
                  onChange={(e) => setTimeIn(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">End Time</label>
                <input
                  type="time"
                  name="time_out"
                  value={time_out}
                  onChange={(e) => setTimeOut(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  required
                />
              </div>
              
              <div>
                <label className="block mb-2 font-medium">Status</label>
                <select
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full p-3 border rounded-lg transition focus:ring-2 focus:ring-teal-500 focus:border-teal-500 ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="">Select status</option>
                  <option value="comfirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto ${
              isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            } border`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                Appointment Details
              </h2>
              <button
                onClick={handleCloseDetails}
                className={`p-2 rounded-full transition ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Appointment ID</p>
                <p className="text-lg font-semibold">{selectedAppointment.id}</p>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Status</p>
                <p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedAppointment.status === "Confirmed"
                        ? "bg-green-100 text-green-800"
                        : selectedAppointment.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </p>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Patient</p>
                <p className="text-lg">{selectedAppointment.patient?.name || "N/A"}</p>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Dentist</p>
                <p className="text-lg">{selectedAppointment.doctor?.name || "N/A"}</p>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Date</p>
                <p className="text-lg">{selectedAppointment.date}</p>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-lg">
                <p className="font-medium text-blue-800 mb-1">Time Slot</p>
                <p className="text-lg">
                  {selectedAppointment.time_in} - {selectedAppointment.time_out}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCloseDetails}
                className={`px-6 py-2 rounded-lg font-medium transition ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                }`}
              >
                Close
              </button>
              <button
                onClick={() => handlePrintInvoice(selectedAppointment)}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
};

export default Appointment;
