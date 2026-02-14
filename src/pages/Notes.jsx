import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SuccessToast from '../components/SuccessToast';
import ConfirmModal from '../components/ConfirmModal';
import API from '../utils/api';

const Notes = () => {
  const [formData, setFormData] = useState({ title: '', content: '', category: '' });
  const [notes, setNotes] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await API.get('/notes');
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert('Please fill title and content');
      return;
    }
    try {
      await API.post('/notes', formData);
      setToastMessage('Note saved successfully!');
      setShowToast(true);
      setFormData({ title: '', content: '', category: '' });
      fetchNotes();
    } catch (error) {
      console.error('Save error:', error.response || error);
      alert(error.response?.data?.error || 'Error saving note. Make sure backend server is running.');
    }
  };

  const handleDelete = async (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/notes/${deleteId}`);
      setToastMessage('Note deleted successfully!');
      setShowToast(true);
      setShowConfirm(false);
      setDeleteId(null);
      fetchNotes();
    } catch (error) {
      alert('Error deleting note');
    }
  };

  const handleClear = () => {
    setFormData({ title: '', content: '', category: '' });
  };

  const exportCSV = () => {
    if (notes.length === 0) {
      alert('No notes to export');
      return;
    }
    const headers = ['Title', 'Category', 'Content', 'Date'];
    const rows = notes.map(n => [n.title, n.category, n.content.replace(/,/g, ';'), n.date]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    setToastMessage('CSV exported successfully!');
    setShowToast(true);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {showToast && <SuccessToast message={toastMessage} onClose={() => setShowToast(false)} />}
      {showConfirm && <ConfirmModal message="Delete this note?" onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />}
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Notes</h1>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input type="text" placeholder="Note title" className="w-full px-3 py-2 border rounded-lg" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
            <input type="text" placeholder="Category" className="w-full px-3 py-2 border rounded-lg" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Content</label>
            <textarea placeholder="Write your note..." rows="5" className="w-full px-3 py-2 border rounded-lg" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-cyan-500 text-white px-6 py-2 rounded-lg hover:bg-cyan-600">Save Note</button>
            <button onClick={handleClear} className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-50">Clear</button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-3 mb-4">
            <input type="text" placeholder="Search notes..." className="px-3 py-2 border rounded" />
            <button onClick={exportCSV} className="px-4 py-2 border rounded hover:bg-gray-50">Export CSV</button>
            <button onClick={exportPDF} className="px-4 py-2 border rounded hover:bg-gray-50">Export PDF</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 font-semibold">Title</th>
                <th className="text-left py-3 font-semibold">Category</th>
                <th className="text-left py-3 font-semibold">Date</th>
                <th className="text-left py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {notes.map(note => (
                <tr key={note._id} className="border-b">
                  <td className="py-3">{note.title}</td>
                  <td className="py-3">{note.category}</td>
                  <td className="py-3">{new Date(note.createdAt).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => handleDelete(note._id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Notes;
