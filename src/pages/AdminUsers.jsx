import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { UserPlus, Mail, Briefcase } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/users');
      // Limit to 2 employees and 1 admin
      const admins = data.filter(u => u.role === 'admin').slice(0, 1);
      const employees = data.filter(u => u.role === 'employee').slice(0, 2);
      setUsers([...admins, ...employees]);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchUserTasks = async (userId) => {
    try {
      const { data } = await API.get('/tasks');
      const tasks = data.filter(task => task.assignedTo?._id === userId);
      setUserTasks(tasks);
      if (selectedUser === userId) {
        setSelectedUser(null); // Hide if clicking same user
      } else {
        setSelectedUser(userId); // Show tasks
      }
    } catch (error) {
      console.error('Error fetching user tasks:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/users', formData);
      alert(`User ${formData.name} created successfully!`);
      setShowModal(false);
      setFormData({ name: '', email: '', password: '', role: 'employee' });
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.error || 'Error creating user');
      console.error('Error creating user:', error);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">User Management</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage team members and view their tasks</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-700 transition"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User</span>
            </button>
          </div>

          <div className="space-y-3">
            {users.map((user) => (
              <div key={user._id}>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                        <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {user.role}
                      </span>
                      {user.role === 'employee' && (
                        <button
                          onClick={() => fetchUserTasks(user._id)}
                          className="bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-3 py-1 rounded-lg text-xs font-medium hover:bg-purple-100 dark:hover:bg-purple-800 transition flex items-center space-x-1"
                        >
                          <Briefcase className="w-3 h-3" />
                          <span>{selectedUser === user._id ? 'Hide Tasks' : 'View Tasks'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {selectedUser === user._id && userTasks.length > 0 && (
                  <div className="mt-2 ml-4 space-y-2">
                    {userTasks.map((task) => (
                      <div key={task._id} className="bg-purple-50 dark:bg-purple-900 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</h5>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            task.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                            task.status === 'In-Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {task.status === 'Completed' ? '✓ Completed' : 
                             task.status === 'In-Progress' ? '⟳ In Progress' : 
                             '○ Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition"
                    >
                      Add User
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
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

export default AdminUsers;
