const TaskEntry = require('../models/TaskEntry');
const User = require('../models/User');
const { sendTaskAssignmentEmail } = require('../utils/emailService');

let taskCounter = 0;

exports.create = async (req, res) => {
  try {
    taskCounter++;
    const taskId = `T${String(taskCounter).padStart(4, '0')}`;
    const { dueDate, dueTime, ...rest } = req.body;
    const taskEntry = new TaskEntry({
      ...rest,
      taskId,
      createdBy: req.user._id,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
    });
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
      .sort({ createdAt: -1 })
      .lean();
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

    // ✅ Respond immediately — don't wait for email
    res.json(entry);

    // Send email in the background (non-blocking)
    if (entry && entry.assignedTo) {
      sendTaskAssignmentEmail(
        entry.assignedTo.email,
        entry.assignedTo.name,
        entry.title,
        entry.description || '',
        entry.dueDate
      ).catch(err => console.error('Background email error (assign):', err.message));
    }
  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate, dueTime } = req.body;

    // Sanitize: convert empty string to null so Mongoose doesn't throw CastError on Date field
    const updateData = {
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
    };

    const entry = await TaskEntry.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    if (!entry) return res.status(404).json({ error: 'Task not found' });
    res.json(entry);
  } catch (error) {
    console.error('TaskEntry update error:', error);
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

    const [stats] = await TaskEntry.aggregate([
      { $match: query },
      {
        $facet: {
          total: [{ $count: 'count' }],
          pending: [{ $match: { status: 'Pending' } }, { $count: 'count' }],
          inProgress: [{ $match: { status: 'In Progress' } }, { $count: 'count' }],
          completed: [{ $match: { status: 'Completed' } }, { $count: 'count' }],
          unassigned: [{ $match: { assignedTo: null } }, { $count: 'count' }]
        }
      }
    ]);

    res.json({
      total: stats.total[0]?.count || 0,
      pending: stats.pending[0]?.count || 0,
      inProgress: stats.inProgress[0]?.count || 0,
      completed: stats.completed[0]?.count || 0,
      unassigned: stats.unassigned[0]?.count || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
