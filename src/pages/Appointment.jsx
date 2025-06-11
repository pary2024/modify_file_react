import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../colors/Thems";
import { useDispatch, useSelector } from "react-redux";
import { createAppointmentPatient, fetchAppointmentPatients } from "../stores/appointmentPatientSlice";
import { fetchDoctors } from "../stores/doctorSlice";
import { fetchPatients } from "../stores/patientSlice";

const Appointment = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { appointmentPatients, loading, error } = useSelector(
    (state) => state.appointmentPatient
  );
  const { doctors } = useSelector((state) => state.doctor);
  const { patients } = useSelector((state) => state.patient);

  const [fontSize, setFontSize] = useState(14);
  const [activeTab, setActiveTab] = useState("appointments");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientId , setPatientId] = useState('');
  const [doctorId , setDoctorId] = useState('');
  const [date , setDate] = useState('');
  const [time_in , setTimeIn] = useState('');
  const [time_out , setTimeOut] = useState('');
  const [status , setStatus] = useState('comfirmed');
  const [message , setMessage] = useState('');

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
      setMessage("Appointment created successfully");
     setTimeout(() => {
          setMessage("");
        }, 3000); 
      dispatch(fetchAppointmentPatients());


    }catch(e){
      console.log(e)
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
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!appointmentPatients || appointmentPatients.length === 0) {
    return <div>No appointments available.</div>;
  }

  return (
    <div
      className={`min-h-screen p-4 md:p-8 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
       {message && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 border border-green-400 rounded">
          {message}
        </div>
      )}
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-0">
            Appointment Management
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFontSize((f) => Math.max(12, f - 1))}
                className={`px-3 py-1 rounded ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                A-
              </button>
              <span className="text-sm">Font: {fontSize}px</span>
              <button
                onClick={() => setFontSize((f) => Math.min(20, f + 1))}
                className={`px-3 py-1 rounded ${
                  isDark
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                A+
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "appointments"
                ? isDark
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
            onClick={() => setActiveTab("appointments")}
          >
            Appointments
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === "new"
                ? isDark
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "border-b-2 border-blue-600 text-blue-600"
                : ""
            }`}
            onClick={() => setActiveTab("new")}
          >
            New Appointment
          </button>
        </div>

        {activeTab === "appointments" ? (
          <div
            className={`rounded-lg shadow overflow-hidden ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={isDark ? "bg-gray-700" : "bg-gray-100"}>
                  <tr>
                    <th className="py-3 px-4 text-left">ID</th>
                    <th className="py-3 px-4 text-left">User</th>
                    <th className="py-3 px-4 text-left">Patient</th>
                    <th className="py-3 px-4 text-left">Doctor</th>
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Time</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointmentPatients.map((appt) => (
                    <tr
                      key={appt.id}
                      className={`border-t ${
                        isDark
                          ? "border-gray-700 hover:bg-gray-700"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <td className="py-3 px-4">{appt.id}</td>
                      <td className="py-3 px-4">{appt.user?.name || "N/A"}</td>
                      <td className="py-3 px-4">
                        {appt.patient?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {appt.doctor?.name || "N/A"}
                      </td>
                      <td className="py-3 px-4">{appt.date}</td>
                      <td className="py-3 px-4">
                        {appt.time_in} - {appt.time_out}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
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
                      <td className="py-3 px-4 flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(appt)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(appt)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Invoice
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div
            className={`rounded-lg shadow p-6 ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold mb-6">New Appointment</h2>
            <form onSubmit={ handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
               
                <div>
                  <label className="block mb-2 font-medium">Patient</label>
                  <select
                    name="patient_id"
                    value={patientId}
                    onChange={(e)=> setPatientId(e.target.value)}
                    className={`w-full p-2 border rounded ${
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
                  <label className="block mb-2 font-medium">Doctor</label>
                  <select
                    name="doctor_id"
                    value={doctorId}
                    onChange={(e)=> setDoctorId(e.target.value)}
                    className={`w-full p-2 border rounded ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  >
                    <option value="">Select a doctor</option>
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
                    onChange={(e)=> setDate(e.target.value)}
                    className={`w-full p-2 border rounded ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Time In</label>
                  <input
                    type="time"
                    name="time_in"
                    value={time_in}
                    onChange={(e)=> setTimeIn(e.target.value)}

                    className={`w-full p-2 border rounded ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Time Out</label>
                  <input
                    type="time"
                    name="time_out"
                    value={time_out}
                    onChange={(e)=> setTimeOut(e.target.value)}
                    className={`w-full p-2 border rounded ${
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
                    onChange={(e)=> setStatus(e.target.value)}
                    className={`w-full p-2 border rounded ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option>select status</option>
                    <option value="comfirmed">comfirmed</option>
                    <option value="pending">pending</option>
                  
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-medium"
                >
                  Create Appointment
                </button>
              </div>
            </form>
          </div>
        )}

        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`rounded-lg shadow-lg p-6 w-full max-w-2xl ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Appointment Details</h2>
                <button
                  onClick={handleCloseDetails}
                  className={`p-2 rounded-full ${
                    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="font-medium">Appointment ID:</p>
                  <p>{selectedAppointment.id}</p>
                </div>
                <div>
                  <p className="font-medium">User:</p>
                  <p>{selectedAppointment.user?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Patient:</p>
                  <p>{selectedAppointment.patient?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Doctor:</p>
                  <p>{selectedAppointment.doctor?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="font-medium">Date:</p>
                  <p>{selectedAppointment.date}</p>
                </div>
                <div>
                  <p className="font-medium">Time:</p>
                  <p>
                    {selectedAppointment.time_in} -{" "}
                    {selectedAppointment.time_out}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Status:</p>
                  <p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
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
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleCloseDetails}
                  className={`px-4 py-2 rounded font-medium ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Close
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
