import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { Download, Filter } from 'lucide-react';

const AdminReports = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [filters, setFilters] = useState({ employee: '', status: '', overdue: '', courierType: '' });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.employee) params.append('employee', filters.employee);
      if (filters.status) params.append('status', filters.status);
      if (filters.overdue) params.append('overdue', filters.overdue);
      const { data } = await API.get(`/task-entries?${params.toString()}`);
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

  const downloadCSV = () => {
    if (tasks.length === 0) {
      alert('No data to export');
      return;
    }
    const headers = ['Task ID', 'Task Name', 'Description', 'Employee', 'Status', 'Due Date', 'Time', 'Created Date'];
    const rows = tasks.map(task => [
      task.taskId || 'N/A',
      task.title,
      task.description || '',
      task.assignedTo?.name || 'Unassigned',
      task.status,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A',
      task.dueTime || 'N/A',
      new Date(task.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily-task-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    alert('CSV downloaded successfully!');
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 p-4 md:p-6 overflow-x-hidden lg:ml-0">
        <div className="max-w-6xl mx-auto pt-16 lg:pt-0">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Daily Task Report</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Filter and export task reports</p>
            </div>
            <button
              onClick={downloadCSV}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 hover:bg-purple-700 transition"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Employee</label>
                <select
                  value={filters.employee}
                  onChange={(e) => setFilters({...filters, employee: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
                >
                  <option value="">All Employees</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Overdue</label>
                <select
                  value={filters.overdue}
                  onChange={(e) => setFilters({...filters, overdue: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
                >
                  <option value="">All</option>
                  <option value="true">Overdue Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Courier Type</label>
                <select
                  value={filters.courierType}
                  onChange={(e) => setFilters({...filters, courierType: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
                >
                  <option value="">All</option>
                  <option value="inward">Inward</option>
                  <option value="outward">Outward</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for this report..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg text-sm"
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Task ID</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Task Name</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Description</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Employee</th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Status</th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Due Date</th>
                  <th className="px-3 sm:px-4 py-3 text-center text-xs font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tasks.map((task) => (
                  <tr key={task._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">{task.taskId}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white whitespace-nowrap">{task.title}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 max-w-[200px] truncate">{task.description?.substring(0, 40)}{task.description?.length > 40 ? '...' : ''}</td>
                    <td className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{task.assignedTo?.name || 'Unassigned'}</td>
                    <td className="px-3 sm:px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        task.status === 'Completed' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                        task.status === 'In Progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' :
                        'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {task.dueTime || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
