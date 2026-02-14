import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const CourierOutward = () => {
  const [formData, setFormData] = useState({ courierNo: '', to: '', sentBy: '', remarks: '' });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Courier Outward Entry</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Courier No</label>
            <input type="text" placeholder="Courier number" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.courierNo} onChange={(e) => setFormData({...formData, courierNo: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">To</label>
            <input type="text" placeholder="Recipient" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.to} onChange={(e) => setFormData({...formData, to: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sent By</label>
            <input type="text" placeholder="Sent by" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.sentBy} onChange={(e) => setFormData({...formData, sentBy: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Remarks</label>
            <textarea rows="4" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save Outward</button>
            <button className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search outward..." className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded" />
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export CSV</button>
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">No</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">To</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">From</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Remarks</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Date</th>
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

export default CourierOutward;
