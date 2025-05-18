import React, { useState, useRef, useEffect, useContext } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ThemeContext } from "../colors/Thems";

const Doctor = () => {
  const { isDark } = useContext(ThemeContext);
  const [doctors, setDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Ayesha Malik',
      specialty: 'Orthodontist',
      email: 'ayesha@clinic.com',
      status: 'Available',
    },
    {
      id: 2,
      name: 'Dr. Ahmed Zafar',
      specialty: 'General Dentist',
      email: 'ahmed@clinic.com',
      status: 'On Leave',
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    specialty: '',
    email: '',
    status: 'Available',
  });

  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      const updatedDoctors = doctors.map((doc) =>
        doc.id === editingId ? { ...doc, ...form } : doc
      );
      setDoctors(updatedDoctors);
      setAlert('Doctor updated successfully!');
      setEditingId(null);
      setIsModalOpen(false);
    } else {
      const newDoctor = {
        id: doctors.length + 1,
        ...form,
      };
      setDoctors([...doctors, newDoctor]);
      setAlert('Doctor added successfully!');
    }

    setForm({ name: '', specialty: '', email: '', status: 'Available' });

    setTimeout(() => setAlert(null), 3000);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter((doc) => doc.id !== id));
      setAlert('Doctor deleted successfully!');
      setTimeout(() => setAlert(null), 3000);
    }
  };

  const handleEdit = (doc) => {
    setForm({
      name: doc.name,
      specialty: doc.specialty,
      email: doc.email,
      status: doc.status,
    });
    setEditingId(doc.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', specialty: '', email: '', status: 'Available' });
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4">Doctors</h2>

      {alert && (
        <div
          className={`mb-4 p-3 border rounded w-fit animate-fade-in ${
            isDark
              ? 'bg-green-900 text-green-300 border-green-700'
              : 'bg-green-100 text-green-800 border-green-300'
          }`}
        >
          {alert}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded mb-6 ${
          isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        <input
          type="text"
          name="name"
          placeholder="Doctor Name"
          value={form.name}
          onChange={handleChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
          required
        />
        <input
          type="text"
          name="specialty"
          placeholder="Specialty"
          value={form.specialty}
          onChange={handleChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
          required
        />
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className={`border p-2 rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
        >
          <option value="Available">Available</option>
          <option value="On Leave">On Leave</option>
        </select>
        <button
          type="submit"
          className="col-span-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Update Doctor' : 'Add Doctor'}
        </button>
      </form>

      <div className={`overflow-x-auto rounded shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        <table className="min-w-full text-sm text-left">
          <thead className={`${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Specialty</th>
              <th className="p-3">Email</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doc) => (
              <tr key={doc.id} className="border-t">
                <td className="p-3">{doc.id}</td>
                <td className="p-3">{doc.name}</td>
                <td className="p-3">{doc.specialty}</td>
                <td className="p-3">{doc.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      doc.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    {doc.status}
                  </span>
                </td>
                <td className="p-3 flex space-x-2">
                  <button
                    onClick={() => handleEdit(doc)}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing Doctor */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className={`rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-down relative ${
              isDark ? 'bg-gray-800 text-white' : 'bg-white text-black'
            }`}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
              aria-label="Close"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">Edit Doctor</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Doctor Name"
                value={form.name}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
                required
              />
              <input
                type="text"
                name="specialty"
                placeholder="Specialty"
                value={form.specialty}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
                required
              />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={`w-full p-2 border rounded ${isDark ? 'bg-gray-700 text-white' : ''}`}
              >
                <option value="Available">Available</option>
                <option value="On Leave">On Leave</option>
              </select>
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctor;
