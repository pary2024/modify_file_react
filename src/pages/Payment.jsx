import React, { useState, useRef } from 'react';


const InvoiceLetter = ({ payment, onClose }) => {
  const printRef = useRef();
  if (!payment) return null;
  const currentDate = new Date().toLocaleDateString();

  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div className="p-6">
      <div
        ref={printRef}
        className="max-w-3xl mx-auto bg-white p-10 rounded-lg shadow-md text-black font-sans border border-gray-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-blue-800">Concept Dental Clinic</h2>
            <p className="text-sm text-gray-700">123 Smile Street, Dental City</p>
            <p className="text-sm text-gray-700">Phone: (123) 456-7890</p>
          </div>
          <div className="text-right">
            <h3 className="text-xl font-semibold">Invoice</h3>
            <p className="text-sm text-gray-700">Date: {currentDate}</p>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-6">
          <p className="text-lg"><strong>Patient Name:</strong> {payment.patient}</p>
          <p className="text-lg">
            <strong>Status:</strong>{' '}
            <span className={payment.paid ? 'text-green-600' : 'text-red-600'}>
              {payment.paid ? 'Paid' : 'Unpaid'}
            </span>
          </p>
        </div>

        {/* Treatment Table */}
        <div className="mb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border-b text-sm">#</th>
                <th className="p-2 border-b text-sm">Treatment</th>
              </tr>
            </thead>
            <tbody>
              {payment.treatments.map((treatment, index) => (
                <tr key={index}>
                  <td className="p-2 border-b text-sm">{index + 1}</td>
                  <td className="p-2 border-b text-sm">{treatment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Summary + QR Code */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-lg font-medium">
            <span>Total Amount:</span>
            <span>${payment.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg">
            <span>Payment Method:</span>
            <span>{payment.method}</span>
          </div>

          {!payment.paid && (
            <div className="mt-6 text-center">
              <p className="text-md font-semibold mb-2">Scan to Pay via ABA or ACLEDA</p>
              <QRCode
                value={`https://your-payment-url.com/pay?amount=${payment.total}&patient=${encodeURIComponent(payment.patient)}`}
                size={160}
                fgColor="#000000"
                includeMargin={true}
              />
              <p className="text-sm text-gray-600 mt-2">Compatible with ABA & ACLEDA (KHQR)</p>
            </div>
          )}
        </div>

        <p className="text-center mt-10 text-gray-700">
          Thank you for trusting <strong>Concept Dental Clinic</strong>. We wish you a healthy smile!
        </p>
      </div>

      <div className="mt-6 flex gap-3 justify-center print:hidden">
        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Print Invoice
        </button>
        <button
          onClick={onClose}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded shadow"
        >
          Back
        </button>
      </div>
    </div>
  );
};

const Payment = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      patient: 'John Doe',
      treatments: ['Cleaning', 'Filling'],
      total: 150,
      method: 'Cash',
      paid: true,
    },
    {
      id: 2,
      patient: 'Jane Smith',
      treatments: ['Extraction'],
      total: 80,
      method: 'Card',
      paid: false,
    },
  ]);

  const [form, setForm] = useState({
    patient: '',
    treatments: '',
    total: '',
    method: 'Cash',
    paid: false,
  });

  const [selectedPayment, setSelectedPayment] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddPayment = (e) => {
    e.preventDefault();

    const newPayment = {
      id: payments.length + 1,
      patient: form.patient,
      treatments: form.treatments.split(',').map((t) => t.trim()),
      total: parseFloat(form.total),
      method: form.method,
      paid: form.paid,
    };

    setPayments([...payments, newPayment]);
    setForm({
      patient: '',
      treatments: '',
      total: '',
      method: 'Cash',
      paid: false,
    });
  };

  return (
    <div className="p-6">
      {!selectedPayment ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Dental Payment Records</h2>

          {/* Add Payment Form */}
          <form onSubmit={handleAddPayment} className="mb-8 space-y-4 bg-gray p-4 rounded shadow-md ">
            <div>
              <label className="block font-semibold">Patient Name</label>
              <input
                type="text"
                name="patient"
                value={form.patient}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Treatments (comma-separated)</label>
              <input
                type="text"
                name="treatments"
                value={form.treatments}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Total ($)</label>
              <input
                type="number"
                name="total"
                value={form.total}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block font-semibold">Payment Method</label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="paid"
                checked={form.paid}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="font-semibold">Paid</label>
            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Payment
            </button>
          </form>

          {/* Payments Table */}
          <table className="w-full table-auto border border-collapse">
            <thead>
              <tr className="bg-white-200 text-left">
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Treatments</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Method</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td className="p-2 border">{payment.patient}</td>
                  <td className="p-2 border">{payment.treatments.join(', ')}</td>
                  <td className="p-2 border">${payment.total.toFixed(2)}</td>
                  <td className="p-2 border">{payment.method}</td>
                  <td className={`p-2 border ${payment.paid ? 'text-green-600' : 'text-red-600'}`}>
                    {payment.paid ? 'Paid' : 'Unpaid'}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => setSelectedPayment(payment)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Invoice
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <InvoiceLetter payment={selectedPayment} onClose={() => setSelectedPayment(null)} />
      )}
    </div>
  );
};

export default Payment;
