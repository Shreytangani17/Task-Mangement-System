const Attachment = require('../models/Attachment');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

exports.upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

exports.uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const attachment = new Attachment({
      task: req.params.taskId,
      user: req.user._id,
      filename: req.file.originalname,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
    
    await attachment.save();
    await attachment.populate('user', 'name');
    
    res.status(201).json(attachment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAttachments = async (req, res) => {
  try {
    const attachments = await Attachment.find({ task: req.params.taskId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(attachments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
