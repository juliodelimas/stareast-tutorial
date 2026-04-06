# STAREAST E-commerce API

A REST API for e-commerce built with JavaScript and Express.js that provides JWT authentication and checkout functionality.

## Description

This API allows users to register, login to get JWT tokens, and perform checkout operations. The checkout system supports cash and credit card payments, with a 10% discount applied for cash payments. Only authenticated users can perform checkout operations.

## Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:
   ```bash
   npm install
   ```

## How to Run

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will start on `http://localhost:3000` by default.

## Rules

### Checkout Rules
- **Payment Methods**: Only cash or credit card payments are accepted
- **Cash Discount**: Cash payments receive a 10% discount
- **Authentication**: Only authenticated users (with valid JWT tokens) can perform checkout

### API Rules
- **Endpoints**: The API has exactly 4 main endpoints (login, register, checkout, healthcheck)
- **Data Storage**: All data is stored in memory (no database)
- **Authentication**: JWT tokens are required for checkout operations

## Data Already Existent

### Users (3 pre-loaded)
1. **John Doe** - `john@example.com` / `password`
2. **Jane Smith** - `jane@example.com` / `password`
3. **Bob Johnson** - `bob@example.com` / `password`

### Products (3 pre-loaded)
1. **Laptop** - $999.99 (Stock: 10)
2. **Smartphone** - $699.99 (Stock: 25)
3. **Headphones** - $199.99 (Stock: 50)

## How to Use the REST API

### Base URL
```
http://localhost:3000/api
```

### 1. User Registration
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 4,
      "email": "newuser@example.com",
      "name": "New User"
    }
  }
}
```

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

### 3. Checkout (Requires Authentication)
**Endpoint:** `POST /api/checkout`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "paymentMethod": "cash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Checkout completed successfully",
  "data": {
    "order": {
      "id": 1703123456789,
      "userId": 1,
      "items": [
        {
          "productId": 1,
          "productName": "Laptop",
          "quantity": 2,
          "unitPrice": 999.99,
          "total": 1999.98
        },
        {
          "productId": 2,
          "productName": "Smartphone",
          "quantity": 1,
          "unitPrice": 699.99,
          "total": 699.99
        }
      ],
      "paymentMethod": "cash",
      "subtotal": 2699.97,
      "discount": 269.997,
      "total": 2429.973,
      "status": "completed",
      "createdAt": "2023-12-21T10:30:00.000Z"
    }
  }
}
```

### 4. Health Check
**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "success": true,
  "message": "API is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2023-12-21T10:30:00.000Z",
    "uptime": 123.456,
    "memory": {
      "rss": 12345678,
      "heapTotal": 12345678,
      "heapUsed": 12345678,
      "external": 12345678
    },
    "data": {
      "totalProducts": 3,
      "totalUsers": 3,
      "totalStock": 85
    }
  }
}
```

### 5. Get Payment Methods
**Endpoint:** `GET /api/checkout/payment-methods`

**Response:**
```json
{
  "success": true,
  "message": "Payment methods retrieved successfully",
  "data": {
    "paymentMethods": ["cash", "credit_card"],
    "cashDiscount": "10%"
  }
}
```

## API Documentation

Interactive API documentation is available at:
```
http://localhost:3000/api-docs
```

## Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── AuthController.js
│   ├── CheckoutController.js
│   └── HealthController.js
├── middleware/           # Custom middleware
│   └── auth.js
├── models/              # Data models
│   ├── User.js
│   └── Product.js
├── routes/              # Route definitions
│   ├── auth.js
│   ├── checkout.js
│   ├── health.js
│   └── index.js
├── services/            # Business logic
│   ├── AuthService.js
│   └── CheckoutService.js
└── app.js              # Main application file
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Testing the API

You can test the API using tools like:
- **Postman**
- **curl**
- **Swagger UI** (available at `/api-docs`)

### Example curl commands:

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'
```

**Checkout:**
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"items":[{"productId":1,"quantity":1}],"paymentMethod":"cash"}'
```

## Notes

- All data is stored in memory and will be reset when the server restarts
- JWT tokens expire after 24 hours
- The API includes CORS support for cross-origin requests
- Request logging is enabled for debugging purposes
