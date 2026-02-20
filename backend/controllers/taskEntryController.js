const TaskEntry = require('../models/TaskEntry');
const User = require('../models/User');
const { sendTaskAssignmentEmail } = require('../utils/emailService');

let taskCounter = 0;

exports.create = async (req, res) => {
  try {
    taskCounter++;
    const taskId = `T${String(taskCounter).padStart(4, '0')}`;
    const taskEntry = new TaskEntry({ ...req.body, taskId, createdBy: req.user._id });
    const saved = await taskEntry.save();
    const populated = await TaskEntry.findById(saved._id).populate('assignedTo', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    console.error('TaskEntry create error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { employee, status, overdue, unassignedOnly } = req.query;
    let query = {};
    
    if (req.user.role === 'employee') {
      query.assignedTo = req.user._id;
    }
    
    if (unassignedOnly === 'true') {
      query.assignedTo = null;
    } else if (employee) {
      query.assignedTo = employee;
    }
    
    if (status) query.status = status;
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'Completed' };
    }
    
    const entries = await TaskEntry.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assign = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const entry = await TaskEntry.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true }
    ).populate('assignedTo', 'name email');
    
    if (entry && entry.assignedTo) {
      await sendTaskAssignmentEmail(
        entry.assignedTo.email,
        entry.assignedTo.name,
        entry.title,
        entry.description || '',
        entry.dueDate
      );
    }
    
    res.json(entry);
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    await TaskEntry.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { employee } = req.query;
    let query = {};
    if (employee) query.assignedTo = employee;
    
    const total = await TaskEntry.countDocuments(query);
    const pending = await TaskEntry.countDocuments({ ...query, status: 'Pending' });
    const inProgress = await TaskEntry.countDocuments({ ...query, status: 'In Progress' });
    const completed = await TaskEntry.countDocuments({ ...query, status: 'Completed' });
    const unassigned = await TaskEntry.countDocuments({ ...query, assignedTo: null });
    
    res.json({ total, pending, inProgress, completed, unassigned });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
