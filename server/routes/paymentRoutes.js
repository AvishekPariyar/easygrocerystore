const express = require('express');
const router = express.Router();
const { initiateKhaltiPayment, verifyKhaltiPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/khalti/initiate', protect, initiateKhaltiPayment);
router.post('/khalti/verify', protect, verifyKhaltiPayment);

module.exports = router;