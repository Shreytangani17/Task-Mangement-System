import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ChequePayments = () => {
  const [formData, setFormData] = useState({ chequeNo: '', payee: '', amount: '', date: '', bank: '' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Cheque Payments</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Cheque No</label>
            <input type="text" placeholder="Cheque number" className="w-full px-3 py-2 border rounded-lg" value={formData.chequeNo} onChange={(e) => setFormData({...formData, chequeNo: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Payee</label>
            <input type="text" placeholder="Payee name" className="w-full px-3 py-2 border rounded-lg" value={formData.payee} onChange={(e) => setFormData({...formData, payee: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
            <input type="number" placeholder="Amount" className="w-full px-3 py-2 border rounded-lg" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bank</label>
            <input type="text" placeholder="Bank name" className="w-full px-3 py-2 border rounded-lg" value={formData.bank} onChange={(e) => setFormData({...formData, bank: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Payment</button>
            <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search payments..." className="px-3 py-2 border rounded" />
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Cheque No</th>
                <th className="text-left py-3 font-semibold">Payee</th>
                <th className="text-left py-3 font-semibold">Amount</th>
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

export default ChequePayments;
