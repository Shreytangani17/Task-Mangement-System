import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';

const TaskAllotment = () => {
  const [taskEntries, setTaskEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [formData, setFormData] = useState({ assignTo: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    try {
      const [taskEntriesRes, tasksRes, employeesRes] = await Promise.all([
        API.get('/task-entries'),
        API.get('/tasks'),
        API.get('/users/employees')
      ]);
      
      console.log('Task Entries:', taskEntriesRes.data);
      console.log('Tasks:', tasksRes.data);
      console.log('Employees:', employeesRes.data);
      
      setTaskEntries(taskEntriesRes.data);
      setTasks(tasksRes.data);
      setEmployees(employeesRes.data);
      const assigned = tasksRes.data.filter(t => t.assignedTo && t.assignedTo._id);
      setAllotments(assigned);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please check console for details.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.assignTo) return alert('Please select employee');
    
    setLoading(true);
    try {
      setShowToast(true);
      setFormData({ assignTo: '', dueDate: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setFormData({ assignTo: '', dueDate: '' });

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      {showToast && <SuccessToast message="Task assigned successfully!" onClose={() => setShowToast(false)} />}
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6 ml-16 lg:ml-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Task Allotment</h1>
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6 mb-4 md:mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assign To Employee</label>
            <select className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.assignTo} onChange={(e) => setFormData({...formData, assignTo: e.target.value})} required>
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Due Date</label>
            <input type="date" className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" disabled={loading} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Allotment'}
            </button>
            <button type="button" onClick={handleClear} className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </form>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold dark:text-white mb-4">Current Allotments</h2>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 font-semibold dark:text-gray-300">Task</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Assigned To</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Status</th>
                <th className="text-left py-3 font-semibold dark:text-gray-300">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {allotments.map(task => (
                <tr key={task._id} className="border-b dark:border-gray-800">
                  <td className="py-3 dark:text-gray-300">{task.title}</td>
                  <td className="py-3 dark:text-gray-300">{task.assignedTo?.name || 'N/A'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                      task.status === 'In-Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>{task.status}</span>
                  </td>
                  <td className="py-3 dark:text-gray-300">{new Date(task.dueDate).toLocaleDateString()}</td>
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

export default TaskAllotment;
