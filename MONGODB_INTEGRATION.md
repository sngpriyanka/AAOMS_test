# MongoDB Integration Guide for Backend

## Overview

This guide explains how to update your backend server to use MongoDB instead of JSON files.

---

## Step 1: Install Dependencies

Run this command in the `backend` directory:

```bash
npm install mongoose
```

This installs Mongoose, which provides schema validation and ORM functionality for MongoDB.

---

## Step 2: Update server.js

Update your `backend/server.js` to initialize MongoDB connection:

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// MongoDB Connection
const { connectDB } = require('./models/mongodb');
const { User, Product, Order, Cart } = require('./models/schemas');
const Database = require('./models/DatabaseAdapter');

const app = express();

// ==================== INITIALIZATION ====================

// Setup CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://aaoms-test.onrender.com',
  credentials: true
}));

app.use(express.json());

// Initialize MongoDB if enabled
(async () => {
  try {
    // Connect to MongoDB (if DATABASE_TYPE=mongodb)
    await connectDB();
    
    // If using MongoDB, register models with Database adapter
    if (process.env.DATABASE_TYPE === 'mongodb') {
      Database.useMongoModels({ User, Product, Order, Cart });
      console.log('🎯 Using MongoDB with Mongoose');
    } else {
      console.log('💾 Using JSON file-based database');
    }
  } catch (error) {
    console.error('Initialization error:', error);
  }
})();

// ==================== ROUTES ====================

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## Step 3: Update Controllers

Your controllers remain mostly the same! The key difference is handling async/await with MongoDB:

### Example: Before (JSON) vs After (MongoDB)

### authController.js

```javascript
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Database = require('../models/Database');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // If using MongoDB, this returns a Promise
    // If using JSON, it returns directly
    const user = await Database.findBy('users', 'email', email);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id || user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id || user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in login',
      error: error.message
    });
  }
};
```

### Key Differences:

| Aspect | JSON | MongoDB |
|--------|------|---------|
| Query Return | Direct value | Promise (use await) |
| ID Field | `item.id` | `item._id` or `item.id` |
| Unique Values | Manual check | Automatic (schema validation) |
| Data Validation | Manual | Schema enforced |

---

## Step 4: Update Routes (No Changes Needed!)

Your routes can stay the same! Just handle the Promises:

```javascript
// Before
router.post('/products', (req, res) => {
  const product = Database.create('products', req.body);
  res.json(product);
});

// After (MongoDB compatible)
router.post('/products', async (req, res) => {
  const product = await Database.create('products', req.body);
  res.json(product);
});
```

---

## Step 5: Update .env File

Change `DATABASE_TYPE` and add `MONGODB_URI`:

```env
# database choice
DATABASE_TYPE=mongodb

# MongoDB connection string from Atlas
MONGODB_URI=mongodb+srv://bombay_trooper:your_password@cluster0.xxxxx.mongodb.net/bombay_trooper?retryWrites=true&w=majority
```

---

## Step 6: Install Mongoose Package

```bash
npm install mongoose
```

---

## Step 7: Migrate Existing Data (Optional)

If you have existing JSON data:

```bash
node scripts/migrateToMongoDB.js
```

This will:
1. Backup your JSON files
2. Connect to MongoDB
3. Migrate all data
4. Verify the migration

---

## Step 8: Run Your Backend

```bash
npm start
```

You should see:
- ✅ MongoDB connection success message
- 📊 Database name confirmation
- Server running on port 5000

---

## What Changed in the Codebase

### Added Files:
- `models/mongodb.js` - MongoDB connection setup
- `models/schemas.js` - Mongoose schemas for collections
- `models/DatabaseAdapter.js` - Unified database interface
- `scripts/migrateToMongoDB.js` - Migration script

### Updated Files:
- `.env` - Added `MONGODB_URI`
- `.env.sample` - Added MongoDB instructions
- `server.js` - Initialize MongoDB connection

### Your Existing Code:
- ✅ Controllers work with async/await
- ✅ Routes stay the same
- ✅ Middleware unchanged
- ✅ API endpoints unchanged

---

## Handling Promises (Important!)

With MongoDB, many operations return Promises. Ensure you use `async/await`:

```javascript
// ❌ Wrong
const user = Database.findBy('users', 'email', email);

// ✅ Correct
const user = await Database.findBy('users', 'email', email);
```

---

## Switching Between JSON and MongoDB

If you need to switch between JSON and MongoDB:

### Use JSON (Development):
```env
DATABASE_TYPE=json
```

### Use MongoDB (Production):
```env
DATABASE_TYPE=mongodb
MONGODB_URI=your_connection_string
```

The Database adapter automatically detects and routes to the correct backend!

---

## Comparison

| Feature | JSON | MongoDB |
|---------|------|---------|
| Setup Time | Instant | 5 minutes |
| Scalability | Limited | Unlimited |
| Performance | Good for small data | Better for large data |
| Backups | Manual | Automatic (Atlas) |
| Queries | Simple filtering | Advanced queries |
| Cost | Free | Free tier available |
| Production Ready | No | Yes |

---

## Troubleshooting

### "Connection Refused"
- Check MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas

### "Duplicate Key Error"
- E11000 means unique constraint violated
- Check email/phone fields

### "Promise Pending"
- You forgot `await` somewhere
- Add `await` to Database method calls

### "Models not initialized"
- Ensure `Database.useMongoModels()` called in server.js
- Check DATABASE_TYPE is 'mongodb'

---

## Support

For detailed MongoDB setup, see: `MONGODB_SETUP.md`
For environment configuration, see: `ENV_SETUP_GUIDE.md`

---

## Summary

✅ Install mongoose
✅ Update server.js with MongoDB connection
✅ Update .env with MONGODB_URI
✅ Run npm start
✅ Done! Your API now uses MongoDB

Your API endpoints and frontend remain unchanged - everything works transparently!
