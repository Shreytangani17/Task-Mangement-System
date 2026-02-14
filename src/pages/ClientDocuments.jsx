import { useState } from 'react';
import Sidebar from '../components/Sidebar';

const ClientDocuments = () => {
  const [formData, setFormData] = useState({ clientName: '', documentType: '', file: null });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Client Documents</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name</label>
            <input type="text" placeholder="Client name" className="w-full px-3 py-2 border rounded-lg" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type</label>
            <input type="text" placeholder="Document type" className="w-full px-3 py-2 border rounded-lg" value={formData.documentType} onChange={(e) => setFormData({...formData, documentType: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Document</label>
            <input type="file" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex gap-3">
            <button className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Document</button>
            <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search documents..." className="px-3 py-2 border rounded" />
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Client</th>
                <th className="text-left py-3 font-semibold">Document Type</th>
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

export default ClientDocuments;
