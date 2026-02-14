const express = require('express');
const router = express.Router();
const courierController = require('../controllers/courierController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, courierController.createCourier);
router.get('/', auth, courierController.getCouriers);
router.get('/stats', auth, adminOnly, courierController.getCourierStats);
router.get('/:id', auth, courierController.getCourierById);
router.patch('/:id', auth, courierController.updateCourier);
router.delete('/:id', auth, adminOnly, courierController.deleteCourier);

module.exports = router;
