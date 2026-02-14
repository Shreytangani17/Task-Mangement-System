import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { Plus, Trash2, Calendar, User } from 'lucide-react';

const AdminTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTaskForAssign, setSelectedTaskForAssign] = useState(null);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/tasks', formData);
      alert(`Task "${formData.title}" created successfully!`);
      setShowModal(false);
      setFormData({ title: '', description: '', priority: 'Medium', dueDate: '', assignedTo: '' });
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating task');
      console.error('Error creating task:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this task?')) {
      try {
        await API.delete(`/tasks/${id}`);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status: newStatus });
      alert('Task status updated successfully!');
      fetchTasks();
    } catch (error) {
      alert('Error updating status');
      console.error('Error updating status:', error);
    }
  };

  const handleAssignTask = async (employeeId) => {
    try {
      await API.patch(`/tasks/${selectedTaskForAssign}/assign`, { assignedTo: employeeId });
      alert('Task assigned successfully! Employee will receive a notification.');
      setShowAssignModal(false);
      setSelectedTaskForAssign(null);
      fetchTasks();
    } catch (error) {
      alert('Error assigning task');
      console.error('Error assigning task:', error);
    }
  };

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  const getPriorityColor = (priority) => {
    const colors = { 
      Low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300', 
      Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300', 
      High: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
    };
    return colors[priority];
  };

  const getStatusColor = (status) => {
    const colors = { 
      Pending: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300', 
      'In-Progress': 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300', 
      Completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
    };
    return colors[status];
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Task Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Create and assign tasks</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>
          </div>

          <div className="flex space-x-2 mb-6">
            {['all', 'Pending', 'In-Progress', 'Completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      {task.assignedTo ? (
                        <div className="flex items-center text-purple-600 dark:text-purple-400 text-xs bg-purple-50 dark:bg-purple-900 px-3 py-1 rounded-full">
                          <User className="w-3 h-3 mr-1" />
                          {task.assignedTo?.name}
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedTaskForAssign(task._id);
                            setShowAssignModal(true);
                          }}
                          className="flex items-center text-orange-600 dark:text-orange-400 text-xs bg-orange-50 dark:bg-orange-900 px-3 py-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-800 transition"
                        >
                          <User className="w-3 h-3 mr-1" />
                          Assign to Employee
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Status:</span>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(task.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 transition-all duration-300 transform hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {showAssignModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Assign Task to Employee</h2>
                <div className="space-y-2">
                  {employees.map((emp) => (
                    <button
                      key={emp._id}
                      onClick={() => handleAssignTask(emp._id)}
                      className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900 rounded-lg transition flex items-center space-x-3"
                    >
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{emp.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{emp.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setShowAssignModal(false);
                    setSelectedTaskForAssign(null);
                  }}
                  className="w-full mt-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create New Task</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign To (Optional)</label>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Unassigned</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>{emp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTasks;
