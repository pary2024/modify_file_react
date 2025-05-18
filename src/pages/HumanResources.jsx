import React, { useContext } from 'react';
import { ThemeContext } from '../colors/Thems';

const HumanResources = () => {
  const { isDark } = useContext(ThemeContext);

  const staff = [
    {
      id: 1,
      name: 'Dr. Sarah Lee',
      role: 'Doctor',
      department: 'Dental',
      contact: 'sarah@example.com',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Ali Khan',
      role: 'Receptionist',
      department: 'Front Desk',
      contact: 'ali@example.com',
      status: 'On Leave',
    },
  ];

  return (
    <div className={`p-6 min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <h2 className="text-2xl font-bold mb-4">Human Resources</h2>

      <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} overflow-x-auto rounded shadow`}>
        <table className="min-w-full text-sm text-left">
          <thead className={`${isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'}`}>
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Department</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr
                key={member.id}
                className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <td className="p-3">{member.id}</td>
                <td className="p-3">{member.name}</td>
                <td className="p-3">{member.role}</td>
                <td className="p-3">{member.department}</td>
                <td className="p-3">{member.contact}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      member.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'
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
    </div>
  );
};

export default HumanResources;
