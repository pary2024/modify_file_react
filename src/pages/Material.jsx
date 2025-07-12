import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../Colors/Themes";
import { useDispatch, useSelector } from "react-redux";
import { createMaterial, fetchMaterials } from "../stores/materialSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Plus, X, ChevronLeft, ChevronRight, Search, Info } from "lucide-react";

const Material = () => {
  const { isDark } = useContext(ThemeContext);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [qty, setQty] = useState("");
  const [date, setDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const dispatch = useDispatch();
  const { materials, status, error } = useSelector((state) => state.material);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const filteredMaterials = materials.filter(
    (material) =>
      material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.price?.toString().includes(searchTerm) ||
      material.qty?.toString().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMaterials = filteredMaterials.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage) || 1; // Ensure at least 1 page

  const handleCreate = async (e) => {
    e.preventDefault();

    if (price === "" || Number(price) < 0) {
      toast.error("Please enter a valid price", { position: "top-center" });
      return;
    }

    if (qty === "" || Number(qty) < 1) {
      toast.error("Please enter a valid quantity (minimum 1)", {
        position: "top-center",
      });
      return;
    }

    const data = {
      description: description,
      price: price,
      qty: qty,
      date: date,
    };

    try {
      await dispatch(createMaterial(data));
      toast.success("Material created successfully!", {
        position: "top-right",
      });
      dispatch(fetchMaterials());
      setShowCreateForm(false);
      setDescription("");
      setPrice("");
      setQty("");
      setDate("");
    } catch (e) {
      toast.error(`Error creating material: ${e.message}`, {
        position: "top-right",
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const calculateTotalValue = () => {
    return filteredMaterials
      .reduce((total, item) => {
        return total + item.price * (item.qty || item.quantity || 0);
      }, 0)
      .toFixed(2);
  };

  // Generate pagination buttons
  const getPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5; // Maximum number of page buttons to show
    let startPage, endPage;

    // Determine the range of pages to show
    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBefore = Math.floor(maxButtons / 2);
      const maxPagesAfter = Math.ceil(maxButtons / 2) - 1;

      if (currentPage <= maxPagesBefore) {
        startPage = 1;
        endPage = maxButtons;
      } else if (currentPage + maxPagesAfter >= totalPages) {
        startPage = totalPages - maxButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBefore;
        endPage = currentPage + maxPagesAfter;
      }
    }

    // Add first page and ellipsis
    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === 1
              ? isDark
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-blue-500 border-blue-500 text-white"
              : isDark
              ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(
          <span
            key="start-ellipsis"
            className="relative inline-flex items-center px-4 py-2 text-sm text-gray-500"
          >
            ...
          </span>
        );
      }
    }

    // Add page buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === i
              ? isDark
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-blue-500 border-blue-500 text-white"
              : isDark
              ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(
          <span
            key="end-ellipsis"
            className="relative inline-flex items-center px-4 py-2 text-sm text-gray-500"
          >
            ...
          </span>
        );
      }
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            currentPage === totalPages
              ? isDark
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-blue-500 border-blue-500 text-white"
              : isDark
              ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div
      className={`p-4 md:p-8 min-h-screen transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme={isDark ? "dark" : "light"}
      />

      <div className=" mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Material Inventory
            </h1>
            <p
              className={`text-sm ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Manage dental clinic materials and supplies
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div
              className={`relative flex-grow ${
                showCreateForm ? "hidden sm:block" : ""
              }`}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className={`pl-10 pr-4 py-2 w-full rounded-lg border focus:outline-none focus:ring-2 ${
                  isDark
                    ? "bg-gray-800 border-gray-700 focus:ring-blue-500"
                    : "bg-white border-gray-300 focus:ring-blue-400"
                }`}
              />
            </div>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showCreateForm
                  ? isDark
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-red-500 hover:bg-red-600 text-white"
                  : isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {showCreateForm ? (
                <>
                  <X size={18} />
                  Cancel
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Material
                </>
              )}
            </button>
          </div>
        </div>

        {/* Create Material Form */}
        {showCreateForm && (
          <div
            className={`mb-8 p-6 rounded-xl shadow-lg transition-all duration-300 ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Add New Material</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className={`p-1 rounded-full ${
                  isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
                }`}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="e.g. Dental floss, Anesthetic..."
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Description (Optional)
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="e.g. Dental floss, Anesthetic..."
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Unit Price ($)
                  </label>
                  <div className="relative">
                    <span
                      className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      $
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className={`w-full pl-8 pr-3 py-3 rounded-lg border focus:outline-none focus:ring-1 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                          : "bg-white border-gray-300 focus:ring-blue-400"
                      }`}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Initial Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-1 ${
                      isDark
                        ? "bg-gray-700 border-gray-600 focus:ring-blue-500"
                        : "bg-white border-gray-300 focus:ring-blue-400"
                    }`}
                    placeholder="1"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={`px-5 py-2 rounded-lg border transition-colors ${
                    isDark
                      ? "border-gray-600 hover:bg-gray-700"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-lg transition-colors ${
                    isDark
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Materials Card */}
          <div
            className={`p-4 rounded-xl shadow ${
              isDark
                ? "bg-blue-900/30 border border-blue-800"
                : "bg-blue-50 border border-blue-100"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-blue-300" : "text-blue-600"
              }`}
            >
              Total Materials
            </h3>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {filteredMaterials.length}
            </p>
          </div>

          {/* Total Items Card */}
          <div
            className={`p-4 rounded-xl shadow ${
              isDark
                ? "bg-green-900/30 border border-green-800"
                : "bg-green-50 border border-green-100"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-green-300" : "text-green-600"
              }`}
            >
              Total Items
            </h3>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {filteredMaterials.reduce(
                (sum, item) => sum + (item.qty || item.quantity || 0),
                0
              )}
            </p>
          </div>

          {/* Total Value Card */}
          <div
            className={`p-4 rounded-xl shadow ${
              isDark
                ? "bg-purple-900/30 border border-purple-800"
                : "bg-purple-50 border border-purple-100"
            }`}
          >
            <h3
              className={`text-sm font-medium ${
                isDark ? "text-purple-300" : "text-purple-600"
              }`}
            >
              Total Value
            </h3>
            <p
              className={`text-2xl font-bold mt-1 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              ${calculateTotalValue()}
            </p>
          </div>
        </div>

        {/* Materials Table */}
        <div
          className={`rounded-xl shadow-lg overflow-hidden ${
            isDark
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200"
          }`}
        >
          {status === "loading" ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading materials...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              <p>Error loading materials: {error}</p>
            </div>
          ) : filteredMaterials.length === 0 ? (
            <div className="p-8 text-center">
              <div className="flex justify-center">
                <Info size={48} className="text-gray-400" />
              </div>
              <p className="mt-4 text-gray-500">
                {searchTerm
                  ? "No materials match your search"
                  : "No materials available"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Add Your First Material
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      >
                        Date curently
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                      >
                        Unit Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                      >
                        Quantity
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                      >
                        Total Value
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-gray-200 dark:divide-gray-700 ${
                      isDark ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    {currentMaterials.map((item, index) => (
                      <tr
                        key={index}
                        className={`hover:${
                          isDark ? "bg-gray-700/50" : "bg-gray-50"
                        } transition-colors`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                          <div className="text-sm font-medium">
                            {item.id || (
                              <span className="italic text-gray-400">
                                No description
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                          <div className="text-sm font-medium truncate max-w-xs">
                            {item.description || (
                              <span className="italic text-gray-400">
                                No description
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap max-w-xs">
                          <div className="text-sm font-medium truncate max-w-xs">
                            {item.date || (
                              <span className="italic text-gray-400">
                                No Date
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          ${Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {item.qty || item.quantity || "0"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          $
                          {(
                            item.price * (item.qty || item.quantity || 0)
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div
                className={`px-4 py-3 flex items-center justify-between border-t ${
                  isDark
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-gray-50"
                } sm:px-6`}
              >
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      isDark
                        ? "border-gray-700 bg-gray-700 text-gray-300 disabled:opacity-50"
                        : "border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                      isDark
                        ? "border-gray-700 bg-gray-700 text-gray-300 disabled:opacity-50"
                        : "border-gray-300 bg-white text-gray-700 disabled:opacity-50"
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstItem + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredMaterials.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {filteredMaterials.length}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${
                          isDark
                            ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        }`}
                      >
                        <span className="sr-only">First</span>
                        <ChevronLeft className="h-5 w-5" />
                        <ChevronLeft className="h-5 w-5 -ml-2" />
                      </button>
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 border ${
                          isDark
                            ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {getPaginationButtons()}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 border ${
                          isDark
                            ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${
                          isDark
                            ? "border-gray-700 bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50"
                            : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        }`}
                      >
                        <span className="sr-only">Last</span>
                        <ChevronRight className="h-5 w-5" />
                        <ChevronRight className="h-5 w-5 -ml-2" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Material;
