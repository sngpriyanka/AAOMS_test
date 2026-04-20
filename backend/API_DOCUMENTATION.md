# 📚 Bombay Trooper Backend - API Documentation

## Overview

Complete RESTful API documentation for the Bombay Trooper E-commerce Backend Server.

**Base URL:** `http://localhost:5000/api`

---

## 🔐 Authentication

All protected endpoints require JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens are obtained through login/signup and expire in 30 days.

---

## 📌 Authentication Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

---

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

---

### GET /auth/me
Get current logged-in user details.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

---

## 📦 Product Endpoints

### GET /products
Get all products with optional filters.

**Query Parameters:**
```
category=t-shirts        // Filter by category
minPrice=500            // Minimum price
maxPrice=5000           // Maximum price
search=shirt            // Search by name
page=1                  // Page number
limit=10                // Items per page
```

**Example:**
```
GET /products?category=t-shirts&minPrice=500&maxPrice=2000&page=1&limit=10
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Burnt Sienna Active Mesh T-Shirt",
      "slug": "burnt-sienna-active-mesh-tshirt",
      "price": 1275,
      "category": "t-shirts",
      "images": ["url1", "url2"],
      "sizes": ["S", "M", "L"],
      "colors": [{ "name": "Burnt Sienna", "code": "#c75b39" }]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

### GET /products/id/:id
Get product by ID.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Product Name",
    "price": 1275,
    "category": "t-shirts",
    "description": { "tagline": "..." },
    "images": [],
    "sizes": [],
    "colors": []
  }
}
```

---

### GET /products/slug/:slug
Get product by URL slug.

**Example:**
```
GET /products/slug/burnt-sienna-active-mesh-tshirt
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* product data */ }
}
```

---

### GET /products/customization/options
Get customization options for a product category.

**Query Parameters:**
```
category=apron  // Category: apron or scrub
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "types": [
      {
        "id": "embroidery_name",
        "name": "Embroidery with Name",
        "price": 200,
        "description": "Add your name with embroidery"
      },
      {
        "id": "embroidery_logo",
        "name": "Embroidery with Logo",
        "price": 300,
        "description": "Add your company logo"
      }
    ]
  }
}
```

---

### POST /products
Create a new product (Admin only).

**Headers Required:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Product",
  "price": 1999,
  "category": "t-shirts",
  "description": { "tagline": "Amazing product" },
  "images": ["url1", "url2"],
  "sizes": ["S", "M", "L"],
  "colors": [{ "name": "Red", "code": "#FF0000" }]
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { /* product data */ }
}
```

---

### PUT /products/:id
Update product (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product */ }
}
```

---

### DELETE /products/:id
Delete product (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 🛒 Cart Endpoints

### GET /cart
Get user's shopping cart.

**Headers Required:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "items": [
      {
        "id": "item_uuid",
        "productId": "uuid",
        "quantity": 2,
        "size": "M",
        "color": "Red",
        "price": 1275,
        "customization": {
          "type": "embroidery_name",
          "value": "John Doe"
        }
      }
    ],
    "total": 2550
  }
}
```

---

### POST /cart/add
Add item to cart.

**Request Body:**
```json
{
  "productId": "uuid",
  "quantity": 1,
  "size": "M",
  "color": "Red",
  "price": 1275,
  "customization": {
    "type": "embroidery_name",
    "value": "John Doe",
    "price": 200
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": { /* updated cart */ }
}
```

---

### PUT /cart/:itemId
Update cart item quantity.

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": { /* updated cart */ }
}
```

---

### DELETE /cart/:itemId
Remove item from cart.

**Response (200):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": { /* updated cart */ }
}
```

---

### DELETE /cart
Clear entire cart.

**Response (200):**
```json
{
  "success": true,
  "message": "Cart cleared",
  "data": { "items": [], "total": 0 }
}
```

---

## 📋 Order Endpoints

### GET /orders
Get user's orders.

**Query Parameters:**
```
page=1      // Page number
limit=10    // Items per page
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "items": [],
      "total": 2550,
      "status": "delivered",
      "paymentStatus": "completed",
      "trackingNumber": "BT1234567890",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST /orders
Create order from cart.

**Request Body:**
```json
{
  "shippingAddress": "123 Main St, Mumbai, 400001",
  "paymentMethod": "card",
  "notes": "Please deliver on weekends"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "uuid",
    "trackingNumber": "BT1234567890",
    "status": "pending",
    "total": 2550,
    "items": []
  }
}
```

---

### GET /orders/:orderId
Get specific order details.

**Response (200):**
```json
{
  "success": true,
  "data": { /* order details */ }
}
```

---

### GET /orders/track/:trackingNumber
Track order by tracking number (Public endpoint).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "order": { /* order details */ },
    "timeline": [
      {
        "status": "Pending",
        "date": "2024-01-01T00:00:00Z"
      },
      {
        "status": "Confirmed",
        "date": "2024-01-02T10:00:00Z"
      },
      {
        "status": "Shipped",
        "date": "2024-01-03T15:00:00Z"
      }
    ]
  }
}
```

---

### PATCH /orders/:orderId/cancel
Cancel order (can only cancel pending or confirmed orders).

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": { /* updated order */ }
}
```

---

### PATCH /orders/:orderId/status
Update order status (Admin only).

**Request Body:**
```json
{
  "status": "shipped"
}
```

**Valid Status Values:**
- pending
- confirmed
- processing
- shipped
- delivered
- cancelled

**Response (200):**
```json
{
  "success": true,
  "message": "Order status updated",
  "data": { /* updated order */ }
}
```

---

### GET /orders/admin/all
Get all orders (Admin only).

**Query Parameters:**
```
status=shipped  // Filter by status
page=1          // Page number
limit=10        // Items per page
```

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of orders */ ],
  "pagination": { /* pagination info */ }
}
```

---

## 👤 User Endpoints

### GET /users/:userId
Get user profile.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "customer",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipcode": "400001"
  }
}
```

---

### PUT /users/:userId
Update user profile.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "9876543210",
  "address": "456 Oak Ave",
  "city": "Bangalore",
  "state": "Karnataka",
  "zipcode": "560001"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": { /* updated user */ }
}
```

---

### POST /users/:userId/change-password
Change user password.

**Request Body:**
```json
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456",
  "confirmPassword": "newPassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### GET /users
Get all users (Admin only).

**Query Parameters:**
```
search=john     // Search by name or email
role=admin      // Filter by role
page=1          // Page number
limit=10        // Items per page
```

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of users */ ],
  "pagination": { /* pagination info */ }
}
```

---

### DELETE /users/:userId
Delete user (Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

### POST /users/:userId/promote
Promote user to admin (Super Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "User promoted to admin",
  "data": { /* updated user */ }
}
```

---

### POST /users/:userId/demote
Demote admin to customer (Super Admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "User demoted to customer",
  "data": { /* updated user */ }
}
```

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid input or missing required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid token or not authenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details"
}
```

---

## 🧪 Testing Examples

### Example: Complete Workflow

1. **Sign up:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

Save the returned `token`.

2. **Browse products:**
```bash
curl http://localhost:5000/api/products?category=t-shirts
```

3. **Add to cart:**
```bash
curl -X POST http://localhost:5000/api/cart/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "productId": "product-uuid",
    "quantity": 1,
    "size": "M",
    "color": "Red",
    "price": 1275
  }'
```

4. **Create order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "shippingAddress": "123 Main St, Mumbai",
    "paymentMethod": "card"
  }'
```

5. **Track order:**
```bash
curl http://localhost:5000/api/orders/track/BT123456789
```

---

## 📊 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Success |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - No/invalid token |
| 403 | Forbidden - No permission |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## 🔄 Rate Limiting

Currently no rate limiting, but recommended for production:
- 100 requests per 15 minutes per IP
- 50 requests per 15 minutes for auth endpoints

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- Prices are in INR (Indian Rupees)
- All IDs are UUIDs
- Tokens expire after 30 days

---

**API Documentation Complete! 🎉**
