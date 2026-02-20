const mongoose = require('mongoose');

const taskEntrySchema = new mongoose.Schema({
  taskId: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  client: { type: String },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Completed'], default: 'Pending' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date },
  dueTime: { type: String },
  time: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TaskEntry', taskEntrySchema);
