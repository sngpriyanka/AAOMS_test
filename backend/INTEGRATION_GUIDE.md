# 🔗 Frontend to Backend Integration Guide

This guide explains how to connect your React frontend to the Node.js backend server.

---

## 🚀 Quick Start

### Step 1: Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

The server will run on: `http://localhost:5000`

### Step 2: Configure Frontend Base URL

Create or update `.env.local` in your frontend folder:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Use API in Frontend

Import and use the API service in your React components.

---

## 📝 API Service Setup

Create a file: `src/services/api.js`

```javascript
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  signup: (email, password, name) => 
    api.post('/auth/signup', { email, password, name }),
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => 
    api.get('/auth/me'),
  logout: () => 
    api.post('/auth/logout')
};

export const productAPI = {
  getAll: (filters) => 
    api.get('/products', { params: filters }),
  getById: (id) => 
    api.get(`/products/id/${id}`),
  getBySlug: (slug) => 
    api.get(`/products/slug/${slug}`),
  getCustomizationOptions: (category) => 
    api.get('/products/customization/options', { params: { category } })
};

export const cartAPI = {
  getCart: () => 
    api.get('/cart'),
  addItem: (item) => 
    api.post('/cart/add', item),
  updateItem: (itemId, quantity) => 
    api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => 
    api.delete(`/cart/${itemId}`),
  clearCart: () => 
    api.delete('/cart')
};

export const orderAPI = {
  getOrders: () => 
    api.get('/orders'),
  getOrder: (orderId) => 
    api.get(`/orders/${orderId}`),
  createOrder: (orderData) => 
    api.post('/orders', orderData),
  trackOrder: (trackingNumber) => 
    api.get(`/orders/track/${trackingNumber}`),
  cancelOrder: (orderId) => 
    api.patch(`/orders/${orderId}/cancel`),
  getAllOrders: (filters) => 
    api.get('/orders/admin/all', { params: filters }),
  updateStatus: (orderId, status) => 
    api.patch(`/orders/${orderId}/status`, { status })
};

export const userAPI = {
  getProfile: (userId) => 
    api.get(`/users/${userId}`),
  updateProfile: (userId, data) => 
    api.put(`/users/${userId}`, data),
  changePassword: (userId, passwordData) => 
    api.post(`/users/${userId}/change-password`, passwordData),
  getAll: (filters) => 
    api.get('/users', { params: filters }),
  deleteUser: (userId) => 
    api.delete(`/users/${userId}`),
  promoteToAdmin: (userId) => 
    api.post(`/users/${userId}/promote`),
  demoteAdmin: (userId) => 
    api.post(`/users/${userId}/demote`)
};

export default api;
```

### Install Axios (if not already installed):
```bash
npm install axios
```

---

## 🔐 Authentication Flow

### Login Example:

```javascript
import { authAPI } from './services/api';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      // Store token and user info
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Redirect to dashboard
      window.location.href = '/';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## 📦 Fetching Products

```javascript
import { productAPI } from './services/api';
import { useEffect, useState } from 'react';

export function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll({
          category: 't-shirts',
          minPrice: 500,
          maxPrice: 2000,
          page: 1,
          limit: 10
        });
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h3>{product.name}</h3>
          <p>Rs. {product.price}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🛒 Shopping Cart

```javascript
import { cartAPI } from './services/api';
import { useState } from 'react';

export function AddToCartButton({ productId, quantity, price, customization }) {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);

    try {
      await cartAPI.addItem({
        productId,
        quantity,
        price,
        customization,
        size: 'M',
        color: 'Red'
      });
      alert('Added to cart!');
    } catch (error) {
      alert('Error adding to cart: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleAddToCart} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

---

## 📋 Creating Orders

```javascript
import { orderAPI, cartAPI } from './services/api';
import { useState } from 'react';

export function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      // Create order
      const response = await orderAPI.createOrder({
        shippingAddress,
        paymentMethod: 'card',
        notes: 'Please deliver ASAP'
      });

      const { trackingNumber } = response.data.data;
      alert(`Order placed! Tracking: ${trackingNumber}`);
      
      // Clear cart
      await cartAPI.clearCart();
      
      // Redirect to orders page
      window.location.href = '/orders';
    } catch (error) {
      alert('Error creating order: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <textarea
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
        placeholder="Enter shipping address"
        required
      />
      <button onClick={handleCheckout} disabled={loading}>
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </div>
  );
}
```

---

## 👤 User Profile Management

```javascript
import { userAPI } from './services/api';
import { useState, useEffect } from 'react';

export function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getProfile(userId);
        setUser(response.data.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await userAPI.updateProfile(userId, {
        name: user.name,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode
      });

      setUser(response.data.data);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <form onSubmit={handleUpdateProfile}>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        placeholder="Name"
      />
      <input
        type="tel"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
        placeholder="Phone"
      />
      <input
        type="text"
        value={user.address}
        onChange={(e) => setUser({ ...user, address: e.target.value })}
        placeholder="Address"
      />
      <button type="submit">Update Profile</button>
    </form>
  );
}
```

---

## 📊 Admin Dashboard Integration

```javascript
import { orderAPI, userAPI } from './services/api';
import { useEffect, useState } from 'react';

export function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all orders
        const ordersRes = await orderAPI.getAllOrders({ limit: 10 });
        setOrders(ordersRes.data.data);

        // Fetch all users
        const usersRes = await userAPI.getAll({ limit: 10 });
        setUsers(usersRes.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>Recent Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>Rs. {order.total}</td>
              <td>{order.status}</td>
              <td>
                <button onClick={() => handleUpdateStatus(order.id, 'shipped')}>
                  Mark Shipped
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  async function handleUpdateStatus(orderId, status) {
    try {
      await orderAPI.updateStatus(orderId, status);
      alert('Order status updated!');
      // Refresh orders
      window.location.reload();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  }
}
```

---

## 🔄 Using Context API for Authentication

```javascript
// AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from './services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { token, user } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## 🧪 Error Handling

```javascript
import axios from 'axios';

// Create a centralized error handler
export function handleAPIError(error) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) {
      // Unauthorized - clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return 'Your session has expired. Please login again.';
    }

    if (error.response?.status === 403) {
      return 'You are not authorized to perform this action.';
    }

    if (error.response?.status === 404) {
      return 'Resource not found.';
    }

    return error.response?.data?.message || error.message;
  }

  return 'An unexpected error occurred.';
}

// Usage in component
try {
  await api.post('/products', productData);
} catch (error) {
  const message = handleAPIError(error);
  console.error(message);
}
```

---

## ✅ Checklist

- [ ] Backend server installed and running
- [ ] Frontend `.env.local` configured
- [ ] API service created (`src/services/api.js`)
- [ ] Axios installed
- [ ] Authentication flow implemented
- [ ] Product fetching working
- [ ] Cart functionality working
- [ ] Order creation working
- [ ] User profile management working
- [ ] Error handling implemented
- [ ] Token refresh logic (if needed)
- [ ] CORS issues resolved

---

## 🚀 Common Issues & Solutions

### CORS Error
**Solution:** Ensure backend is running and `FRONTEND_URL` in backend `.env` matches your frontend URL.

### 401 Unauthorized
**Solution:** Check token is being sent in Authorization header. Verify token is stored correctly.

### Undefined API_URL
**Solution:** Create `.env.local` in frontend with `REACT_APP_API_URL=http://localhost:5000/api`

### Network Error
**Solution:** Verify backend is running on port 5000. Check if firewall is blocking connection.

---

## 📞 Support

For integration issues:
1. Check console for error messages
2. Verify backend is running (`http://localhost:5000/api/health`)
3. Check network tab in browser DevTools
4. Review API documentation
5. Check error response format

---

**Integration Complete! 🎉**

Your frontend and backend are now connected and ready to work together!
