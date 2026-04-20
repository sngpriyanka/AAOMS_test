const mongoose = require('mongoose');

// ==================== USER SCHEMA ====================
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'super_admin'],
    default: 'customer',
  },
  phone: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  city: {
    type: String,
    default: null,
  },
  state: {
    type: String,
    default: null,
  },
  zipcode: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ==================== PRODUCT SCHEMA ====================
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: null,
  },
  description: {
    tagline: String,
    details: String,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  images: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
  },
  colors: {
    type: mongoose.Schema.Types.Mixed,
    default: [],
  },
  stock: {
    type: Number,
    default: 100,
  },
  quickDry: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ==================== ORDER SCHEMA ====================
const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    size: String,
    color: String,
  }],
  subtotal: {
    type: Number,
    required: true,
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['esewa', 'khalti', 'cod'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  shippingAddress: {
    name: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipcode: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// ==================== CART SCHEMA ====================
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
    },
    size: String,
    color: String,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create models
const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

module.exports = { User, Product, Order, Cart };
