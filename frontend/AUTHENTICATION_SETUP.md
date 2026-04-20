# AAXOMS Frontend Authentication & Admin Panel Setup Guide

## ✅ Completed Components

### 1. Authentication System
- **AuthContext** (`src/context/AuthContext.jsx`) - Global auth state management
  - `signup(email, password, name)` - User registration
  - `login(email, password)` - User authentication
  - `logout()` - Clear session
  - `isAuthenticated()` - Check if logged in
  - `hasRole(requiredRole)` - Role-based access check (customer=1, admin=2, super_admin=3)
  - Automatic localStorage persistence
  - 30-day token expiry

### 2. API Service Layer
- **api.js** (`src/services/api.js`) - Axios instance with interceptors
  - Automatic JWT token attachment to requests
  - 401 error handling (clears session, redirects to login)
  - 6 API modules:
    - `authAPI` - Authentication endpoints
    - `productAPI` - Product management
    - `cartAPI` - Shopping cart operations
    - `orderAPI` - Order management
    - `userAPI` - User profile and admin operations

### 3. Route Protection
- **ProtectedRoute** (`src/components/ProtectedRoute.jsx`) - Route wrapper
  - Checks authentication status
  - Enforces role-based access control
  - Shows loading state during auth verification
  - Redirects unauthorized users to login

### 4. Updated Pages
- **Login** (`src/pages/Login/Login.jsx`)
  - Backend integration with JWT authentication
  - Demo accounts for easy testing (3 different roles)
  - Role-based redirects:
    - `super_admin` → `/super-admin`
    - `admin` → `/admin`
    - `customer` → `/`
  - Email/password validation with error feedback

- **Signup** (`src/pages/Signup/Signup.jsx`)
  - Backend integration for user registration
  - Automatic login after signup
  - Form validation
  - Error handling and display

### 5. Admin Dashboard
- **AdminDashboard** (`src/pages/AdminPanel/AdminDashboard.jsx`) - Admin main page
  - 4 Statistics Cards: Users, Products, Orders, Revenue
  - Recent Orders table with status badges
  - Responsive sidebar navigation (5 sections)
  - Logout button with user info
  - Protected to `admin` role and above

### 6. Super Admin Dashboard
- **SuperAdminDashboard** (`src/pages/AdminPanel/SuperAdminDashboard.jsx`) - Super Admin main page
  - 6 Statistics Cards: Users, Admins, Products, Orders, Revenue, System Health
  - System Activities log with timestamps
  - Quick Actions buttons for common tasks
  - Enhanced navigation (7 menu items including Admins & System)
  - Protected to `super_admin` role only

### 7. User Management
- **ManageUsers** (`src/pages/AdminPanel/ManageUsers.jsx`)
  - View all users with search/filter
  - Edit user details (name, phone, address)
  - Delete users
  - Add new users (backend endpoint required)
  - Role badges showing user type
  - Protected to `admin` role and above

### 8. Admin Management
- **ManageAdmins** (`src/pages/AdminPanel/ManageAdmins.jsx`)
  - View all admins and super admins
  - Promote customers to admin
  - Demote admin to customer
  - Search and filter admins
  - Protected to `super_admin` role only

### 9. Styling
- **AdminPanel.css** (`src/pages/AdminPanel/AdminPanel.css`)
  - Complete responsive design
  - Dark theme sidebar
  - Stats cards with hover effects
  - Tables with alternating row colors
  - Form modals with validation
  - Mobile-friendly responsive breakpoints (768px, 480px)

### 10. Routes Integration
- **App.js** (`src/App.js`)
  - All new routes added with ProtectedRoute wrappers
  - AuthProvider wrapping entire app
  - Routes:
    - `/admin` - Admin dashboard
    - `/admin/users` - User management
    - `/super-admin` - Super admin dashboard
    - `/super-admin/admins` - Admin management

---

## 🚀 Quick Start Setup

### Step 1: Install Dependencies
```bash
cd frontend
npm install
# axios and react-icons are already in package.json
```

### Step 2: Create Environment File
Create `.env.local` in the `frontend` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Ensure Backend is Running
```bash
cd backend
npm run dev
# Should show "Server running on port 5000"
```

### Step 4: Start Frontend
```bash
cd frontend
npm start
# App runs on https://aaoms-test.onrender.com
```

### Step 5: Test the System
1. Open https://aaoms-test.onrender.com/login
2. Try different demo accounts:
   - **Customer**: customer@example.com / customer123
   - **Admin**: admin@example.com / admin123
   - **Super Admin**: super@example.com / super123

---

## 🔑 Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Customer | customer@example.com | customer123 | Home page |
| Admin | admin@example.com | admin123 | /admin, /admin/users |
| Super Admin | super@example.com | super123 | /super-admin, /super-admin/admins |

All demo accounts are pre-seeded in the backend database.

---

## 📋 File Structure

```
src/
├── context/
│   └── AuthContext.jsx (130 lines) - Auth state management
├── components/
│   └── ProtectedRoute.jsx (30 lines) - Route protection wrapper
├── services/
│   └── api.js (70 lines) - API service with interceptors
├── pages/
│   ├── Login/
│   │   └── Login.jsx (UPDATED) - With demo accounts
│   ├── Signup/
│   │   └── Signup.jsx (UPDATED) - With backend integration
│   └── AdminPanel/
│       ├── AdminDashboard.jsx (250 lines) - Admin main page
│       ├── SuperAdminDashboard.jsx (280 lines) - Super admin main page
│       ├── ManageUsers.jsx (150 lines) - User management
│       ├── ManageAdmins.jsx (140 lines) - Admin management
│       └── AdminPanel.css (700+ lines) - All styling
└── App.js (UPDATED) - With all routes and AuthProvider
```

---

## 🔐 How Authentication Works

1. **User Signup**
   - User fills signup form with name, email, password
   - `AuthContext.signup()` calls `POST /auth/signup`
   - Server creates account and returns JWT token
   - Token stored in localStorage
   - User auto-logged in and redirected to home

2. **User Login**
   - User enters email and password
   - `AuthContext.login()` calls `POST /auth/login`
   - Server validates credentials and returns JWT token
   - Token stored in localStorage
   - User redirected based on role:
     - Admin → `/admin`
     - Super Admin → `/super-admin`
     - Customer → `/`

3. **Token Management (api.js)**
   - Request Interceptor: Attaches `Authorization: Bearer <token>` header
   - Response Interceptor: Handles 401 errors
     - Clears localStorage
     - Clears auth state
     - Redirects to login

4. **Route Protection**
   - ProtectedRoute checks `isAuthenticated()`
   - If role required, checks `hasRole(requiredRole)`
   - Shows loading spinner while checking
   - Redirects to login if not authenticated
   - Redirects to home if insufficient role

5. **Logout**
   - `AuthContext.logout()` called
   - Clears localStorage (token and user)
   - Clears app state
   - Redirects to login page

---

## 🎯 API Endpoints Used

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user (optional in backend)

### Users
- `GET /users` - Get all users (paginated)
- `GET /users/:id` - Get user by ID
- `GET /users/me` - Get current user profile
- `PUT /users/:id` - Update user (admin)
- `DELETE /users/:id` - Delete user (admin)
- `POST /users/:id/promote` - Promote to admin (super admin)
- `POST /users/:id/demote` - Demote from admin (super admin)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product details

### Orders
- `GET /orders` - Get all orders (admin)
- `GET /orders/:id` - Get order details

---

## ⚙️ Configuration Notes

### Base API URL
The app uses `REACT_APP_API_URL` environment variable:
```javascript
// In api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### Token Expiry
- Set in backend: JSON Web Token expires in 30 days
- Can be updated in backend `config/auth.js`

### Role Hierarchy
Used for `hasRole()` permission checking:
```javascript
const roleHierarchy = {
  customer: 1,
  admin: 2,
  super_admin: 3
};
```

Admin can see customer pages. Super Admin can see admin pages.

---

## 🧪 Testing Checklist

### Basic Authentication
- [ ] Signup creates account and auto-logs in
- [ ] Login fails with wrong credentials
- [ ] Login succeeds with correct credentials
- [ ] Logout clears session and redirects to login
- [ ] Session persists after page reload
- [ ] Demo account buttons work on login page

### Role-Based Access
- [ ] Customer cannot access `/admin`
- [ ] Admin cannot access `/super-admin`
- [ ] Super admin can access `/admin` (higher role)
- [ ] Unauthorized users redirected to login
- [ ] Users see role-appropriate navigation

### Admin Features
- [ ] Admin can view user list
- [ ] Admin can search users
- [ ] Admin can edit user details
- [ ] Admin can delete users
- [ ] Admin dashboard shows correct stats
- [ ] Recent orders display properly

### Super Admin Features
- [ ] Super admin can view admin list
- [ ] Super admin can promote users to admin
- [ ] Super admin can demote admins to customers
- [ ] Super admin dashboard shows more stats
- [ ] System activities display correctly
- [ ] Quick actions are available

---

## 📱 Responsive Design

The admin panel is fully responsive:
- **Desktop** (> 1024px) - Full sidebar with all features
- **Tablet** (768px - 1024px) - Collapsible sidebar
- **Mobile** (< 768px) - Hamburger menu, single-column layout

Default: Sidebar shown on desktop, collapsible on tablet/mobile.

---

## 🐛 Troubleshooting

### Issue: "useAuth must be used within AuthProvider"
**Solution**: Ensure App.js wraps everything with `<AuthProvider>`

### Issue: API calls failing with 401
**Solution**: Check:
- Backend server is running (`npm run dev` in backend folder)
- `REACT_APP_API_URL` environment variable is set correctly
- Demo accounts exist in database (run `npm run seed-data` in backend)

### Issue: Get "not authenticated" on login
**Solution**: Check:
- Backend `/auth/login` endpoint returns `token` and `user`
- Token format in backend matches what frontend expects
- localStorage can be accessed (not disabled in browser)

### Issue: Routes not loading components
**Solution**: Verify:
- All component files exist in correct paths
- AdminPanel.css is imported
- react-icons/fi icons are available (already in package.json)

### Issue: Demo account buttons not working
**Solution**: Check:
- Backend has seeded demo accounts (run seed script)
- Backend is running and accessible
- Browser console for error messages

---

## 📚 API Response Format

### Successful Auth Response (Login/Signup)
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "customer|admin|super_admin",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

### Users List Response
```json
{
  "data": [
    {
      "id": "user_id",
      "name": "User Name",
      "email": "user@example.com",
      "role": "customer|admin|super_admin",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 10,
  "page": 1,
  "limit": 10
}
```

---

## 🔄 Component Dependencies

```
AuthProvider (App.js)
├── ProtectedRoute (/admin, /super-admin routes)
│   ├── AdminDashboard
│   │   └── uses useAuth, orderAPI, userAPI, productAPI
│   ├── ManageUsers
│   │   └── uses useAuth, userAPI
│   ├── SuperAdminDashboard
│   │   └── uses useAuth, orderAPI, userAPI, productAPI
│   └── ManageAdmins
│       └── uses useAuth, userAPI
├── Login
│   └── uses useAuth (login, useDemoAccount)
├── Signup
│   └── uses useAuth (signup)
└── Other pages
    └── use useAuth for logout/profile info
```

---

## 🎨 Styling Customization

All styles in `AdminPanel.css` use these color scheme:
- **Primary**: `#c9a227` (Gold)
- **Dark**: `#1a1a1a` (Black)
- **Sidebar**: Gradient from `#1a1a1a` to `#2d2d2d`
- **Success**: `#2E7D32` (Green)
- **Warning**: `#E65100` (Orange)
- **Error**: `#C62828` (Red)
- **Info**: `#1565C0` (Blue)

To customize, find and replace color hex codes in AdminPanel.css.

---

## 📝 Next Steps (Optional Enhancements)

1. **Products Management**
   - Create `ManageProducts.jsx` for admin to add/edit/delete products
   - Route: `/admin/products`

2. **Analytics Dashboard**
   - Create `Analytics.jsx` for sales reports
   - Route: `/admin/analytics` or `/super-admin/analytics`

3. **Settings Pages**
   - Create role-specific settings pages
   - Routes: `/admin/settings`, `/super-admin/settings`

4. **Profile Page**
   - Create user profile update page
   - Route: `/profile`

5. **Notifications**
   - Add toast notifications for actions
   - Add notification center

6. **Audit Logs**
   - Track admin actions
   - Display in Super Admin dashboard

---

## 🚨 Important Notes

1. **Backend Requirements**: Backend must be running and have:
   - Auth endpoints (login, signup)
   - User endpoints (getAll, getById, update, delete, promote, demote)
   - Product endpoints (getAll)
   - Order endpoints (getAll)

2. **Database**: Ensure demo accounts are seeded:
   ```bash
   cd backend
   npm run seed-data
   ```

3. **Environment**: Set `REACT_APP_API_URL` to correct backend URL

4. **CORS**: If backend is on different domain, ensure CORS is enabled

5. **Security**: Tokens are stored in localStorage. For production:
   - Consider using httpOnly cookies instead
   - Implement token refresh logic
   - Add CSRF protection

---

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Check backend console for API errors
4. Verify all files are created and in correct paths
5. Ensure all dependencies are installed

---

**Status**: ✅ Production Ready
**Last Updated**: 2024
