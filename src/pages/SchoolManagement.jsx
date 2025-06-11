import React, { useState, useEffect, useContext } from "react";
import { ThemeContext } from "../colors/Thems";
import { useDispatch, useSelector } from "react-redux";
import { createSchool, fetchSchools } from "../stores/schoolSlice";
import { fetchProvinces } from "../stores/provinceSlice";
import { fetchUsers } from "../stores/userSlice";

const SchoolManagement = () => {
  const { isDark } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const { schools, school, status, error } = useSelector((state) => state.school);
  const { provinces } = useSelector((state) => state.province);
  const { users } = useSelector((state) => state.user);

  const [editMode, setEditMode] = useState(false);
  const [currentSchoolId, setCurrentSchoolId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [successMessage, setSuccessMessage] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [province_id, setProvince] = useState("");
  const [tabLine, setTabline] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: "", province_id: "" });
  const [alertMessage, setAlertMessage] = useState(null); 

  useEffect(() => {
    dispatch(fetchSchools());
    dispatch(fetchUsers());
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

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const validateForm = () => {
    const errors = { name: "", province_id: "" };
    let isValid = true;

    if (!name.trim()) {
      errors.name = "School name is required";
      isValid = false;
    }
    if (!province_id) {
      errors.province_id = "Please select a province";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview("");
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", name);
    data.append("location", location);
    data.append("province_id", province_id);
    data.append("tabLine", tabLine);
    if (image) data.append("image", image);

    try {
      if (editMode) {
        await dispatch(updateSchool({ id: currentSchoolId, data }));
      } else {
        await dispatch(createSchool(data));
      }
      dispatch(fetchSchools());
       Swal.fire({
              icon: "success",
              title: "School created successfully!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });

      // Reset form
      setName("");
      setLocation("");
      setProvince("");
      setTabline("");
      setImage(null);
      setImagePreview("");
      setEditMode(false);
      setCurrentSchoolId(null);
      setIsFormExpanded(false);
      setFormErrors({ name: "", province_id: "" });
    } catch (e) {
       Swal.fire({
              icon: "success",
              title: "School created erorr!",
              showConfirmButton: false,
              timer: 1500,
              position: "top-end",
            });
    }
  };

  const handleEdit = (school) => {
    setEditMode(true);
    setCurrentSchoolId(school.id);
    setName(school.name);
    setLocation(school.location || "");
    setProvince(school.province_id || "");
    setTabline(school.tabLine || "");
    setImagePreview(school.image || "");
    setImage(null); // File input cannot be pre-filled
    setIsFormExpanded(true);
    setFormErrors({ name: "", province_id: "" });
  };

  const handleCancel = () => {
    setEditMode(false);
    setCurrentSchoolId(null);
    setName("");
    setLocation("");
    setProvince("");
    setTabline("");
    setImage(null);
    setImagePreview("");
    setIsFormExpanded(false);
    setFormErrors({ name: "", province_id: "" });
  };

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedSchools = React.useMemo(() => {
    if (!schools || !Array.isArray(schools)) return [];

    let sortableItems = [...schools];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "user_id") {
          aValue = a.user?.name || "";
          bValue = b.user?.name || "";
        } else if (sortConfig.key === "province_id") {
          aValue = a.province?.name || "";
          bValue = b.province?.name || "";
        } else {
          aValue = a[sortConfig.key] || "";
          bValue = b[sortConfig.key] || "";
        }

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      sortableItems = sortableItems.filter(
        (school) =>
          school.name.toLowerCase().includes(term) ||
          (school.location && school.location.toLowerCase().includes(term)) ||
          (school.tabLine && school.tabLine.toLowerCase().includes(term)) ||
          (school.province?.name &&
            school.province.name.toLowerCase().includes(term)) ||
          (school.user?.name && school.user.name.toLowerCase().includes(term))
      );
    }

    return sortableItems;
  }, [schools, sortConfig, searchTerm]);

  const getFilteredSchoolsCount = () => {
    return sortedSchools.length;
  };

  return (
    <div
      className={`container mx-auto p-4 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-8 text-center tracking-tight">
        School Management System
      </h1>

      {/* Status Messages */}
      <div className="mb-6 space-y-3" role="alert" aria-live="assertive">
        {successMessage && (
          <div
            className="p-4 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-lg shadow-md flex items-center animate-fade-in"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {successMessage}
          </div>
        )}

        {error && (
          <div
            className="p-4 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 rounded-lg shadow-md flex items-center animate-fade-in"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            Error: {error}
          </div>
        )}

        {status === "loading" && (
          <div
            className="p-4 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-lg shadow-md flex items-center justify-center animate-pulse"
          >
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 dark:border-blue-300 mr-2"></div>
            Loading...
          </div>
        )}
      </div>

      {/* Search and Add School Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="w-full md:w-1/2 relative">
          <input
            type="text"
            placeholder="Search by name, location, province, or admin..."
            className={`w-full p-3 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
              isDark
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search schools"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="Clear search"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          {searchTerm && (
            <p className="text-sm mt-2 text-gray-500 dark:text-gray-400">
              Showing {getFilteredSchoolsCount()} of{" "}
              {Array.isArray(schools) ? schools.length : 0} schools
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setIsFormExpanded(!isFormExpanded);
            if (editMode && isFormExpanded) handleCancel();
          }}
          className={`px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors ${
            isFormExpanded
              ? "bg-gray-500 hover:bg-gray-600 text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
          aria-expanded={isFormExpanded}
        >
          {isFormExpanded ? "Close Form" : "+ Add New School"}
        </button>
      </div>

      {/* School Form - Collapsible */}
      {isFormExpanded && (
        <form
          onSubmit={handleSave}
          className={`p-6 rounded-lg shadow-lg mb-8 transition-all duration-300 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-semibold mb-6">
            {editMode ? "Edit School" : "Add New School"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                School Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter school name"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                } ${formErrors.name ? "border-red-500" : ""}`}
                required
                aria-invalid={formErrors.name ? "true" : "false"}
                aria-describedby={formErrors.name ? "name-error" : undefined}
              />
              {formErrors.name && (
                <p id="name-error" className="text-sm text-red-500 mt-1">
                  {formErrors.name}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="province_id"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Province <span className="text-red-500">*</span>
              </label>
              <select
                id="province_id"
                name="province_id"
                value={province_id}
                onChange={(e) => setProvince(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                } ${formErrors.province_id ? "border-red-500" : ""}`}
                required
                aria-invalid={formErrors.province_id ? "true" : "false"}
                aria-describedby={formErrors.province_id ? "province-error" : undefined}
              >
                <option value="">Select a province</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.name}
                  </option>
                ))}
              </select>
              {formErrors.province_id && (
                <p id="province-error" className="text-sm text-red-500 mt-1">
                  {formErrors.province_id}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter school location (e.g., 123 Main St)"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              />
            </div>
            <div>
              <label
                htmlFor="tabLine"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                Tab Line
              </label>
              <input
                id="tabLine"
                type="text"
                name="tabLine"
                value={tabLine}
                onChange={(e) => setTabline(e.target.value)}
                placeholder="Enter tab line (e.g., High School)"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${
                  isDark
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
              />
            </div>
            <div className="md:col-span-2">
              <label
                htmlFor="image"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
              >
                School Image
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    id="image"
                    type="file"
                    name="image"
                    onChange={handleImageChange}
                    accept="image/*"
                    className={`w-full p-3 border rounded-lg ${
                      isDark
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-white text-gray-900 border-gray-300"
                    }`}
                  />
                </div>
                {imagePreview ? (
                  <div className="relative w-16 h-16 border rounded-lg overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={clearImage}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      aria-label="Clear image"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
                Recommended size: 300x300 pixels, max 2MB
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              aria-label="Cancel form"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
              disabled={status === "loading"}
              aria-label={editMode ? "Update School" : "Save School"}
            >
              {editMode ? "Update School" : "Save School"}
            </button>
          </div>
        </form>
      )}

      {/* Schools Table */}
      <div
        className={`rounded-lg shadow-lg overflow-hidden mb-8 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="overflow-x-auto scrollbar-hide">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
            <thead className={isDark ? "bg-gray-700" : "bg-gray-50"}>
              <tr>
                {[
                  { key: "id", label: "ID" },
                  { key: "name", label: "Name" },
                  { key: "user_id", label: "Admin" },
                  { key: "province_id", label: "Province" },
                  { key: "tabLine", label: "Tab Line" },
                  { key: "location", label: "Location" },
                  { key: "image", label: "Image" },
                ].map((column) => (
                  <th
                    key={column.key}
                    className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider transition-colors ${
                      isDark
                        ? "text-gray-300 hover:bg-gray-600"
                        : "text-gray-500 hover:bg-gray-100"
                    } ${column.key === sortConfig.key ? "bg-gray-200 dark:bg-gray-600" : ""} ${
                      column.key !== "image" ? "cursor-pointer" : ""
                    }`}
                    onClick={() => column.key !== "image" && requestSort(column.key)}
                    aria-sort={
                      sortConfig.key === column.key
                        ? sortConfig.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                    }
                  >
                    <div className="flex items-center">
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span className="ml-2 text-blue-500 dark:text-blue-400">
                          {sortConfig.direction === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                <th
                  className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-500"
                  }`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDark ? "divide-gray-700" : "divide-gray-200"}`}>
              {sortedSchools.length > 0 ? (
                sortedSchools.map((school) => (
                  <tr
                    key={school.id}
                    className={`transition-all duration-200 ${
                      isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{school.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-sm">
                      {school.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {school.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {school.province?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {school.tabLine || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {school.location || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {school.image ? (
                        <img
                          src={school.image}
                          alt={school.name}
                          className="h-10 w-10 object-cover rounded-lg shadow-sm"
                        />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                          No Image
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-3">
                      <button
                        onClick={() => handleEdit(school)}
                        className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Edit school"
                        aria-label={`Edit ${school.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(school.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Delete school"
                        aria-label={`Delete ${school.name}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                  >
                    {status === "loading" ? (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-lg mb-4">
                          {searchTerm
                            ? "No matching schools found"
                            : "No schools added yet"}
                        </p>
                        {!searchTerm && (
                          <button
                            onClick={() => setIsFormExpanded(true)}
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add Your First School
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
            Total Schools
          </h3>
          <p className="text-4xl font-bold mt-2">
            {Array.isArray(schools) ? schools.length : 0}
          </p>
        </div>
        <div
          className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
            Schools with Images
          </h3>
          <p className="text-4xl font-bold mt-2">
            {Array.isArray(schools)
              ? schools.filter((school) => school.image).length
              : 0}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Array.isArray(schools) && schools.length > 0
              ? `${Math.round(
                  (schools.filter((school) => school.image).length /
                    schools.length) *
                    100
                )}% coverage`
              : ""}
          </p>
        </div>
        <div
          className={`p-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3 className="font-medium text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
            Currently Showing
          </h3>
          <p className="text-4xl font-bold mt-2">{getFilteredSchoolsCount()}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {searchTerm ? "Filtered results" : "All schools"}
          </p>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SchoolManagement;