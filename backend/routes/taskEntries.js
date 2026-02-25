const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskEntryController');
const { auth } = require('../middleware/auth');

router.post('/', auth, controller.create);
router.get('/', auth, controller.getAll);
router.get('/stats', auth, controller.getStats);
router.put('/:id', auth, controller.update);
router.patch('/:id/assign', auth, controller.assign);
router.delete('/:id', auth, controller.delete);

module.exports = router;
