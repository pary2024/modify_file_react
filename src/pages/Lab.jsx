import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchLabs, createLab } from "../stores/labSlice";

const LabReport = () => {
  const { isDark } = useContext(ThemeContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [date, setDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Number of items per page

  const dispatch = useDispatch();
  const { labs, status, error } = useSelector((state) => state.lab);

  useEffect(() => {
    dispatch(fetchLabs());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const totalAmount = Array.isArray(labs)
    ? labs.reduce((sum, item) => {
        const amount = item.amount ?? item.price * item.qty;
        return sum + (Number(amount) || 0);
      }, 0)
    : null;

  const handleCreateLab = async (e) => {
    e.preventDefault();

    const lab = {
      description: description,
      price: price,
      qty: qty,
      date: date,
    };
    try {
      await dispatch(createLab(lab));
      setShowCreateForm(false);
      dispatch(fetchLabs());
      toast.success("Lab created successfully!", { position: "top-right" });
      setDescription("");
      setPrice("");
      setQty("");
      setDate("");
    } catch (e) {
      toast.error(`Error creating lab: ${e.message}`, {
        position: "top-right",
      });
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(labs)
    ? labs.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Array.isArray(labs)
    ? Math.ceil(labs.length / itemsPerPage)
    : 1;

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div
      className={`p-4 md:p-6 min-h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />

      <div className=" mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Dental Lab Reports
            </h1>
            <p
              className={`text-sm mt-1 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage all laboratory cases and materials
            </p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                showCreateForm
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              {showCreateForm ? "Cancel" : "New Lab Case"}
            </button>
          </div>
        </div>

        {/* Create Lab Material Form */}
        {showCreateForm && (
          <div
            className={`mb-8 p-4 md:p-6 rounded-xl shadow-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            } transition-all duration-300`}
          >
            <h3 className="text-xl font-semibold mb-4">New Laboratory Case</h3>
            <form onSubmit={handleCreateLab}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full p-2 md:p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="Case details (optional)"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Due Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full p-2 md:p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={`w-full p-2 md:p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="qty"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className={`w-full p-2 md:p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-70 flex items-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    "Save Lab Case"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Report Section */}
        <div
          className={`p-4 md:p-6 rounded-xl shadow-lg ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-blue-50"
              } border ${isDark ? "border-gray-600" : "border-blue-100"}`}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Cases
              </h3>
              <p className="text-2xl font-bold mt-1">{labs?.length || 0}</p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-green-50"
              } border ${isDark ? "border-gray-600" : "border-green-100"}`}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </h3>
              <p className="text-2xl font-bold mt-1">
                {labs?.filter((l) => l.status === "completed").length || 0}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-yellow-50"
              } border ${isDark ? "border-gray-600" : "border-yellow-100"}`}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                In Progress
              </h3>
              <p className="text-2xl font-bold mt-1">
                {labs?.filter((l) => l.status === "in-progress").length || 0}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDark ? "bg-gray-700" : "bg-purple-50"
              } border ${isDark ? "border-gray-600" : "border-purple-100"}`}
            >
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Cost
              </h3>
              <p class Pillow className="text-2xl font-bold mt-1">
                ${totalAmount}
              </p>
            </div>
          </div>

          {/* Lab Table */}
          {status === "loading" && !labs ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error && !labs ? (
            <div className="text-center py-10 text-red-500">
              Failed to load lab data. Please try again.
            </div>
          ) : Array.isArray(labs) && labs.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 md:px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                    isDark ? "bg-gray-800" : "bg-white"
                  }`}
                >
                  {currentItems.map((item, index) => (
                    <tr
                      key={index}
                      className={
                        item.status === "completed"
                          ? isDark
                            ? "bg-green-900/20"
                            : "bg-green-50"
                          : item.status === "delivered"
                          ? isDark
                            ? "bg-blue-900/20"
                            : "bg-blue-50"
                          : index % 2 === 0
                          ? isDark
                            ? "bg-gray-800"
                            : "bg-white"
                          : isDark
                          ? "bg-gray-700/50"
                          : "bg-gray-50"
                      }
                    >
                      <td
                        className="px-4 md:px-6 py-4 max-w-xs truncate"
                        title={item.description}
                      >
                        {item.id || "-"}
                      </td>
                      <td
                        className="px-4 md:px-6 py-4 max-w-xs truncate"
                        title={item.description}
                      >
                        {item.description || "-"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                        {new Date(item.date).toLocaleDateString() || "-"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                        ${item.price || "0.00"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right">
                        {item.qty || item.quantity || "0"}
                      </td>
                      <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right font-medium">
                        $
                        {item.amount ||
                          item.price * (item.qty || item.quantity) ||
                          0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No lab cases found. Create your first lab case to get started.
            </div>
          )}
          {/* Pagination Controls */}
          {Array.isArray(labs) && labs.length > itemsPerPage && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {indexOfFirstItem + 1} to{" "}
                {Math.min(indexOfLastItem, labs.length)} of {labs.length}{" "}
                entries
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border ${
                    isDark
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-300 bg-white"
                  } ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  Previous
                </button>
                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => paginate(page + 1)}
                    className={`px-3 py-1 rounded-lg border ${
                      isDark ? "border-gray-600" : "border-gray-300"
                    } ${
                      currentPage === page + 1
                        ? isDark
                          ? "bg-blue-600 text-white"
                          : "bg-blue-500 text-white"
                        : isDark
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border ${
                    isDark
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-300 bg-white"
                  } ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LabReport;
