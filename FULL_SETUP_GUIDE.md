# 🚀 AAXOMS Full Setup & Authentication Guide

## Table of Contents
1. [Quick Start (5 minutes)](#quick-start)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Setup](#database-setup)
5. [Testing Authentication](#testing-authentication)
6. [Troubleshooting](#troubleshooting)
7. [Deployment](#deployment)

---

## Quick Start

### Prerequisites
- ✅ Node.js 14+ installed
- ✅ VS Code or any code editor
- ✅ MongoDB Atlas account (free tier available)
- ✅ Git installed

### 1️⃣ Clone & Install Dependencies (2 minutes)

```bash
# Backend setup
cd c:\Users\ACER\Desktop\AAXOMS\backend
npm install

# Frontend setup
cd c:\Users\ACER\Desktop\AAXOMS\frontend
npm install
```

### 2️⃣ Create Environment Files (2 minutes)

#### Backend `.env` file
Create `c:\Users\ACER\Desktop\AAXOMS\backend\.env`:

```env
# Server Settings
PORT=5000
NODE_ENV=development

# JWT Secret (CHANGE IN PRODUCTION!)
JWT_SECRET=bombay_trooper_jwt_secret_12345_change_this_in_production

# CORS
FRONTEND_URL=https://aaoms-test.onrender.com

# Database (Choose ONE)
# Option A: Simple JSON (Development only)
DATABASE_TYPE=json
DATABASE_PATH=./data

# Option B: MongoDB (Recommended - Production)
# DATABASE_TYPE=mongodb
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

#### Frontend `.env` file
Create `c:\Users\ACER\Desktop\AAXOMS\frontend\.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### 3️⃣ Start the Application (1 minute)

**Terminal 1 - Backend:**
```bash
cd c:\Users\ACER\Desktop\AAXOMS\backend
npm start
# Expected: Server running on http://localhost:5000 ✅
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\ACER\Desktop\AAXOMS\frontend
npm start
# Expected: App opens at https://aaoms-test.onrender.com ✅
```

---

## Backend Setup

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables

Create `.env` file with these values:

```env
# ========== SERVER ==========
PORT=5000
NODE_ENV=development

# ========== SECURITY ==========
JWT_SECRET=your_secret_key_at_least_32_chars_long_minimum

# ========== CORS ==========
FRONTEND_URL=https://aaoms-test.onrender.com

# ========== DATABASE ==========
# Choose based on your preference:

# Option 1: JSON Database (Development)
DATABASE_TYPE=json
DATABASE_PATH=./data

# Option 2: MongoDB (Production Recommended)
# DATABASE_TYPE=mongodb
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Step 3: Verify Backend Routes

The following endpoints should be available:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (requires token) |
| POST | `/api/auth/logout` | Logout user |

### Step 4: Start Backend Server

```bash
npm start
```

Expected Output:
```
🚀 Server is running on port 5000
📁 Using JSON file-based database
✅ API is ready at http://localhost:5000/api
```

---

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

### Step 3: Start React Development Server

```bash
npm start
```

Expected Output:
```
Compiled successfully!

You can now view aaxoms in the browser.

Local:            https://aaoms-test.onrender.com
```

### Step 4: Verify Frontend Working

- ✅ Website loads at `https://aaoms-test.onrender.com`
- ✅ Navigation bar visible
- ✅ Home page displays products
- ✅ No red errors in console

---

## Database Setup

### Option A: JSON Database (Quick Development)

✅ **Easiest for Development**
- No additional setup needed
- Data stored in `backend/data/` folder
- Files: `users.json`, `products.json`, `orders.json`, `carts.json`

**Limitation:** Cannot be used for production or multiple servers

### Option B: MongoDB Atlas (Recommended Production)

#### Step 1: Create Free MongoDB Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Sign up with email
4. Check email and verify account

#### Step 2: Create a Cluster
1. After login, click "Create a Deployment"
2. Choose **FREE Tier** (M0 Sandbox)
3. Select your region (closest to your location)
4. Click "Create Deployment"
5. Set username: `bombay_trooper`
6. Set password: Use auto-generated strong password (copy it!)

#### Step 3: Get Connection String
1. After cluster is created, click "Connect"
2. Choose "Drivers" → "Node.js"
3. Copy the connection string
4. Replace `<password>` with your actual password
5. Replace `myFirstDatabase` with `bombay_trooper`

Example:
```
mongodb+srv://bombay_trooper:YOUR_PASSWORD@cluster0.aefcbft.mongodb.net/bombay_trooper?retryWrites=true&w=majority
```

#### Step 4: Update Backend .env
```env
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://bombay_trooper:YOUR_PASSWORD@cluster0.aefcbft.mongodb.net/bombay_trooper?retryWrites=true&w=majority
```

#### Step 5: Whitelist Your IP (Important!)
1. In MongoDB Atlas, go to "Network Access"
2. Click "Add IP Address"
3. Click "Add Current IP Address" OR
4. For development, add `0.0.0.0/0` (allows all IPs)

#### Step 6: Restart Backend
```bash
npm start
```

Expected output:
```
🔗 Connecting to MongoDB Atlas...
✅ MongoDB Connected Successfully!
```

---

## Testing Authentication

### Demo Accounts (Pre-seeded)

When you first run the application, use these demo accounts:

#### Customer Account
- **Email:** `customer@example.com`
- **Password:** `customer123`
- **Role:** Customer
- **Access:** Home page, products, cart, checkout

#### Admin Account
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** Admin
- **Access:** Admin Dashboard, manage users, products, orders
- **URL:** `https://aaoms-test.onrender.com/admin`

#### Super Admin Account
- **Email:** `super@example.com`
- **Password:** `super123`
- **Role:** Super Admin
- **Access:** Super Admin Dashboard, system settings, all admin features
- **URL:** `https://aaoms-test.onrender.com/super-admin`

### Manual Testing Steps

#### 1. Test Customer Signup
```
1. Go to https://aaoms-test.onrender.com/signup
2. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 9876543210
   - Password: Password123
   - Confirm: Password123
3. Click "CREATE ACCOUNT"
4. ✅ Should redirect to home page with toast success
5. ✅ Should see "Hi John" in navbar
```

#### 2. Test Customer Login
```
1. Go to https://aaoms-test.onrender.com/login
2. Enter email: john@example.com
3. Enter password: Password123
4. Click "LOGIN"
5. ✅ Should redirect to home page
6. ✅ Should see username in navbar
7. ✅ Should see green toast: "Login Successful"
```

#### 3. Test Admin Login
```
1. Go to https://aaoms-test.onrender.com/login
2. Enter: admin@example.com / admin123
3. Click "LOGIN"
4. ✅ Should redirect to https://aaoms-test.onrender.com/admin
5. ✅ Admin dashboard should load
```

#### 4. Test Super Admin Login
```
1. Go to https://aaoms-test.onrender.com/login
2. Enter: super@example.com / super123
3. Click "LOGIN"
4. ✅ Should redirect to https://aaoms-test.onrender.com/super-admin
5. ✅ Super Admin dashboard should load
6. ✅ Can access System Settings & Admin Settings
```

#### 5. Test Logout
```
1. Login to any account
2. Click user dropdown → Logout
3. ✅ Should redirect to login page
4. ✅ Token removed from localStorage
```

#### 6. Test Protected Routes
```
1. Logout completely
2. Try to access: https://aaoms-test.onrender.com/admin
3. ✅ Should redirect to login page
4. Login as customer and try same
5. ✅ Should show "Access Denied" message
```

---

## Authentication Flow

### Sign Up Process
```
User fills signup form
         ↓
Frontend validates input
         ↓
POST /api/auth/signup (email, password, name)
         ↓
Backend validates email format & password strength
         ↓
Backend checks if email already exists
         ↓
Backend hashes password (bcrypt)
         ↓
Backend creates user with role: 'customer'
         ↓
Backend generates JWT token
         ↓
Response with token + user data
         ↓
Frontend stores token in localStorage
         ↓
Frontend stores user in localStorage
         ↓
Frontend redirects to home page
         ↓
Toast success notification appears
```

### Login Process
```
User enters email & password
         ↓
Frontend validates fields not empty
         ↓
POST /api/auth/login (email, password)
         ↓
Backend finds user by email
         ↓
Backend compares password with hash (bcrypt)
         ↓
Backend generates JWT token
         ↓
Response with token + user data
         ↓
Frontend stores token & user in localStorage
         ↓
Frontend checks user role:
   - role === 'super_admin' → /super-admin
   - role === 'admin' → /admin
   - role === 'customer' → /
         ↓
Redirect with toast notification
```

### API Request with Authentication
```
Every API request:
         ↓
Interceptor checks for token in localStorage
         ↓
If found, adds header: Authorization: Bearer {token}
         ↓
Server receives request
         ↓
Middleware validates token signature & expiration
         ↓
If valid, request proceeds
         ↓
If invalid, returns 401 Unauthorized
         ↓
Frontend removes token & redirects to login
```

---

## Troubleshooting

### Issue: "Cannot GET /api/auth/login"
**Solution:**
- ✅ Ensure backend is running on port 5000
- ✅ Check `REACT_APP_API_URL` in frontend .env file
- ✅ Restart both servers

### Issue: "Network Error when signing up"
**Solution:**
- ✅ Backend server must be running
- ✅ Check backend .env `FRONTEND_URL` is set to `https://aaoms-test.onrender.com`
- ✅ Check CORS is enabled
- ✅ Look at backend console for detailed error

### Issue: "Login successful but staying on login page"
**Solution:**
- ✅ Check browser console (F12) for errors
- ✅ Verify token is saved: `localStorage.getItem('token')`
- ✅ Check response from `/api/auth/login` endpoint
- ✅ Ensure user object has `role` property

### Issue: "Can't login as admin/super-admin"
**Solution:**
- ✅ Verify demo accounts exist in database
- ✅ Check user `role` field in database
- ✅ Verify role is exactly: 'admin', 'super_admin', or 'customer'
- ✅ No spaces or different capitalization

### Issue: "MongoDB connection failed"
**Solution:**
- ✅ Check MONGODB_URI is correct
- ✅ Verify IP is whitelisted on MongoDB Atlas
- ✅ Check username & password are correct
- ✅ Ensure network has internet connection
- ✅ Fall back to JSON database for testing

### Issue: "Port 5000 already in use"
**Solution:**
```bash
# Windows: Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm start
# Then update REACT_APP_API_URL to http://localhost:5001/api
```

### Issue: "Password validation failing"
**Solution:**
- ✅ Password must be at least 6 characters
- ✅ Passwords must match (signup)
- ✅ No special characters (currently)
- ✅ Try: `Password123`

---

## Deployment to Production

### Backend (Heroku/Railway)

1. **Create Production .env**
```env
PORT=5000
NODE_ENV=production
JWT_SECRET=your_very_strong_secret_key_12345_minimum_32_chars
FRONTEND_URL=https://yourdomain.com
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bomb...
```

2. **Deploy to Heroku**
```bash
heroku login
heroku create your-app-name
git push heroku main
```

3. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET=your_secret
heroku config:set DATABASE_TYPE=mongodb
heroku config:set MONGODB_URI=your_uri
```

### Frontend (Vercel/Netlify)

1. **Change API URL in .env**
```env
REACT_APP_API_URL=https://your-backend-domain/api
REACT_APP_ENV=production
```

2. **Build for Production**
```bash
npm run build
```

3. **Deploy to Vercel**
```bash
npm install -g vercel
vercel
```

---

## Security Checklist

Before going to production:

- [ ] Change JWT_SECRET to strong random value (32+ characters)
- [ ] Enable HTTPS only
- [ ] Set secure cookie flags (if using cookies)
- [ ] Add rate limiting to auth endpoints
- [ ] Enable password complexity requirements
- [ ] Add email verification for signups
- [ ] Implement password reset functionality
- [ ] Add 2-factor authentication (optional)
- [ ] Monitor failed login attempts
- [ ] Use environment variables for all secrets
- [ ] Enable CORS only for your domain
- [ ] Add input sanitization
- [ ] Use HTTPS for all connections
- [ ] Keep dependencies updated

---

## File Structure Reference

```
AAXOMS/
├── backend/
│   ├── controllers/
│   │   └── authController.js      ← Login/Signup logic
│   ├── routes/
│   │   └── authRoutes.js          ← API endpoints
│   ├── middleware/
│   │   └── roleMiddleware.js      ← JWT verification
│   ├── models/
│   │   └── Database.js            ← JSON/MongoDB abstraction
│   ├── data/
│   │   ├── users.json            ← User data (JSON mode)
│   │   ├── products.json
│   │   ├── orders.json
│   │   └── carts.json
│   ├── .env                       ← Environment variables
│   ├── server.js                  ← Main server file
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx    ← Auth state management
│   │   ├── services/
│   │   │   └── api.js             ← API configuration
│   │   ├── pages/
│   │   │   ├── Login/
│   │   │   │   └── Login.jsx
│   │   │   └── Signup/
│   │   │       └── Signup.jsx
│   │   └── App.js                 ← Route definitions
│   ├── .env                       ← Environment variables
│   ├── package.json
│   └── public/
│
└── README.md
```

---

## Need Help?

1. **Check the logs**
   - Backend console output
   - Browser DevTools (F12)
   - Network tab for API calls

2. **Common issues resolved**
   - See "Troubleshooting" section above

3. **Test endpoints with Postman**
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{"email": "admin@example.com", "password": "admin123"}`

---

**Happy Coding! 🚀**
