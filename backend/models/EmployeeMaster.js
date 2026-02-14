const mongoose = require('mongoose');

const employeeMasterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  designation: { type: String },
  joiningDate: { type: Date },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EmployeeMaster', employeeMasterSchema);
