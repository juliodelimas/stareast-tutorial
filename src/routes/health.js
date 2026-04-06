const express = require('express');
const HealthController = require('../controllers/HealthController');

const router = express.Router();

// GET /api/health
router.get('/', HealthController.healthcheck);

module.exports = router;
