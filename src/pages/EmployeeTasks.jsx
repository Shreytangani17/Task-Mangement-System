import { useState, useEffect } from 'react';
import API from '../utils/api';
import Sidebar from '../components/Sidebar';
import { Calendar, MessageSquare, Paperclip, Send, Upload } from 'lucide-react';

const EmployeeTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks/my-tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchTaskDetails = async (taskId) => {
    try {
      const { data } = await API.get(`/tasks/${taskId}`);
      setSelectedTask(data.task);
      setComments(data.comments);
      setAttachments(data.attachments);
    } catch (error) {
      console.error('Error fetching task details:', error);
    }
  };

  const updateStatus = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      fetchTasks();
      if (selectedTask?._id === taskId) {
        fetchTaskDetails(taskId);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    try {
      await API.post(`/comments/${selectedTask._id}`, { text: newComment });
      setNewComment('');
      fetchTaskDetails(selectedTask._id);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      await API.post(`/attachments/${selectedTask._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFile(null);
      fetchTaskDetails(selectedTask._id);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = { Low: 'bg-green-100 text-green-800', Medium: 'bg-yellow-100 text-yellow-800', High: 'bg-red-100 text-red-800' };
    return colors[priority];
  };

  const getStatusColor = (status) => {
    const colors = { Pending: 'bg-gray-100 text-gray-800', 'In-Progress': 'bg-blue-100 text-blue-800', Completed: 'bg-green-100 text-green-800' };
    return colors[status];
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Tasks</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {tasks.map((task) => {
              const isOverdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();
              return (
                <div
                  key={task._id}
                  onClick={() => fetchTaskDetails(task._id)}
                  className={`bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition ${
                    selectedTask?._id === task._id ? 'ring-2 ring-indigo-500' : ''
                  }`}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{task.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{task.description}</p>
                  <div className="flex items-center space-x-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                    {isOverdue && <span className="ml-2 text-red-600 font-medium">Overdue!</span>}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedTask && (
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{selectedTask.title}</h2>
              <p className="text-gray-600 mb-6">{selectedTask.description}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Update Status</label>
                <select
                  value={selectedTask.status}
                  onChange={(e) => updateStatus(selectedTask._id, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="In-Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Comments
                </h3>
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment._id} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-gray-800">{comment.user.name}</p>
                      <p className="text-sm text-gray-600 mt-1">{comment.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={addComment}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Paperclip className="w-5 h-5 mr-2" />
                  Attachments
                </h3>
                <div className="space-y-2 mb-4">
                  {attachments.map((att) => (
                    <div key={att._id} className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="font-medium text-gray-800">{att.filename}</p>
                      <p className="text-xs text-gray-500">
                        Uploaded by {att.user.name} on {new Date(att.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="flex-1 text-sm"
                  />
                  <button
                    onClick={uploadFile}
                    disabled={!file}
                    className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Upload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeTasks;
