const Task = require('../models/Task');
const Notification = require('../models/Notification');
const Comment = require('../models/Comment');
const Attachment = require('../models/Attachment');
const User = require('../models/User');
const { sendTaskAssignmentEmail } = require('../utils/emailService');

exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo } = req.body;
    
    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      statusHistory: [{ status: 'Pending', changedBy: req.user._id }]
    });
    
    await task.save();
    await task.populate('assignedTo createdBy', 'name email');
    
    if (assignedTo) {
      await new Notification({
        user: assignedTo,
        task: task._id,
        type: 'assignment',
        message: `New task assigned: ${title}`
      }).save();
      
      const employee = await User.findById(assignedTo);
      if (employee) {
        console.log(`Sending email to: ${employee.email} (${employee.name})`);
        await sendTaskAssignmentEmail(employee.email, employee.name, title, description, dueDate);
        console.log(`Email sent successfully to: ${employee.email}`);
      }
    }
    
    res.status(201).json(task);
  } catch (error) {
    console.error('Error in createTask:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedTo createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    task.status = status;
    task.updatedAt = Date.now();
    task.statusHistory.push({ status, changedBy: req.user._id });
    
    await task.save();
    await task.populate('assignedTo createdBy', 'name email');
    
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { assignedTo, dueDate } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    task.updatedAt = Date.now();
    
    await task.save();
    await task.populate('assignedTo createdBy', 'name email');
    
    await new Notification({
      user: assignedTo,
      task: task._id,
      type: 'assignment',
      message: `New task assigned: ${task.title}`
    }).save();
    
    const employee = await User.findById(assignedTo);
    if (employee) {
      console.log(`Sending email to: ${employee.email} (${employee.name})`);
      await sendTaskAssignmentEmail(employee.email, employee.name, task.title, task.description, task.dueDate);
      console.log(`Email sent successfully to: ${employee.email}`);
    } else {
      console.log('Employee not found for email notification');
    }
    
    res.json(task);
  } catch (error) {
    console.error('Error in assignTask:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo createdBy', 'name email');
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    const comments = await Comment.find({ task: task._id }).populate('user', 'name');
    const attachments = await Attachment.find({ task: task._id }).populate('user', 'name');
    
    res.json({ task, comments, attachments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskStats = async (req, res) => {
  try {
    const total = await Task.countDocuments();
    const pending = await Task.countDocuments({ status: 'Pending' });
    const inProgress = await Task.countDocuments({ status: 'In-Progress' });
    const completed = await Task.countDocuments({ status: 'Completed' });
    const overdue = await Task.countDocuments({ 
      status: { $ne: 'Completed' },
      dueDate: { $lt: new Date() }
    });
    
    console.log('Task Stats:', { total, pending, inProgress, completed, overdue });
    res.json({ total, pending, inProgress, completed, overdue });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeStats = async (req, res) => {
  try {
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$assignedTo',
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'In-Progress'] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          name: '$user.name',
          email: '$user.email',
          total: 1,
          completed: 1,
          pending: 1,
          inProgress: 1
        }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
