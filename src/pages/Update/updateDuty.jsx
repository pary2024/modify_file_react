import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDuty, updateDuty } from "../../Stores/dutyDoctorSlice";
import { FaUserMd, FaUser, FaClinicMedical, FaPlus, FaSearch, FaCalendarAlt, FaTimes, FaTeeth, FaUserInjured, FaSave, FaPrint } from 'react-icons/fa';
import { useNavigate, useParams } from "react-router";
import { fetchDoctors } from "../../Stores/doctorSlice";
import { fetchPatients } from "../../Stores/patientSlice";
import { fetchTreats } from "../../Stores/treatSlice";
import { ToastContainer, toast } from "react-toastify";

 const EditeDuty = () => {
  const { duty } = useSelector((state) => state.duty);
  const {doctors} = useSelector((state)=> state.doctor);
  const {patients} = useSelector((state)=> state.patient);
  const {treats} = useSelector((state)=> state.treat);
  const dispatch = useDispatch();
  const {id} = useParams();
  const navigate = useNavigate();
  useEffect(()=>{
    dispatch(fetchDoctors())
    dispatch(fetchPatients())
    dispatch(fetchTreats())
    dispatch(fetchDuty(id))
  },[duty,id,dispatch])
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedTreatId, setSelectedTreatId] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  useEffect(() => {
    if (duty){
      setSelectedDoctorId(duty.doctor?.name);
      setSelectedPatientId(duty.patient?.name);
      setSelectedTreatId(duty.treat?.name);
      setNote(duty.note || '');
      setStatus(duty.status || '');
    }
  }, [duty]);

  const handleEdit = async (e) => {
  e.preventDefault();

  if (!id) {
    toast.error("Invalid ID for update.", { position: "top-right" });
    return;
  }

  const data = {
    
    treat_id: selectedTreatId,
    note,
    status
  };

  try {
    await dispatch(updateDuty({ data, id }));
    navigate("/admin/dutyDoctor");
    toast.success("Duty updated successfully!", { position: "top-right" });
  } catch (e) {
    toast.error(`Error updating duty: ${e.message}`, {
      position: "top-right",
    });
  }
};

 

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
          <ToastContainer
                position="top-center"
                autoClose={3000}   
          />
        {/* Header */}
        <div className="flex justify-between items-center border-b border-teal-100 p-5 bg-gradient-to-r from-teal-50 to-blue-50 rounded-t-xl">
          <h3 className="text-xl font-semibold text-teal-800">
            <FaTeeth className="inline mr-2"/>
            Update Dental Duty Assignment
          </h3>
          <button
            
            className="text-teal-600 hover:text-teal-800 transition-colors duration-200 p-1 rounded-full hover:bg-teal-100"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleEdit}>
          <div className="p-5 space-y-5">

            {/* Doctor Select */}
            <div className="relative">
              <label className="block text-sm font-medium text-teal-700 mb-1 ml-1">Dentist</label>
              <div className="relative">
                <select
                  name="doctor_id"
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all appearance-none"
                >
                 
                  {doctors?.map((doc) => (
                    <option key={doc.id} value={doc.id.toString()}>{doc.name}</option>
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
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-teal-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 transition-all appearance-none"
                >
                  
                  {patients?.map((patient) => (
                    <option key={patient.id} value={patient.id.toString()}>{patient.name}</option>
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
                value={selectedTreatId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  setSelectedTreatId(selectedId);

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
               
                {treats.map((t) => (
                  <option key={t.id} value={t.id.toString()}>{t.name}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>

            {/* Note */}
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
                  value="in_progress"
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
                    status === "complete"
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

export default EditeDuty;
