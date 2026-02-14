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

  const COLORS = ['#a855f7', '#ec4899', '#06b6d4', '#f43f5e'];

  const pieData = stats ? [
    { name: 'Pending', value: stats.pending },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
    { name: 'Overdue', value: stats.overdue }
  ] : [];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h1>

          {stats && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-100 font-medium">Total Tasks</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                    </div>
                    <ListTodo className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-pink-100 font-medium">Pending</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-cyan-100 font-medium">Completed</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats.completed}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-white opacity-80" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-lg p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-rose-100 font-medium">Overdue</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats.overdue}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-white opacity-80" />
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
