const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

// Import routes
const routes = require('./routes');

// Load Swagger YAML
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yaml'));

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api', routes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Starwest E-commerce API Documentation'
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Starwest E-commerce API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      checkout: '/api/checkout',
      health: '/api/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: {
      root: 'GET /',
      docs: 'GET /api-docs',
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      checkout: {
        checkout: 'POST /api/checkout (requires authentication)',
        paymentMethods: 'GET /api/checkout/payment-methods'
      },
      health: 'GET /api/health'
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test' && !module.parent) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`🚀 Starwest E-commerce API is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Login: POST http://localhost:${PORT}/api/auth/login`);
    console.log(`📝 Register: POST http://localhost:${PORT}/api/auth/register`);
    console.log(`🛒 Checkout: POST http://localhost:${PORT}/api/checkout`);
  });
}

module.exports = app;
