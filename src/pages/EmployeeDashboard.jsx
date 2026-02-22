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
    <div className="flex min-h-screen bg-gray-50 dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden lg:ml-0">
        <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Welcome, {user?.name}!
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Here's your task overview</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition shadow-md"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border-2 border-black z-50 overflow-hidden">
                  <div className="bg-black text-white p-4">
                    <h3 className="font-bold text-lg">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-6 text-center text-gray-500">No new notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif._id} className="p-4 border-b border-gray-200 hover:bg-gray-50 transition">
                          <p className="text-sm text-gray-900 font-medium mb-2">{notif.message}</p>
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</p>
                            <button
                              onClick={() => markAsRead(notif._id)}
                              className="text-xs bg-black text-white px-3 py-1 rounded-full hover:bg-gray-800 transition font-medium"
                            >
                              Mark as read
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 md:p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-100 font-medium">Total Tasks</p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <ListTodo className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-3 md:p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-pink-100 font-medium">Pending</p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.pending}</p>
                </div>
                <Clock className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-3 md:p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-cyan-100 font-medium">Completed</p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.completed}</p>
                </div>
                <CheckCircle className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg p-3 md:p-4 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-rose-100 font-medium">Overdue</p>
                  <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.overdue}</p>
                </div>
                <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
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
