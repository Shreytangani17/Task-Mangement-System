import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { ListTodo, Clock, CheckCircle, AlertCircle, UserX } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    fetchStats();
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchStats();
  }, [selectedEmployee]);

  const fetchStats = async () => {
    try {
      const params = selectedEmployee ? `?employee=${selectedEmployee}` : '';
      const statsRes = await API.get(`/task-entries/stats${params}`);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const barData = stats ? [
    { name: 'Pending', value: stats.pending, fill: '#ec4899' },
    { name: 'In Progress', value: stats.inProgress, fill: '#a855f7' },
    { name: 'Completed', value: stats.completed, fill: '#06b6d4' },
    { name: 'Unassigned', value: stats.unassigned, fill: '#f43f5e' }
  ] : [];

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden lg:ml-0">
        <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700 dark:text-gray-300">Filter:</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="px-3 py-2 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg text-sm"
              >
                <option value="">All Employees</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>{emp.name}</option>
                ))}
              </select>
            </div>
          </div>

          {stats && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-4 md:mb-6">
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

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 md:p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-100 font-medium">In Progress</p>
                      <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.inProgress}</p>
                    </div>
                    <AlertCircle className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
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
                      <p className="text-xs text-rose-100 font-medium">Unassigned</p>
                      <p className="text-xl md:text-2xl font-bold text-white mt-1">{stats.unassigned}</p>
                    </div>
                    <UserX className="w-6 h-6 md:w-8 md:h-8 text-white opacity-80" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 md:p-5 border border-gray-200 dark:border-gray-700">
                <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white mb-4">Task Distribution</h2>
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minWidth={300}>
                    <BarChart data={barData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" />
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
