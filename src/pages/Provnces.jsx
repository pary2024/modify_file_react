import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import {
  createProvince,
  deleteProvince,
  fetchProvinces,
} from "../stores/provinceSlice";
const Provinces = () => {
  const { isDark } = useContext(ThemeContext);

  const dispatch = useDispatch();
  const { provinces } = useSelector((state) => state.province);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchProvinces());
  }, [dispatch]);
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

  // Auto-clear success message after 3 seconds

  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const handleSave = async (e) => {
    e.preventDefault();

    const data = {
      name: name,
    };
    try {
      await dispatch(createProvince(data));
      dispatch(fetchProvinces());
      Swal.fire({
        icon: "success",
        title: "Province created successfully!",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProvince(id));
      dispatch(fetchProvinces());
      Swal.fire({
        icon: "success",
        title: "Province deleted successfully!",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Province Management System
      </h1>

      {/* Search and Stats */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search provinces..."
            className="w-full p-2 border rounded dark:bg-gray-800 dark:text-white dark:border-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded shadow">
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Total Provinces
          </h3>
          <p className="text-xl font-bold">{provinces.length}</p>
        </div>
      </div>

      {/* Province Form */}
      <form
        onSubmit={handleSave}
        className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editId ? "Edit Province" : "Add New Province"}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Province Name*
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Province name"
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            required
          />
        </div>

        <div className="flex justify-end gap-2">
          {editId && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editId ? "Update Province" : "Add Province"}
          </button>
        </div>
      </form>

      {/* Provinces Table */}
      <div className="bg-white dark:bg-gray-800 rounded shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {provinces.length > 0 ? (
                provinces.map((province) => (
                  <tr
                    key={province.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {province.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(province)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(province.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {provinces.length === 0
                      ? "No provinces added yet"
                      : "No matching provinces found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Provinces;
