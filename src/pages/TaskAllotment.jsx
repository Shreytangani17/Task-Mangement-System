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
  const [formData, setFormData] = useState({ taskId: '', assignTo: '', dueDate: '' });
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
      const assigned = tasksRes.data.filter(t => t.assignedTo);
      setAllotments(assigned);
      console.log('Assigned Tasks:', assigned);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please check console for details.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.taskId) return alert('Please select a task');
    if (!formData.assignTo) return alert('Please select employee');
    
    setLoading(true);
    try {
      const response = await API.patch(`/tasks/${formData.taskId}/assign`, {
        assignedTo: formData.assignTo,
        dueDate: formData.dueDate || undefined
      });
      
      console.log('Assignment Response:', response.data);
      
      setShowToast(true);
      setFormData({ taskId: '', assignTo: '', dueDate: '' });
      
      // Refresh data to get updated list
      await fetchData();
    } catch (error) {
      console.error('Assignment Error:', error);
      alert(error.response?.data?.error || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setFormData({ taskId: '', assignTo: '', dueDate: '' });

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
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Task</label>
            <select className="w-full px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg" value={formData.taskId} onChange={(e) => setFormData({...formData, taskId: e.target.value})} required>
              <option value="">-- Select Task --</option>
              {tasks.map(task => (
                <option key={task._id} value={task._id}>{task.title} - {task.status}</option>
              ))}
            </select>
          </div>
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
              {loading ? 'Assigning...' : 'Assign Task'}
            </button>
            <button type="button" onClick={handleClear} className="bg-white dark:bg-gray-800 border dark:border-gray-700 dark:text-white px-6 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskAllotment;
