import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';
import ConfirmModal from '../components/ConfirmModal';
import API from '../utils/api';

const TaskEntry = () => {
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', dueTime: '' });
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/task-entries');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  const handleSave = async () => {
    if (!formData.title) {
      alert('Please fill task name');
      return;
    }
    try {
      await API.post('/task-entries', formData);
      setShowToast(true);
      setFormData({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', dueTime: '' });
      fetchTasks();
    } catch (error) {
      console.error('Save error:', error.response || error);
      alert(error.response?.data?.error || 'Error saving task');
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
    setFormData({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '', dueTime: '' });
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {showToast && <SuccessToast message="Task saved successfully!" onClose={() => setShowToast(false)} />}
      {showConfirm && <ConfirmModal message="Delete this task?" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden lg:ml-0">
        <div className="pt-16 lg:pt-0">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">Task Entry</h1>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Name *</label>
            <input type="text" placeholder="Enter task name" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Description</label>
            <textarea placeholder="Enter task description" rows="3" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
              <select className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Priority</label>
              <select className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
              <input type="date" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time</label>
              <input type="time" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.dueTime} onChange={(e) => setFormData({...formData, dueTime: e.target.value})} />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleSave} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Task</button>
            <button onClick={handleClear} className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4 dark:text-white">Task List</h2>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">Task ID</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Task Name</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Description</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Status</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Employee</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Due Date</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task._id} className="border-b dark:border-gray-800">
                  <td className="py-3 dark:text-gray-300">{task.taskId || 'N/A'}</td>
                  <td className="py-3 dark:text-gray-300">{task.title}</td>
                  <td className="py-3 dark:text-gray-300">{task.description?.substring(0, 30)}{task.description?.length > 30 ? '...' : ''}</td>
                  <td className="py-3 dark:text-gray-300">{task.status}</td>
                  <td className="py-3 dark:text-gray-300">{task.assignedTo?.name || 'Unassigned'}</td>
                  <td className="py-3 dark:text-gray-300">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'} {task.dueTime || ''}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(task._id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEntry;
