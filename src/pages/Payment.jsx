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
  FiLoader,
  FiFileText,
  
} from "react-icons/fi";
import { format } from "date-fns";
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import { fetchPatients } from "../stores/patientSlice";
import { fetchTreats } from "../stores/treatSlice";
import {
  createInvoicePatient,
  fetchInvoicePatients,
  deleteInvoicePatient,
} from "../stores/invoicePatientSlice";
import { fetchPays } from "../stores/paySlice";
import { ToastContainer, toast } from "react-toastify";
import { Doughnut, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import dayjs from "dayjs";
import { fetchDoctors } from "../stores/doctorSlice";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Title
);

const PaymentModal = ({ isOpen, onClose, isDark, paymentToEdit }) => {
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patient);
  const { doctors } = useSelector((state) => state.doctor);
  const { pays } = useSelector((state) => state.pay);

  const [patient_id, setPatient] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor_id, setDoctor] = useState("");
  const [price, setPrice] = useState(0);
  const [pay_id, setMethod] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [total, setTotal] = useState(0);
  const [debt, setDebt] = useState(0);
  const [status, setStatus] = useState("");

  const handleSave = async (e) => {
    e.preventDefault();
    const data = {
      patient_id: patient_id,
      doctor_id: doctor_id,
      phone: phone,
      price: price,
      pay_id: pay_id,
      deposit: deposit,
      total: total,
      debt: debt,
      status: status,
    };
    try {
      await dispatch(createInvoicePatient(data));
      dispatch(fetchInvoicePatients());
      toast.success("Payment created successfully!", { position: "top-right" });
      setPatient("");
      setPhone("");
      setDoctor("");
      setPrice(0);
      setMethod("");
      setDeposit(0);
      setTotal(0);
      setDebt(0);
      setStatus("");

      onClose();
    } catch (e) {
      toast.error(`Error creating payment: ${e.message}`, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    const calculatedDebt = parseFloat(total) - parseFloat(deposit);
    setDebt(calculatedDebt > 0 ? calculatedDebt : 0);
  }, [total, deposit]);

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

        <form onSubmit={handleSave} className="p-4 space-y-4">
          <div>
            <label
              htmlFor="patient-select"
              className="block text-sm font-medium mb-1"
            >
              Patient Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiUser />
              </span>
              <select
                id="patient-select"
                name="patient_id"
                value={patient_id}
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
            <label
              htmlFor="patient-select"
              className="block text-sm font-medium mb-1"
            >
              Doctor Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiUser />
              </span>
              <select
                id="patient-select"
                name="doctor_id"
                value={doctor_id}
                onChange={(e) => setDoctor(e.target.value)}
                className={`pl-10 w-full p-2 border rounded-lg appearance-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
                required
              >
                <option value="" disabled>
                  Select a doctor
                </option>
                {doctors.map((p) => (
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
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
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
              onChange={(e) => setPrice(e.target.value)}
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
                  onChange={(e) => setTotal(e.target.value)}
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
                onChange={(e) => setDeposit(e.target.value)}
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
            <label className="block text-sm font-medium mb-1">Debt</label>
            <input
              type="number"
              name="debt"
              value={debt}
              readOnly
              className={`w-full p-2 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300 text-black"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Method
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                <FiCreditCard />
              </span>
              <select
                name="pay_id"
                value={pay_id}
                onChange={(e) => setMethod(e.target.value)}
                className={`pl-10 w-full p-2 border rounded-lg appearance-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-black"
                }`}
              >
                <option value="" disabled>
                  -- Select payment method --
                </option>
                {pays.map((pay) => (
                  <option key={pay.id} value={pay.id}>
                    {pay.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full p-2 border rounded-lg ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-black"
              }`}
              required
            >
              <option value="" disabled>
                Select status
              </option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="pending">Pending</option>
            </select>
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
  const { invoicePatients } = useSelector((state) => state.invoicePatient);

  useEffect(() => {
    dispatch(fetchPatients());
    dispatch(fetchTreats());
    dispatch(fetchPays());
    dispatch(fetchDoctors());
    dispatch(fetchInvoicePatients());
  }, [dispatch]);

  console.log("invoice patient status", invoicePatients.status);

  const phoneNumbers = Array.isArray(patients)
    ? patients.map((p) => p.phone || "N/A")
    : [];
  console.log(phoneNumbers);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");

  const paymentsPerPage = 3;

  const filteredPayments = Array.isArray(invoicePatients)
    ? invoicePatients.filter((payment) => {
        const matchesSearch =
          (payment.patient &&
            payment.patient.name &&
            payment.patient.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          (payment.phone && payment.phone.includes(searchTerm));

        const matchesStatus =
          statusFilter === "all" || payment.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
    : [];

  const totalPages = Math.ceil(filteredPayments.length / paymentsPerPage);
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = filteredPayments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Doughnut Chart Data Preparation
  const getPaymentSummaryData = () => {
    const totalAmount = Array.isArray(invoicePatients)
      ? invoicePatients.reduce((sum, p) => sum + parseFloat(p.total || 0), 0)
      : 0;
    const totalPaid = Array.isArray(invoicePatients)
      ? invoicePatients
          .filter((p) => p.status === "paid")
          .reduce((sum, p) => sum + parseFloat(p.deposit || 0), 0)
      : 0;

    return {
      labels: [
        `Total Amount ($${totalAmount.toFixed(2)})`,
        `Total Paid ($${totalPaid.toFixed(2)})`,
      ],
      datasets: [
        {
          label: "Payment Summary",
          data: [totalAmount, totalPaid],
          backgroundColor: [
            isDark ? "rgba(234, 88, 12, 0.6)" : "rgba(249, 115, 22, 0.6)", // Orange for Total Amount
            isDark ? "rgba(34, 197, 94, 0.6)" : "rgba(22, 163, 74, 0.6)", // Green for Total Paid
          ],
          borderColor: [
            isDark ? "rgb(234, 88, 12)" : "rgb(249, 115, 22)",
            isDark ? "rgb(34, 197, 94)" : "rgb(22, 163, 74)",
          ],
          borderWidth: 2,
          hoverBackgroundColor: [
            isDark ? "rgba(234, 88, 12, 0.8)" : "rgba(249, 115, 22, 0.8)",
            isDark ? "rgba(34, 197, 94, 0.8)" : "rgba(22, 163, 74, 0.8)",
          ],
        },
      ],
    };
  };

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Payment Summary",
        color: isDark ? "#e5e7eb" : "#374151",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(31, 41, 55, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#e5e7eb" : "#374151",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#4b5563" : "#d1d5db",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data[0]; // Total Amount
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%", // Makes it a doughnut chart with a thicker ring
  };

  // Line Chart Data Preparation for Unpaid and Pending Trends
  const getUnpaidPendingTrendData = () => {
    if (!Array.isArray(invoicePatients) || invoicePatients.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    // Group payments by date (YYYY-MM-DD)
    const trendData = invoicePatients.reduce((acc, payment) => {
      if (!payment.created_at) return acc; // Skip if no creation date
      const date = dayjs(payment.created_at).format("YYYY-MM-DD");
      if (!acc[date]) {
        acc[date] = { unpaid: 0, pending: 0 };
      }
      const outstanding =
        parseFloat(payment.total || 0) - parseFloat(payment.deposit || 0);
      if (payment.status === "unpaid") {
        acc[date].unpaid += outstanding;
      } else if (payment.status === "pending") {
        acc[date].pending += outstanding;
      }
      return acc;
    }, {});

    // Generate labels and data for the last 30 days
    const days = 30;
    const labels = [];
    const unpaidData = [];
    const pendingData = [];
    const today = dayjs();

    for (let i = days - 1; i >= 0; i--) {
      const date = today.subtract(i, "day").format("YYYY-MM-DD");
      labels.push(date);
      unpaidData.push(trendData[date]?.unpaid.toFixed(2) || 0);
      pendingData.push(trendData[date]?.pending.toFixed(2) || 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "Unpaid Amount",
          data: unpaidData,
          borderColor: isDark ? "rgb(220, 38, 38)" : "rgb(239, 68, 68)", // Red
          backgroundColor: isDark
            ? "rgba(220, 38, 38, 0.2)"
            : "rgba(239, 68, 68, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Pending Amount",
          data: pendingData,
          borderColor: isDark ? "rgb(234, 179, 8)" : "rgb(245, 158, 11)", // Yellow
          backgroundColor: isDark
            ? "rgba(234, 179, 8, 0.2)"
            : "rgba(245, 158, 11, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: "Unpaid & Pending Trend",
        color: isDark ? "#e5e7eb" : "#374151",
        font: {
          size: 18,
          weight: "bold",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: isDark
          ? "rgba(31, 41, 55, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#e5e7eb" : "#374151",
        bodyColor: isDark ? "#e5e7eb" : "#374151",
        borderColor: isDark ? "#4b5563" : "#d1d5db",
        borderWidth: 1,
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: $${value}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date",
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: isDark ? "#e5e7eb" : "#374151",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          display: false,
        },
      },
      y: {
        title: {
          display: true,
          text: "Amount ($)",
          color: isDark ? "#e5e7eb" : "#374151",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: isDark ? "#e5e7eb" : "#374151",
          callback: function (value) {
            return `$${value}`;
          },
        },
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
        beginAtZero: true,
      },
    },
  };

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

  const handleDeletePayment = async (paymentId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteInvoicePatient(paymentId));
        dispatch(fetchInvoicePatients());
        Swal.fire({
          icon: "success",
          title: "Payment deleted successfully!",
          showConfirmButton: false,
          timer: 1500,
          position: "top-end",
        });
      } catch (e) {
        Swal.fire({
          icon: "error",
          title: "Payment deletion failed!",
          showConfirmButton: false,
          timer: 1500,
          position: "top-end",
        });
      }
    }
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-6 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />
      {selectedPayment ? (
        <Invoice
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-orange-600">
                Invoice Management
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
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`w-full p-2 border rounded-lg ${
                    isDark
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <option value="all">All Payments</option>
                  <option value="paid">Paid Only</option>
                  <option value="unpaid">Unpaid Only</option>
                  <option value="pending">Pending Only</option>
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
                    className={`${
                      isDark
                        ? "bg-gray-800 text-gray-100"
                        : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                    }`}
                  >
                    <th className="p-4 text-left text-sm font-medium">ID</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Patient
                    </th>
                    <th className="p-4 text-left text-sm font-medium">Phone</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Doctor
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Due Date
                    </th>
                    <th className="p-4 text-right text-sm font-medium">
                      Total
                    </th>
                    <th className="p-4 text-right text-sm font-medium">
                      Price
                    </th>
                    <th className="p-4 text-right text-sm font-medium">
                      Deposit
                    </th>
                    <th className="p-4 text-right text-sm font-medium">Debt</th>
                    <th className="p-4 text-left text-sm font-medium">
                      Method
                    </th>
                    <th className="p-4 text-left text-sm font-medium">
                      Status
                    </th>
                    <th className="p-4 text-right text-sm font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Array.isArray(currentPayments) &&
                  currentPayments.length > 0 ? (
                    currentPayments.map((payment, index) => (
                      <tr
                        key={payment.id || index}
                        className={`border-t ${
                          isDark
                            ? "border-gray-700 hover:bg-gray-800/50"
                            : "border-gray-100 hover:bg-orange-50"
                        } ${
                          index === currentPayments.length - 1
                            ? "last:border-b-0"
                            : ""
                        }`}
                      >
                        <td className="p-4 text-sm font-medium">
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {payment.id || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-sm">
                          <span
                            className={
                              isDark ? "text-gray-100" : "text-gray-800"
                            }
                          >
                            {payment.patient?.name || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-sm">
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {payment.patient?.phone || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-sm">
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {payment.doctor?.name || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-sm">
                          <span
                            className={
                              isDark ? "text-orange-300" : "text-orange-600"
                            }
                          >
                            {payment.created_at
                              ? dayjs(payment.created_at).format(
                                  "YYYY-MM-DD HH:mm:ss"
                                )
                              : ""}
                          </span>
                        </td>

                        <td className="p-4 text-right text-sm">
                          <span
                            className={
                              isDark ? "text-orange-300" : "text-orange-600"
                            }
                          >
                            {payment.total
                              ? payment.total.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                })
                              : "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-right text-sm">
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {payment.price || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-right text-sm">
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {payment.deposit || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-right text-sm">
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-600"
                            }
                          >
                            {payment.debt || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-sm">
                          <span
                            className={`inline-flex items-center gap-1.5 ${
                              isDark ? "text-gray-300" : "text-gray-600"
                            }`}
                          >
                            {payment.pay?.name === "Credit Card" && (
                              <FiCreditCard className="h-4 w-4 text-gray-400" />
                            )}
                            {payment.pay?.name === "Cash" && (
                              <FiDollarSign className="h-4 w-4 text-gray-400" />
                            )}
                            {payment.pay?.name || "N/A"}
                          </span>
                        </td>

                        <td className="p-4 text-sm">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              payment.status === "paid"
                                ? isDark
                                  ? "bg-green-900/50 text-green-200"
                                  : "bg-green-100 text-green-800"
                                : payment.status === "unpaid"
                                ? isDark
                                  ? "bg-red-900/50 text-red-200"
                                  : "bg-red-100 text-red-800"
                                : isDark
                                ? "bg-yellow-900/50 text-yellow-200"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1">
                            <a href={`/admin/edite/invoice/${payment.id}`} className={`p-2 rounded-md transition-colors ${
                                isDark
                                  ? "text-gray-300 hover:bg-gray-700 hover:text-white"
                                  : "text-gray-500 hover:bg-gray-100 hover:text-orange-600"
                              }`}>
                                 <FiEdit2  className="h-4 w-4" />
                              </a>
                            <button
                                onClick={() => setSelectedPayment(payment)}
                                className={`p-2 rounded-md transition-colors ${
                                  isDark
                                   ? "text-blue-400 hover:bg-gray-700 hover:text-blue-300"
                                    : "text-blue-600 hover:bg-gray-100 hover:text-blue-700"
                                }`}
                                title="Print Invoice"
                              >
                                <FiPrinter className="h-4 w-4" />
                              </button>

                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className={`p-2 rounded-md transition-colors ${
                                isDark
                                  ? "text-red-400 hover:bg-gray-700 hover:text-red-300"
                                  : "text-red-600 hover:bg-gray-100 hover:text-red-700"
                              }`}
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
                      <td colSpan={12} className="p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <FiFile
                            className={`h-12 w-12 ${
                              isDark ? "text-gray-600" : "text-gray-300"
                            }`}
                          />
                          <p
                            className={
                              isDark ? "text-gray-400" : "text-gray-500"
                            }
                          >
                            No payments found. Create your first payment.
                          </p>
                          <button
                            onClick={() => setIsModalOpen(true)}
                            className={`mt-4 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              isDark
                                ? "bg-orange-600 hover:bg-orange-700 text-white"
                                : "bg-orange-500 hover:bg-orange-600 text-white"
                            }`}
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
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "opacity-50 cursor-not-allowed"
                        : isDark
                        ? "hover:bg-gray-700"
                        : "hover:bg-orange-100"
                    } ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={18} />
                  </button>
                  <div className="flex items-center gap-1">
                    {(() => {
                      const maxPagesToShow = 5;
                      const pages = [];
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(maxPagesToShow / 2)
                      );
                      let endPage = Math.min(
                        totalPages,
                        startPage + maxPagesToShow - 1
                      );

                      if (endPage - startPage + 1 < maxPagesToShow) {
                        startPage = Math.max(1, endPage - maxPagesToShow + 1);
                      }

                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              isDark
                                ? "text-gray-300 hover:bg-gray-700"
                                : "text-gray-600 hover:bg-orange-100"
                            }`}
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span
                              key="start-ellipsis"
                              className={`px-3 py-1 text-sm ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              ...
                            </span>
                          );
                        }
                      }

                      for (let page = startPage; page <= endPage; page++) {
                        pages.push(
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
                                : "text-gray-600 hover:bg-orange-100"
                            }`}
                            aria-current={
                              currentPage === page ? "page" : undefined
                            }
                          >
                            {page}
                          </button>
                        );
                      }

                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span
                              key="end-ellipsis"
                              className={`px-3 py-1 text-sm ${
                                isDark ? "text-gray-500" : "text-gray-400"
                              }`}
                            >
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className={`px-3 py-1 rounded-lg text-sm ${
                              isDark
                                ? "text-gray-300 hover:bg-gray-700"
                                : "text-gray-600 hover:bg-orange-100"
                            }`}
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "opacity-50 cursor-not-allowed"
                        : isDark
                        ? "hover:bg-gray-700"
                        : "hover:bg-orange-100"
                    } ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    aria-label="Next page"
                  >
                    <FiChevronRight size={18} />
                  </button>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => {
                        const page = Math.max(
                          1,
                          Math.min(totalPages, parseInt(e.target.value) || 1)
                        );
                        handlePageChange(page);
                      }}
                      className={`w-16 p-1 text-sm border rounded-lg text-center ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-300"
                          : "bg-white border-gray-300 text-gray-800"
                      }`}
                      aria-label="Go to page"
                    />
                    <span
                      className={`text-sm ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    >
                      of {totalPages}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Section with Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    ? invoicePatients.reduce(
                        (sum, p) => sum + parseFloat(p.total || 0),
                        0
                      )
                    : "0.00"}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg shadow-sm ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500">
                  Paid Amount
                </h3>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  $
                  {Array.isArray(invoicePatients)
                    ? invoicePatients
                        .filter((p) => p.status === "paid")
                        .reduce((sum, p) => sum + parseFloat(p.deposit || 0), 0)
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
                        .filter((p) => p.status == "pending")
                        .reduce(
                          (sum, p) =>
                            sum +
                            (parseFloat(p.total || 0) -
                              parseFloat(p.debt || 0)),
                          0
                        )
                    : "0.00"}
                </p>
              </div>
              <div
                className={`p-4 rounded-lg shadow-sm ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500">
                  Unpaid Amount
                </h3>
                <p className="text-2xl font-bold mt-1 text-red-600">
                  $
                  {Array.isArray(invoicePatients)
                    ? invoicePatients
                        .filter((p) => p.status   == "unpaid")
                        .reduce(
                          (sum, p) =>
                            sum +
                            (parseFloat(p.total || 0) -
                              parseFloat(p.deposit || 0)),
                          0
                        )
                    : "0.00"}
                </p>
              </div>
            </div>
            {Array.isArray(invoicePatients) && invoicePatients.length > 0 && (
              <div
                className={`p-4 rounded-lg shadow-sm ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Payment Overview
                </h3>
                <div className="h-48">
                  <Doughnut
                    data={getPaymentSummaryData()}
                    options={doughnutChartOptions}
                    aria-label="Payment Summary Doughnut Chart"
                  />
                </div>
              </div>
            )}
          </div>
          {Array.isArray(invoicePatients) && invoicePatients.length > 0 ? (
            <div
              className={`p-4 mt-3 rounded-lg shadow-sm ${
                isDark ? "bg-gray-800" : "bg-white"
              } md:col-span-2`}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Unpaid & Pending Trend
              </h3>
              <div className="h-48">
                <Line
                  data={getUnpaidPendingTrendData()}
                  options={lineChartOptions}
                  aria-label="Unpaid and Pending Payment Trend Line Chart"
                />
              </div>
            </div>
          ) : (
            <div
              className={`p-4 rounded-lg shadow-sm ${
                isDark ? "bg-gray-800" : "bg-white"
              } md:col-span-2 flex items-center justify-center h-48`}
            >
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                No unpaid or pending payments to display.
              </p>
            </div>
          )}

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
const Invoice = ({ onClose, invoice }) => {
  const { invoicePatients } = useSelector((state) => state.invoicePatient);

  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const printRef = useRef();
  const [isPrinting, setIsPrinting] = useState(false);

  const imageCompany = localStorage.getItem("companyImage");
  const companyName = localStorage.getItem("company");

  const handlePrint = (invoice) => {
    setSelectedInvoice(invoice);
    setIsPrinting(true);
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert(
        "Print window blocked. Please allow popups for this site and try again."
      );
      setIsPrinting(false);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <title>Dental Invoice</title>
        <meta charset="UTF-8" />
        <style>
          @page { size: A4; margin: 15mm 20mm; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #333; line-height: 1.5; }
          .invoice-container { max-width: 800px; margin: 0 auto; padding: 25px; position: relative; }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #e0e6ed; }
          .logo { width: 90px; height: 90px; object-fit: contain; border-radius: 8px; }
          .clinic-info { text-align: right; }
          .clinic-name { font-weight: bold; font-size: 22px; margin-bottom: 5px; color: #2c5282; }
          .clinic-details { font-size: 13px; color: #4a5568; }
          .invoice-title { text-align: center; font-size: 24px; font-weight: bold; margin: 25px 0; color: #2c5282; }
          .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .patient-info p { margin: 5px 0; font-size: 14px; }
          .patient-info strong { display: inline-block; width: 120px; color: #4a5568; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
          th { background-color: #2c5282; color: white; padding: 12px 10px; text-align: left; font-weight: 600; }
          td { padding: 10px; border: 1px solid #e2e8f0; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .totals { float: right; width: 300px; margin-top: 20px; }
          .totals table { width: 100%; border: 1px solid #e2e8f0; background: #f8fafc; border-radius: 8px; }
          .totals td { padding: 8px 12px; text-align: right; }
          .totals tr:last-child td { font-weight: bold; font-size: 15px; color: #2c5282; }
          .signatures { display: flex; justify-content: space-between; margin-top: 60px; padding-top: 40px; border-top: 1px solid #e2e8f0; }
          .sign-box { text-align: center; width: 45%; }
          .sign-line { border-top: 1px solid #cbd5e0; margin: 15px auto; width: 80%; }
          .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #718096; padding-top: 15px; border-top: 1px solid #e2e8f0; }
          .watermark { position: absolute; opacity: 0.05; font-size: 120px; color: #2c5282; transform: rotate(-30deg); z-index: -1; top: 40%; left: 20%; font-weight: bold; }
          @media print { .no-print { display: none !important; } body { -webkit-print-color-adjust: exact; } }
        </style>
      </head>
      <body onload="window.print(); setTimeout(() => window.close(), 1000)">
        <div class="invoice-container">
          <div class="watermark">${companyName}</div>
          <div class="header">
            <img src="${imageCompany}" alt="Clinic Logo" class="logo" />
            <div class="clinic-info">
              <div class="clinic-name">${companyName}</div>
              <div class="clinic-details">
                <p>${invoice?.company?.address}</p>
                <p>Phone: ${invoice?.company?.phone}</p>
                <p>Email: ${invoice?.company?.email
                  ?.toLowerCase()
                  ?.replace(/\s+/g, "")}</p>
              </div>
            </div>
          </div>

          <div class="invoice-title">Dental Treatment Invoice</div>

          <div class="patient-info">
            <div>
              <p><strong>Patient Name:</strong> ${
                invoice?.patient?.name || "N/A"
              }</p>
              <p><strong>Phone:</strong> ${invoice?.patient?.phone || "N/A"}</p>
            </div>
            <div>
              <p><strong>Date:</strong> ${
                invoice?.created_at
                  ? new Date(invoice.created_at).toLocaleDateString()
                  : "N/A"
              }</p>
              <p><strong>Dentist:</strong> ${invoice?.doctor?.name || "N/A"}</p>
              <p><strong>Invoice No.:</strong> INV-${invoice?.id || "0000"}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
              
                <th>Dentist</th>
                <th>Price</th>
                <th>Deposit</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
              
                <td>${invoice?.doctor?.name || "N/A"}</td>
                <td>$${invoice?.price || "0.00"}</td>
                <td>$${invoice?.deposit || "0.00"}</td>
                <td>$${invoice?.total || "0.00"}</td>
                <td>${invoice?.status || "Pending"}</td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <table>
              <tr><td>Subtotal:</td><td>$${invoice?.price || "0.00"}</td></tr>
              <tr><td>Tax (0%):</td><td>$0.00</td></tr>
              <tr><td>Total Amount:</td><td>$${
                invoice?.total || "0.00"
              }</td></tr>
              <tr><td>Amount Paid:</td><td>$${
                invoice?.deposit || "0.00"
              }</td></tr>
              <tr><td>Balance Due:</td><td>$${
                (invoice?.total || 0) - (invoice?.deposit || 0)
              }</td></tr>
            </table>
          </div>

          <div class="signatures">
            <div class="sign-box">
              <p><strong>Patient's Signature</strong></p>
              <div class="sign-line"></div>
              <p>${invoice?.patient?.name || "Name"}</p>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing ${companyName}. Please bring this invoice for your next visit.</p>
            <p>Office Hours: Mon-Fri 9:00 AM - 6:00 PM | Sat 9:00 AM - 2:00 PM</p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    setIsPrinting(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        {selectedInvoice ? (
          <>
            <div className="bg-blue-700 p-4 text-white">
              <h1 className="text-xl font-bold">Invoice Preview</h1>
              <p className="text-blue-100 text-sm">
                Patient: {selectedInvoice.patient?.name || "N/A"}
              </p>
            </div>

            <div ref={printRef} className="p-6">
              <div className="text-center mb-6">
                <FiFileText className="mx-auto text-4xl text-gray-400 mb-3" />
                <h2 className="text-lg font-medium text-gray-700">
                  Dental Treatment Invoice
                </h2>
                <p className="text-gray-500 mt-2">
                  For: {selectedInvoice.patient?.name || "Patient Name"}
                </p>
                <p className="text-gray-500">
                  Date:{" "}
                  {selectedInvoice.created_at
                    ? new Date(selectedInvoice.created_at).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div className="border border-dashed border-gray-300 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Dentist:</p>
                    <p>{selectedInvoice.doctor?.name || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Total Amount:</p>
                    <p>${selectedInvoice.total || "0.00"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Treatment:</p>
                    <p>{selectedInvoice.treatment || "General Checkup"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Status:</p>
                    <p>{selectedInvoice.status || "Pending"}</p>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-500 text-sm">
                This is a preview. The actual printed invoice will contain full
                details.
              </p>
            </div>

            <div className="mt-8 flex justify-center gap-4 no-print p-6 border-t border-gray-200">
              <button
                onClick={() => handlePrint(selectedInvoice)}
                className="px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-md shadow"
              >
                {isPrinting ? "Printing..." : "Print Invoice"}
              </button>

              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-md shadow"
              >
                <FiArrowLeft size={18} />
                Back to Invoices
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-blue-700 p-4 text-white">
              <h1 className="text-xl font-bold">Invoice List</h1>
              <p className="text-blue-100 text-sm">
                Click on an invoice to preview and print.
              </p>
            </div>

            <div className="p-6 space-y-4">
              {invoicePatients.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border p-4 rounded-md shadow-sm bg-white"
                >
                  <h4 className="text-md font-semibold text-gray-700">
                    {invoice.patient?.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Total: ${invoice.total} | Date:{" "}
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => setSelectedInvoice(invoice)}
                    className="mt-2 inline-block text-sm text-blue-600 hover:underline"
                  >
                    View & Print
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={onClose}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md shadow"
              >
                <FiArrowLeft size={18} />
                <span>Back to Patient List</span>
              </button>
            </div>
          </>
        )}

        <div className="mt-4 text-center text-sm text-gray-500 no-print pb-6">
          <p>Ensure your printer has enough paper before printing.</p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
