import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';

const AppointmentStudent = () => {
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
        font-family: 'Khmer OS Battambang', 'Segoe UI', Tahoma, sans-serif;
        padding: 30px;
        background: #f4f4f4;
        font-size: ${fontSize}px;
        margin: 0;
      }
      .invoice-box {
        width: 800px;
        margin: auto;
        background: white;
        padding: 20px 30px; /* reduced padding */
        border: 1px solid #ddd;
        page-break-inside: avoid;
        page-break-after: avoid;
        page-break-before: avoid;
      }
      .header, .footer, .header-info, table, .totals, .signature, .footer-note {
        page-break-inside: avoid !important;
        page-break-after: avoid !important;
        page-break-before: avoid !important;
      }
      .header img {
        height: 60px;
        margin-bottom: 10px;
      }
      .header-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
      }
      .header-left, .header-right {
        width: 48%;
      }
      .header-left p, .header-right p {
        margin: 2px 0;
        line-height: 1.1;
      }
      .header-left {
        text-align: left;
      }
      .header-right {
        text-align: right;
      }
      h3 {
        text-align: center;
        color:#002D62;
        margin: 15px 0 15px 0;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      th, td {
        border: 1px solid #333;
        padding: 6px 5px;
        text-align: center;
        line-height: 1.1;
      }
      th {
        background: #002D62;
        color: white;
      }
      .footer-note {
        margin-top: 20px;
        font-size: 11px;
        color: #444;
      }
      .footer-note ul {
        padding-left: 18px;
        margin: 5px 0;
      }
      .totals {
        margin-top: 10px;
        width: 300px;
        float: right;
      }
      .totals td {
        text-align: right;
        padding: 4px 8px;
      }
      .signature {
        margin-top: 50px;
        display: flex;
        justify-content: space-between;
      }
      .signature div {
        text-align: center;
        width: 45%;
      }
      @media print {
        body {
          background: none;
          padding: 0;
          margin: 0;
        }
        .invoice-box {
          border: none;
          box-shadow: none;
          page-break-after: avoid;
          page-break-before: avoid;
          page-break-inside: avoid;
        }
        table, tr, td, th {
      
          page-break-inside: avoid !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="invoice-box">
      <div class="header">
        <img src="https://i.imgur.com/FlZ3xWn.png" alt="Logo" />
        <div class="header-info">
          <div class="header-left">
            <p>ប្រទេសកម្ពុជា | Cambodia</p>
            <p><strong>វិក្កយបត្រ | Invoice No:</strong> ${appointment.id}</p>
            <p><strong>កាលបរិច្ឆេទ | Date:</strong> ${appointment.date}</p>
          </div>
          <div class="header-right">
            <p>ឈ្មោះអតិថិជន | Customer Name: ${appointment.patient}</p>
            <p>លេខកូដអតិថិជន | Code: ####</p>
            <p>ទូរស័ព្ទ | Phone: ####</p>
           
          </div>
        </div>
      </div>

      <h3>វិក្កយបត្រ (INVOICE)</h3>

      <table>
        <thead>
          <tr>
            <th>ល.រ<br>No.</th>
            <th>ឈ្មោះអ្នកជំងឺ</th>
            <th>គ្រូពេទ្យ</th>
            <th>Time In</th>
            <th>Time Out</th>
            
           
          </tr>
        </thead>
        <tbody>
      <tr>
      <td>1</td>
       <td>leak</td>
       <td>leakna</td>
       <td>22/03/2025</td>
       <td>22/03/2025</td>
       
      

       </tr>

        <tr>
      <td>1</td>
       <td>dd</td>
       <td>leakna</td>
       <td>11/03/2025</td>
       <td>12/03/2025</td>
       
       </tr>

         
        </tbody>
      </table>

     

      <div style="clear: both;"></div>

      <div class="footer-note">
        <strong>Terms And Conditions</strong>
        <ul>
          <li>សូមធ្វើការទូទាត់នៅពេលទទួលបានវិក្កយបត្រ</li>
          <li>មិនអាចដូរទំនិញដែលទិញរួចបាន</li>
          <li>សូមអរគុណសម្រាប់ការជាវជ្រើសរើសជាមួយយើង</li>
        </ul>
      </div>

      <div class="signature">
        <div>ហត្ថលេខាអតិថិជន និងឈ្មោះ <br/> Customer's Signature & Name</div>
        <div>ហត្ថលេខាអ្នកលក់ និងឈ្មោះ <br/> Seller's Signature & Name</div>
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
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      {/* Heading with font size controls */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Appointments for Student</h2>
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
              <th className="p-3">Student</th>
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

export default AppointmentStudent;
