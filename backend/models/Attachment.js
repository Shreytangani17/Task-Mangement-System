const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  mimetype: { type: String },
  size: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attachment', attachmentSchema);
