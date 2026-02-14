const TaskEntry = require('../models/TaskEntry');

exports.create = async (req, res) => {
  try {
    const taskEntry = new TaskEntry({ ...req.body, createdBy: req.user._id });
    await taskEntry.save();
    res.status(201).json(taskEntry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const entries = await TaskEntry.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
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
