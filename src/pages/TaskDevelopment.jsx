import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const TaskDevelopment = () => {
  const [formData, setFormData] = useState({ task: '', notes: '' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Development</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Task</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.task} onChange={(e) => setFormData({...formData, task: e.target.value})}>
              <option>-- Select Task --</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes / Progress</label>
            <textarea placeholder="Describe progress" rows="5" className="w-full px-3 py-2 border rounded-lg" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Development</button>
            <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search development..." className="px-3 py-2 border rounded" />
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Task</th>
                <th className="text-left py-3 font-semibold">Notes</th>
                <th className="text-left py-3 font-semibold">Date</th>
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

export default TaskDevelopment;
