const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();

// ==================== MongoDB Connection ====================
let dbConnected = false;

const connectMongoDB = async () => {
  try {
    if (process.env.DATABASE_TYPE !== 'mongodb') {
      console.log('📁 Using JSON file-based database\n');
      dbConnected = 'json';
      return;
    }

    if (!process.env.MONGODB_URI) {
      console.log('⚠️  MONGODB_URI not set in .env file');
      console.log('📁 Falling back to JSON database\n');
      dbConnected = 'json';
      return;
    }

    console.log('🔗 Connecting to MongoDB Atlas...');
    console.log('   Cluster: cluster0.aefcbft.mongodb.net');
    console.log('   User: AAXOMS-mantra');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 15000,
      retryWrites: true,
      retryReads: true
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('📊 Database: ' + mongoose.connection.name);
    console.log('🔐 Host: ' + mongoose.connection.host + '\n');
    dbConnected = 'mongodb';

  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('   Code: ' + error.code);
    console.error('   Message: ' + error.message);
    
    // Provide specific guidance based on error
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n⚠️  ECONNREFUSED - Your IP may not be whitelisted!');
      console.error('   Fix: Go to MongoDB Atlas → Network Access → Add Your IP');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n⚠️  Authentication failed - Check username/password');
    } else if (error.message.includes('Timeout')) {
      console.error('\n⚠️  Connection timeout - Cluster may not be ready');
      console.error('   Wait 5-10 minutes for cluster to initialize');
    }
    
    console.log('\n📁 Falling back to JSON database\n');
    dbConnected = 'json';
  }
};

// Connect to MongoDB on startup
connectMongoDB();

// Middleware
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? [
      'https://incomparable-pasca-899ef8.netlify.app',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : [
      'http://localhost:3000',
      'http://localhost:5000',
      'https://incomparable-pasca-899ef8.netlify.app',
      process.env.FRONTEND_URL
    ].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== Health & Status Routes ====================
// Check overall health
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Bombay Trooper Backend is Running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: dbConnected
  });
});

// Check database connection status
app.get('/api/database-status', (req, res) => {
  if (dbConnected === 'mongodb') {
    res.json({
      status: 'connected',
      database: 'MongoDB Atlas',
      host: mongoose.connection.host,
      database_name: mongoose.connection.name,
      connection_state: mongoose.connection.readyState,
      message: '✅ Connected to MongoDB',
      timestamp: new Date().toISOString()
    });
  } else {
    res.json({
      status: 'connected',
      database: 'JSON File-Based',
      path: process.env.DATABASE_PATH || './data',
      message: '📁 Using JSON file-based database',
      timestamp: new Date().toISOString()
    });
  }
});

// Import Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authRoutes = require('./routes/authRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const addressRoutes = require('./routes/addressRoutes');

// Use Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/addresses', addressRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  Bombay Trooper Backend Server         ║`);
  console.log(`║  Running on: http://localhost:${PORT}      ║`);
  console.log(`║  Environment: ${process.env.NODE_ENV}                ║`);
  console.log(`║  Database: ${dbConnected === 'mongodb' ? 'MongoDB Atlas' : 'JSON Files'}          ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
  
  console.log('🔍 Check Database Status:');
  console.log('  • GET http://localhost:' + PORT + '/api/database-status\n');
  
  console.log('📋 Available API Endpoints:');
  console.log('  • GET  /api/health');
  console.log('  • GET  /api/database-status');
  console.log('  • GET  /api/products');
  console.log('  • GET  /api/products/:id');
  console.log('  • POST /api/auth/login');
  console.log('  • POST /api/auth/signup');
  console.log('  • POST /api/cart/add');
  console.log('  • GET  /api/orders\n');
});

module.exports = app;
