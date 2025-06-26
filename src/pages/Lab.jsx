import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../colors/Thems';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {fetchLabs} from "../stores/labSlice";

const LabReport = () => {
  const { isDark } = useContext(ThemeContext);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    labType: 'crown',
    status: 'pending'
  });
  const dispatch = useDispatch();
  const { data: labs, loading, error } = useSelector((state) => state.lab);

  useEffect(() => {
    dispatch(fetchLabs({ startDate, endDate }));
  }, [dispatch, startDate, endDate]);

  const handleGenerateReport = () => {
    if (startDate && endDate && startDate > endDate) {
      toast.error('Start date cannot be after end date');
      return;
    }
    dispatch(fetchLabs({ startDate, endDate }));
  };

  const handleCreateMaterial = () => {
    if (!newMaterial.name || !newMaterial.price || !newMaterial.quantity) {
      toast.error('Please fill all required fields');
      return;
    }
    dispatch(createLabMaterial(newMaterial))
      .unwrap()
      .then(() => {
        toast.success('Lab material created successfully');
        setShowCreateForm(false);
        setNewMaterial({
          name: '',
          description: '',
          price: '',
          quantity: '',
          labType: 'crown',
          
        });
        dispatch(fetchLabs({ startDate, endDate }));
      })
      .catch((err) => {
        toast.error(`Error creating lab material: ${err.message}`);
      });
  };

  const totalAmount = Array.isArray(labs)
    ? labs.reduce((sum, item) => sum + (item.amount || item.price * item.qty), 0)
    : 0;

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} />
      
      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Dental Clinic Lab Management</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              {showCreateForm ? 'Cancel' : 'Add Lab Material'}
            </button>
          </div>
        </div>

        {/* Create Lab Material Form */}
        {showCreateForm && (
          <div className={`mb-8 p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'} transition-all duration-300`}>
            <h3 className="text-xl font-semibold mb-4">Add New Lab Material</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 text-sm font-medium">Name *</label>
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="e.g. Porcelain Crown"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Lab Type</label>
                <select
                  value={newMaterial.labType}
                  onChange={(e) => setNewMaterial({...newMaterial, labType: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="crown">Crown</option>
                  <option value="bridge">Bridge</option>
                  <option value="denture">Denture</option>
                  <option value="implant">Implant</option>
                  <option value="orthodontic">Orthodontic</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Description</label>
                <input
                  type="text"
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="Optional description"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Status</label>
                <select
                  value={newMaterial.status}
                  onChange={(e) => setNewMaterial({...newMaterial, status: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Price (USD) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newMaterial.price}
                  onChange={(e) => setNewMaterial({...newMaterial, price: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={newMaterial.quantity}
                  onChange={(e) => setNewMaterial({...newMaterial, quantity: e.target.value})}
                  className={`w-full p-3 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="1"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateMaterial}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Save Lab Material
              </button>
            </div>
          </div>
        )}

        {/* Report Section */}
        <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h3 className="text-xl font-semibold mb-4 md:mb-0">Lab Usage Report</h3>
            
            {/* Date Filter */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={`border rounded-lg p-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={`border rounded-lg p-2 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                />
              </div>

              <button
                onClick={handleGenerateReport}
                className="mt-5 md:mt-0 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
                Generate Report
              </button>
            </div>
          </div>

          {/* Lab Table */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
          
          {error && (
            <div className={`p-4 rounded-lg mb-6 ${isDark ? 'bg-red-900/50' : 'bg-red-100'}`}>
              <p className="text-red-500">Error: {error}</p>
            </div>
          )}
          
          {!loading && !error && (!Array.isArray(labs) || labs.length === 0) && (
            <div className={`p-8 text-center rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
              <p className="text-gray-500 dark:text-gray-400">No lab data available for the selected date range.</p>
            </div>
          )}
          
          {!loading && !error && Array.isArray(labs) && labs.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Qty</th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  {labs.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? (isDark ? 'bg-gray-800' : 'bg-white') : (isDark ? 'bg-gray-700/50' : 'bg-gray-50')}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.labType === 'crown' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                          item.labType === 'bridge' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300' :
                          item.labType === 'denture' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                          item.labType === 'implant' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {item.labType || 'other'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap max-w-xs truncate" title={item.description}>
                        {item.description || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">${item.price?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">{item.qty || item.quantity || '0'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                        ${(item.amount || item.price * (item.qty || item.quantity) || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className={`font-bold ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <td colSpan="6" className="px-6 py-4 text-right">Total</td>
                    <td className="px-6 py-4 text-right">${totalAmount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReport;