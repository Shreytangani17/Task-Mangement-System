import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { ListTodo, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [employeeStats, setEmployeeStats] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [statsRes, empStatsRes] = await Promise.all([
        API.get('/tasks/stats'),
        API.get('/tasks/employee-stats')
      ]);
      setStats(statsRes.data);
      setEmployeeStats(empStatsRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const COLORS = ['#9333ea', '#f59e0b', '#10b981', '#ef4444'];

  const pieData = stats ? [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
    { name: 'Overdue', value: stats.overdue }
  ] : [];

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>

          {stats && (
            <>
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Task Distribution</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4">Employee Performance</h2>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={employeeStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completed" fill="#10b981" name="Completed" />
                      <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
