# RBAC System - API Testing Guide

## Step 1: Create Initial Super Admin

Run this command to create the first super admin account:
```bash
cd backend
node scripts/seedSuperAdmin.js
```

Expected Output:
```
✅ Super Admin Account Created Successfully!
   Name:  Super Administrator
   Email: superadmin@aaxoms.com
   Role:  super_admin
   ID:    [UUID]
```

---

## Step 2: Test Authentication and Role Assignment

### Test 2A: Signup as Customer (Auto-assigned role)
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "pass123456",
  "name": "John Customer"
}
```

Expected Response (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid-123",
    "email": "customer@example.com",
    "name": "John Customer",
    "role": "customer"
  }
}
```

✅ Verify: `"role": "customer"` is set

---

### Test 2B: Login as Customer
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "pass123456"
}
```

Expected Response (200 OK):
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGc...",
  "user": {
    "role": "customer"
  }
}
```

💾 Save this token as `CUSTOMER_TOKEN`

---

### Test 2C: Login as Super Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "superadmin@aaxoms.com",
  "password": "SuperAdmin@123"
}
```

Expected Response (200 OK):
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "role": "super_admin"
  }
}
```

💾 Save this token as `SUPERADMIN_TOKEN`

---

## Step 3: Test Role-Based Route Access

### Test 3A: Customer trying to create product (Should FAIL)
```http
POST http://localhost:5000/api/products
Authorization: Bearer {CUSTOMER_TOKEN}
Content-Type: application/json

{
  "name": "Test Product",
  "price": 99.99,
  "stock": 10
}
```

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "Admin access required"
}
```

✅ Test Passed: Customer blocked from admin route

---

### Test 3B: Super Admin creating product (Should SUCCEED)
```http
POST http://localhost:5000/api/products
Authorization: Bearer {SUPERADMIN_TOKEN}
Content-Type: application/json

{
  "name": "Test Product",
  "price": 99.99,
  "stock": 10,
  "category": "shirts"
}
```

Expected Response (201 Created):
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": "prod-123",
    "name": "Test Product",
    "price": 99.99,
    "stock": 10
  }
}
```

✅ Test Passed: Super Admin can create products

---

## Step 4: Test Admin Account Creation

### Test 4A: Create another customer to promote
```http
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "email": "future.admin@example.com",
  "password": "pass123456",
  "name": "Jane Doe"
}
```

💾 Save the user ID as `FUTURE_ADMIN_ID`

---

### Test 4B: Super Admin promotes customer to admin
```http
POST http://localhost:5000/api/users/super-admin/promote/{FUTURE_ADMIN_ID}
Authorization: Bearer {SUPERADMIN_TOKEN}
```

Expected Response (200 OK):
```json
{
  "success": true,
  "message": "User promoted to admin",
  "data": {
    "id": "uuid-456",
    "email": "future.admin@example.com",
    "role": "admin"
  }
}
```

✅ Test Passed: Super Admin can promote users

---

### Test 4C: Customer trying to promote (Should FAIL)
```http
POST http://localhost:5000/api/users/super-admin/promote/{FUTURE_ADMIN_ID}
Authorization: Bearer {CUSTOMER_TOKEN}
```

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "Super Admin access required"
}
```

✅ Test Passed: Customers cannot promote users

---

## Step 5: Test Admin Capabilities

### Test 5A: Promote same customer as Admin
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "future.admin@example.com",
  "password": "pass123456"
}
```

💾 Save token as `ADMIN_TOKEN`

---

### Test 5B: Admin can view all users
```http
GET http://localhost:5000/api/users/admin/users/all
Authorization: Bearer {ADMIN_TOKEN}
```

Expected Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-123",
      "email": "customer@example.com",
      "name": "John Customer",
      "role": "customer"
    },
    {
      "id": "uuid-456",
      "email": "future.admin@example.com",
      "role": "admin"
    }
  ],
  "pagination": {
    "total": 2,
    "page": 1,
    "limit": 10  
  }
}
```

✅ Test Passed: Admin can list users

---

### Test 5C: Admin trying to access super admin route (Should FAIL)
```http
POST http://localhost:5000/api/users/super-admin/logs
Authorization: Bearer {ADMIN_TOKEN}
```

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "Super Admin access required"
}
```

✅ Test Passed: Admin cannot access super admin routes

---

## Step 6: Test Customer Functionality

### Test 6A: Customer add to cart (Should SUCCEED)
```http
POST http://localhost:5000/api/cart/add
Authorization: Bearer {CUSTOMER_TOKEN}
Content-Type: application/json

{
  "productId": "prod-123",
  "quantity": 1,
  "size": "M",
  "color": "Black"
}
```

Expected Response (201 Created):
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": "cart-item-123",
    "productId": "prod-123",
    "quantity": 1
  }
}
```

✅ Test Passed: Customer can add to cart

---

### Test 6B: Customer view own profile
```http
GET http://localhost:5000/api/users/profile/{CUSTOMER_ID}
Authorization: Bearer {CUSTOMER_TOKEN}
```

Expected Response (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "email": "customer@example.com",
    "name": "John Customer",
    "role": "customer",
    "phone": "",
    "address": ""
  }
}
```

✅ Test Passed: Customer can view own profile

---

### Test 6C: Customer trying to delete another user (Should FAIL)
```http
DELETE http://localhost:5000/api/users/admin/users/{OTHER_USER_ID}
Authorization: Bearer {CUSTOMER_TOKEN}
```

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "Admin access required"
}
```

✅ Test Passed: Customer cannot delete users

---

## Step 7: Test Activity Logs (Super Admin Only)

### Test 7A: Super Admin view activity logs
```http
POST http://localhost:5000/api/users/super-admin/logs
Authorization: Bearer {SUPERADMIN_TOKEN}
Content-Type: application/json

{
  "action": "login"
}
```

Expected Response (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "userId": "uuid-123",
      "action": "login",
      "timestamp": "2024-04-12T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1
  }
}
```

✅ Test Passed: Super Admin can view logs

---

### Test 7B: Admin trying to view logs (Should FAIL)
```http
POST http://localhost:5000/api/users/super-admin/logs
Authorization: Bearer {ADMIN_TOKEN}
```

Expected Response (403 Forbidden):
```json
{
  "success": false,
  "message": "Super Admin access required"
}
```

✅ Test Passed: Admin cannot access logs

---

## Summary: Test Results

| Test | Expected | Result | Status |
|------|----------|--------|--------|
| Customer signup auto-assigns role | ✅ customer | ? | ⚠️ |
| Customer blocked from product creation | ✅ 403 | ? | ⚠️ |
| Super Admin can create products | ✅ 201 | ? | ⚠️ |
| Super Admin promotes customer to admin | ✅ 200 | ? | ⚠️ |
| Admin cannot promote users | ✅ 403 | ? | ⚠️ |
| Admin can view all users | ✅ 200 | ? | ⚠️ |
| Admin cannot access super admin routes | ✅ 403 | ? | ⚠️ |
| Customer can add to cart | ✅ 201 | ? | ⚠️ |
| Super Admin can view activity logs | ✅ 200 | ? | ⚠️ |
| Admin cannot view activity logs | ✅ 403 | ? | ⚠️ |

---

## Quick Test Script

You can also use this curl commands to test:

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Create product (with token)
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product","price":99.99,"stock":10}'

# View users as admin
curl -X GET http://localhost:5000/api/users/admin/users/all \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

---

## Expected Authorization Errors

All these should return **403 Forbidden**:
```
❌ Customer creating product
❌ Customer promoting user
❌ Customer viewing all users
❌ Customer accessing admin routes
❌ Admin viewing super admin logs
❌ Admin promoting users
❌ Admin accessing system settings
```

All these should return **401 Unauthorized**:
```
❌ Missing authorization header
❌ Expired token
❌ Invalid token
❌ Malformed token
```

---

## Troubleshooting

If tests fail:

1. **401 Unauthorized** - Check token is valid and not expired
2. **403 Forbidden** - Verify user role matches required role
3. **500 Server Error** - Check backend logs for errors
4. **Token parsing fails** - Ensure Bearer token format: `Authorization: Bearer {TOKEN}`

---

## Notes

✅ All roles are now properly defined and enforced
✅ Routes are protected with middleware
✅ Each role has specific permissions
✅ Cross-role access is blocked
✅ Error messages are clear and specific
