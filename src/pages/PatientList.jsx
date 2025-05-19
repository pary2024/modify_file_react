import { useContext, useState } from "react";
import { PencilIcon, TrashIcon, MapPinIcon } from "@heroicons/react/24/solid";
import {
  UserIcon,
  IdentificationIcon,
  CalendarIcon,
  PhoneIcon,
  UserCircleIcon,
  ClipboardDocumentListIcon,
  HeartIcon,
  ClockIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { ThemeContext } from "../colors/Thems";

export default function PatientList() {
  const { isDark } = useContext(ThemeContext);
  const [patients, setPatients] = useState([]);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    disease: "",
    career: "",
    status: "Active",
    province: "", // Added
  });
  const [editPatient, setEditPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    phone: "",
    disease: "",
    career: "",
    status: "Active",
    province: "", // Added
  });
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditPatient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const patientWithId = {
      ...newPatient,
      id: Date.now(),
      registered: new Date().toISOString().split("T")[0],
    };
    setPatients((prev) => [...prev, patientWithId]);
    setNewPatient({
      name: "",
      age: "",
      gender: "Male",
      phone: "",
      disease: "",
      career: "",
      status: "Active",
      province: "",
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedList = patients.map((p) =>
      p.id === editingId
        ? { ...editPatient, id: editingId, registered: p.registered }
        : p
    );
    setPatients(updatedList);
    setEditingId(null);
    setShowEditModal(false);
  };

  const handleDelete = (id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className={`p-6 space-y-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-bold">Patient Registration</h1>

      {/* Create Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        {/* Existing inputs ... */}
        <input
          name="name"
          value={newPatient.name}
          onChange={handleNewInputChange}
          placeholder="Name"
          required
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        />
        <input
          name="age"
          value={newPatient.age}
          onChange={handleNewInputChange}
          type="number"
          placeholder="Age"
          required
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        />
        <select
          name="gender"
          value={newPatient.gender}
          onChange={handleNewInputChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        >
          <option>Male</option>
          <option>Female</option>
        </select>
        <input
          name="phone"
          value={newPatient.phone}
          onChange={handleNewInputChange}
          placeholder="Phone"
          required
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        />
        <input
          name="career"
          value={newPatient.career}
          onChange={handleNewInputChange}
          placeholder="Career"
          required
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        />
        <input
          name="disease"
          value={newPatient.disease}
          onChange={handleNewInputChange}
          placeholder="Disease"
          required
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        />
        <select
          name="status"
          value={newPatient.status}
          onChange={handleNewInputChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        >
          <option>Active</option>
          <option>Recovered</option>
          <option>Chronic</option>
        </select>
        {/* Province Input */}
        <input
          name="province"
          value={newPatient.province}
          onChange={handleNewInputChange}
          placeholder="Province"
          required
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
        />
        <button
          type="submit"
          className="col-span-2 ml-auto bg-blue-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Add Patient
        </button>
      </form>

      {/* Table */}
      <table className="w-full table-auto mt-4">
        <thead className={`${isDark ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'} text-sm`}>
          <tr>
            {/* Existing table headers */}
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <IdentificationIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                ID Code
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Name
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Age
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Gender
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Phone
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <HeartIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Disease
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <ClipboardDocumentListIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Status
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Registered
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Career
              </div>
            </th>
            {/* Province Column */}
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Province
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <Cog6ToothIcon className="w-4 h-4 text-gray-500 border-r border-gray-300 pr-2" />
                Actions
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="p-2">DT{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.age}</td>
              <td className="p-2">{p.gender}</td>
              <td className="p-2">{p.phone}</td>
              <td className="p-2">{p.disease}</td>
              <td className="p-2">
                <span className={`px-2 py-1 rounded-full text-white text-sm font-medium
                  ${p.status === "Active"
                    ? "bg-green-500"
                    : p.status === "Recovered"
                    ? "bg-blue-500"
                    : "bg-red-500"}`}>
                  {p.status}
                </span>
              </td>
              <td className="p-2">{p.registered}</td>
              <td className="p-2">{p.career}</td>
              <td className="p-2">{p.province}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => {
                    setEditPatient(p);
                    setEditingId(p.id);
                    setShowEditModal(true);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <PencilIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className={`p-6 rounded shadow-md w-[500px] ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-xl font-bold mb-4">Edit Patient</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Existing Edit Fields */}
                <input
                  name="name"
                  value={editPatient.name}
                  onChange={handleEditInputChange}
                  placeholder="Name"
                  required
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                />
                <input
                  name="age"
                  value={editPatient.age}
                  onChange={handleEditInputChange}
                  type="number"
                  placeholder="Age"
                  required
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                />
                <select
                  name="gender"
                  value={editPatient.gender}
                  onChange={handleEditInputChange}
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
                <input
                  name="phone"
                  value={editPatient.phone}
                  onChange={handleEditInputChange}
                  placeholder="Phone"
                  required
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                />
                <input
                  name="disease"
                  value={editPatient.disease}
                  onChange={handleEditInputChange}
                  placeholder="Disease"
                  required
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                />
                <input
                  name="career"
                  value={editPatient.career}
                  onChange={handleEditInputChange}
                  placeholder="Career"
                  required
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                />
                <select
                  name="status"
                  value={editPatient.status}
                  onChange={handleEditInputChange}
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                >
                  <option>Active</option>
                  <option>Recovered</option>
                  <option>Chronic</option>
                </select>
                {/* Province Input in Edit Modal */}
                <input
                  name="province"
                  value={editPatient.province}
                  onChange={handleEditInputChange}
                  placeholder="Province"
                  required
                  className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-black'}`}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
