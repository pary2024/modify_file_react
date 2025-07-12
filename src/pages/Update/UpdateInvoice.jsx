import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { fetchInvoicePatientById, updateInvoicePatient } from "../../stores/invoicePatientSlice";
import { fetchPatients } from "../../stores/patientSlice";
import { fetchTreats } from "../../stores/treatSlice";
import { fetchPays } from "../../stores/paySlice";
import { fetchDoctors } from "../../stores/doctorSlice";
import { ThemeContext } from "../../Colors/Themes";
import { ToastContainer, toast } from "react-toastify";
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

const PaymentEdit = ({  onClose,  paymentToEdit }) => {
    const { isDark } = useContext(ThemeContext);
    const navigate = useNavigate();
    const {id} = useParams();
  const dispatch = useDispatch();
  const { patients } = useSelector((state) => state.patient);
  const { doctors } = useSelector((state) => state.doctor);
  const { pays } = useSelector((state) => state.pay);
  const { invoicePatient } = useSelector((state) => state.invoicePatient);

  const [patient_id, setPatient] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor_id, setDoctor] = useState("");
  const [price, setPrice] = useState(0);
  const [pay_id, setMethod] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [total, setTotal] = useState(0);
  const [debt, setDebt] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(()=>{
    dispatch(fetchInvoicePatientById(id))
    dispatch(fetchPatients());
    dispatch(fetchTreats());
    dispatch(fetchPays());
    dispatch(fetchDoctors());
  },[id,dispatch])

  useEffect(() => {
  if (invoicePatient) {
    setPatient(invoicePatient?.patient?.id);   // ✅ should be ID
    setPhone(invoicePatient?.patient?.phone);
    setDoctor(invoicePatient?.doctor?.id);     // ✅ should be ID
    setPrice(invoicePatient.price);
    setMethod(invoicePatient?.pay?.id);        // ✅ should be ID
    setDeposit(invoicePatient.deposit);
    setTotal(invoicePatient.total);
    setDebt(invoicePatient.debt);
    setStatus(invoicePatient.status);
  }
}, [invoicePatient]);
  const handleEdit = async (e) =>{
    e.preventDefault();
    const data = {
        patient_id:patient_id,
        phone:phone,
        doctor_id:doctor_id,
        price:price,
        pay_id:pay_id,
        deposit:deposit,
        total:total,
        debt:debt,
        status:status       
    }
    try{
        await dispatch(updateInvoicePatient({id,data}))
        navigate("/admin/payment/patient");
        toast.success("invoice updated successfully!", { position: "top-right" });
    }catch(e){
      toast.error(`Error updating invoice: ${e.message}`, {
      position: "top-right",
    });

    }

  }

  

  useEffect(() => {
    const calculatedDebt = parseFloat(total) - parseFloat(deposit);
    setDebt(calculatedDebt > 0 ? calculatedDebt : 0);
  }, [total, deposit]);

  

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
            Edit Payment
          </h3>
          <button
             onClick={() => navigate("/admin/payment/patient")} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleEdit}  className="p-4 space-y-4">
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
              Update Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default PaymentEdit;
