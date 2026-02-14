import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const EmployeeLeaves = () => {
  const [formData, setFormData] = useState({ employeeName: '', leaveType: '', startDate: '', endDate: '', reason: '' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Leaves</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Employee Name</label>
            <input type="text" placeholder="Employee name" className="w-full px-3 py-2 border rounded-lg" value={formData.employeeName} onChange={(e) => setFormData({...formData, employeeName: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Leave Type</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.leaveType} onChange={(e) => setFormData({...formData, leaveType: e.target.value})}>
              <option>Sick Leave</option>
              <option>Casual Leave</option>
              <option>Earned Leave</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
            <textarea rows="3" className="w-full px-3 py-2 border rounded-lg" value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Leave</button>
            <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search leaves..." className="px-3 py-2 border rounded" />
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Employee</th>
                <th className="text-left py-3 font-semibold">Type</th>
                <th className="text-left py-3 font-semibold">Start Date</th>
                <th className="text-left py-3 font-semibold">End Date</th>
                <th className="text-left py-3 font-semibold">Action</th>
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
