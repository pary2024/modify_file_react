import React, { useState, useEffect, useRef, useContext } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { ThemeContext } from "../colors/Thems";

const Department = () => {
  const { isDark } = useContext(ThemeContext);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Orthodontics', description: 'Braces and teeth alignment' },
    { id: 2, name: 'Pediatric Dentistry', description: 'Dental care for children' },
  ]);

  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const storedAlert = sessionStorage.getItem('deptAlert');
    if (storedAlert) {
      setAlert(storedAlert);
      setTimeout(() => {
        setAlert(null);
        sessionStorage.removeItem('deptAlert');
      }, 3000);
    }
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingId) {
      const updated = departments.map((d) =>
        d.id === editingId ? { ...d, ...form } : d
      );
      setDepartments(updated);
      setEditingId(null);
      setIsModalOpen(false);
      showAlert('Department updated successfully!');
    } else {
      const newDept = {
        id: departments.length + 1,
        ...form,
      };
      setDepartments([...departments, newDept]);
      showAlert('Department added successfully!');
    }

    setForm({ name: '', description: '' });
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description });
    setEditingId(dept.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter((d) => d.id !== id));
      showAlert('Department deleted successfully!');
    }
  };

  const showAlert = (message) => {
    setAlert(message);
    sessionStorage.setItem('deptAlert', message);
    setTimeout(() => {
      setAlert(null);
      sessionStorage.removeItem('deptAlert');
    }, 3000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', description: '' });
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  return (
    <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} p-4 sm:p-6 lg:p-8 min-h-screen`}>
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6">Departments</h2>

        {alert && (
          <div className={`${isDark ? 'bg-green-900 text-green-100 border-green-400' : 'bg-green-50 text-green-800 border-green-500'} mb-6 p-4 border-l-4 rounded-r-lg animate-fade-in`}>
            {alert}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg mb-6`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Department Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter department name"
                value={form.name}
                onChange={handleChange}
                className={`w-full p-3 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Enter description"
                value={form.description}
                onChange={handleChange}
                className={`w-full p-3 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full sm:w-auto bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {editingId ? 'Update Department' : 'Add Department'}
          </button>
        </form>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={handleClickOutside}
          >
            <div
              ref={modalRef}
              className={`${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl shadow-xl w-full max-w-md p-6 relative animate-slide-down`}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <h3 className="text-xl font-semibold mb-4">Edit Department</h3>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
                      Department Name
                    </label>
                    <input
                      type="text"
                      id="edit-name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className={`w-full p-3 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-description" className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      id="edit-description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className={`w-full p-3 border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500`}
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
                  >
                    Update Department
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className={`${isDark ? 'bg-gray-700 text-white' : 'bg-gray-50 text-gray-700'}`}>
                <tr>
                  <th className="p-4 font-semibold">#</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className={`${isDark ? 'hover:bg-gray-700 border-gray-700' : 'hover:bg-gray-50 border-gray-200'} border-t transition-colors`}
                  >
                    <td className="p-4">{dept.id}</td>
                    <td className="p-4">{dept.name}</td>
                    <td className="p-4">{dept.description}</td>
                    <td className="p-4 flex space-x-3">
                      <button
                        onClick={() => handleEdit(dept)}
                        className="text-blue-500 hover:text-blue-700 p-1"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Department;
