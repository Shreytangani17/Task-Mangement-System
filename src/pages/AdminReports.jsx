import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { Download, TrendingUp } from 'lucide-react';

const AdminReports = () => {
  const [employeeStats, setEmployeeStats] = useState([]);

  useEffect(() => {
    fetchEmployeeStats();
  }, []);

  const fetchEmployeeStats = async () => {
    try {
      const { data } = await API.get('/tasks/employee-stats');
      setEmployeeStats(data);
    } catch (error) {
      console.error('Error fetching employee stats:', error);
    }
  };

  const downloadCSV = () => {
    if (employeeStats.length === 0) {
      alert('No data to export');
      return;
    }
    const headers = ['Employee Name', 'Email', 'Total Tasks', 'Completed', 'Pending', 'In Progress'];
    const rows = employeeStats.map(emp => [
      emp.name,
      emp.email,
      emp.total,
      emp.completed,
      emp.pending,
      emp.inProgress
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('CSV downloaded successfully!');
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Employee Reports</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">View performance metrics</p>
            </div>
            <button
              onClick={downloadCSV}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV</span>
            </button>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Total</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Completed</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Pending</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">In Progress</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {employeeStats.map((emp) => {
                  const completionRate = emp.total > 0 ? ((emp.completed / emp.total) * 100).toFixed(1) : 0;
                  return (
                    <tr key={emp._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-2">
                            <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{emp.email}</td>
                      <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900 dark:text-white">{emp.total}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
                          {emp.completed}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium">
                          {emp.pending}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                          {emp.inProgress}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
