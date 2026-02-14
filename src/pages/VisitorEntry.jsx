import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const VisitorEntry = () => {
  const [formData, setFormData] = useState({ name: '', company: '', purpose: '', contactPerson: '', time: '' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Visitor Entry</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Visitor Name</label>
            <input type="text" placeholder="Visitor name" className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
            <input type="text" placeholder="Company name" className="w-full px-3 py-2 border rounded-lg" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose</label>
            <input type="text" placeholder="Purpose of visit" className="w-full px-3 py-2 border rounded-lg" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person</label>
            <input type="text" placeholder="Contact person" className="w-full px-3 py-2 border rounded-lg" value={formData.contactPerson} onChange={(e) => setFormData({...formData, contactPerson: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
            <input type="time" className="w-full px-3 py-2 border rounded-lg" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Entry</button>
            <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search visitors..." className="px-3 py-2 border rounded" />
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Name</th>
                <th className="text-left py-3 font-semibold">Company</th>
                <th className="text-left py-3 font-semibold">Purpose</th>
                <th className="text-left py-3 font-semibold">Time</th>
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

export default VisitorEntry;
