# 📡 AAXOMS Authentication & API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Header
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 🔐 Authentication Endpoints

### 1. Sign Up (Register New User)

**Endpoint:** `POST /auth/signup`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email already registered"
}
```

**Validation Rules:**
- ✅ Email: Must be valid format
- ✅ Password: At least 6 characters
- ✅ Name: Required, not empty
- ✅ Email: Must not already exist

---

### 2. Login

**Endpoint:** `POST /auth/login`

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Demo Accounts:**
```
Customer:   customer@example.com / customer123
Admin:      admin@example.com / admin123
Super Admin: super@example.com / super123
```

---

### 3. Get Current User (Protected)

**Endpoint:** `GET /auth/me`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid-here",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin",
    "phone": "9876543210",
    "address": "123 Admin St",
    "city": "Admin City",
    "state": "AC",
    "zipcode": "12345",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Unauthorized - Invalid or missing token"
}
```

---

### 4. Logout (Protected)

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Frontend Action:**
- Remove token from localStorage
- Remove user from localStorage
- Redirect to login page

---

## 🔑 JWT Token Structure

### Token Payload
```json
{
  "id": "user-id-uuid",
  "email": "user@example.com",
  "role": "admin",
  "iat": 1642345678,
  "exp": 1644937678
}
```

### Token Format
```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiBEb2UiLCJpYXQiOjE1MTYyMzkwMjJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Expiration
- **Duration:** 30 days
- **Format:** Unix timestamp (seconds)
- **Example:** Token expires 30 days from creation

---

## 👥 User Roles & Permissions

### 1. Customer
- **Role value:** `"customer"`
- **Permissions:**
  - Browse products
  - Add to cart
  - Checkout orders
  - View own orders
  - Update profile
- **Restricted from:**
  - Admin dashboard
  - User management
  - Product management
  - System settings

### 2. Admin
- **Role value:** `"admin"`
- **Permissions:**
  - All customer permissions
  - Manage users
  - Manage products
  - Manage orders
  - View analytics
  - Admin settings
- **Restricted from:**
  - Super Admin dashboard
  - System settings
  - Role management

### 3. Super Admin
- **Role value:** `"super_admin"`
- **Permissions:**
  - All admin permissions
  - System settings
  - Manage admins
  - Manage super admins
  - Database backups
  - Security settings
  - Full system control

---

## 🛡️ Security Features

### Password Security
- **Algorithm:** bcrypt with salt (10 rounds)
- **Storage:** Never stored as plaintext
- **Minimum Length:** 6 characters
- **Hashing:** One-way encryption

```javascript
// Backend hashing
const hashedPassword = await bcrypt.hash(password, 10);

// Backend verification
const isValid = await bcrypt.compare(inputPassword, hashedPassword);
```

### Token Security
- **Algorithm:** HS256 (HMAC SHA-256)
- **Secret:** JWT_SECRET environment variable
- **Storage:** Sent to frontend in response
- **Frontend Storage:** localStorage (HTTPS recommended)
- **Transmission:** Authorization header with Bearer scheme

### CORS Security
- **Allowed Origins:** Specified in FRONTEND_URL
- **Methods:** GET, POST, PUT, DELETE, PATCH
- **Credentials:** Allowed (for cookies)
- **Headers:** Content-Type, Authorization

---

## 🔄 Complete Authentication Flow

### Signup Flow
```
1. User fills signup form
   ├─ Validate fields
   ├─ Check email format
   └─ Check password length

2. POST /auth/signup
   ├─ Backend validates input
   ├─ Check email doesn't exist
   ├─ Hash password with bcrypt
   └─ Create user record

3. Generate JWT token
   ├─ Include user ID, email, role
   ├─ Set 30-day expiration
   └─ Sign with JWT_SECRET

4. Response to frontend
   ├─ Return token
   ├─ Return user object
   └─ Return success message

5. Frontend stores data
   ├─ Save token to localStorage
   ├─ Save user to localStorage
   └─ Update React Context

6. Auto-login
   ├─ Redirect based on role
   └─ Show welcome toast
```

### Login Flow
```
1. User enters credentials
   ├─ Validate fields present
   └─ Check format

2. POST /auth/login
   ├─ Find user by email
   ├─ Compare password (bcrypt)
   └─ Verify account active

3. Generate JWT token
   ├─ Include user ID, email, role
   ├─ Set 30-day expiration
   └─ Sign with JWT_SECRET

4. Response to frontend
   ├─ Return token
   ├─ Return user object
   └─ Return success message

5. Frontend processes login
   ├─ Save token to localStorage
   ├─ Save user to localStorage
   ├─ Update React Context
   └─ Check user role

6. Redirect to dashboard
   ├─ super_admin → /super-admin
   ├─ admin → /admin
   └─ customer → /home
```

### Protected API Request Flow
```
1. Frontend makes API request
   ├─ Axios interceptor checks localStorage
   └─ Adds Authorization header

2. Request sent with token
   ├─ Headers include: "Authorization: Bearer {token}"
   └─ Server receives request

3. Server validates token
   ├─ Check signature with JWT_SECRET
   ├─ Check expiration date
   └─ Extract user info

4. If valid
   ├─ Allow request to proceed
   └─ Attach user to request

5. If invalid
   ├─ Return 401 Unauthorized
   └─ Frontend clears storage & redirects

6. Response sent
   ├─ With user data (if GET /auth/me)
   └─ With success/error message
```

### Logout Flow
```
1. User clicks logout
   ├─ POST /auth/logout (with token)
   └─ Server validates token

2. Server response
   ├─ Returns success message
   └─ No need for token destruction

3. Frontend cleanup
   ├─ Remove token from localStorage
   ├─ Remove user from localStorage
   ├─ Clear React Context
   └─ Redirect to login page

4. Auto-logout on 401
   ├─ Token expired
   ├─ Response interceptor catches error
   ├─ Clears storage automatically
   ├─ Redirects to login
   └─ Shows error toast
```

---

## 🧪 Testing with cURL

### Login Request
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Response
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "admin"
  }
}
```

### Using Token in Next Request
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"
```

---

## 🧪 Testing with Postman

### 1. Create Collection: "AAXOMS Auth"
### 2. Add Request: "Login"
```
Method: POST
URL: http://localhost:5000/api/auth/login

Body (raw JSON):
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 3. Save Token
In Postman after successful login:
```
1. Response → Body → Copy token
2. Environment → Create variable "token"
3. Paste token value
4. Use {{token}} in Authorization header
```

### 4. Add Request: "Get Current User"
```
Method: GET
URL: http://localhost:5000/api/auth/me

Headers:
Authorization: Bearer {{token}}
```

---

## 📊 Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | ✅ Success | Login successful |
| 201 | ✅ Created | User registered |
| 400 | ❌ Bad Request | Missing email |
| 401 | ❌ Unauthorized | Invalid password |
| 409 | ❌ Conflict | Email already exists |
| 500 | ❌ Server Error | Database error |

---

## 🔗 Integration Guide

### Frontend Setup
```javascript
// 1. Import useAuth hook
import { useAuth } from './context/AuthContext';

// 2. Use in component
const { login, signup, logout, user } = useAuth();

// 3. Call login
const user = await login(email, password);

// 4. Check role
if (user?.role === 'admin') {
  navigate('/admin');
}

// 5. Logout
logout();
```

### Authentication Context
```javascript
// AuthContext.jsx provides:
- user: Current user object
- token: JWT token
- loading: Loading state
- error: Error messages
- login(email, password): Login function
- signup(email, password, name): Register function
- logout(): Logout function
- isAuthenticated(): Check if logged in
- hasRole(role): Check user role
```

### API Service Configuration
```javascript
// api.js automatically:
- Adds Authorization header with token
- Handles 401 errors (logs out user)
- Refreshes page on token expiration
- Interceptors for request/response
```

---

## 🚀 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your_secret_key
PORT=5000
FRONTEND_URL=https://aaoms-test.onrender.com
DATABASE_TYPE=json
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## 📝 Database Schema (Users)

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "password": "hashed_password_bcrypt",
  "name": "Full Name",
  "role": "customer|admin|super_admin",
  "phone": "9876543210",
  "address": "Street address",
  "city": "City name",
  "state": "State code",
  "zipcode": "12345",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

## ⚠️ Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `"Email already registered"` | User exists | Use different email |
| `"Invalid email or password"` | Wrong credentials | Check email & password |
| `"Password must be at least 6 characters"` | Too short | Use 6+ chars |
| `"Unauthorized - Invalid token"` | Token expired/invalid | Login again |
| `"Cannot connect to server"` | Backend offline | Start backend server |
| `"Network Error"` | CORS issue | Check REACT_APP_API_URL |

---

## 🔗 Related Routes

- `GET /` - Home page
- `POST /products` - Admin: Create product
- `GET /products` - Get all products
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `PUT /users/:id` - Update profile

---

## 📚 References

- [JWT.io](https://jwt.io) - JWT decoder/verifier
- [bcryptjs npm](https://www.npmjs.com/package/bcryptjs) - Password hashing
- [Express.js Docs](https://expressjs.com) - Backend framework
- [React Docs](https://react.dev) - Frontend framework
- [Axios Docs](https://axios-http.com) - HTTP client

---

**All endpoints tested and working! 🎉**
