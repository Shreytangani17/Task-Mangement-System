import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const TaskDevelopment = () => {
  const [formData, setFormData] = useState({ task: '', notes: '' });
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Task Development</h1>
          <button
            onClick={fetchTasks}
            disabled={refreshing}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task</label>
            <select className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.task} onChange={(e) => setFormData({...formData, task: e.target.value})}>
              <option value="">-- Select Task --</option>
              {tasks.map(task => (
                <option key={task._id} value={task._id}>{task.title} ({task.status})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes / Progress</label>
            <textarea placeholder="Describe progress" rows="5" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save Development</button>
            <button className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search development..." className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded" />
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export CSV</button>
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">Task</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Notes</th>
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

export default TaskDevelopment;
