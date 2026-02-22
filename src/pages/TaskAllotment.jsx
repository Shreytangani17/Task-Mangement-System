import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';

const TaskAllotment = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, employeesRes] = await Promise.all([
        API.get('/task-entries?unassignedOnly=true'),
        API.get('/users/employees')
      ]);
      setTasks(tasksRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data');
    }
  };

  const handleAssign = async (taskId, employeeId) => {
    if (!employeeId) return alert('Please select an employee');
    
    setAssigningId(taskId);
    try {
      await API.patch(`/task-entries/${taskId}/assign`, { assignedTo: employeeId });
      setShowToast(true);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Assignment Error:', error);
      alert(error.response?.data?.error || 'Failed to assign task');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {showToast && <SuccessToast message="Task assigned successfully!" onClose={() => setShowToast(false)} />}
      <Sidebar />
      <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6 pt-16 lg:pt-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">Task Allotment</h1>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr className="border-b dark:border-gray-700">
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Task ID</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Task Name</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Description</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Status</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Current Employee</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Assign Employee</th>
                <th className="text-left py-3 px-3 font-semibold dark:text-gray-300 text-sm whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <TaskRow 
                  key={task._id} 
                  task={task} 
                  employees={employees} 
                  onAssign={handleAssign}
                  isAssigning={assigningId === task._id}
                />
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TaskRow = ({ task, employees, onAssign, isAssigning }) => {
  const [selectedEmployee, setSelectedEmployee] = useState('');

  return (
    <tr className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="py-3 px-3 dark:text-gray-300 text-sm whitespace-nowrap">{task.taskId || 'N/A'}</td>
      <td className="py-3 px-3 dark:text-gray-300 text-sm whitespace-nowrap">{task.title}</td>
      <td className="py-3 px-3 dark:text-gray-300 text-sm max-w-[150px] truncate">{task.description?.substring(0, 30)}{task.description?.length > 30 ? '...' : ''}</td>
      <td className="py-3 px-3">
        <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
          task.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
          'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {task.status}
        </span>
      </td>
      <td className="py-3 px-3 dark:text-gray-300 text-sm whitespace-nowrap">{task.assignedTo?.name || 'Unassigned'}</td>
      <td className="py-3 px-3">
        <select 
          className="px-2 py-1 border dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded text-sm min-w-[120px]"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          <option value="">-- Select --</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>
      </td>
      <td className="py-3 px-3">
        <button 
          onClick={() => onAssign(task._id, selectedEmployee)}
          disabled={isAssigning}
          className="bg-cyan-500 text-white px-3 py-1 rounded hover:bg-cyan-600 disabled:opacity-50 text-sm whitespace-nowrap"
        >
          {isAssigning ? 'Assigning...' : 'Assign'}
        </button>
      </td>
    </tr>
  );
};

export default TaskAllotment;
