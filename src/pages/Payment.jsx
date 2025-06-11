import React, { useState, useRef, useContext, useEffect } from "react";
import {
  FiPrinter,
  FiArrowLeft,
  FiPlus,
  FiX,
  FiEdit2,
  FiDollarSign,
  FiCreditCard,
  FiUser,
  FiCalendar,
  FiMail,
  FiDownload,
  FiChevronLeft,
  FiChevronRight, 
  FiTrash2,
  FiFile,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import { format } from 'date-fns';
import { ThemeContext } from "../colors/Thems";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../stores/patientSlice";
import { fetchTreats } from "../stores/treatSlice";
import { createInvoicePatient, fetchInvoicePatients } from "../stores/invoicePatientSlice";
import { fetchPays } from "../stores/paySlice";

const InvoiceLetter = ({ payment, onClose }) => {
  const { isDark } = useContext(ThemeContext);
  const printRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);

  if (!payment) return null;

  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handlePrint = () => {
    setIsPrinting(true);
    if (!payment || !payment.id || !payment.patient || !payment.treat) {
      console.error("Invalid payment data:", payment);
      alert("Cannot print invoice: Invalid payment data.");
      setIsPrinting(false);
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Print window blocked. Please allow popups for this site and try again.");
      setIsPrinting(false);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <title>Dental Invoice #${payment.id.toString().padStart(5, "0")}</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            @page {
              size: A4;
              margin: 20mm 15mm;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Segoe UI', Roboto, -apple-system, sans-serif;
              line-height: 1.6;
              color: #1f2937;
              background-color: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              padding: 2.5rem;
              background-color: white;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 2.5rem;
              padding-bottom: 1.5rem;
              border-bottom: 1px solid #e5e7eb;
            }
            .clinic-info h1 {
              color: #075985;
              font-size: 1.8rem;
              font-weight: 700;
              margin-bottom: 0.75rem;
              letter-spacing: -0.5px;
            }
            .clinic-info p {
              color: #4b5563;
              font-size: 0.875rem;
              margin: 0.25rem 0;
              line-height: 1.5;
            }
            .invoice-info h2 {
              color: #075985;
              font-size: 1.5rem;
              font-weight: 600;
              margin-bottom: 0.75rem;
              text-align: right;
            }
            .invoice-info p {
              color: #4b5563;
              font-size: 0.875rem;
              margin: 0.25rem 0;
              text-align: right;
              line-height: 1.5;
            }
            .patient-section {
              background-color: #f0f9ff;
              padding: 1.75rem;
              border-radius: 0.5rem;
              margin-bottom: 2rem;
              border: 1px solid #e0f2fe;
            }
            .section-title {
              font-size: 1.125rem;
              font-weight: 600;
              color: #075985;
              margin-bottom: 1.25rem;
              display: flex;
              align-items: center;
            }
            .section-title:after {
              content: "";
              flex: 1;
              margin-left: 1rem;
              height: 1px;
              background-color: #e0f2fe;
            }
            .patient-info-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
              gap: 1.25rem;
            }
            .patient-info p {
              font-size: 0.95rem;
              margin: 0.5rem 0;
              display: flex;
            }
            .patient-info strong {
              color: #075985;
              font-weight: 600;
              min-width: 120px;
              display: inline-block;
            }
            .status {
              display: inline-flex;
              align-items: center;
              padding: 0.25rem 0.75rem;
              border-radius: 9999px;
              font-size: 0.85rem;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .status.paid {
              background-color: #dcfce7;
              color: #166534;
            }
            .status.unpaid {
              background-color: #fee2e2;
              color: #991b1b;
            }
            .treatment-section {
              margin: 2.5rem 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1.75rem 0;
              font-size: 0.95rem;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th {
              background-color: #075985;
              color: white;
              text-align: left;
              padding: 0.875rem 1.25rem;
              font-weight: 600;
              border: none;
            }
            td {
              padding: 0.875rem 1.25rem;
              border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .text-right {
              text-align: right;
            }
            .total-row {
              font-weight: 600;
              background-color: #f0f9ff !important;
            }
            .balance-row {
              font-weight: 700;
              background-color: #e0f2fe !important;
              font-size: 1.05rem;
            }
            .payment-method {
              display: flex;
              justify-content: space-between;
              padding: 1.25rem;
              background-color: #f8fafc;
              border-radius: 0.5rem;
              margin: 2rem 0;
              font-size: 0.95rem;
              border: 1px solid #e5e7eb;
            }
            .payment-method span:last-child {
              font-weight: 600;
              color: #075985;
            }
            .qr-section {
              background-color: #f0f9ff;
              padding: 1.75rem;
              border-radius: 0.5rem;
              margin: 2rem 0;
              text-align: center;
              border: 1px dashed #bae6fd;
            }
            .qr-section p {
              font-weight: 600;
              color: #075985;
              font-size: 1rem;
              margin-bottom: 1.25rem;
            }
            .qr-container {
              display: inline-block;
              background: white;
              padding: 1rem;
              border-radius: 0.5rem;
              border: 1px solid #e5e7eb;
              margin-bottom: 1rem;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .qr-note {
              font-size: 0.85rem;
              color: #4b5563;
              max-width: 300px;
              margin: 0 auto;
              line-height: 1.5;
            }
            .footer {
              text-align: center;
              color: #4b5563;
              font-size: 0.85rem;
              padding-top: 2rem;
              margin-top: 2.5rem;
              border-top: 1px solid #e5e7eb;
              line-height: 1.6;
            }
            .footer strong {
              color: #075985;
            }
            .policy-list {
              list-style-type: none;
              padding-left: 0;
            }
            .policy-list li {
              position: relative;
              padding-left: 1.5rem;
              margin-bottom: 0.75rem;
            }
            .policy-list li:before {
              content: "•";
              color: #075985;
              font-weight: bold;
              position: absolute;
              left: 0;
            }
            @media print {
              body {
                background: white !important;
                padding: 0 !important;
              }
              .invoice-container {
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                max-width: 100% !important;
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 1000)">
          <div class="invoice-container">
            ${printRef.current.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setIsPrinting(false);
  };

  return (
    <div className={`p-4 md:p-6 ${isDark ? "bg-gray-900" : "bg-amber-50"} min-h-screen`}>
      <div
        ref={printRef}
        className={`mx-auto ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        } 
          p-6 md:p-8 rounded-xl shadow-lg font-sans border ${
            isDark ? "border-gray-700" : "border-amber-200"
          } transition-all duration-200`}
        style={{ maxWidth: "800px" }}
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-amber-200">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold text-amber-600 mb-2">
              Concept Dental Clinic
            </h2>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">123 Smile Street, Dental City</p>
              <p className="text-sm text-gray-500">Phone: (123) 456-7890</p>
              <p className="text-sm text-gray-500">Email: info@conceptdental.com</p>
              <p className="text-sm text-gray-500 mt-2">
                Tax ID: DC-123456789 | Dental License: DL-987654
              </p>
            </div>
          </div>
          <div className="text-right">
            <h3 className="text-2xl font-bold text-amber-600 mb-2">INVOICE</h3>
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Issued: {currentDate}</p>
              <p className="text-sm text-gray-500">
                Invoice #: {payment.id.toString().padStart(5, "0")}
              </p>
              {payment.dueDate && (
                <p className="text-sm font-medium text-amber-600">
                  Due: {payment.dueDate}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Patient Information Section */}
        <div
          className={`mb-8 p-6 rounded-lg ${
            isDark ? "bg-gray-700" : "bg-amber-50"
          } border ${isDark ? "border-gray-600" : "border-amber-200"}`}
        >
          <h4 className="text-lg font-semibold text-amber-600 mb-4 flex items-center">
            <span className="mr-2">👤</span> PATIENT INFORMATION
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-start">
                <span className="font-medium min-w-[120px]">Name:</span>
                {payment.patient.name}
              </p>
              {payment.phone && (
                <p className="flex items-start">
                  <span className="font-medium min-w-[120px]">Phone:</span>
                  {payment.patient.phone}
                </p>
              )}
              {payment.email && (
                <p className="flex items-start">
                  <span className="font-medium min-w-[120px]">Email:</span>
                  {payment.email}
                </p>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-medium min-w-[120px]">Status:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    payment.paid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {payment.status ? "PAID" : "UNPAID"}
                </span>
              </div>
              <p className="flex items-start">
                <span className="font-medium min-w-[120px]">Appointment:</span>
                {payment.date || currentDate}
              </p>
              {payment.doctor && (
                <p className="flex items-start">
                  <span className="font-medium min-w-[120px]">Dentist:</span>
                  {payment.doctor}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Treatment Details Section */}
        <div className="mb-10">
          <h4 className="text-xl font-semibold text-amber-600 mb-4 flex items-center">
            <span className="mr-2">🦷</span> TREATMENT DETAILS
          </h4>
          <div className="overflow-x-auto rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead
                className={`${
                  isDark ? "bg-gray-700" : "bg-amber-600"
                } text-white`}
              >
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Procedure
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-bold uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(Array.isArray(payment.treat) ? payment.treat : []).map((treatment, index) => (
                  <tr
                    key={index}
                    className={`${
                      index % 2 === 0
                        ? isDark
                          ? "bg-gray-800"
                          : "bg-amber-50"
                        : isDark
                        ? "bg-gray-900"
                        : "bg-white"
                    } hover:bg-opacity-90 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {treatment.name || "Dental Procedure"}
                    </td>
                    <td className="px-6 py-4">
                      {treatment.description || "Standard dental treatment"}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      ${treatment.cost || payment.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment Summary Section */}
        <div className="mb-10">
          <div className="flex justify-end">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <div className="rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    <tr className={isDark ? "bg-gray-800" : "bg-amber-50"}>
                      <td className="p-4 font-semibold">Subtotal</td>
                      <td className="p-4 text-right">${payment.total}</td>
                    </tr>
                    {payment.discount > 0 && (
                      <tr className={isDark ? "bg-gray-800" : "bg-amber-50"}>
                        <td className="p-4 font-semibold">Discount</td>
                        <td className="p-4 text-right text-green-600">
                          -${payment.discount.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {payment.tax > 0 && (
                      <tr className={isDark ? "bg-gray-800" : "bg-amber-50"}>
                        <td className="p-4 font-semibold">
                          Tax ({payment.taxRate || 0}%)
                        </td>
                        <td className="p-4 text-right">
                          ${payment.tax.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    {payment.deposit > 0 && (
                      <tr className={isDark ? "bg-gray-800" : "bg-amber-50"}>
                        <td className="p-4 font-semibold">Deposit Paid</td>
                        <td className="p-4 text-right text-green-600">
                          -${payment.deposit.toFixed(2)}
                        </td>
                      </tr>
                    )}
                    <tr
                      className={`${
                        isDark ? "bg-gray-700" : "bg-amber-200"
                      } border-t-2 border-amber-300`}
                    >
                      <td className="p-4 font-bold text-lg">TOTAL</td>
                      <td className="p-4 text-right font-bold text-lg">
                        $
                        {(
                          payment.total +
                          (payment.tax || 0) -
                          (payment.discount || 0) -
                          (payment.deposit || 0)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Information Section */}
        <div className="mb-8">
          <div
            className={`p-6 rounded-lg ${
              isDark ? "bg-gray-700" : "bg-amber-50"
            } border ${isDark ? "border-gray-600" : "border-amber-200"}`}
          >
            <h4 className="text-lg font-semibold text-amber-600 mb-4 flex items-center">
              <span className="mr-2">💳</span> PAYMENT INFORMATION
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="flex items-start">
                  <span className="font-medium min-w-[150px]">Method:</span>
                  {payment.pay?.name || "Credit Card"}
                </p>
                {payment.transactionId && (
                  <p className="flex items-start">
                    <span className="font-medium min-w-[150px]">Transaction ID:</span>
                    {payment.transactionId}
                  </p>
                )}
                {payment.paidDate && (
                  <p className="flex items-start">
                    <span className="font-medium min-w-[150px]">Paid Date:</span>
                    {payment.paidDate}
                  </p>
                )}
                <div className="mt-4">
                  <p className="font-medium">Accepted Payment Methods:</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Credit/Debit Cards, Bank Transfer, KHQR, Cash
                  </p>
                </div>
              </div>

              {!payment.paid && (
                <div className="flex flex-col items-center">
                  <p className="text-md font-semibold mb-3 text-center">
                    Scan to Pay via Mobile Banking
                  </p>
                  <div
                    className={`p-4 rounded-lg ${
                      isDark ? "bg-gray-600" : "bg-white"
                    } shadow-md border ${
                      isDark ? "border-gray-500" : "border-amber-200"
                    }`}
                  >
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmllFzhBwp8Evri_db9P1XGueBmvGKQiD3cg&s"
                      alt="Payment QR Code"
                      className="w-36 h-36 mx-auto"
                      style={{ filter: isDark ? "invert(1)" : "none" }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-3 text-center max-w-xs">
                    Compatible with ABA, ACLEDA, and other KHQR participating banks
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="mt-8 pt-6 border-t border-amber-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="text-lg font-semibold text-amber-600 mb-3 flex items-center">
                <span className="mr-2">📋</span> CLINIC POLICIES
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Payment is due within 15 days of invoice date</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>1.5% late fee applied monthly to overdue balances</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Cancellation requires 24 hours notice to avoid fees</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Insurance claims are patient's responsibility</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-amber-600 mb-3 flex items-center">
                <span className="mr-2">🙏</span> THANK YOU
              </h4>
              <p className="mb-3">
                We appreciate your trust in our dental care services. Please don't
                hesitate to contact us with any questions about your treatment or
                this invoice.
              </p>
              <p className="font-medium text-amber-600">
                Your oral health is our priority!
              </p>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-6">
            Concept Dental Clinic • 123 Smile Street, Dental City • (123) 456-7890 •
            info@conceptdental.com
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-wrap gap-4 justify-center no-print">
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className={`flex items-center gap-2 ${
            isPrinting ? "bg-amber-400" : "bg-amber-600 hover:bg-amber-700"
          } text-white px-6 py-3 rounded-lg shadow-md transition-colors`}
        >
          {isPrinting ? (
            <>
              <FiLoader className="animate-spin text-lg" />
              Printing...
            </>
          ) : (
            <>
              <FiPrinter className="text-lg" />
              Print Invoice
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors"
        >
          <FiArrowLeft className="text-lg" />
          Back to Payments
        </button>
      </div>
    </div>
  );
};

const PaymentModal = ({ isOpen, onClose, onSubmit, isDark, paymentToEdit }) => {

  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patient);
  const { treats } = useSelector((state) => state.treat);
  const { pays } = useSelector((state) => state.pay);
  
  const [patient , setPatient] = useState("");
  const [phone , setPhone] = useState("");
  const [treat  , setTreatments] = useState([]);
  const [price , setPrice] = useState(0);
  const [method , setMethod] = useState("");
  const [deposit , setDeposit] = useState(0);
  const [total , setTotal] = useState(0);
  const [debt , setDebt] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);
 
  const handleSave = async (e) =>{
    e.preventDefault();
    const data = {
      patient_id: patient,
      phone: phone,
      treat_id: treat,
      price: price,
      method: method,
      deposit: deposit,
      total: total,
      debt: debt

    }
    try{
      await dispatch(createInvoicePatient(data));
      dispatch(fetchInvoicePatients());
       Swal.fire({
              icon: "success",
              title: "payment created successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
          });

    }catch(e){
       Swal.fire({
              icon: "success",
              title: "payment create warning !",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
          });
    }


  }

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
  

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      data-aos="zoom-in"
    >
      <div
        className={`rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"
        }`}
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold">
            {paymentToEdit ? "Edit Payment" : "Add New Payment"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSave}  className="p-4 space-y-4">
          <div>
      <label htmlFor="patient-select" className="block text-sm font-medium mb-1">
        Patient Name <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FiUser />
        </span>

        <select
          id="patient-select"
          name="patient"
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className={`pl-10 w-full p-2 border rounded-lg appearance-none ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white"
              : "bg-white border-gray-300 text-black"
          }`}
          required
        >
          <option value="" disabled>
            -- Select a patient --
          </option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
    </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={(e) => setPhone (e.target.value)}
             
              className={`w-full p-2 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>

          <div>
      <label className="block text-sm font-medium mb-1">
        Treatments (select or type) <span className="text-red-500">*</span>
      </label>

      {/* Select to add treatment */}
      <select
        
        className={`mb-2 w-full p-2 border rounded-lg ${
          isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
        }`}
        defaultValue=""
      >
        <option value="" disabled>
          -- Select treatment to add --
        </option>
        {treats.map((t) => (
          <option key={t.id} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>

      {/* Textarea for comma-separated treatments */}
      <textarea
        name="treat"
        value={treat}
        onChange={(e) => setTreat(e.target.value)}
        className={`w-full p-2 border rounded-lg ${
          isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
        }`}
        rows="2"
        required
        placeholder="Cleaning, Filling, Extraction"
      />
    </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Prices (comma separated, optional)
            </label>
            <input
              type="text"
              name="price"
              value={price}
              onChange={(e) => setPrice (e.target.value)}
             
              className={`w-full p-2 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              placeholder="80, 70, 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Debt
            </label>
            <input
              type="text"
              name="debt"
              value={debt}
              onChange={(e) => setDebt (e.target.value)}
             
              className={`w-full p-2 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
              placeholder="80, 70, 100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Total Amount
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <FiDollarSign />
                </span>
                <input
                  type="number"
                  name="total"
                  value={total}
                  onChange={(e) => setTotal (e.target.value)}
                 
                  min="0"
                  step="0.01"
                  className={`pl-10 w-full p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deposit</label>
              <input
                type="number"
                name="deposit"
                value={deposit}
                onChange={(e) => setDeposit (e.target.value)}
               
                min="0"
                step="0.01"
                className={`w-full p-2 border rounded-lg ${
                  isDark
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          </div>

          <div>
      <label className="block text-sm font-medium mb-1">Payment Method</label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          <FiCreditCard />
        </span>
        <select
          name="method"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className={`pl-10 w-full p-2 border rounded-lg appearance-none ${
            isDark ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
          }`}
        >
          {/* Optional placeholder */}
          <option value="" disabled>
            -- Select payment method --
          </option>
          {pays.map((pay) => (
            <option key={pay.id} value={pay.name}>
              {pay.name}
            </option>
          ))}
        </select>
      </div>
    </div>

         

          <div className="flex items-center">
            <input
              type="checkbox"
              name="status"
              value={status}
              onChange={(e) => setStatus (e.target.checked)}
             
              className={`h-5 w-5 rounded ${
                isDark ? "bg-gray-700 border-gray-600" : "border-gray-300"
              }`}
              id="paidCheckbox"
            />
            <label htmlFor="paidCheckbox" className="ml-2 text-sm font-medium">
              Mark as Paid
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg shadow ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow"
            >
              {paymentToEdit ? "Update Payment" : "Add Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Payment = () => {
  const { isDark } = useContext(ThemeContext);

  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patient);
  const { treats } = useSelector((state) => state.treat);
  const { pays } = useSelector((state) => state.pay);
  const { invoicePatients } = useSelector((state) => state.invoicePatient);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchTreats());
    dispatch(fetchInvoicePatients());
    dispatch(fetchPays());
  }, [dispatch]);
 const phoneNumbers = Array.isArray(patients)
    ? patients.map(p => p.phone || 'N/A')
    : [];
  console.log(phoneNumbers);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 5;

 const filteredPayments = Array.isArray(invoicePatients)
  ? invoicePatients.filter(
      (payment) =>
        (payment.patient &&
          payment.patient.name &&
          payment.patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payment.phone && payment.phone.includes(searchTerm))
    )
  : [];

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

 

  const handleEditPayment = (payment) => {
    setPaymentToEdit(payment);
    setIsModalOpen(true);
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {selectedPayment ? (
        <InvoiceLetter
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
                Payment Management
              </h1>
              <p className="text-sm text-gray-500">
                Manage patient payments and invoices
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={() => {
                  setPaymentToEdit(null);
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
              >
                <FiPlus /> New Payment
              </button>
            </div>
          </div>

          <div
            className={`mb-6 p-4 rounded-lg shadow-sm ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium mb-1"
                >
                  Search
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by patient name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-[300px] p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid Only</option>
                  <option value="unpaid">Unpaid Only</option>
                </select>
              </div>
            </div>
          </div>

          <div
            className={`rounded-lg shadow-md overflow-hidden ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          >
       <div className="overflow-x-auto rounded-lg border shadow-sm">
          <table className="w-full table-auto">
  <thead>
    <tr
      className={`
        ${isDark ? "bg-gray-800 text-gray-100" : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"}
      `}
    >
      <th className="p-4 text-left text-sm font-medium first:rounded-tl-lg">ID</th>
      <th className="p-4 text-left text-sm font-medium">Patient</th>
      <th className="p-4 text-left text-sm font-medium">Phone</th>
      <th className="p-4 text-left text-sm font-medium">Treatments</th>
      <th className="p-4 text-right text-sm font-medium">Due Date</th>
      <th className="p-4 text-right text-sm font-medium">Total</th>
      <th className="p-4 text-right text-sm font-medium">price</th>
      <th className="p-4 text-right text-sm font-medium">deposit</th>
      <th className="p-4 text-right text-sm font-medium">debt</th>
      <th className="p-4 text-left text-sm font-medium">Method</th>
      <th className="p-4 text-left text-sm font-medium">Status</th>
      <th className="p-4 text-right text-sm font-medium last:rounded-tr-lg">Actions</th>
    </tr>
  </thead>
  <tbody>
    {Array.isArray(currentPayments) && currentPayments.length > 0 ? (
      currentPayments.map((payment, index) => (
        <tr
          key={payment.id || index}
          className={`
            border-t ${isDark ? "border-gray-700 hover:bg-gray-800/50" : "border-gray-100 hover:bg-orange-50"}
            ${index === currentPayments.length - 1 ? "last:border-b-0" : ""}
          `}
        >
          <td className="p-4 text-sm font-medium">
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              {payment.id || 'N/A'}
            </span>
          </td>
          <td className="p-4 text-sm">
            <div className="flex flex-col">
              <span className={isDark ? "text-gray-100" : "text-gray-800"}>
                {payment.patient?.name || 'N/A'}
              </span>
            </div>
          </td>
          <td className="p-4 text-sm">
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {payment.patient?.phone || 'N/A'}
            </span>
          </td>
          <td className="p-4 text-sm">
            <div className="line-clamp-2 max-w-xs">
              {Array.isArray(payment.treat)
                ? payment.treat.map(t => (typeof t === 'string' ? t : t.name || 'Unknown')).join(', ')
                : payment.treat?.name || 'N/A'}
            </div>
          </td>
          <td className="p-4 text-right text-sm font-medium">
            <span className={isDark ? "text-orange-300" : "text-orange-600"}>
               {payment.created_at ? dayjs(payment.created_at).format("YYYY-MM-DD HH:mm:ss") : ""}
            </span>
          </td>
          <td className="p-4 text-right text-sm font-medium">
            <span className={isDark ? "text-orange-300" : "text-orange-600"}>
              {payment.total ? payment.total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'N/A'}
            </span>
          </td>
           <td className="p-4 text-sm">
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {payment.price || 'N/A'}
            </span>
          </td>
           <td className="p-4 text-sm">
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {payment.deposit || 'N/A'}
            </span>
          </td>
           <td className="p-4 text-sm">
            <span className={isDark ? "text-gray-300" : "text-gray-600"}>
              {payment.debt || 'N/A'}
            </span>
          </td>
          <td className="p-4 text-sm">
            <span className={`inline-flex items-center gap-1.5 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
              {payment.pay?.name === 'Credit Card' && (
                <FiCreditCard className="h-4 w-4 text-gray-400" />
              )}
              {payment.pay?.name === 'Cash' && (
                <FiDollarSign className="h-4 w-4 text-gray-400" />
              )}
              {payment.pay?.name || 'N/A'}
            </span>
          </td>
          <td className="p-4 text-sm">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                payment.paid
                  ? isDark
                    ? "bg-green-900/50 text-green-200"
                    : "bg-green-100 text-green-800"
                  : isDark
                    ? "bg-red-900/50 text-red-200"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {payment.status ? (
                <>
                  <FiCheckCircle className="h-3 w-3 mr-1" />
                  Paid
                </>
              ) : (
                <>
                  <FiXCircle className="h-3 w-3 mr-1" />
                  Unpaid
                </>
              )}
            </span>
          </td>
          <td className="p-4 text-right">
            <div className="flex justify-end gap-1">
              <button
                onClick={() => handleEditPayment(payment)}
                className={`
                  p-2 rounded-md transition-colors
                  ${isDark ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-500 hover:bg-gray-100 hover:text-orange-600"}
                `}
                title="Edit"
              >
                <FiEdit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setSelectedPayment(payment)}
                className={`
                  p-2 rounded-md transition-colors
                  ${isDark ? "text-blue-400 hover:bg-gray-700 hover:text-blue-300" : "text-blue-600 hover:bg-gray-100 hover:text-blue-700"}
                `}
                title="View Invoice"
              >
                <FiDollarSign className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeletePayment(payment)} // Added onClick handler
                className={`
                  p-2 rounded-md transition-colors
                  ${isDark ? "text-red-400 hover:bg-gray-700 hover:text-red-300" : "text-red-600 hover:bg-gray-100 hover:text-red-700"}
                `}
                title="Delete"
              >
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan={9} // Corrected to match 9 columns
          className="p-8 text-center"
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <FiFile className={`h-12 w-12 ${isDark ? "text-gray-600" : "text-gray-300"}`} />
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              No payments found. Create your first payment.
            </p>
            <button
              className={`
                mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors
                ${isDark ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"}
              `}
              
            >
              <FiPlus className="inline mr-2" />
              New Payment
            </button>
          </div>
        </td>
      </tr>
    )}
  </tbody>
</table>
        </div>
            {totalPages > 1 && (
              <div
                className={`flex items-center justify-between p-4 border-t ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstPayment + 1} to{" "}
                  {Math.min(indexOfLastPayment, filteredPayments.length)} of{" "}
                  {filteredPayments.length} payments
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <div className="flex gap-1">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1
                    ).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          currentPage === page
                            ? isDark
                              ? "bg-orange-600 text-white"
                              : "bg-orange-600 text-white"
                            : isDark
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    } ${isDark ? "text-gray-300" : "text-gray-600"}`}
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div
              className={`p-4 rounded-lg shadow-sm ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-sm font-medium text-gray-500">
                Total Payments
              </h3>
              <p className="text-2xl font-bold mt-1">
                $
                {Array.isArray(invoicePatients)
                  ? invoicePatients
                      .reduce((sum, p) =>  p.total+sum, 0)
                      
                  : "0.00"}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg shadow-sm ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-sm font-medium text-gray-500">Paid Amount</h3>
              <p className="text-2xl font-bold mt-1 text-green-600">
                $
                {Array.isArray(invoicePatients)
                  ? invoicePatients
                      .filter((p) => p.paid)
                      .reduce((sum, p) => sum + p.total, 0)
                      
                  : "0.00"}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg shadow-sm ${
                isDark ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-sm font-medium text-gray-500">
                Pending Amount
              </h3>
              <p className="text-2xl font-bold mt-1 text-red-600">
                $
                {Array.isArray(invoicePatients)
                  ? invoicePatients
                      .filter((p) => !p.paid)
                      .reduce((sum, p) => sum + (p.total - p.deposit), 0)
                      
                  : "0.00"}
              </p>
            </div>
          </div>

          <PaymentModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setPaymentToEdit(null);
            }}
            
            isDark={isDark}
            paymentToEdit={paymentToEdit}
          />
        </>
      )}
    </div>
  );
};

export default Payment;
