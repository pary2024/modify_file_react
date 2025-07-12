import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createDuty, fetchDuty, fetchDutys } from '../stores/dutyDoctorSlice';
import { FaUserMd, FaUser, FaClinicMedical, FaPlus, FaSearch, FaCalendarAlt, FaTimes, FaTeeth, FaUserInjured, FaSave, FaPrint } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import { fetchTreats } from '../stores/treatSlice';
import { fetchDoctors } from '../stores/doctorSlice';
import { fetchPatients } from '../stores/patientSlice';
import { ToastContainer, toast } from 'react-toastify';
const DutyDoctor = () => {
  const dispatch = useDispatch();
  const { duties = [], loading, error } = useSelector((state) => state.duty || {});
  
  const { treats } = useSelector((state) => state.treat || {});
  const { doctors } = useSelector((state) => state.doctor || {});
  const { patients } = useSelector((state) => state.patient || {});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [printDuty, setPrintDuty] = useState(null);
  

  const [patientId, setPatient] = useState('');
  const [doctorId, setDoctor] = useState('');
  const [treatId, setTreat] = useState('');
  const [status, setStatus] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    dispatch(fetchDutys());
    dispatch(fetchTreats());
    dispatch(fetchDoctors());
    dispatch(fetchPatients());   
  }, [dispatch]);

  const handleSave = async () => {
    const data = {
      patient_id: patientId,
      doctor_id: doctorId,
      treat_id: treatId,
      status: status,
      note: note
    }
    try {
      await dispatch(createDuty(data));
      dispatch(fetchDutys());
      toast.success('Duty created successfully!', { position: "top-right" });
      setIsModalOpen(false);
    } catch (e) {
      toast.error(`Error creating duty: ${e.message}`, { position: "top-right" });
    }
  }

  const filteredDuties = Array.isArray(duties)
    ? duties.filter((duty) => {
      const term = searchTerm.trim().toLowerCase();
      return (
        String(duty.doctor_id || '').toLowerCase().includes(term) ||
        String(duty.user_id || '').toLowerCase().includes(term) ||
        String(duty.company_id || '').toLowerCase().includes(term) ||
        String(duty.patient_id || '').toLowerCase().includes(term) ||
        String(duty.treat_id || '').toLowerCase().includes(term)
      );
    })
    : [];

  const handlePrint = (duty) => {
    setPrintDuty(duty);
  };

  const PrintTreatment = ({ duty, onClose }) => {
    if (!duty) return null;

    // Renamed this to avoid conflict with the function below
    const PrintContentComponent = () => {
      return (
        <div className="p-6 max-w-md mx-auto bg-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Dental Clinic</h2>
            <p className="text-gray-600">123 Health Street, Dental City</p>
            <p className="text-gray-600">Phone: (123) 456-7890</p>
          </div>

          <div className="border-b-2 border-gray-200 pb-4 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Treatment Receipt</h3>
            <p className="text-gray-500">Date: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">Patient:</span>
              <span>{duty.patient?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">Doctor:</span>
              <span>Dr. {duty.doctor?.name || 'Unknown'}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">Treatment Date:</span>
              <span>{new Date(duty.created_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Treatment Details</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-gray-700">{duty.note || 'No treatment details provided'}</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-800 mb-2">Next Steps</h4>
            <ul className="list-disc pl-5 text-gray-700">
              <li>Follow any post-treatment care instructions</li>
              <li>Contact us if you experience unusual pain or discomfort</li>
              <li>Schedule your next appointment if needed</li>
            </ul>
          </div>

          <div className="text-center text-sm text-gray-500 mt-8">
            <p>Thank you for choosing our clinic!</p>
            <p>For any questions, please call (123) 456-7890</p>
          </div>
        </div>
      );
    };

  const handlePrint = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow pop-ups for this site to print');
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Treatment Receipt - ${duty.patient?.name || 'Patient'}</title>
        <style>
          * {
            box-sizing: border-box;
            font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
          }
          body {
            margin: 0;
            padding: 20px;
            background: #f5f9ff;
            color: #2d3748;
          }
          .receipt-container {
            max-width: 700px;
            margin: 20px auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            position: relative;
            overflow: hidden;
          }
          
          /* Dental-themed watermark */
          .receipt-container::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" opacity="0.03"><path d="M30 50 Q50 30 70 50 Q50 70 30 50 Z" fill="none" stroke="%233b82f6" stroke-width="1"/></svg>');
            z-index: -1;
          }

          .clinic-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid rgba(59, 130, 246, 0.2);
          }
          .clinic-header h2 {
            margin: 0;
            font-size: 28px;
            color: #1e40af;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .clinic-header p {
            margin: 5px 0 0;
            font-size: 15px;
            color: #4b5563;
          }
          .clinic-contact {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 10px;
            font-size: 14px;
            color: #6b7280;
          }

          .section {
            margin-bottom: 25px;
          }

          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 15px;
            padding-bottom: 5px;
            border-bottom: 2px solid #ebf2ff;
            display: flex;
            align-items: center;
          }
          .section-title::before {
            content: "";
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #3b82f6;
            border-radius: 50%;
            margin-right: 10px;
          }

          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 15px;
          }
          .info-row.highlight {
            background: #f0f7ff;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 15px -12px;
          }

          .label {
            font-weight: 600;
            color: #374151;
            min-width: 120px;
          }
          .value {
            color: #4b5563;
            text-align: right;
          }
          .value.important {
            color: #1e40af;
            font-weight: 600;
          }

          .treatment-details {
            background: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            font-size: 15px;
            color: #374151;
            white-space: pre-line;
            line-height: 1.6;
            border-left: 4px solid #3b82f6;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 14px;
            color: #6b7280;
          }
          .footer-note {
            background: #f0fdf4;
            color: #166534;
            padding: 12px;
            border-radius: 8px;
            margin: 20px 0;
            border: 1px solid #bbf7d0;
            font-size: 14px;
          }
          .signature-area {
            display: flex;
            justify-content: space-between;
            margin-top: 50px;
          }
          .signature {
            text-align: center;
            width: 45%;
          }
          .signature-line {
            height: 1px;
            background: #cbd5e0;
            margin: 40px auto 10px;
            width: 80%;
          }

          @media print {
            body {
              background: white;
              padding: 0;
            }
            .receipt-container {
              box-shadow: none;
              border-radius: 0;
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="clinic-header">
            <h2>BrightSmile Dental Clinic</h2>
            <p>Specialized Dental Care & Cosmetic Dentistry</p>
            <div class="clinic-contact">
              <span>123 Health Street, Dental City</span>
              <span>Phone: (123) 456-7890</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Treatment Receipt</div>
            <div class="info-row">
              <div class="label">Receipt Date:</div>
              <div class="value important">${new Date().toLocaleDateString()}</div>
            </div>
            <div class="info-row">
              <div class="label">Receipt No:</div>
              <div class="value important">#${duty.id || '0000'}</div>
            </div>
            <div class="info-row">
              <div class="label">លេខធ្មេញ:</div>
              <div class="value important">..............</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Patient Information</div>
            <div class="info-row highlight">
              <div class="label">Patient Name:</div>
              <div class="value important">${duty.patient?.name || 'Unknown'}</div>
            </div>
           
          </div>

          <div class="section">
            <div class="section-title">Treatment Information</div>
            <div class="info-row">
              <div class="label">Dentist:</div>
              <div class="value important">Dr. ${duty.doctor?.name || 'Unknown'}</div>
            </div>
            <div class="info-row">
              <div class="label">Treatment Date:</div>
              <div class="value">${new Date(duty.created_at).toLocaleDateString()}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Treatment Details</div>
            <div class="treatment-details">
              ${duty.note || 'No treatment details provided'}
            </div>
          </div>

          <div class="footer-note">
            <strong>Next Appointment:</strong> Please schedule your follow-up visit for complete care
          </div>

          <div class="footer">
            ចំណាំ! ត្រូវមកតាមការណាត់ជូប: ថ្ងៃទី.......ខែ......ឆ្នាំ.......។<br>
            វេលាម៉ោង:..............។
          </div>

          <div class="signature-area">
            <div class="signature">
              <div class="signature-line"></div>
              <p>Patient's Signature</p>
            </div>
            <div class="signature">
              <div class="signature-line"></div>
              <p>Dentist's Signature</p>
            </div>
          </div>

          <div class="footer">
            Thank you for choosing BrightSmile Dental Clinic<br>
            For emergencies: (123) 456-7890 (24/7)
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 300);
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};


    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-lg font-semibold">Print Treatment Report</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>
          <div className="p-4">
            <PrintContentComponent />
          </div>
          <div className="flex justify-end space-x-3 p-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                handlePrint();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <FaPrint className="mr-2" />
              Print
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CreateDutyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">

          {/* Header */}
          <div className="flex justify-between items-center border-b border-teal-100 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-t-xl">
            <h3 className="text-xl font-semibold text-teal-800">
              <FaTeeth className="inline mr-2" />
              New Dental Duty Assignment
            </h3>
            <button
              onClick={onClose}
              className="text-teal-600 hover:text-teal-800 transition-colors duration-200 p-1 rounded-full hover:bg-teal-100"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave}>
            <div className="p-5 space-y-5">
              {/* Doctor Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-teal-700 mb-1 ml-1">Dentist</label>
                <div className="relative">
                  <select
                    name="doctor_id"
                    value={doctorId}
                    onChange={(e) => setDoctor(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all appearance-none"
                  >
                    <option value="">Select a dentist</option>
                    {doctors?.map((doc) => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </select>
                  <FaUserMd className="absolute left-3 top-3 text-teal-400 pointer-events-none" />
                </div>
              </div>

              {/* Patient Select */}
              <div className="relative">
                <label className="block text-sm font-medium text-teal-700 mb-1 ml-1">Patient</label>
                <div className="relative">
                  <select
                    name="patient_id"
                    value={patientId}
                    onChange={(e) => setPatient(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all appearance-none"
                  >
                    <option value="">Select a patient</option>
                    {patients?.map((patient) => (
                      <option key={patient.id} value={patient.id}>{patient.name}</option>
                    ))}
                  </select>
                  <FaUserInjured className="absolute left-3 top-3 text-teal-400 pointer-events-none" />
                </div>
              </div>

              {/* Treatment Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Treatments (select or type) <span className="text-red-500">*</span>
                </label>
                <select
                  name="treat_id"
                  value={treatId}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    setTreat(selectedId);

                    if (selectedId === "other") return;

                    const selectedTreatment = treats.find(
                      (t) => t.id.toString() === selectedId
                    );

                    if (selectedTreatment) {
                      setNote((prev) => {
                        const alreadyIncluded = prev.includes(selectedTreatment.name);
                        return alreadyIncluded
                          ? prev
                          : prev.trim()
                          ? `${prev.trim()}, ${selectedTreatment.name}`
                          : selectedTreatment.name;
                      });
                    }
                  }}
                  className="w-full pl-3 pr-3 py-2.5 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all"
                >
                  <option value="" disabled>Select treatment</option>
                  {treats.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Note / Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  rows={3}
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all resize-none"
                  placeholder="Treatment name will appear here or type your custom treatment"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-teal-700 mb-1 ml-1">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    value="in progress"
                    onClick={(e) => setStatus(e.target.value)}
                    className={`py-2 px-3 border rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                      status === "in_progress"
                        ? "border-amber-400 bg-amber-100 text-amber-800"
                        : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    value="complete"
                    onClick={(e) => setStatus(e.target.value)}
                    className={`py-2 px-3 border rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-300 ${
                      status === "completed"
                        ? "border-emerald-400 bg-emerald-100 text-emerald-800"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    Completed
                  </button>
                </div>
                <input type="hidden" name="status" value={status} />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-5 border-t border-teal-100 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium shadow-md hover:shadow-teal-200"
              >
                <FaSave className="inline mr-2" />
                Save Assignment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <ToastContainer position="top-center" autoClose={3000} />
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Duty Doctor Schedule</h1>
            <p className="text-gray-600 mt-1">Manage and track doctor duties</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition duration-200"
          >
            <FaPlus className="mr-2" />
            New Duty Assignment
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-[500px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
            <h3 className="text-gray-500 font-medium">Total Duties</h3>
            <p className="text-2xl font-bold text-gray-800">{filteredDuties.length || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
            <h3 className="text-gray-500 font-medium">Active Duties</h3>
            <p className="text-2xl font-bold text-gray-800">
              {filteredDuties.filter(d => d.status === 'active').length || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
            <h3 className="text-gray-500 font-medium">Completed</h3>
            <p className="text-2xl font-bold text-gray-800">
              {filteredDuties.filter(d => d.status === 'complete').length || 0}
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading duties</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredDuties.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No duties found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search' : 'Get started by creating a new duty assignment'}
            </p>
            <div className="mt-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaPlus className="-ml-1 mr-2 h-5 w-5" />
                New Duty
              </button>
            </div>
          </div>
        )}

        {/* Data Table */}
        {!loading && filteredDuties.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaUserMd className="inline mr-1" /> Doctor
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDuties.map((duty, index) => (
                    <tr key={duty.id || index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaUserMd className="text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              Dr. {duty.doctor?.name || 'Unknown'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {duty.doctor?.specialty || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {duty.patient_id ? duty.patient?.name || 'Unknown' : '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {duty.note ? `${duty.note}` : '-'}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${duty.status === 'inprogress' ? 'bg-green-100 text-green-800' : 
                            duty.status === 'complete' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'}`}>
                          {duty.status || 'unknown'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {duty.status === 'complete' && (
                          <button 
                            onClick={() => handlePrint(duty)} 
                            className="text-gray-600 hover:text-gray-900 mr-3"
                            title="Print Treatment Report"
                          >
                            <FaPrint className="inline" />
                          </button>
                        )}
                      <a href={`/admin/edite/duty/${duty.id}`} className='text-blue-600 hover:text-blue-900 mr-3'>
                            <MdEdit className="inline" />
                          </a>


                        <button className="text-red-600 hover:text-red-900">
                          <MdDelete className="inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Create Duty Modal */}
      <CreateDutyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      {/* <EditeDutyModal isOpen={isEdit} onClose={() => setIsEdit(false)} id={selectedId} /> */}

     
      
      {/* Print Treatment Modal */}
      {printDuty && (
        <PrintTreatment 
          duty={printDuty} 
          onClose={() => setPrintDuty(null)} 
        />
      )}
    </div>
  );
};

export default DutyDoctor;
