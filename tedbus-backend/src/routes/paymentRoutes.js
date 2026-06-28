const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  applyCoupon
} = require('../controllers/paymentController');

router.post('/create-order', isAuthenticated, createOrder);
router.post('/verify-payment', isAuthenticated, verifyPayment);
router.get('/:paymentId', isAuthenticated, getPaymentDetails);
router.post('/apply-coupon', isAuthenticated, applyCoupon);

module.exports = router;