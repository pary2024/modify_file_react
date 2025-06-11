import React, { useState, useEffect, useRef, useContext } from 'react';
import { Pencil, Trash2, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ThemeContext } from "../colors/Thems";

const Department = () => {
  const { isDark } = useContext(ThemeContext);
  const [departments, setDepartments] = useState([
    { id: 1, name: 'Orthodontics', description: 'Braces and teeth alignment', status: 'active' },
    { id: 2, name: 'Pediatric Dentistry', description: 'Dental care for children', status: 'active' },
    { id: 3, name: 'Endodontics', description: 'Root canal treatments', status: 'active' },
    { id: 4, name: 'Periodontics', description: 'Gum disease treatment', status: 'active' },
    { id: 5, name: 'Prosthodontics', description: 'Dental prosthetics', status: 'active' },
  ]);

  const [form, setForm] = useState({ name: '', description: '', status: 'active' });
  const [editingId, setEditingId] = useState(null);
  const [alert, setAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const modalRef = useRef(null);

  // Filter departments based on search term
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dept.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);

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
        id: Math.max(...departments.map(d => d.id)) + 1,
        ...form,
      };
      setDepartments([...departments, newDept]);
      showAlert('Department added successfully!');
    }

    setForm({ name: '', description: '', status: 'active' });
    setCurrentPage(1); // Reset to first page after adding/editing
  };

  const handleEdit = (dept) => {
    setForm({ name: dept.name, description: dept.description, status: dept.status });
    setEditingId(dept.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter((d) => d.id !== id));
      showAlert('Department deleted successfully!');
      // Adjust current page if we're on a page that would be empty after deletion
      if (currentDepartments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const toggleStatus = (id) => {
    setDepartments(departments.map(dept => 
      dept.id === id ? { 
        ...dept, 
        status: dept.status === 'active' ? 'inactive' : 'active' 
      } : dept
    ));
    showAlert('Department status updated!');
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
    setForm({ name: '', description: '', status: 'active' });
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={`${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} p-4 sm:p-6 lg:p-8 min-h-screen transition-colors duration-300`}>
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Department Management</h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
              Manage your dental clinic departments
            </p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus size={18} />
            Add Department
          </button>
        </div>

        {alert && (
          <div className={`${isDark ? 'bg-green-900 text-green-100' : 'bg-green-100 text-green-800'} mb-6 p-4 rounded-lg flex items-center justify-between border ${isDark ? 'border-green-700' : 'border-green-300'} animate-fade-in`}>
            <span>{alert}</span>
            <button onClick={() => setAlert(null)} className="text-green-500 hover:text-green-300">
              <X size={18} />
            </button>
          </div>
        )}

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-8 transition-colors duration-300`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search departments..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
              />
              <svg
                className={`absolute left-3 top-2.5 h-5 w-5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredDepartments.length)} of {filteredDepartments.length} departments
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {currentDepartments.length > 0 ? (
                  currentDepartments.map((dept) => (
                    <tr key={dept.id} className={`${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors duration-150`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {dept.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-medium">{dept.name}</span>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-xs">
                        <p className="truncate">{dept.description}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => toggleStatus(dept.id)}
                          className={`px-2 py-1 rounded-full text-xs font-medium ${dept.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} ${isDark && dept.status === 'active' ? '!bg-green-900 !text-green-100' : ''} ${isDark && dept.status === 'inactive' ? '!bg-red-900 !text-red-100' : ''}`}
                        >
                          {dept.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(dept)}
                            className={`p-1.5 rounded-md ${isDark ? 'text-blue-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-gray-100'} transition-colors duration-200`}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className={`p-1.5 rounded-md ${isDark ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-100'} transition-colors duration-200`}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm">
                      {searchTerm ? 'No departments match your search.' : 'No departments found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <ChevronLeft size={16} />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-md ${currentPage === page ? 'bg-blue-600 text-white' : isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md ${currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClickOutside}
        >
          <div
            ref={modalRef}
            className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl w-full max-w-md animate-scale-in`}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">
                {editingId ? 'Edit Department' : 'Add New Department'}
              </h3>
              <button
                onClick={closeModal}
                className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors duration-200`}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Department Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                    required
                    placeholder="e.g., Orthodontics"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                    required
                    placeholder="Brief description of the department"
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600 focus:border-blue-500' : 'border-gray-300 focus:border-blue-500'} focus:ring-2 focus:ring-blue-500 transition-colors duration-200`}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-200`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  {editingId ? 'Update Department' : 'Add Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;