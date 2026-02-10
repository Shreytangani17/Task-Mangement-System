const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, taskController.createTask);
router.get('/', auth, taskController.getAllTasks);
router.get('/my-tasks', auth, taskController.getMyTasks);
router.get('/stats', auth, adminOnly, taskController.getTaskStats);
router.get('/employee-stats', auth, adminOnly, taskController.getEmployeeStats);
router.get('/:id', auth, taskController.getTaskById);
router.patch('/:id/status', auth, taskController.updateTaskStatus);
router.patch('/:id/assign', auth, adminOnly, taskController.assignTask);
router.delete('/:id', auth, adminOnly, taskController.deleteTask);

module.exports = router;
