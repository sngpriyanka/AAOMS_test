# 🎯 AAXOMS Developer Quick Reference

## Command Cheat Sheet

### Start Development Servers
```bash
# Terminal 1 - Backend
cd c:\Users\ACER\Desktop\AAXOMS\backend
npm start
# Port: 5000

# Terminal 2 - Frontend
cd c:\Users\ACER\Desktop\AAXOMS\frontend
npm start
# Port: 3000
```

### Initialize Demo Accounts
```bash
cd c:\Users\ACER\Desktop\AAXOMS\backend
node scripts/seed-demo-accounts.js
```

### Build for Production
```bash
cd c:\Users\ACER\Desktop\AAXOMS\frontend
npm run build
```

---

## 🔐 Demo Login Credentials

```
Customer:  customer@example.com / customer123 → Home page
Admin:     admin@example.com / admin123 → /admin
Super:     super@example.com / super123 → /super-admin
```

---

## 🌐 Important URLs

| Page | URL | Requires |
|------|-----|----------|
| Home | https://aaoms-test.onrender.com | None |
| Login | https://aaoms-test.onrender.com/login | None |
| Signup | https://aaoms-test.onrender.com/signup | None |
| Admin Dashboard | https://aaoms-test.onrender.com/admin | Admin role |
| Super Admin | https://aaoms-test.onrender.com/super-admin | Super Admin role |
| Product Detail | https://aaoms-test.onrender.com/product/:slug | None |
| Cart | https://aaoms-test.onrender.com/cart | None |
| Checkout | https://aaoms-test.onrender.com/checkout | None |
| Order History | https://aaoms-test.onrender.com/orders | Login required |

---

## API Endpoints

### Authentication
```
POST   /api/auth/signup      - Create new account
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user (protected)
POST   /api/auth/logout      - Logout user (protected)
```

### Example Requests
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Response includes: token, user object, message
```

---

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=bombay_trooper_jwt_secret_key_xxxxx
FRONTEND_URL=https://aaoms-test.onrender.com
DATABASE_TYPE=json
DATABASE_PATH=./data
# MONGODB_URI=mongodb+srv://user:pass@cluster...
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## 📁 Key File Locations

```
backend/
  ├── controllers/authController.js        - Auth logic
  ├── routes/authRoutes.js                - API routes
  ├── middleware/roleMiddleware.js        - JWT verification
  ├── models/Database.js                  - DB abstraction
  ├── data/users.json                     - User storage
  ├── scripts/seed-demo-accounts.js       - Seeder script
  ├── .env                                - Configuration
  └── server.js                           - Main server

frontend/
  ├── src/context/AuthContext.jsx         - Auth state
  ├── src/pages/Login/Login.jsx           - Login page
  ├── src/pages/Signup/Signup.jsx         - Signup page
  ├── src/services/api.js                 - API setup
  ├── src/App.js                          - Routes
  ├── .env                                - Configuration
  └── package.json
```

---

## 🔍 Debugging Tips

### Check if servers are running
```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl https://aaoms-test.onrender.com
```

### Check localhost ports
```bash
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Check localStorage (in browser)
```javascript
// Console in DevTools
console.log(localStorage.getItem('token'))
console.log(JSON.parse(localStorage.getItem('user')))
```

### Verify API connection
```bash
# Open DevTools → Network tab
# Try to login and watch the request/response
# POST /api/auth/login should return 200 with token
```

---

## 💾 Database

### JSON Mode (Current Default)
- Files: `backend/data/*.json`
- Users: `backend/data/users.json`
- Quick, no setup needed
- Perfect for development

### Switch to MongoDB
```env
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
```

### Clear Database (Dev Only)
```bash
# Delete backend/data/users.json content or entire file
# Run seeder to recreate: node scripts/seed-demo-accounts.js
```

---

## 🧪 Testing Quick Flow

### 1. Signup Test
```
1. Go to https://aaoms-test.onrender.com/signup
2. Fill all fields
3. Create account → Should redirect to home
4. Should see username in navbar
```

### 2. Login Test
```
1. Go to https://aaoms-test.onrender.com/login
2. Click demo account button OR enter credentials
3. Click LOGIN → Should redirect to dashboard
4. Should see green toast notification
```

### 3. Role Test
```
# Logout first, then:
1. Login as customer → Home page
2. Try /admin → "Access Denied"

1. Login as admin → Admin dashboard
2. Try /super-admin → "Access Denied"

1. Login as super → Super admin dashboard
2. Can access /admin, /super-admin, all features
```

### 4. Logout Test
```
1. Click user menu
2. Click Logout
3. Should redirect to home
4. Navbar should show "Login"
```

---

## 🐛 Common Problems & Quick Fixes

| Problem | Command | Why |
|---------|---------|-----|
| Can't login | `npm start` (in backend) | Backend must be running |
| Network error | Check `REACT_APP_API_URL` in .env | Must match backend URL |
| Demo accounts missing | `node scripts/seed-demo-accounts.js` | Accounts must be seeded |
| Port in use | `netstat -ano \| findstr :5000` | Find & kill process |
| Still logged in after logout | Clear localStorage in DevTools | Cache issue |
| Toast not showing | Check `<ToastContainer>` in App.js | Component missing |

---

## 🎨 Customization Points

### Change login/signup colors
```css
/* frontend/src/pages/auth/auth.css */
.auth-page__submit {
  background: #c9a227; /* CHANGE THIS */
}
```

### Change API URL
```env
# frontend/.env
REACT_APP_API_URL=https://your-api.com/api
```

### Change JWT secret
```env
# backend/.env
JWT_SECRET=your_strong_secret_key_here
```

### Change demo accounts
```bash
# Edit: backend/scripts/seed-demo-accounts.js
# Change email, password, role, name
```

---

## 📚 Documentation Files

| File | Purpose | Read Time |
|------|---------|-----------|
| QUICK_START.md | Get running in 5 minutes | 5 min |
| FULL_SETUP_GUIDE.md | Complete guide with all details | 20 min |
| TROUBLESHOOTING.md | Fix problems when stuck | 10 min |
| API_AUTHENTICATION.md | Understand API structure | 15 min |
| AAXOMS_IMPLEMENTATION_COMPLETE.md | Overview of everything | 5 min |

---

## 🚀 Production Deployment

### Before Deploy Checklist
```
☐ Change JWT_SECRET to strong random value
☐ Setup MongoDB Atlas
☐ Update .env files for production
☐ Update REACT_APP_API_URL to production domain
☐ Update CORS FRONTEND_URL
☐ Test authentication flow
☐ Test all user roles
☐ Setup HTTPS
☐ Enable security headers
☐ Setup monitoring
```

### Deploy Backend (Heroku example)
```bash
heroku login
heroku create your-app-name
git push heroku main
heroku config:set JWT_SECRET=xxxxx
heroku config:set DATABASE_TYPE=mongodb
heroku config:set MONGODB_URI=xxxxx
```

### Deploy Frontend (Vercel example)
```bash
npm run build
vercel
# Update REACT_APP_API_URL to production API
```

---

## 🔗 Important Links

- **JWT Token Debugger:** https://jwt.io
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas
- **Nodemon:** `npm install --save-dev nodemon`
- **Bcrypt:** `npm install bcryptjs`
- **React-Toastify:** `npm install react-toastify`
- **Axios:** `npm install axios`

---

## 💡 Tips & Tricks

### View decoded JWT
```javascript
// In browser console
const token = localStorage.getItem('token');
const decoded = JSON.parse(atob(token.split('.')[1]));
console.log(decoded);
```

### Test API with cURL
```bash
# Save response to variable
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' | jq -r '.token')

# Use token
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Enable request logging
```javascript
// In api.js, add before creating axios instance
const logger = require('your-logger');

api.interceptors.request.use(config => {
  logger.info(`${config.method} ${config.url}`);
  return config;
});
```

---

## 📞 Getting Help

### Steps to take when stuck:
1. Read the error message carefully
2. Check TROUBLESHOOTING.md
3. Check browser console (F12)
4. Check backend console output
5. Check network tab in DevTools
6. Review API_AUTHENTICATION.md
7. Test endpoints with cURL
8. Review code in relevant file

### Ask specific questions:
Instead of: "It doesn't work"
Ask: "On login, I get error X. Backend shows Y. Here's my .env"

---

## 🎯 What Each File Does

**authController.js** - Handles login/signup logic
**authRoutes.js** - Maps endpoints to controller functions
**roleMiddleware.js** - Validates JWT tokens and checks roles
**Database.js** - Abstracts JSON/MongoDB operations
**AuthContext.jsx** - React state management for auth
**api.js** - Axios setup with token interceptor
**Login.jsx** - Login UI and logic
**Signup.jsx** - Signup UI and logic
**App.js** - Route definitions and protections

---

## ✅ Success Indicators

When everything is working:
- ✅ Backend starts without errors
- ✅ Frontend loads at localhost:3000
- ✅ Can login with demo accounts
- ✅ Redirects to correct dashboard
- ✅ Toast notifications appear
- ✅ Can logout and clear session
- ✅ Can create new account
- ✅ Role-based access works
- ✅ Protected routes redirect to login
- ✅ Token persists on refresh

---

## 🎊 You're All Set!

Everything is configured and ready to go.

**Start here:** Follow QUICK_START.md (5 minutes)

**Stuck somewhere?** Check TROUBLESHOOTING.md

**Need API details?** Read API_AUTHENTICATION.md

**Want to understand everything?** Read FULL_SETUP_GUIDE.md

---

**Happy coding! 🚀**

Last Updated: April 2024
All credentials and URLs are examples for development
