import { useContext, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ThemeContext } from "../colors/Thems";
import {
  IdentificationIcon,
  UserIcon,
  CalendarIcon,
  AcademicCapIcon,
  BuildingLibraryIcon,
  UsersIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

export default function Student() {
  const { isDark } = useContext(ThemeContext);
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    gender: "Male",
    grade: "",
    school: "",
    parent: "",
    birthday: "",
    image: "",
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudent((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editStudentId
            ? { ...newStudent, id: student.id }
            : student
        )
      );
    } else {
      const studentWithId = {
        ...newStudent,
        id: Date.now(),
      };
      setStudents((prev) => [...prev, studentWithId]);
    }

    setNewStudent({
      name: "",
      age: "",
      gender: "Male",
      grade: "",
      school: "",
      parent: "",
      birthday: "",
      image: "",
    });
    setIsEditMode(false);
    setEditStudentId(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleEdit = (student) => {
    setIsEditMode(true);
    setEditStudentId(student.id);
    setNewStudent(student);
    setShowModal(true);
  };

  return (
    <div
      className={`p-6 space-y-6 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Student Dentists</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`border p-2 rounded ${
              isDark ? "bg-gray-800 text-white border-gray-600" : ""
            }`}
          />
          <button
            onClick={() => {
              setIsEditMode(false);
              setNewStudent({
                name: "",
                age: "",
                gender: "Male",
                grade: "",
                school: "",
                parent: "",
                birthday: "",
                image: "",
              });
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Add New Student
          </button>
        </div>
      </div>

      <table className="w-full table-auto mt-4">
        <thead
          className={`${
            isDark ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700"
          } text-sm`}
        >
          <tr>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <IdentificationIcon className="w-4 h-4 text-gray-500" />
                ID Card
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                Name
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                Age
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                Birthday
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-gray-500" />
                Gender
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <AcademicCapIcon className="w-4 h-4 text-gray-500" />
                Grade
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <BuildingLibraryIcon className="w-4 h-4 text-gray-500" />
                School
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <UsersIcon className="w-4 h-4 text-gray-500" />
                Parent
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-gray-500" />
                Status
              </div>
            </th>
            <th className="p-2 font-normal">
              <div className="flex items-center gap-2">
                <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
                Actions
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          {students
            .filter((s) =>
              s.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((s, index) => (
              <tr
                key={s.id}
                className={`text-center ${isDark ? "bg-gray-800" : ""}`}
              >
                <td className="p-2">DS0000{index + 1}</td>
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.age}</td>
                <td className="p-2">{s.birthday}</td>
                <td className="p-2">{s.gender}</td>
                <td className="p-2">{s.grade}</td>
                <td className="p-2">{s.school}</td>
                <td className="p-2">{s.parent}</td>
                <td className="p-2">Active</td>
                <td className="p-2 text-center">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`${
              isDark ? "bg-gray-800 text-white" : "bg-white text-black"
            } p-6 rounded shadow-md w-[500px]`}
          >
            <h2 className="text-xl font-bold mb-4">
              {isEditMode ? "Edit Student" : "Add Student"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              />
              <input
                name="age"
                value={newStudent.age}
                onChange={handleInputChange}
                type="number"
                placeholder="Age"
                required
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              />
              <input
                name="birthday"
                value={newStudent.birthday}
                onChange={handleInputChange}
                type="date"
                placeholder="Birthday"
                required
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              />
              <select
                name="gender"
                value={newStudent.gender}
                onChange={handleInputChange}
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              >
                <option>Male</option>
                <option>Female</option>
              </select>
              <input
                name="grade"
                value={newStudent.grade}
                onChange={handleInputChange}
                placeholder="Grade (e.g. 10th)"
                required
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              />
              <input
                name="school"
                value={newStudent.school}
                onChange={handleInputChange}
                placeholder="School Name"
                required
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              />
              <input
                name="parent"
                value={newStudent.parent}
                onChange={handleInputChange}
                placeholder="Parent Name"
                required
                className={`border p-2 w-full rounded ${
                  isDark ? "bg-gray-700 text-white border-gray-600" : ""
                }`}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-4 py-2 border rounded ${
                    isDark ? "border-gray-400" : ""
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
