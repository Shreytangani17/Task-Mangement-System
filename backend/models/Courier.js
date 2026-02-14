const mongoose = require('mongoose');

const courierSchema = new mongoose.Schema({
  courierNumber: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderAddress: String,
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receivedDate: { type: Date, default: Date.now },
  courierType: { type: String, enum: ['Document', 'Package', 'Letter', 'Other'], required: true },
  description: String,
  forwardedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Received', 'Forwarded', 'Collected'], default: 'Received' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  remarks: String
}, { timestamps: true });

module.exports = mongoose.model('Courier', courierSchema);
