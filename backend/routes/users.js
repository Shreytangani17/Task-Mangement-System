const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, adminOnly, userController.createUser);
router.get('/', auth, adminOnly, userController.getAllUsers);
router.get('/employees', auth, adminOnly, userController.getEmployees);

module.exports = router;
