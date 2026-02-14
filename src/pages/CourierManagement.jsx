import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Plus, Search, Filter, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CourierManagement = () => {
  const navigate = useNavigate();
  const [couriers, setCouriers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [formData, setFormData] = useState({
    courierNumber: '', senderName: '', senderAddress: '', courierType: 'Document',
    description: '', forwardedTo: '', status: 'Received', priority: 'Medium', remarks: ''
  });

  useEffect(() => {
    fetchCouriers();
    fetchEmployees();
  }, [filter]);

  const fetchCouriers = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/couriers`, {
      params: filter,
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setCouriers(data);
  };

  const fetchEmployees = async () => {
    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/employees`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setEmployees(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`${import.meta.env.VITE_API_URL}/api/couriers`, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setShowForm(false);
    setFormData({ courierNumber: '', senderName: '', senderAddress: '', courierType: 'Document', description: '', forwardedTo: '', status: 'Received', priority: 'Medium', remarks: '' });
    fetchCouriers();
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this courier entry?')) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/couriers/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchCouriers();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Package /> Courier / Inward Entry</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2">
          <Plus size={20} /> Add Entry
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6 flex gap-4">
        <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })} className="border p-2 rounded">
          <option value="">All Status</option>
          <option value="Received">Received</option>
          <option value="Forwarded">Forwarded</option>
          <option value="Collected">Collected</option>
        </select>
        <select value={filter.priority} onChange={(e) => setFilter({ ...filter, priority: e.target.value })} className="border p-2 rounded">
          <option value="">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <input required placeholder="Courier Number" value={formData.courierNumber} onChange={(e) => setFormData({ ...formData, courierNumber: e.target.value })} className="border p-2 rounded" />
            <input required placeholder="Sender Name" value={formData.senderName} onChange={(e) => setFormData({ ...formData, senderName: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Sender Address" value={formData.senderAddress} onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })} className="border p-2 rounded" />
            <select value={formData.courierType} onChange={(e) => setFormData({ ...formData, courierType: e.target.value })} className="border p-2 rounded">
              <option value="Document">Document</option>
              <option value="Package">Package</option>
              <option value="Letter">Letter</option>
              <option value="Other">Other</option>
            </select>
            <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="border p-2 rounded">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="border p-2 rounded">
              <option value="Received">Received</option>
              <option value="Forwarded">Forwarded</option>
              <option value="Collected">Collected</option>
            </select>
            <select value={formData.forwardedTo} onChange={(e) => setFormData({ ...formData, forwardedTo: e.target.value })} className="border p-2 rounded">
              <option value="">Forward To (Optional)</option>
              {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
            </select>
            <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border p-2 rounded col-span-2" />
            <textarea placeholder="Remarks" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} className="border p-2 rounded col-span-2" />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
            <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Courier #</th>
              <th className="p-3 text-left">Sender</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Forwarded To</th>
              <th className="p-3 text-left">Received Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {couriers.map(courier => (
              <tr key={courier._id} className="border-t">
                <td className="p-3">{courier.courierNumber}</td>
                <td className="p-3">{courier.senderName}</td>
                <td className="p-3">{courier.courierType}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${courier.priority === 'High' ? 'bg-red-100 text-red-800' : courier.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{courier.priority}</span></td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${courier.status === 'Collected' ? 'bg-green-100 text-green-800' : courier.status === 'Forwarded' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{courier.status}</span></td>
                <td className="p-3">{courier.forwardedTo?.name || '-'}</td>
                <td className="p-3">{new Date(courier.receivedDate).toLocaleDateString()}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(courier._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourierManagement;
