const express = require('express');
const router = express.Router();
const attachmentController = require('../controllers/attachmentController');
const { auth } = require('../middleware/auth');

router.post('/:taskId', auth, attachmentController.upload.single('file'), attachmentController.uploadAttachment);
router.get('/:taskId', auth, attachmentController.getAttachments);

module.exports = router;
