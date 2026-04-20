# Role-Based Access Control (RBAC) System - AAXOMS

## Overview
The AAXOMS e-commerce platform implements a comprehensive Role-Based Access Control (RBAC) system with three distinct roles, each with specific permissions and capabilities.

---

## 🛒 Role 1: CUSTOMER (User)

### Definition
End-users who browse, purchase products, and manage their orders.

### Permissions:

#### Authentication
- ✅ Sign up
- ✅ Login
- ✅ View own profile
- ✅ Change password
- ✅ Logout

#### Shopping
- ✅ View all products (public)
- ✅ Search products
- ✅ Filter by category
- ✅ View product details
- ✅ View customization options

#### Cart Management
- ✅ Add items to cart
- ✅ View own cart
- ✅ Update cart item quantities
- ✅ Remove items from cart
- ✅ Clear cart

#### Orders
- ✅ Create orders
- ✅ View own orders
- ✅ View order details
- ✅ Cancel orders
- ✅ Track orders (public tracking)

#### Profile Management
- ✅ Update profile (name, phone, address, city, state, zipcode)
- ✅ Change password
- ✅ View own profile

#### Reviews & Ratings (if implemented)
- ✅ Submit product reviews
- ✅ View reviews

### Access Denied:
- ❌ Manage products
- ❌ View all users
- ❌ Manage orders (admin operations)
- ❌ Create admin accounts
- ❌ View system logs
- ❌ Delete users

---

## 🧑‍💼 Role 2: ADMIN

### Definition
Admins manage daily store operations, including products, orders, customers, and inventory.

### Permissions (Includes all CUSTOMER permissions + Additional):

#### Product Management
- ✅ Create products (name, price, images, stock, categories)
- ✅ Edit products
- ✅ Delete products
- ✅ Manage categories
- ✅ Update inventory/stock levels

#### Order Management
- ✅ View all orders
- ✅ Update order status (pending → confirmed → shipped → delivered)
- ✅ Cancel orders
- ✅ Track orders
- ✅ Generate order reports

#### Customer Management
- ✅ View all users/customers
- ✅ Filter users by role
- ✅ Search customers by name/email
- ✅ View customer details
- ✅ Delete customer accounts
- ✅ Toggle customer active/inactive status

#### Discount & Offers (if implemented)
- ✅ Create discounts/coupons
- ✅ Edit discounts
- ✅ View discount usage

#### Reports & Analytics (if implemented)
- ✅ View sales reports
- ✅ View revenue reports
- ✅ View inventory reports

### Access Denied:
- ❌ Create other admin accounts (only super admin)
- ❌ Promote/demote users to admin
- ❌ View system logs
- ❌ Modify system settings
- ❌ Delete admin accounts

---

## 👑 Role 3: SUPER ADMIN

### Definition
Super Admin has full system control and can manage all aspects of the platform, including admin accounts and system settings.

### Permissions (Includes all CUSTOMER + ADMIN permissions + Additional):

#### Admin Account Management
- ✅ Create admin accounts
- ✅ Delete admin accounts
- ✅ View all admins
- ✅ Promote customers to admin
- ✅ Demote admins to customer
- ✅ Assign/revoke admin permissions

#### User Access Control
- ✅ View all users (customers, admins, super admins)
- ✅ Edit user accounts
- ✅ Delete user accounts
- ✅ Activate/deactivate users
- ✅ Override user actions
- ✅ Manage user roles and permissions

#### System Monitoring
- ✅ View system activity logs
- ✅ Filter logs by date range, action type
- ✅ Monitor admin activities
- ✅ View security logs

#### System Settings (if implemented)
- ✅ Configure payment gateway settings
- ✅ Manage API keys
- ✅ Update system configuration
- ✅ Manage email templates

#### Full Data Access
- ✅ Export/backup all data
- ✅ Access all reports
- ✅ View all transactions
- ✅ Override any operation

### Special Privileges:
- ✅ Can perform any action a customer or admin can perform
- ✅ Highest level of access and control
- ✅ Can override admin decisions
- ✅ Full audit trail access

---

## API Route Structure

### Authentication Routes (`/api/auth`)
```
POST   /auth/signup              - Public (all users)
POST   /auth/login               - Public (all users)
GET    /auth/me                  - Protected (all authenticated users)
POST   /auth/logout              - Protected (all authenticated users)
```

### User Routes (`/api/users`)
```
-- CUSTOMER Routes --
GET    /users/profile/:userId       - View own profile
PUT    /users/profile/:userId       - Update own profile
POST   /users/change-password/:userId - Change password

-- ADMIN Routes --
GET    /users/admin/users/all       - View all users
DELETE /users/admin/users/:userId   - Delete user
PUT    /users/admin/users/:userId/toggle-status - Toggle user status

-- SUPER ADMIN Routes --
POST   /users/super-admin/promote/:userId           - Promote to admin
POST   /users/super-admin/demote/:userId            - Demote to customer
GET    /users/super-admin/all-users                 - View all users
POST   /users/super-admin/logs                      - View activity logs
```

### Product Routes (`/api/products`)
```
-- PUBLIC Routes --
GET    /products                          - Get all products
GET    /products/id/:id                   - Get product by ID
GET    /products/slug/:slug               - Get product by slug
GET    /products/customization/options    - Get customization options

-- ADMIN & SUPER ADMIN Routes --
POST   /products                          - Create product
PUT    /products/:id                      - Update product
DELETE /products/:id                      - Delete product
```

### Cart Routes (`/api/cart`)
```
-- CUSTOMER Routes (Authenticated) --
GET    /cart                  - Get own cart
POST   /cart/add              - Add item to cart
PUT    /cart/:itemId          - Update cart item
DELETE /cart/:itemId          - Remove item from cart
DELETE /cart                  - Clear cart
```

### Order Routes (`/api/orders`)
```
-- PUBLIC Routes --
GET    /orders/track/:trackingNumber     - Track order (no auth required)

-- CUSTOMER Routes --
GET    /orders                           - Get own orders
POST   /orders                           - Create order
GET    /orders/:orderId                  - Get order details
PATCH  /orders/:orderId/cancel           - Cancel order

-- ADMIN & SUPER ADMIN Routes --
GET    /orders/admin/all                 - Get all orders
PATCH  /orders/:orderId/status           - Update order status
```

---

## Middleware Implementation

### File: `middleware/roleMiddleware.js`

The RBAC system uses middleware functions to enforce access control:

#### `protect` - Authentication middleware
- Verifies JWT token
- Validates user session
- Required for all protected routes

#### `customerOnly` - Customer-only access
- Restricts access to customers only
- Denies admin and super_admin access

#### `adminOnly` - Admin access control
- Allows admins and super_admins
- Denies customers

#### `superAdminOnly` - Super admin-only access
- Allows only super_admins
- Denies customers and admins

#### `hasRole(...roles)` - Flexible role checking
- Allows multiple specific roles
- Example: `hasRole('admin', 'super_admin')`

---

## Middleware Usage Examples

### Protecting a route for admins only:
```javascript
router.post('/products', protect, adminOnly, productController.createProduct);
```

### Protecting a route for super admins only:
```javascript
router.post('/promote/:userId', protect, superAdminOnly, userController.promoteToAdmin);
```

### Protecting a route for specific roles:
```javascript
router.get('/dashboard', protect, hasRole('admin', 'super_admin'), dashboardController.getStats);
```

---

## Security Considerations

1. **JWT Token** - Each authenticated request requires a valid JWT token
2. **Role Verification** - Every protected route verifies the user's role
3. **Authorization Checks** - Backend validates permissions before executing actions
4. **Password Security** - Passwords are hashed using bcrypt
5. **Error Responses** - Clear error messages for unauthorized access attempts
6. **Database Isolation** - Users can only access their own data (except admins)
7. **Activity Logging** - Super admin can monitor all activities

---

## Default Behavior

- **New Users**: Automatically assigned `customer` role
- **Self-Operations**: Users can manage their own profile
- **Admin Operations**: Require explicit role check
- **Super Admin Operations**: Can override any action

---

## Implementation Checklist

✅ Role schema defined (customer, admin, super_admin)
✅ JWT tokens include user role
✅ Authentication middleware created
✅ Role-based middleware created
✅ All routes protected and role-validated
✅ Admin routes require admin access
✅ Super admin routes require super admin access
✅ Error handling for unauthorized access
✅ User can promote to admin (super admin only)
✅ User can demote from admin (super admin only)
✅ User status toggle capability (admin only)
✅ Activity logs accessible (super admin only)

---

## Testing the RBAC System

### Test Case 1: Customer accessing admin route
```
Expected: 403 Forbidden - "Admin access required"
```

### Test Case 2: Admin accessing super admin route
```
Expected: 403 Forbidden - "Super Admin access required"
```

### Test Case 3: Super admin accessing customer route
```
Expected: 200 OK - Access allowed
```

### Test Case 4: Unauthenticated user accessing protected route
```
Expected: 401 Unauthorized - "No token provided"
```

---

## Future Enhancements

- [ ] Permission-based access (granular control)
- [ ] Role templates/presets
- [ ] Activity audit logs integration
- [ ] Two-factor authentication (2FA)
- [ ] IP whitelisting for admins
- [ ] Session management/logout all devices
- [ ] Role-specific data encryption
