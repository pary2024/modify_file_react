import React, { useContext, useState } from 'react';
import { ThemeContext } from '../colors/Thems';

const HumanResources = () => {
  const { isDark } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample HR data
  const staff = [
    {
      id: 1,
      name: 'Dr. Sarah Lee',
      role: 'Dentist',
      department: 'Dental',
      contact: 'sarah@example.com',
      status: 'Active',
      hireDate: '2020-05-15',
      salary: '$85,000',
      skills: ['Periodontics', 'Cosmetic Dentistry'],
    },
    {
      id: 2,
      name: 'Ali Khan',
      role: 'Receptionist',
      department: 'Front Desk',
      contact: 'ali@example.com',
      status: 'On Leave',
      hireDate: '2021-02-10',
      salary: '$42,000',
      skills: ['Customer Service', 'Scheduling'],
    },
    {
      id: 3,
      name: 'Dr. Michael Chen',
      role: 'Orthodontist',
      department: 'Dental',
      contact: 'michael@example.com',
      status: 'Active',
      hireDate: '2019-08-22',
      salary: '$92,000',
      skills: ['Braces', 'Aligners'],
    },
    {
      id: 4,
      name: 'Nurse Jessica Wong',
      role: 'Dental Nurse',
      department: 'Dental',
      contact: 'jessica@example.com',
      status: 'Active',
      hireDate: '2022-01-05',
      salary: '$48,000',
      skills: ['Sterilization', 'Patient Care'],
    },
  ];

  const departments = [
    { id: 1, name: 'Dental', manager: 'Dr. Sarah Lee', staffCount: 3 },
    { id: 2, name: 'Front Desk', manager: 'Ali Khan', staffCount: 1 },
  ];

  const jobOpenings = [
    { id: 1, title: 'Dental Hygienist', department: 'Dental', posted: '2023-06-01', applicants: 5 },
    { id: 2, title: 'Office Manager', department: 'Administration', posted: '2023-06-10', applicants: 3 },
  ];

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderStaffTable = () => (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full text-sm text-left">
        <thead className={`${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Position</th>
            <th className="p-3">Department</th>
            <th className="p-3">Contact</th>
            <th className="p-3">Hire Date</th>
            <th className="p-3">Salary</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.map((member) => (
            <tr
              key={member.id}
              className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <td className="p-3">{member.id}</td>
              <td className="p-3 font-medium">{member.name}</td>
              <td className="p-3">{member.role}</td>
              <td className="p-3">{member.department}</td>
              <td className="p-3 text-blue-500 hover:underline cursor-pointer">
                <a href={`mailto:${member.contact}`}>{member.contact}</a>
              </td>
              <td className="p-3">{member.hireDate}</td>
              <td className="p-3">{member.salary}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-white text-xs ${
                    member.status === 'Active' 
                      ? 'bg-green-500' 
                      : member.status === 'On Leave' 
                        ? 'bg-yellow-500' 
                        : 'bg-red-500'
                  }`}
                >
                  {member.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDepartments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {departments.map(dept => (
        <div 
          key={dept.id} 
          className={`p-4 rounded shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-bold text-lg mb-2">{dept.name}</h3>
          <p className="mb-1"><span className="font-medium">Manager:</span> {dept.manager}</p>
          <p><span className="font-medium">Staff Count:</span> {dept.staffCount}</p>
        </div>
      ))}
    </div>
  );

  const renderJobOpenings = () => (
    <div className="overflow-x-auto rounded shadow">
      <table className="min-w-full text-sm text-left">
        <thead className={`${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
          <tr>
            <th className="p-3">ID</th>
            <th className="p-3">Position</th>
            <th className="p-3">Department</th>
            <th className="p-3">Posted Date</th>
            <th className="p-3">Applicants</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobOpenings.map(job => (
            <tr
              key={job.id}
              className={`border-t ${isDark ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <td className="p-3">{job.id}</td>
              <td className="p-3 font-medium">{job.title}</td>
              <td className="p-3">{job.department}</td>
              <td className="p-3">{job.posted}</td>
              <td className="p-3">{job.applicants}</td>
              <td className="p-3">
                <button className="mr-2 text-blue-500 hover:text-blue-700">View</button>
                <button className="text-green-500 hover:text-green-700">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderStaffOverview = () => (
    <div className={`p-4 rounded shadow mb-6 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="font-bold text-lg mb-4">Staff Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-blue-50'}`}>
          <h4 className="font-medium mb-1">Total Staff</h4>
          <p className="text-2xl font-bold">{staff.length}</p>
        </div>
        <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-green-50'}`}>
          <h4 className="font-medium mb-1">Active Staff</h4>
          <p className="text-2xl font-bold">{staff.filter(m => m.status === 'Active').length}</p>
        </div>
        <div className={`p-3 rounded ${isDark ? 'bg-gray-700' : 'bg-yellow-50'}`}>
          <h4 className="font-medium mb-1">On Leave</h4>
          <p className="text-2xl font-bold">{staff.filter(m => m.status === 'On Leave').length}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Human Resources Management</h2>
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search staff..."
            className={`w-full p-2 pl-8 rounded ${isDark ? 'bg-gray-700 text-white' : 'bg-white'}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'staff' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          Staff Directory
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'departments' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          Departments
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'recruitment' ? 'border-b-2 border-blue-500 text-blue-500' : ''}`}
          onClick={() => setActiveTab('recruitment')}
        >
          Recruitment
        </button>
      </div>

      {renderStaffOverview()}

      <div className={`p-4 rounded shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
        {activeTab === 'staff' && renderStaffTable()}
        {activeTab === 'departments' && renderDepartments()}
        {activeTab === 'recruitment' && renderJobOpenings()}
      </div>

      {activeTab === 'staff' && (
        <div className={`mt-6 p-4 rounded shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className="font-bold text-lg mb-4">Recent Activities</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className={`h-2 w-2 mt-2 rounded-full bg-green-500 mr-3`}></div>
              <div>
                <p>Dr. Michael Chen completed his annual training</p>
                <p className="text-xs text-gray-400">2 hours ago</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className={`h-2 w-2 mt-2 rounded-full bg-blue-500 mr-3`}></div>
              <div>
                <p>Ali Khan submitted a leave request for next week</p>
                <p className="text-xs text-gray-400">1 day ago</p>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default HumanResources;