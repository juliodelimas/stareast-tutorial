const { ProductService } = require('../models/Product');

class CheckoutService {
  static PAYMENT_METHODS = {
    CASH: 'cash',
    CREDIT_CARD: 'credit_card'
  };

  static CASH_DISCOUNT = 0.10; // 10% discount for cash payments

  static async processCheckout(userId, items, paymentMethod) {
    // Validate payment method
    if (!Object.values(this.PAYMENT_METHODS).includes(paymentMethod)) {
      throw new Error('Invalid payment method. Only cash or credit_card are accepted.');
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Items are required for checkout');
    }

    let totalAmount = 0;
    const processedItems = [];

    // Process each item
    for (const item of items) {
      const { productId, quantity } = item;

      if (!productId || !quantity || quantity <= 0) {
        throw new Error('Invalid item: productId and quantity are required');
      }

      const product = ProductService.findById(productId);
      
      if (!product) {
        throw new Error(`Product with ID ${productId} not found`);
      }

      if (!ProductService.checkStock(productId, quantity)) {
        throw new Error(`Insufficient stock for product: ${product.name}`);
      }

      const itemTotal = product.price * quantity;
      totalAmount += itemTotal;

      processedItems.push({
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        total: itemTotal
      });
    }

    // Apply cash discount
    let discount = 0;
    if (paymentMethod === this.PAYMENT_METHODS.CASH) {
      discount = totalAmount * this.CASH_DISCOUNT;
    }

    const finalAmount = totalAmount - discount;

    // Update stock for all items
    for (const item of items) {
      const success = ProductService.updateStock(item.productId, item.quantity);
      if (!success) {
        throw new Error(`Failed to update stock for product ID: ${item.productId}`);
      }
    }

    // Create order
    const order = {
      id: Date.now(), // Simple ID generation
      userId,
      items: processedItems,
      paymentMethod,
      subtotal: totalAmount,
      discount,
      total: finalAmount,
      status: 'completed',
      createdAt: new Date()
    };

    return order;
  }

  static getPaymentMethods() {
    return Object.values(this.PAYMENT_METHODS);
  }
}

module.exports = CheckoutService;
