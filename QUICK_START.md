# 🚀 QUICK START - AAXOMS Login & Signup (5 Minutes)

## Step 1: Create Environment Files

### Backend Environment (.env)
Create file: `backend/.env`

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=bombay_trooper_jwt_secret_key_change_this_in_production
FRONTEND_URL=https://aaoms-test.onrender.com
DATABASE_TYPE=json
DATABASE_PATH=./data
```

### Frontend Environment (.env)
Create file: `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Step 2: Install Dependencies

```bash
# Backend dependencies
cd backend
npm install
cd ..

# Frontend dependencies
cd frontend
npm install
cd ..
```

## Step 3: Seed Demo Accounts

```bash
cd backend
node scripts/seed-demo-accounts.js
```

Output should show:
```
✅ Created CUSTOMER: customer@example.com
✅ Created ADMIN: admin@example.com
✅ Created SUPER_ADMIN: super@example.com
```

## Step 4: Start Servers

**Open Terminal 1 - Backend:**
```bash
cd backend
npm start
```

Expected: `🚀 Server running on http://localhost:5000`

**Open Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Expected: Browser opens at `https://aaoms-test.onrender.com`

## Step 5: Test Login

### Option A: Use Demo Accounts

1. Navigate to `https://aaoms-test.onrender.com/login`
2. Click on demo account buttons (shows email & password)
3. Click "Use This" button
4. Click "LOGIN"
5. ✅ Should redirect based on role:
   - Customer → Home page
   - Admin → Admin dashboard
   - Super Admin → Super Admin dashboard

### Option B: Manual Entry

1. Go to `https://aaoms-test.onrender.com/login`
2. Enter email: `admin@example.com`
3. Enter password: `admin123`
4. Click "LOGIN"
5. ✅ Should see green toast: "Welcome back, Admin User!"
6. ✅ Redirected to `/admin` dashboard

## Step 6: Test Signup

1. Navigate to `https://aaoms-test.onrender.com/signup`
2. Fill in the form:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `9876543210`
   - Password: `Password123`
   - Confirm: `Password123`
3. Check "I agree to terms"
4. Click "CREATE ACCOUNT"
5. ✅ Should see green toast: "Account created successfully!"
6. ✅ Auto-redirected to home page
7. ✅ Navbar shows "Hi John"

## Step 7: Test Role-Based Access

**Change to Customer Account:**
```
1. Go to /login
2. Login with: customer@example.com / customer123
3. Try accessing: https://aaoms-test.onrender.com/admin
4. ✅ Should show: "Access Denied"
```

**Change to Admin Account:**
```
1. Go to /login
2. Login with: admin@example.com / admin123
3. Try accessing: https://aaoms-test.onrender.com/super-admin
4. ✅ Should show: "Access Denied"
```

**Super Admin Access:**
```
1. Go to /login
2. Login with: super@example.com / super123
3. Can access: /super-admin, /admin & all features
```

---

## Login/Signup Features Working

✅ **Login Page:**
- Email & password input
- Show/hide password toggle
- "Remember me" checkbox
- Demo account buttons
- Error messages with toast notifications
- Loading state
- Role-based redirect

✅ **Signup Page:**
- First name, last name, email input
- Phone number input
- Password confirmation
- Terms & conditions checkbox
- Form validation
- Toast notifications
- Auto-login after signup

✅ **Authentication:**
- JWT token-based auth
- Secure password hashing (bcrypt)
- Token stored in localStorage
- Auto-logout on 401 error
- Protected routes

---

## Demo Accounts Reference

| Role | Email | Password | Access |
|------|-------|----------|--------|
| 👤 Customer | customer@example.com | customer123 | Home, Products, Cart, Checkout |
| 🔐 Admin | admin@example.com | admin123 | /admin dashboard & management |
| 👑 Super Admin | super@example.com | super123 | /super-admin dashboard & system settings |

---

## Troubleshooting

### Backend not starting
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm start
```

### Frontend can't connect to backend
```bash
1. Ensure backend is running on port 5000
2. Check REACT_APP_API_URL in frontend/.env
3. Check FRONTEND_URL in backend/.env
4. Try: http://localhost:5000/api/health (should work if running)
```

### Login not working
```bash
1. Check backend console - see if request arrives
2. Verify demo accounts were seeded: npm run seed:demo
3. Check email & password are correct
4. Clear browser cache & localStorage
5. Check browser DevTools Network tab → /auth/login response
```

### Toast notifications not showing
```bash
Make sure AuthContext imports toast:
import { toast } from 'react-toastify';

And Login.jsx has it:
import { toast } from 'react-toastify';
```

---

## Next Steps

1. ✅ Test login/signup functionality
2. ✅ Try different user roles
3. ✅ Check role-based route protection
4. ✅ Test logout functionality
5. 📱 Test on mobile (responsive design)
6. 🔄 Test refresh (should maintain login)
7. 🗑️ Test logout (should clear session)
8. 🔐 Test forgotten password (if implemented)

---

## File Structure
```
AAXOMS/
├── backend/
│   ├── controllers/authController.js      ← Login/Signup logic
│   ├── routes/authRoutes.js              ← API routes
│   ├── middleware/roleMiddleware.js      ← JWT verification
│   ├── scripts/seed-demo-accounts.js     ← Seed accounts
│   ├── .env                              ← Configuration
│   └── data/users.json                   ← User data (JSON mode)
│
├── frontend/
│   ├── src/
│   │   ├── pages/Login/Login.jsx         ← Login page
│   │   ├── pages/Signup/Signup.jsx       ← Signup page
│   │   ├── context/AuthContext.jsx       ← Auth state
│   │   └── services/api.js               ← API calls
│   ├── .env                              ← Configuration
│   └── package.json
│
└── FULL_SETUP_GUIDE.md                   ← Complete guide
```

---

## Common Commands

```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm start

# Seed demo accounts
cd backend && node scripts/seed-demo-accounts.js

# Build frontend for production
cd frontend && npm run build

# Run backend tests (if available)
cd backend && npm test
```

---

**Now your AAXOMS application is fully functional with working login & signup! 🎉**
