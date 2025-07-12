import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import { createTreat, fetchTreats } from "../stores/treatSlice";

const Treat = () => {
  const { isDark } = useContext(ThemeContext);
  const { treats } = useSelector((state) => state.treat);
  const dispatch = useDispatch();
  const [treatments, setTreatments] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");
  // UX: Add loading state for fetching treatments
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    // UX: Set loading state during fetch
    setIsLoading(true);
    dispatch(fetchTreats()).finally(() => setIsLoading(false));
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

  // Ensure treatments is an array before filtering
  const filteredTreatments = Array.isArray(treats)
    ? treats.filter((treatment) =>
        treatment.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleCreate = async (e) => {
    e.preventDefault();
    const newTreat = {
      name: name,
    };
    try {
      await dispatch(createTreat(newTreat));
      dispatch(fetchTreats());
      setShowForm(false);
      Swal.fire({
        icon: "success",
        title: "Treatment created successfully!",
        showConfirmButton: false,
        timer: 1500,
        position: "top-end",
      });
      setName("");
    } catch (e) {
      setError("Error creating treat");
    }
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <h1 className="text-2xl font-bold mb-6 text-center">
        Dental Treatment Management
      </h1>

      {/* UX: Enhanced error message with dismiss button and ARIA alert */}
      {error && (
        <div
          role="alert"
          className="mb-4 p-3 bg-red-100 text-red-700 rounded flex justify-between items-center"
        >
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-700 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search by treatment name..."
            className={`w-full p-2 border rounded pr-10 ${
              isDark
                ? "bg-gray-800 border-gray-600 text-white"
                : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search treatments"
          />
          {/* UX: Add clear search button */}
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              showForm ? "bg-red-600 hover:bg-red-700" : ""
            }`}
            aria-label={showForm ? "Hide form" : "Add new treatment"}
          >
            {showForm ? "Hide Form" : "Add New Treatment"}
          </button>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className={`p-4 rounded shadow mb-6 ${
            isDark ? "bg-gray-800 text-white" : "bg-white"
          }`}
        >
          <h2 className="text-xl font-semibold mb-4">
            {editId ? "Edit Treatment" : "Add New Treatment"}
          </h2>
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Treatment Name
                <span className="text-red-500" aria-hidden="true">
                  *
                </span>
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className={`w-full p-2 border rounded ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                required
                aria-required="true"
                placeholder="Enter treatment name"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              aria-label="Cancel form"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              aria-label={editId ? "Update treatment" : "Add treatment"}
            >
              {editId ? "Update Treatment" : "Add Treatment"}
            </button>
          </div>
        </form>
      )}

      <div
        className={`rounded shadow overflow-hidden ${
          isDark ? "bg-gray-800 text-white" : "bg-white"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Treatment Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  User ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                isDark ? "bg-gray-800" : "bg-white"
              } divide-y divide-gray-200`}
            >
              {/* UX: Show loading state */}
              {isLoading ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    <div className="flex justify-center items-center">
                      <svg
                        className="animate-spin h-5 w-5 text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="ml-2">Loading treatments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTreatments.length > 0 ? (
                filteredTreatments.map((treatment) => (
                  <tr
                    key={treatment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {treatment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {treatment.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(treatment)}
                        className="text-blue-600 hover:text-blue-900 focus:outline-none focus:underline"
                        aria-label={`Edit ${treatment.name}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(treatment.id)}
                        className="text-red-600 hover:text-red-900 focus:outline-none focus:underline"
                        aria-label={`Delete ${treatment.name}`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {treatments.length === 0
                      ? "No treatments added yet"
                      : "No matching treatments found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className={`p-4 rounded shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Total Treatments
          </h3>
          <p className="text-2xl font-bold">{treats.length}</p>
        </div>
        <div
          className={`p-4 rounded shadow ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            Unique Users
          </h3>
          <p className="text-2xl font-bold">
            {Array.isArray(treats)
              ? [...new Set(treats.map((t) => t.user_id))].length
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Treat;
