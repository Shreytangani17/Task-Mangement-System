import { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { ListTodo, Clock, CheckCircle, AlertCircle, Bell } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchTasks();
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data.filter(n => !n.read).slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks/my-tasks');
      setTasks(data);
      
      const now = new Date();
      const stats = {
        total: data.length,
        pending: data.filter(t => t.status === 'Pending').length,
        inProgress: data.filter(t => t.status === 'In-Progress').length,
        completed: data.filter(t => t.status === 'Completed').length,
        overdue: data.filter(t => t.status !== 'Completed' && new Date(t.dueDate) < now).length
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Welcome, {user?.name}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Here's your task overview</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-gray-600 dark:text-gray-400">No new notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <p className="text-sm text-gray-900 dark:text-white">{notif.message}</p>
                          <div className="flex justify-between items-center mt-2">
                            <p className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="text-xs text-purple-600 hover:text-purple-700"
                            >
                              Mark as read
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-600 dark:text-purple-300 font-medium">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</p>
                </div>
                <ListTodo className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 border border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-yellow-600 dark:text-yellow-300 font-medium">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900 rounded-lg p-4 border border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-600 dark:text-green-300 font-medium">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4 border border-red-200 dark:border-red-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-600 dark:text-red-300 font-medium">Overdue</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.overdue}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Tasks</h2>
            <div className="space-y-3">
              {tasks.slice(0, 5).map((task) => {
                const isOverdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();
                return (
                  <div key={task._id} className="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{task.title}</h3>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        task.status === 'In-Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {task.status}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {isOverdue && (
                        <span className="text-xs text-red-600 dark:text-red-400 font-semibold">
                          Overdue!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
