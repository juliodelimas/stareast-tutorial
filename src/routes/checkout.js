const express = require('express');
const CheckoutController = require('../controllers/CheckoutController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/checkout - Requires authentication
router.post('/', authenticateToken, CheckoutController.checkout);

// GET /api/checkout/payment-methods - Public endpoint to get available payment methods
router.get('/payment-methods', CheckoutController.getPaymentMethods);

module.exports = router;
