const { ProductService } = require('../models/Product');
const { UserService } = require('../models/User');

class HealthController {
  static async healthcheck(req, res) {
    try {
      const products = ProductService.getAll();
      const users = await UserService.getAll();

      const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        data: {
          totalProducts: products.length,
          totalUsers: users.length,
          totalStock: products.reduce((sum, product) => sum + product.stock, 0)
        }
      };

      res.status(200).json({
        success: true,
        message: 'API is healthy',
        data: healthData
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Health check failed',
        error: error.message
      });
    }
  }
}

module.exports = HealthController;
