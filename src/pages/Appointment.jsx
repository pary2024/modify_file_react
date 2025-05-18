import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';

const Appointment = () => {
  const { isDark } = useContext(ThemeContext);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patient: 'John Doe',
      doctor: 'Dr. Smith',
      date: '2025-05-20',
      timeIn: '10:00',
      timeOut: '10:45',
      status: 'Pending',
    },
    {
      id: 2,
      patient: 'Jane Roe',
      doctor: 'Dr. Adams',
      date: '2025-05-21',
      timeIn: '11:30',
      timeOut: '12:15',
      status: 'Confirmed',
    },
  ]);

  const [form, setForm] = useState({
    patient: '',
    doctor: '',
    date: '',
    timeIn: '',
    timeOut: '',
  });

  const [fontSize, setFontSize] = useState(16); // Font size for invoice

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { patient, doctor, date, timeIn, timeOut } = form;
    if (patient && doctor && date && timeIn && timeOut) {
      const newAppointment = {
        id: appointments.length + 1,
        ...form,
        status: 'Pending',
      };
      setAppointments([...appointments, newAppointment]);
      setForm({
        patient: '',
        doctor: '',
        date: '',
        timeIn: '',
        timeOut: '',
      });
    }
  };

  const handlePrint = (appointment) => {
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const html = `
      <html>
        <head>
          <title>Invoice #${appointment.id}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              font-size: ${fontSize}px;
            }
            h2 { color: #2563eb; }
            .invoice-box {
              max-width: 600px;
              margin: auto;
              padding: 30px;
              border: 1px solid #eee;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
            }
            .details {
              margin-top: 20px;
              line-height: 1.6;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #777;
            }
            .teeth-image {
              display: block;
              margin: 0 auto 20px auto;
              width: 100px;
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <img class="teeth-image" src="https://cdn-icons-png.flaticon.com/512/2840/2840170.png" alt="Teeth Icon" />
            <h2>Appointment Invoice</h2>
            <div class="details">
              <p><strong>Invoice ID:</strong> ${appointment.id}</p>
              <p><strong>Patient:</strong> ${appointment.patient}</p>
              <p><strong>Doctor:</strong> ${appointment.doctor}</p>
              <p><strong>Date:</strong> ${appointment.date}</p>
              <p><strong>Time In:</strong> ${appointment.timeIn}</p>
              <p><strong>Time Out:</strong> ${appointment.timeOut}</p>
              <p><strong>Status:</strong> ${appointment.status}</p>
              <p><strong>Fee:</strong> $50.00</p>
            </div>
            <div class="footer">
              Printed on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
            </div>
          </div>
          <script>
            window.print();
            window.onafterprint = function() { window.close(); };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Heading with font size controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Appointments</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setFontSize((prev) => Math.max(12, prev - 2))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize((prev) => Math.min(30, prev + 2))}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            A+
          </button>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className={`shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}
      >
        <input
          type="text"
          name="patient"
          placeholder="Patient Name"
          value={form.patient}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="doctor"
          placeholder="Doctor Name"
          value={form.doctor}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          name="timeIn"
          value={form.timeIn}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="time"
          name="timeOut"
          value={form.timeOut}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="col-span-[200px] bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Appointment
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className={`min-w-full shadow rounded ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
          <thead>
            <tr className={`${isDark ? 'bg-gray-700' : 'bg-gray-200'} text-left`}>
              <th className="p-3">#</th>
              <th className="p-3">Patient</th>
              <th className="p-3">Doctor</th>
              <th className="p-3">Date</th>
              <th className="p-3">Time In</th>
              <th className="p-3">Time Out</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id} className="border-t">
                <td className="p-3">{appt.id}</td>
                <td className="p-3">{appt.patient}</td>
                <td className="p-3">{appt.doctor}</td>
                <td className="p-3">{appt.date}</td>
                <td className="p-3">{appt.timeIn}</td>
                <td className="p-3">{appt.timeOut}</td>
                <td className="p-3">{appt.status}</td>
                <td className="p-3">
                  <button
                    onClick={() => handlePrint(appt)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
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
  );
};

export default Appointment;
