const mongoose = require('mongoose');

// MongoDB Connection Configuration
const connectDB = async () => {
  try {
    // Check if MongoDB is enabled
    if (process.env.DATABASE_TYPE !== 'mongodb') {
      console.log('📁 Using JSON file-based database');
      return null;
    }

    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error('❌ MONGODB_URI not set in .env file');
      console.error('Please set MONGODB_URI in your .env file');
      console.error('See MONGODB_SETUP.md for instructions');
      // Fall back to JSON
      process.env.DATABASE_TYPE = 'json';
      return null;
    }

    // Connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    };

    // Connect to MongoDB
    await mongoose.connect(uri, options);
    
    console.log('✅ Connected to MongoDB Atlas Successfully!');
    console.log(`📊 Database: ${mongoose.connection.db.name}`);
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB connection disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });

    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB Connection Failed!');
    console.error('Error:', error.message);
    console.log('\n📝 Troubleshooting:');
    console.log('1. Check your MONGODB_URI in .env file');
    console.log('2. Verify password has no special characters (or escape them)');
    console.log('3. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('4. Check internet connection');
    console.log('\n💾 Falling back to JSON file-based database...\n');
    
    // Fall back to JSON database
    process.env.DATABASE_TYPE = 'json';
    return null;
  }
};

// Close MongoDB connection
const closeDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('✅ MongoDB connection closed');
    }
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
  }
};

module.exports = { connectDB, closeDB, mongoose };
