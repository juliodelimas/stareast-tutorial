const express = require('express');
const authRoutes = require('./auth');
const checkoutRoutes = require('./checkout');
const healthRoutes = require('./health');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/health', healthRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Starwest E-commerce API',
    version: '1.0.0',
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      checkout: {
        checkout: 'POST /api/checkout (requires authentication)',
        paymentMethods: 'GET /api/checkout/payment-methods'
      },
      health: {
        healthcheck: 'GET /api/health'
      },
      docs: 'GET /api-docs'
    }
  });
});

module.exports = router;
