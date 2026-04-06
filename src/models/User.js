const bcrypt = require('bcryptjs');

class User {
  constructor(id, email, password, name) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.createdAt = new Date();
  }

  // Static method to hash password
  static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  // Instance method to compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Convert to JSON without password
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

// In-memory storage for users
const users = [
  new User(1, 'john@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe'),
  new User(2, 'jane@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Smith'),
  new User(3, 'bob@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Bob Johnson')
];

// User service methods
class UserService {
  static async findById(id) {
    return users.find(user => user.id === parseInt(id));
  }

  static async findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static async create(email, password, name) {
    const hashedPassword = await User.hashPassword(password);
    const newUser = new User(
      users.length + 1,
      email,
      hashedPassword,
      name
    );
    users.push(newUser);
    return newUser;
  }

  static async getAll() {
    return users.map(user => user.toJSON());
  }
}

module.exports = { User, UserService };
