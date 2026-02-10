const Comment = require('../models/Comment');

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const comment = new Comment({
      task: req.params.taskId,
      user: req.user._id,
      text
    });
    
    await comment.save();
    await comment.populate('user', 'name');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
