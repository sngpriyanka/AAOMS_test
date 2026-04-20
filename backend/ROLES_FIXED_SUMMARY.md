# Role Configuration Summary - Fixed ✅

## Three-Tier Role System Implemented

### 1. 🛒 CUSTOMER (Default for new users)
**What they can do:**
- Browse and search products
- Add items to cart
- Place orders
- Track orders
- Manage profile (address, password, etc.)
- View own orders and cart

**Cannot do:**
- Manage products
- View other customers
- Access admin functions

**Default Role:** Assigned automatically on signup

---

### 2. 🧑‍💼 ADMIN (Elevated permissions)
**What they can do:**
- All CUSTOMER capabilities
- Add/Edit/Delete products
- Manage inventory/stock
- View all customers
- Handle orders (confirm, ship, cancel, status updates)
- Block/unblock customers
- View sales reports
- Manage discounts

**Cannot do:**
- Create other admin accounts
- Delete admin accounts
- View system logs
- Access super admin settings

**Promotion:** Only super admin can promote users to admin
**Route Prefix:** `/api/users/admin/`

---

### 3. 👑 SUPER ADMIN (Full system control)
**What they can do:**
- All ADMIN capabilities
- Create/Delete admin accounts
- Promote/demote admin users
- Change any user's role
- View all system activity logs
- Monitor admin actions
- Access all system settings
- Override any operation
- Block/unblock admins

**Special Privileges:**
- Highest access level
- Can perform any action in the system
- Full audit trail access
- Can override admin decisions

**Route Prefix:** `/api/users/super-admin/`
**Creation:** Manually set in database or via special script

---

## Updated Architecture

### Middleware Structure
```
middleware/
├── authMiddleware.js      (Legacy - being replaced)
└── roleMiddleware.js      (NEW - Role-Based Access Control)
    ├── protect()          - Verify JWT token
    ├── customerOnly()     - Restrict to customers
    ├── adminOnly()        - Restrict to admins/super_admins
    ├── superAdminOnly()   - Restrict to super_admins only
    └── hasRole(...roles)  - Flexible role validation
```

### Route Structure with RBAC

#### User Routes (`/api/users/`)
```
👤 CUSTOMER ROUTES:
  GET    /profile/:userId              - View own profile
  PUT    /profile/:userId              - Update profile
  POST   /change-password/:userId      - Change password

👨‍💼 ADMIN ROUTES:
  GET    /admin/users/all              - List all users
  DELETE /admin/users/:userId          - Delete user
  PUT    /admin/users/:userId/toggle-status - Block/Unblock user

👑 SUPER ADMIN ROUTES:
  POST   /super-admin/promote/:userId  - Make admin
  POST   /super-admin/demote/:userId   - Remove admin
  GET    /super-admin/all-users        - View all users
  POST   /super-admin/logs             - View activity logs
```

#### Product Routes (`/api/products/`)
```
PUBLIC:
  GET    /                    - Browse products
  GET    /id/:id              - View product details
  GET    /slug/:slug          - Get by slug

👨‍💼 ADMIN+ ONLY:
  POST   /                    - Create product
  PUT    /:id                 - Edit product
  DELETE /:id                 - Delete product
```

#### Order Routes (`/api/orders/`)
```
PUBLIC:
  GET    /track/:trackingNumber       - Track order (no auth)

👤 CUSTOMER:
  GET    /                            - My orders
  POST   /                            - Create order
  GET    /:orderId                    - Order details
  PATCH  /:orderId/cancel             - Cancel order

👨‍💼 ADMIN+ ONLY:
  GET    /admin/all                   - All orders
  PATCH  /:orderId/status             - Update status
```

---

## Implementation Details

### User Schema (MongoDB)
```javascript
{
  email: String,
  password: String,      // Hashed
  name: String,
  role: {
    type: String,
    enum: ['customer', 'admin', 'super_admin'],
    default: 'customer'
  },
  phone: String,
  address: String,
  city: String,
  state: String,
  zipcode: String,
  isActive: Boolean,     // Can be toggled by admin
  createdAt: Date
}
```

### JWT Token Payload
```javascript
{
  id: String,
  email: String,
  role: 'customer' | 'admin' | 'super_admin'
  // Token expires in 30 days
}
```

---

## Authorization Flow

```
1. User Login
   ↓
2. System checks credentials
   ↓
3. JWT token created with role
   ↓
4. Token stored on client
   ↓
5. Each request includes token in header
   ↓
6. Middleware validates token
   ↓
7. Middleware checks user role
   ↓
8. If authorized → Access granted
9. If unauthorized → 403 Forbidden
```

---

## API Request Examples

### As Customer
```bash
# Login
POST /api/auth/login
{ "email": "customer@example.com", "password": "pass123" }

# Response includes token with role: 'customer'
{
  "token": "eyJhbG...",
  "user": { "role": "customer", "id": "123" }
}

# Add to cart (with token in header)
POST /api/cart/add
Headers: Authorization: Bearer eyJhbG...
{ "productId": "456", "quantity": 1 }
✅ Success - 200 OK
```

### As Admin
```bash
# Login
POST /api/auth/login
{ "email": "admin@example.com", "password": "adminpass" }

# Response includes token with role: 'admin'
{
  "token": "eyJhbG...",
  "user": { "role": "admin", "id": "789" }
}

# Create product (with token in header)
POST /api/products
Headers: Authorization: Bearer eyJhbG...
{ "name": "New Shirt", "price": 99.99, "stock": 50 }
✅ Success - 201 Created

# Customer tries same route
POST /api/products
Headers: Authorization: Bearer customerToken...
❌ Error - 403 Forbidden "Admin access required"
```

### As Super Admin
```bash
# Promote user to admin
POST /api/users/super-admin/promote/user123
Headers: Authorization: Bearer superAdminToken...
✅ Success - User is now admin

# View all activity logs
POST /api/users/super-admin/logs
Headers: Authorization: Bearer superAdminToken...
✅ Success - Logs returned
```

---

## Security Notes

✅ Passwords hashed with bcrypt
✅ JWT tokens signed and verified
✅ Role validation on every protected route
✅ Tokens expire after 30 days
✅ Users cannot self-promote to admin
✅ Users cannot self-deactivate
✅ Admin cannot access super admin features
✅ All passwords excluded from API responses

---

## All Fixed Categories ✅

| Category | Previous Status | Current Status |
|----------|-----------------|----------------|
| 🛒 Customer | Missing permissions | ✅ Fully defined |
| 🧑‍💼 Admin | Incomplete | ✅ Complete with admin routes |
| 👑 Super Admin | Not implemented | ✅ Fully implemented |
| Middleware | Basic only | ✅ Role-based middleware |
| Routes | No role protection | ✅ All routes protected |
| Controllers | No role checks | ✅ Role validators added |
| Documentation | None | ✅ Complete RBAC docs |

---

## How to SetUp Initial Super Admin

Option 1: Direct Database Edit
```json
{
  "email": "superadmin@aaxoms.com",
  "password": "hashed_password",
  "name": "Super Admin",
  "role": "super_admin"
}
```

Option 2: Use existing API
1. Create customer account first
2. Have current super admin promote them

Option 3: Use seed script (if created)
```bash
npm run seed:admin
```

---

## Files Modified/Created

### ✅ New Files
- `middleware/roleMiddleware.js` - Complete RBAC middleware
- `RBAC_SYSTEM.md` - Full documentation

### ✅ Updated Files
- `routes/userRoutes.js` - Role-based routes added
- `routes/productRoutes.js` - Admin protection added
- `routes/orderRoutes.js` - Role-based routes added
- `routes/cartRoutes.js` - Role protection added
- `routes/authRoutes.js` - Role protection added
- `controllers/userController.js` - Added admin functions:
  - `toggleUserStatus()` - Admin toggle active/inactive
  - `getActivityLogs()` - Super admin logs

---

## Status:  ALL ROLES FIXED ✅

The role-based access control system is now:
- ✅ Properly defined
- ✅ Fully implemented
- ✅ Protected with middleware
- ✅ Extended to all routes
- ✅ Documented completely
- ✅ Ready for production use
