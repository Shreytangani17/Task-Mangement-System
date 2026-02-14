import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';
import ConfirmModal from '../components/ConfirmModal';
import API from '../utils/api';

const TaskEntry = () => {
  const [formData, setFormData] = useState({ title: '', client: '', priority: 'Medium', status: 'Pending' });
  const [tasks, setTasks] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/task-entries');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.client) {
      alert('Please fill all required fields');
      return;
    }
    try {
      await API.post('/task-entries', formData);
      setShowToast(true);
      setFormData({ title: '', client: '', priority: 'Medium', status: 'Pending' });
      fetchTasks();
    } catch (error) {
      console.error('Save error:', error.response || error);
      alert(error.response?.data?.error || 'Error saving task. Make sure backend server is running.');
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/task-entries/${deleteId}`);
      setShowToast(true);
      setShowConfirm(false);
      setDeleteId(null);
      fetchTasks();
    } catch (error) {
      alert('Error deleting task');
    }
  };

  const handleClear = () => {
    setFormData({ title: '', client: '', priority: 'Medium', status: 'Pending' });
  };

  const exportCSV = () => {
    if (tasks.length === 0) {
      alert('No tasks to export');
      return;
    }
    const headers = ['Title', 'Client', 'Priority', 'Status', 'Date'];
    const rows = tasks.map(t => [t.title, t.client, t.priority, t.status, t.date]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('CSV exported successfully!');
  };

  const exportPDF = () => {
    alert('PDF export: Install jsPDF library for full PDF support. For now, use Print (Ctrl+P) to save as PDF.');
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showToast && <SuccessToast message="Task saved successfully!" onClose={() => setShowToast(false)} />}
      {showConfirm && <ConfirmModal message="Delete this task?" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Entry</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input type="text" placeholder="Enter task title" className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Client</label>
            <input type="text" placeholder="Client name" className="w-full px-3 py-2 border rounded-lg" value={formData.client} onChange={(e) => setFormData({...formData, client: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Task</button>
            <button onClick={handleClear} className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search tasks..." className="px-3 py-2 border rounded" />
            <button onClick={exportCSV} className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button onClick={exportPDF} className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Title</th>
                <th className="text-left py-3 font-semibold">Client</th>
                <th className="text-left py-3 font-semibold">Priority</th>
                <th className="text-left py-3 font-semibold">Status</th>
                <th className="text-left py-3 font-semibold">Date</th>
                <th className="text-left py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-b">
                  <td className="py-3">{task.title}</td>
                  <td className="py-3">{task.client}</td>
                  <td className="py-3">{task.priority}</td>
                  <td className="py-3">{task.status}</td>
                  <td className="py-3">{new Date(task.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800">Delete</button>
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

export default TaskEntry;
