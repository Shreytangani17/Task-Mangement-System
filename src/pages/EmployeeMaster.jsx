import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';
import ConfirmModal from '../components/ConfirmModal';
import API from '../utils/api';

const EmployeeMaster = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', department: '', designation: '', joiningDate: '' });
  const [employees, setEmployees] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data } = await API.get('/employee-master');
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      alert('Please fill name and email');
      return;
    }
    try {
      const { data } = await API.post('/employee-master', formData);
      setToastMessage(`Employee created! Login: ${formData.email} / Password: employee123`);
      setShowToast(true);
      setFormData({ name: '', email: '', phone: '', department: '', designation: '', joiningDate: '' });
      fetchEmployees();
    } catch (error) {
      console.error('Save error:', error.response || error);
      alert(error.response?.data?.error || 'Error saving employee. Make sure backend server is running.');
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/employee-master/${deleteId}`);
      setToastMessage('Employee deleted successfully!');
      setShowToast(true);
      setShowConfirm(false);
      setDeleteId(null);
      fetchEmployees();
    } catch (error) {
      alert('Error deleting employee');
    }
  };

  const handleClear = () => {
    setFormData({ name: '', email: '', phone: '', department: '', designation: '', joiningDate: '' });
  };

  const exportCSV = () => {
    if (employees.length === 0) {
      alert('No employees to export');
      return;
    }
    const headers = ['Name', 'Email', 'Phone', 'Department', 'Designation', 'Joining Date'];
    const rows = employees.map(e => [e.name, e.email, e.phone, e.department, e.designation, e.joiningDate]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('CSV exported successfully!');
  };

  const exportPDF = () => {
    alert('PDF export: Use Print (Ctrl+P) to save as PDF.');
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showToast && <SuccessToast message={toastMessage} onClose={() => setShowToast(false)} />}
      {showConfirm && <ConfirmModal message="Delete this employee?" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Employee Master</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
            <input type="text" placeholder="Employee name" className="w-full px-3 py-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input type="email" placeholder="Email address" className="w-full px-3 py-2 border rounded-lg" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
            <input type="tel" placeholder="Phone number" className="w-full px-3 py-2 border rounded-lg" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input type="text" placeholder="Department" className="w-full px-3 py-2 border rounded-lg" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Designation</label>
            <input type="text" placeholder="Designation" className="w-full px-3 py-2 border rounded-lg" value={formData.designation} onChange={(e) => setFormData({...formData, designation: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.joiningDate} onChange={(e) => setFormData({...formData, joiningDate: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Employee</button>
            <button onClick={handleClear} className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search employees..." className="px-3 py-2 border rounded" />
            <button onClick={exportCSV} className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button onClick={exportPDF} className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Name</th>
                <th className="text-left py-3 font-semibold">Email</th>
                <th className="text-left py-3 font-semibold">Department</th>
                <th className="text-left py-3 font-semibold">Designation</th>
                <th className="text-left py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp._id} className="border-b">
                  <td className="py-3">{emp.name}</td>
                  <td className="py-3">{emp.email}</td>
                  <td className="py-3">{emp.department}</td>
                  <td className="py-3">{emp.designation}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(emp._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeMaster;
