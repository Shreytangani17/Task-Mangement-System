import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const EmployeeLeaves = () => {
  const [formData, setFormData] = useState({ employeeName: '', leaveType: '', startDate: '', endDate: '', reason: '' });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Employee Leaves</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Employee Name</label>
            <input type="text" placeholder="Employee name" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Leave Type</label>
            <select className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.leaveType} onChange={(e) => setFormData({...formData, leaveType: e.target.value})}>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
            <input type="date" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
            <input type="date" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Reason</label>
            <textarea rows="3" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save Leave</button>
            <button className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search leaves..." className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded" />
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export CSV</button>
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">Employee</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Type</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Start Date</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">End Date</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLeaves;
