const CheckoutService = require('../services/CheckoutService');

class CheckoutController {
  static async checkout(req, res) {
    try {
      const { items, paymentMethod } = req.body;
      const userId = req.user.id;

      // Validate input
      if (!items || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: 'Items and paymentMethod are required'
        });
      }

      const order = await CheckoutService.processCheckout(userId, items, paymentMethod);

      res.status(200).json({
        success: true,
        message: 'Checkout completed successfully',
        data: {
          order
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getPaymentMethods(req, res) {
    try {
      const paymentMethods = CheckoutService.getPaymentMethods();
      
      res.status(200).json({
        success: true,
        message: 'Payment methods retrieved successfully',
        data: {
          paymentMethods,
          cashDiscount: `${CheckoutService.CASH_DISCOUNT * 100}%`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve payment methods'
      });
    }
  }
}

module.exports = CheckoutController;
