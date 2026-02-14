import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ChequePayments = () => {
  const [formData, setFormData] = useState({ chequeNo: '', payee: '', amount: '', date: '', bank: '' });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Cheque Payments</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Cheque No</label>
            <input type="text" placeholder="Cheque number" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.chequeNo} onChange={(e) => setFormData({...formData, chequeNo: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Payee</label>
            <input type="text" placeholder="Payee name" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.payee} onChange={(e) => setFormData({...formData, payee: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Amount</label>
            <input type="number" placeholder="Amount" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bank</label>
            <input type="text" placeholder="Bank name" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.bank} onChange={(e) => setFormData({...formData, bank: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date</label>
            <input type="date" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save Payment</button>
            <button className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search payments..." className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded" />
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export CSV</button>
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">Cheque No</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Payee</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Amount</th>
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

export default ChequePayments;
