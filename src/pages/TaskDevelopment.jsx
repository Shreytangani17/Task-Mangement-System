import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';

const TaskDevelopment = () => {
  const [formData, setFormData] = useState({ taskName: '', notes: '' });
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setRefreshing(true);
    try {
      const response = await API.get('/tasks');
      console.log('Tasks loaded:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Error loading tasks. Please check console.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6 ml-16 lg:ml-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Task Development</h1>
          <button
            onClick={fetchTasks}
            disabled={refreshing}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name Task</label>
            <input type="text" placeholder="Enter task name" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.taskName} onChange={(e) => setFormData({...formData, taskName: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes / Progress</label>
            <textarea placeholder="Describe progress" rows="5" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">Save Development</button>
            <button className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input type="text" placeholder="Search development..." className="flex-1 px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded" />
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export CSV</button>
            <button className="px-4 py-2 border dark:border-gray-700 dark:text-white rounded hover:bg-gray-50 dark:hover:bg-gray-800">Export PDF</button>
          </div>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">Name Task</th>
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
    </div>
  );
};

export default TaskDevelopment;
