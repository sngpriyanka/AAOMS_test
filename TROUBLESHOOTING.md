# 🔧 AAXOMS Authentication Troubleshooting Guide

## Common Issues & Solutions

### 1. Backend Won't Start

**Error: `Cannot find module`**
```bash
# Solution
cd backend
npm install
npm start
```

**Error: `Port 5000 already in use`**
```bash
# Windows - Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm start
```

---

### 2. Frontend Can't Connect to Backend

**Error: `Network Error` on login**

**Cause:** Backend not running or wrong API URL

**Solution:**
```bash
# Step 1: Check backend is running
# Terminal should show: 🚀 Server is running on port 5000

# Step 2: Verify API URL in frontend/.env
REACT_APP_API_URL=http://localhost:5000/api

# Step 3: Check CORS in backend/.env
FRONTEND_URL=https://aaoms-test.onrender.com

# Step 4: Restart both servers
```

---

### 3. Demo Accounts Not Found

**Error: `Invalid email or password` for demo accounts**

**Cause:** Demo accounts not seeded

**Solution:**
```bash
# Seed demo accounts
cd backend
node scripts/seed-demo-accounts.js

# Check output
# ✅ Created CUSTOMER: customer@example.com
# ✅ Created ADMIN: admin@example.com
# ✅ Created SUPER_ADMIN: super@example.com

# Verify data/users.json exists and has accounts
```

---

### 4. Login Works But Wrong Redirect

**Issue: Logged in as admin but redirected to customer page**

**Cause:** Role not properly set in database or response

**Solution:**
```bash
# Check user role in backend/data/users.json
# Should be exactly: "admin" or "super_admin"

# Check API response (DevTools → Network tab)
# POST /auth/login response should include: "role": "admin"

# Verify AuthContext checking role:
# super_admin → /super-admin
# admin → /admin
# customer → /
```

**Code Check:**
```javascript
// In Login.jsx
if (user?.role === 'super_admin') {
  navigate('/super-admin');
} else if (user?.role === 'admin') {
  navigate('/admin');
} else {
  navigate('/');
}
```

---

### 5. Toast Notifications Not Showing

**Issue: No success/error messages after login/signup**

**Cause:** React-toastify not properly imported or configured

**Solution 1: Check Imports**
```javascript
// Login.jsx should have
import { toast } from 'react-toastify';
```

**Solution 2: Check App.js has ToastContainer**
```javascript
// In App.js, component should include:
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// In JSX:
<ToastContainer
  position="bottom-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
```

**Solution 3: Test Toast**
```javascript
// Add this in your component to test
import { useEffect } from 'react';
import { toast } from 'react-toastify';

useEffect(() => {
  toast.success('Testing toast!');
}, []);
```

---

### 6. Signup Email Already Exists Error

**Error: `Email already registered`**

**Cause:** User already exists in database

**Solution:**
```bash
# Option 1: Use different email
# In signup form, enter: newemail@example.com

# Option 2: Clear database (dev only)
# Delete content of backend/data/users.json (keep empty [])
# Reseed accounts: node scripts/seed-demo-accounts.js
```

---

### 7. Password Too Short Error

**Error: `Password must be at least 6 characters`**

**Solution:**
- Use at least 6 characters: `Password123`
- Try stronger password: `MyPassword@2024`

---

### 8. Signup Form Validation Failing

**Issue: Can't create account even with valid data**

**Solution: Check all required fields**
```
✅ First Name: Must not be empty
✅ Last Name: Must not be empty
✅ Email: Must include @ symbol (john@example.com)
✅ Phone: Must not be empty (10 digits)
✅ Password: At least 6 chars (Password123)
✅ Confirm Password: Must match password
✅ Terms: Must check the checkbox
```

---

### 9. Logout Not Working

**Issue: Still logged in after clicking logout**

**Cause:** Token not properly cleared

**Solution:**
```javascript
// Check AuthContext logout function
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setToken(null);
  setUser(null);
  setError(null);
  // Redirect should happen in component
};
```

**If still not working:**
```bash
# Clear browser data
1. DevTools → Application → Storage
2. Delete all items in localStorage
3. Press Ctrl+Shift+Del to clear cache
4. Refresh page - should be logged out
```

---

### 10. Protected Routes Not Working

**Issue: Can access /admin without admin role**

**Cause:** ProtectedRoute component not checking role properly

**Solution:**
```javascript
// Check App.js has this structure
<Route path="/admin" element={
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
} />
```

**Check ProtectedRoute Component:**
```javascript
// ProtectedRoute.jsx should:
// 1. Check if user is authenticated
// 2. Check if user has required role
// 3. Redirect to login if not authenticated
// 4. Show "Access Denied" if not authorized
```

---

### 11. Refreshing Page Logs You Out

**Issue: After refresh, user is logged out**

**Cause:** Token not being loaded from localStorage on app start

**Solution:**
```javascript
// In AuthContext useEffect:
useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  
  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
  }
  setLoading(false);
}, []);
```

**Verify:**
1. Login to app
2. Open DevTools → Application → Local Storage
3. Should see `token` and `user` keys
4. Refresh page - should still be logged in

---

### 12. MongoDB Connection Error

**Error: `Cannot connect to MongoDB`**

**Solution:**
```bash
# Option 1: Use JSON database (no setup needed)
DATABASE_TYPE=json

# Option 2: Setup MongoDB Atlas
# 1. Go to https://www.mongodb.com/cloud/atlas
# 2. Create free account
# 3. Create cluster
# 4. Create database user
# 5. Get connection string
# 6. Set in .env:
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Option 3: Common MongoDB error - IP not whitelisted
# Go to MongoDB Atlas → Network Access
# Click "Add IP Address"
# Add your current IP or 0.0.0.0/0 for all
# Wait 5-10 seconds before trying again
```

---

### 13. API Response 400 Errors

**Error: `Bad Request [400]`**

**Check:**
```
1. POST /auth/login - requires: email, password
2. POST /auth/signup - requires: email, password, name
3. All fields must be provided
4. Email must be valid format
```

**Debug:**
```javascript
// In DevTools → Network → Auth Request
// Check Request: POST data is valid
// Check Response: Error message what's missing
```

---

### 14. Token Not Sent in Requests

**Issue: API returns 401 Unauthorized on protected routes**

**Cause:** Token not being added to request headers

**Solution:**
```javascript
// In api.js, check interceptor:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**Verify:**
1. Login successfully
2. Go to `/admin` or protected route
3. DevTools → Network tab
4. Check request headers include: `Authorization: Bearer <token>`

---

## Debug Checklist

```
Before reporting an issue, check:

[ ] Backend is running (npm start in backend/)
[ ] Frontend is running (npm start in frontend/)
[ ] .env files are created (backend/.env and frontend/.env)
[ ] Demo accounts seeded (node scripts/seed-demo-accounts.js)
[ ] API URL correct in frontend/.env (http://localhost:5000/api)
[ ] Port 5000 is free (netstat -ano | findstr :5000)
[ ] Browser cache cleared (Ctrl+Shift+Del)
[ ] localStorage cleared if needed (DevTools → Storage)
[ ] Both terminals showing no errors
[ ] Correct email/password being used
[ ] Forms filled completely
[ ] No trailing spaces in inputs
```

---

## Getting Help

1. **Check Browser Console**
   - Open: DevTools (F12) → Console
   - Look for red error messages

2. **Check DevTools Network**
   - F12 → Network tab
   - Make request (login/signup)
   - Check request/response details

3. **Check Backend Console**
   - Look at terminal where backend is running
   - See if request is received
   - Check error messages

4. **Enable Debug Mode**
   - Add `console.log()` in key places
   - Check localStorage values
   - Test API with Postman/curl

---

## Quick Fixes Summary

| Problem | Fix |
|---------|-----|
| Backend won't start | `npm install` then `npm start` |
| Frontend won't connect | Check `.env` and restart backend |
| Demo accounts missing | `node scripts/seed-demo-accounts.js` |
| Toast not showing | Add `<ToastContainer>` in App.js |
| Wrong redirect | Check role in database is 'admin' or 'super_admin' |
| Logout not working | Check localStorage cleared |
| Protected routes broken | Verify ProtectedRoute component |
| Still logged in after refresh | Token should load from localStorage |
| MongoDB error | Use JSON mode or setup MongoDB Atlas |

---

**Still having issues? Create an issue with:**
- Error message (copy exact text)
- Which step failed
- Output from terminal where server runs
- Browser DevTools console errors
