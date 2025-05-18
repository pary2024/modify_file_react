import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';

const Sms = () => {
  const { isDark } = useContext(ThemeContext);
  const [patients] = useState([
    { id: 1, name: 'John Doe', phone: '1234567890' },
    { id: 2, name: 'Jane Roe', phone: '0987654321' },
  ]);

  const [selectedPatient, setSelectedPatient] = useState('');
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');

  const templates = {
    reminder: 'Hello {patientName}, this is a reminder for your appointment on {date} at {time}.',
    followup: 'Dear {patientName}, we hope your visit went well. Please reach out if you need any assistance.',
    custom: '',
  };

  const handleTemplateChange = (e) => {
    const temp = e.target.value;
    setTemplate(temp);
    const selected = templates[temp] || '';
    setMessage(selected);
  };

  const handleSend = () => {
    if (!selectedPatient || !message) return alert('Fill all fields');
    const patient = patients.find((p) => p.id === parseInt(selectedPatient));
    const finalMessage = message
      .replace('{patientName}', patient.name)
      .replace('{date}', '2025-05-20')
      .replace('{time}', '10:00 AM');

    alert(`Sending to ${patient.phone}: ${finalMessage}`);
    // Integrate real SMS API here
  };

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-4">Send SMS</h2>

      {/* Form */}
      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4`}>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={template}
          onChange={handleTemplateChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
        >
          <option value="">Select Template</option>
          <option value="reminder">Appointment Reminder</option>
          <option value="followup">Follow-up</option>
          <option value="custom">Custom</option>
        </select>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          className={`col-span-full border p-2 rounded ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          placeholder="Type your message here..."
        ></textarea>

        <button
          onClick={handleSend}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 w-[100px]"
        >
          Send SMS
        </button>
      </div>
    </div>
  );
};

export default Sms;
