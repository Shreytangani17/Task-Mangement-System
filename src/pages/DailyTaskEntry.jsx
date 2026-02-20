import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';
import API from '../utils/api';

const DailyTaskEntry = () => {
  const [formData, setFormData] = useState({ title: '', description: '', status: 'Pending', time: '' });
  const [tasks, setTasks] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/task-entries');
      const today = new Date().toDateString();
      const todayTasks = data.filter(t => new Date(t.createdAt).toDateString() === today);
      setTasks(todayTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert('Please enter task name');
      return;
    }
    try {
      const payload = { ...formData, time: formData.time };
      await API.post('/task-entries', payload);
      setShowToast(true);
      setFormData({ title: '', description: '', status: 'Pending', time: '' });
      fetchTasks();
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving task');
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {showToast && <SuccessToast message="Task saved!" onClose={() => setShowToast(false)} />}
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden lg:ml-0">
        <div className="pt-16 lg:pt-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">Daily Task Entry</h1>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6 border border-gray-200 dark:border-gray-700">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Entry Date</label>
              <input type="text" value={new Date().toLocaleDateString()} disabled className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Name *</label>
              <input type="text" placeholder="Enter task name" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Task Description</label>
              <textarea placeholder="Enter description" rows="3" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
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
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Time</label>
                <input type="time" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
              </div>
            </div>
            <button onClick={handleSave} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Task</button>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold mb-4 dark:text-white">Today's Tasks</h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 font-semibold dark:text-gray-300">Task ID</th>
                    <th className="text-left py-3 font-semibold dark:text-gray-300">Entry Date</th>
                    <th className="text-left py-3 font-semibold dark:text-gray-300">Task Name</th>
                    <th className="text-left py-3 font-semibold dark:text-gray-300">Description</th>
                    <th className="text-left py-3 font-semibold dark:text-gray-300">Status</th>
                    <th className="text-left py-3 font-semibold dark:text-gray-300">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id} className="border-b dark:border-gray-800">
                      <td className="py-3 dark:text-gray-300">{task.taskId || 'N/A'}</td>
                      <td className="py-3 dark:text-gray-300">{new Date(task.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 dark:text-gray-300">{task.title}</td>
                      <td className="py-3 dark:text-gray-300">{task.description?.substring(0, 30)}{task.description?.length > 30 ? '...' : ''}</td>
                      <td className="py-3 dark:text-gray-300">{task.status}</td>
                      <td className="py-3 dark:text-gray-300">{task.time || 'N/A'}</td>
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

export default DailyTaskEntry;
