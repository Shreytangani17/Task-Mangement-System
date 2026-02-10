const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

router.post('/:taskId', auth, commentController.addComment);
router.get('/:taskId', auth, commentController.getComments);

module.exports = router;
