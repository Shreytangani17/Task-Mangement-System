import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const CourierInward = () => {
  const [formData, setFormData] = useState({ courierNo: '', from: '', receivedBy: '', remarks: '' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Courier Inward Entry</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Courier No</label>
            <input type="text" placeholder="Courier number" className="w-full px-3 py-2 border rounded-lg" value={formData.courierNo} onChange={(e) => setFormData({...formData, courierNo: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
            <input type="text" placeholder="From" className="w-full px-3 py-2 border rounded-lg" value={formData.from} onChange={(e) => setFormData({...formData, from: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Received By</label>
            <input type="text" placeholder="Received at office" className="w-full px-3 py-2 border rounded-lg" value={formData.receivedBy} onChange={(e) => setFormData({...formData, receivedBy: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks</label>
            <textarea rows="4" className="w-full px-3 py-2 border rounded-lg" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Inward</button>
            <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search inward..." className="px-3 py-2 border rounded" />
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">No</th>
                <th className="text-left py-3 font-semibold">From</th>
                <th className="text-left py-3 font-semibold">To</th>
                <th className="text-left py-3 font-semibold">Remarks</th>
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

export default CourierInward;
