import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { Download, Filter, Upload } from 'lucide-react';

const AdminReports = () => {
  const [documents, setDocuments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [file, setFile] = useState(null);
  const [uploadData, setUploadData] = useState({ clientName: '', documentType: '' });

  useEffect(() => {
    fetchDocuments();
    fetchEmployees();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data } = await API.get('/tasks');
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get('/users/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleUpload = async () => {
    if (!uploadData.clientName || !uploadData.documentType || !file) {
      alert('Please fill all fields and select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientName', uploadData.clientName);
    formData.append('documentType', uploadData.documentType);
    try {
      await API.post('/documents/upload', formData);
      alert('Document uploaded successfully!');
      setUploadData({ clientName: '', documentType: '' });
      setFile(null);
      fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading document');
    }
  };

  const filteredDocuments = selectedEmployee
    ? documents.filter(doc => doc.assignedTo?._id === selectedEmployee)
    : documents;

  const downloadCSV = () => {
    if (filteredDocuments.length === 0) {
      alert('No data to export');
      return;
    }
    const headers = ['Client Name', 'Document Type', 'Employee', 'Status', 'Date'];
    const rows = filteredDocuments.map(doc => [
      doc.assignedTo?.name || 'N/A',
      doc.title,
      doc.assignedTo?.name || 'Unassigned',
      doc.status,
      new Date(doc.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-documents-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('CSV downloaded successfully!');
  };

  const downloadPDF = () => {
    alert('PDF export: Use Print (Ctrl+P) to save as PDF.');
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden lg:ml-0">
        <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Reports</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Employee Documents</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={downloadCSV}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>CSV</span>
              </button>
              <button
                onClick={downloadPDF}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-700 transition"
              >
                <Download className="w-4 h-4" />
                <span>PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upload Document</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input
                type="text"
                placeholder="Client Name"
                value={uploadData.clientName}
                onChange={(e) => setUploadData({...uploadData, clientName: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
              />
              <input
                type="text"
                placeholder="Document Type"
                value={uploadData.documentType}
                onChange={(e) => setUploadData({...uploadData, documentType: e.target.value})}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
              />
              <input
                type="file"
                accept=".pdf,.csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
              />
            </div>
            <button
              onClick={handleUpload}
              className="bg-cyan-500 text-white px-6 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-cyan-600 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Document</span>
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm"
            >
              <option value="">All Employees</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-x-auto border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Client Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Document Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredDocuments.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{doc.assignedTo?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{doc.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{doc.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doc.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                        doc.status === 'In-Progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
