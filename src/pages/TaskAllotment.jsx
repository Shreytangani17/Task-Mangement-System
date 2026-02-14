import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';

const TaskAllotment = () => {
  const [taskEntries, setTaskEntries] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [allotments, setAllotments] = useState([]);
  const [formData, setFormData] = useState({ taskEntry: '', task: '', assignTo: '', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [taskEntriesRes, tasksRes, employeesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/task-entries', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/tasks', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://localhost:5000/api/users/employees', { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setTaskEntries(taskEntriesRes.data);
      setTasks(tasksRes.data);
      setEmployees(employeesRes.data);
      const assigned = tasksRes.data.filter(t => t.assignedTo && t.assignedTo._id);
      setAllotments(assigned);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedTask = formData.task || formData.taskEntry;
    if (!selectedTask || !formData.assignTo) return alert('Please select task and employee');
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // If TaskEntry selected, create Task first
      if (formData.taskEntry) {
        const entry = taskEntries.find(t => t._id === formData.taskEntry);
        const taskData = {
          title: entry.title,
          description: `Client: ${entry.client}`,
          priority: entry.priority,
          dueDate: formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          assignedTo: formData.assignTo
        };
        await axios.post('http://localhost:5000/api/tasks', taskData, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        // Assign existing Task
        await axios.patch(
          `http://localhost:5000/api/tasks/${formData.task}/assign`,
          { assignedTo: formData.assignTo, dueDate: formData.dueDate },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      setShowToast(true);
      setFormData({ taskEntry: '', task: '', assignTo: '', dueDate: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => setFormData({ taskEntry: '', task: '', assignTo: '', dueDate: '' });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showToast && <SuccessToast message="Task assigned successfully!" onClose={() => setShowToast(false)} />}
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Task Allotment</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select from Task Entry</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.taskEntry} onChange={(e) => setFormData({...formData, taskEntry: e.target.value, task: ''})}>
              <option value="">-- Select Task Entry --</option>
              {taskEntries.map(task => (
                <option key={task._id} value={task._id}>{task.title} - {task.client} ({task.priority})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">OR Select Existing Task</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.task} onChange={(e) => setFormData({...formData, task: e.target.value, taskEntry: ''})}>
              <option value="">-- Select Task --</option>
              {tasks.map(task => (
                <option key={task._id} value={task._id}>{task.title} ({task.status})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign To Employee</label>
            <select className="w-full px-3 py-2 border rounded-lg" value={formData.assignTo} onChange={(e) => setFormData({...formData, assignTo: e.target.value})} required>
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name} ({emp.email})</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600 disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Allotment'}
            </button>
            <button type="button" onClick={handleClear} className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </form>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Current Allotments</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Task</th>
                <th className="text-left py-3 font-semibold">Assigned To</th>
                <th className="text-left py-3 font-semibold">Status</th>
                <th className="text-left py-3 font-semibold">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {allotments.map(task => (
                <tr key={task._id} className="border-b">
                  <td className="py-3">{task.title}</td>
                  <td className="py-3">{task.assignedTo?.name || 'N/A'}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'In-Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>{task.status}</span>
                  </td>
                  <td className="py-3">{new Date(task.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskAllotment;
