# 📚 Backend Quick Reference

Complete reference guide for the Bombay Trooper backend system.

---

## 🗂️ Project Structure Overview

```
backend/
├── controllers/
│   ├── authController.js       - User registration & login
│   ├── productController.js    - Product CRUD operations
│   ├── cartController.js       - Shopping cart management
│   ├── orderController.js      - Order processing & tracking
│   └── userController.js       - User management & roles
│
├── routes/
│   ├── authRoutes.js           - /api/auth endpoints
│   ├── productRoutes.js        - /api/products endpoints
│   ├── cartRoutes.js           - /api/cart endpoints
│   ├── orderRoutes.js          - /api/orders endpoints
│   └── userRoutes.js           - /api/users endpoints
│
├── middleware/
│   └── authMiddleware.js       - JWT verification
│
├── models/
│   └── Database.js             - JSON database layer
│
├── utils/
│   ├── constants.js            - App constants
│   └── validators.js           - Input validation
│
├── data/
│   ├── users.json              - User data
│   ├── products.json           - Product data
│   ├── orders.json             - Order data
│   └── carts.json              - Cart data
│
├── server.js                   - Express server setup
├── package.json                - Dependencies
├── .env                        - Environment variables
├── README.md                   - Setup instructions
├── API_DOCUMENTATION.md        - Full API docs
├── INTEGRATION_GUIDE.md        - Frontend integration
└── QUICK_REFERENCE.md          - This file
```

---

## ⚡ Quick Commands

### Setup
```bash
npm install                    # Install dependencies
npm run dev                    # Start development server
npm start                      # Start production server
```

### Backend URL
```
http://localhost:5000/api
```

### Health Check
```
GET http://localhost:5000/api/health
```

---

## 🔧 Common Operations

### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Check Server Status
```bash
curl http://localhost:5000/api/health
```

### 3. View Logs
Check browser console and terminal output

### 4. Reset Data (Delete JSON files)
```bash
rm -rf backend/data/*.json  # Unix/Mac
del backend\data\*.json     # Windows
```

---

## 📡 Controller Methods

### Authentication Controller
- `signup()` - Create new user account
- `login()` - Authenticate user
- `logout()` - Logout user
- `getCurrentUser()` - Get logged-in user details

### Product Controller
- `getAllProducts()` - Fetch all products with filters
- `getProductById()` - Get single product by ID
- `getProductBySlug()` - Get product by URL slug
- `createProduct()` - Create new product (Admin)
- `updateProduct()` - Update product (Admin)
- `deleteProduct()` - Delete product (Admin)
- `getCustomizationOptions()` - Get apron/scrub options

### Cart Controller
- `getCart()` - Get user's cart
- `addToCart()` - Add item to cart
- `updateCartItem()` - Change item quantity
- `removeFromCart()` - Remove item from cart
- `clearCart()` - Empty entire cart

### Order Controller
- `getUserOrders()` - Get user's orders
- `getOrderById()` - Get specific order
- `createOrder()` - Create new order
- `trackOrder()` - Track order by tracking number
- `updateOrderStatus()` - Change order status (Admin)
- `cancelOrder()` - Cancel pending order
- `getAllOrders()` - Get all orders (Admin)

### User Controller
- `getAllUsers()` - Get all users (Admin)
- `getUserById()` - Get user profile
- `updateUserProfile()` - Update user info
- `changePassword()` - Change password
- `deleteUser()` - Delete user (Admin)
- `promoteToAdmin()` - Make user admin (Super Admin)
- `demoteAdmin()` - Remove admin role (Super Admin)

---

## 🔑 Authentication

### Token Storage
```javascript
localStorage.setItem('token', token);
```

### Using Token
```
Authorization: Bearer <token>
```

### Token Expiry
30 days from creation

### Role Levels
```
Customer (1) < Admin (2) < Super Admin (3)
```

---

## 📊 Data Models

### User
```json
{
  "id": "uuid",
  "email": "string",
  "password": "hashed",
  "name": "string",
  "role": "customer|admin|super_admin",
  "phone": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipcode": "string",
  "createdAt": "ISO datetime"
}
```

### Product
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "price": "number",
  "category": "string",
  "description": "object",
  "images": ["url"],
  "sizes": ["string"],
  "colors": [{"name": "string", "code": "#hex"}],
  "createdAt": "ISO datetime"
}
```

### Order
```json
{
  "id": "uuid",
  "userId": "uuid",
  "items": [],
  "shippingAddress": "string",
  "total": "number",
  "status": "pending|confirmed|processing|shipped|delivered|cancelled",
  "paymentStatus": "pending|completed|failed",
  "trackingNumber": "string",
  "createdAt": "ISO datetime"
}
```

### Cart
```json
{
  "id": "uuid",
  "userId": "uuid",
  "items": [],
  "total": "number",
  "createdAt": "ISO datetime"
}
```

---

## 🔒 Middleware

### authMiddleware
- Validates JWT token
- Extracts user info
- Attaches to `req.user`
- Returns 401 if invalid

---

## ✔️ Validators

### validateEmail()
Checks valid email format

### validatePassword()
Requires minimum 6 characters

### validatePhone()
Checks 10-digit phone format

### validateProductData()
Checks required fields (name, price, category)

### validateOrderData()
Checks items and address

### validateCartItem()
Checks product ID and quantity

---

## 📝 Error Handling

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Additional details"
}
```

---

## 🧪 Testing Endpoints

### Test with cURL

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test User"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

**With Authorization:**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/cart
```

---

## 🔄 Database Layer

### Methods (Database.js)

```javascript
Database.create(collection, item)      // Create item
Database.read(collection, id)          // Get item by ID
Database.readAll(collection)           // Get all items
Database.update(collection, id, data)  // Update item
Database.delete(collection, id)        // Delete item
Database.findBy(collection, field, val)    // Find by field
Database.filterBy(collection, field, val)  // Filter by field
```

---

## 🌐 Routes Summary

```
POST   /api/auth/signup                - User registration
POST   /api/auth/login                 - User login
GET    /api/auth/me                    - Current user
POST   /api/auth/logout                - Logout

GET    /api/products                   - All products
POST   /api/products                   - Create product
GET    /api/products/id/:id            - Product by ID
GET    /api/products/slug/:slug        - Product by slug
GET    /api/products/customization/options - Customization options
PUT    /api/products/:id               - Update product
DELETE /api/products/:id               - Delete product

GET    /api/cart                       - Get cart
POST   /api/cart/add                   - Add to cart
PUT    /api/cart/:itemId               - Update cart item
DELETE /api/cart/:itemId               - Remove from cart
DELETE /api/cart                       - Clear cart

GET    /api/orders                     - User orders
POST   /api/orders                     - Create order
GET    /api/orders/:orderId            - Order details
GET    /api/orders/track/:trackingNo   - Track order
PATCH  /api/orders/:orderId/cancel     - Cancel order
GET    /api/orders/admin/all           - All orders (Admin)
PATCH  /api/orders/:orderId/status     - Update status (Admin)

GET    /api/users/:userId              - User profile
PUT    /api/users/:userId              - Update profile
POST   /api/users/:userId/change-password - Change password
GET    /api/users                      - All users (Admin)
DELETE /api/users/:userId              - Delete user (Admin)
POST   /api/users/:userId/promote      - Promote admin (Super Admin)
POST   /api/users/:userId/demote       - Demote admin (Super Admin)
```

---

## 🚨 Common Issues

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Kill process or change PORT in .env |
| CORS error | Check FRONTEND_URL in .env |
| 401 Unauthorized | Verify token in Authorization header |
| 404 Not Found | Check endpoint path is correct |
| No data saved | Check /data folder permissions |

---

## 📚 Documentation Files

- `README.md` - Complete setup guide
- `API_DOCUMENTATION.md` - Full API reference
- `INTEGRATION_GUIDE.md` - Frontend integration
- `QUICK_REFERENCE.md` - This file

---

## 🎯 Development Workflow

1. **Start server**
   ```bash
   npm run dev
   ```

2. **Test endpoints**
   - Use cURL or Postman
   - Check browser DevTools Network tab

3. **Check data**
   - View JSON files in `/data` folder
   - Verify token in localStorage

4. **Debug**
   - Check console logs
   - Review error responses
   - Check middleware execution

5. **Push to production**
   - Test all endpoints
   - Verify CORS settings
   - Update environment variables
   - Deploy with PM2

---

## 🔐 Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Enable HTTPS
- [ ] Add rate limiting
- [ ] Validate all inputs
- [ ] Use environment variables
- [ ] Implement request logging
- [ ] Set up monitoring
- [ ] Regular backups
- [ ] Update dependencies
- [ ] Review error logs

---

## 📈 Performance Tips

1. **Add caching** - Cache frequent GET requests
2. **Pagination** - Limit items per page
3. **Database indexes** - When migrating to real DB
4. **API versioning** - Use `/api/v1/` prefix
5. **Compression** - Gzip responses
6. **CDN** - Serve static files from CDN

---

## 🎉 You're All Set!

Backend is ready for production. Follow the integration guide to connect with frontend.

For support: Check documentation files or review error logs.
