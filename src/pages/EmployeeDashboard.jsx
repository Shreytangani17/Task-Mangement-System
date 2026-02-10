import { useState, useEffect, useContext } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';
import { ListTodo, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });

  useEffect(() => {
    fetchTasks();
  }, []);

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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome, {user?.name}!
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Here's your task overview</p>
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
