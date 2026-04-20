import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (email, password, name) =>
    api.post('/auth/signup', { email, password, name }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () =>
    api.get('/auth/me'),
  logout: () =>
    api.post('/auth/logout'),
};

// Product API
export const productAPI = {
  getAll: (filters = {}) =>
    api.get('/products', { params: filters }),
  getById: (id) =>
    api.get(`/products/id/${id}`),
  getBySlug: (slug) =>
    api.get(`/products/slug/${slug}`),
  getCustomizationOptions: (category) =>
    api.get('/products/customization/options', { params: { category } }),
  create: (data) =>
    api.post('/products', data),
  update: (id, data) =>
    api.put(`/products/${id}`, data),
  delete: (id) =>
    api.delete(`/products/${id}`),
};

// Cart API
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
    api.delete('/cart'),
};

// Order API
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
  getAllOrders: (filters = {}) =>
    api.get('/orders/admin/all', { params: filters }),
  updateStatus: (orderId, status) =>
    api.patch(`/orders/${orderId}/status`, { status }),
};

// User API
export const userAPI = {
  getProfile: (userId) =>
    api.get(`/users/${userId}`),
  updateProfile: (userId, data) =>
    api.put(`/users/${userId}`, data),
  changePassword: (userId, data) =>
    api.post(`/users/${userId}/change-password`, data),
  getAll: (filters = {}) =>
    api.get('/users', { params: filters }),
  deleteUser: (userId) =>
    api.delete(`/users/${userId}`),
  promoteToAdmin: (userId) =>
    api.post(`/users/${userId}/promote`),
  demoteAdmin: (userId) =>
    api.post(`/users/${userId}/demote`),
};

export default api;
