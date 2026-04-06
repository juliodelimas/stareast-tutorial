class Product {
  constructor(id, name, description, price, stock) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.createdAt = new Date();
  }
}

// In-memory storage for products
const products = [
  new Product(1, 'Laptop', 'High-performance laptop for work and gaming', 999.99, 10),
  new Product(2, 'Smartphone', 'Latest model smartphone with advanced features', 699.99, 25),
  new Product(3, 'Headphones', 'Wireless noise-cancelling headphones', 199.99, 50)
];

// Product service methods
class ProductService {
  static findById(id) {
    return products.find(product => product.id === parseInt(id));
  }

  static getAll() {
    return products;
  }

  static updateStock(id, quantity) {
    const product = this.findById(id);
    if (product && product.stock >= quantity) {
      product.stock -= quantity;
      return true;
    }
    return false;
  }

  static checkStock(id, quantity) {
    const product = this.findById(id);
    return product && product.stock >= quantity;
  }
}

module.exports = { Product, ProductService };
