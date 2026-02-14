const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeMasterController');
const { auth } = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.getAll);
router.delete('/:id', auth, controller.delete);

module.exports = router;
