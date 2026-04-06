const jwt = require('jsonwebtoken');
const { UserService } = require('../models/User');

class AuthService {
  static JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  static JWT_EXPIRES_IN = '24h';

  static async login(email, password) {
    const user = await UserService.findByEmail(email);
    
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: user.toJSON()
    };
  }

  static async register(email, password, name) {
    // Check if user already exists
    const existingUser = await UserService.findByEmail(email);
    
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = await UserService.create(email, password, name);
    
    // Generate token for new user
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email 
      },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: user.toJSON()
    };
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = AuthService;
