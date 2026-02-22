import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const CourierInward = () => {
  const [formData, setFormData] = useState({ courierNo: '', from: '', receivedBy: '', remarks: '' });

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
        <div className="pt-16 lg:pt-0">
        <div className="flex items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Courier Inward Entry</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Courier No</label>
            <input type="text" placeholder="Courier number" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm" value={formData.courierNo} onChange={(e) => setFormData({...formData, courierNo: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">From</label>
            <input type="text" placeholder="From" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm" value={formData.from} onChange={(e) => setFormData({...formData, from: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Received By</label>
            <input type="text" placeholder="Received at office" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm" value={formData.receivedBy} onChange={(e) => setFormData({...formData, receivedBy: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Remarks</label>
            <textarea rows="4" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})}></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-purple-700 text-sm">Save Inward</button>
            <button className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input type="text" placeholder="Search inward..." className="flex-1 px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded text-sm" />
            <button className="px-3 sm:px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm whitespace-nowrap">Export CSV</button>
            <button className="px-3 sm:px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800 text-xs sm:text-sm whitespace-nowrap">Export PDF</button>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">No</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">From</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">To</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">Remarks</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">Date</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-xs sm:text-sm whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CourierInward;
