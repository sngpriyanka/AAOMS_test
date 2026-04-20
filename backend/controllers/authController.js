const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Database = require('../models/Database');
const { validateEmail, validatePassword } = require('../utils/validators');

const USERS_COLLECTION = 'users';

exports.signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if user exists
    const existingUser = Database.findBy(USERS_COLLECTION, 'email', email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = Database.create(USERS_COLLECTION, {
      email,
      password: hashedPassword,
      name,
      role: 'customer',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipcode: '',
      createdAt: new Date().toISOString()
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in signup',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = Database.findBy(USERS_COLLECTION, 'email', email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
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

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Google token is required'
      });
    }

    // Decode Google JWT token (without verification as a fallback)
    // In production, you should verify the token with Google's public key
    const decoded = decodeGoogleToken(token);
    
    if (!decoded || !decoded.email) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    const googleEmail = decoded.email;
    const googleName = decoded.name || 'User';
    const googlePicture = decoded.picture || '';

    // Check if user exists
    let user = Database.findBy(USERS_COLLECTION, 'email', googleEmail);

    if (!user) {
      // Create new user from Google data
      user = Database.create(USERS_COLLECTION, {
        email: googleEmail,
        password: '', // No password for Google auth users
        name: googleName,
        profilePicture: googlePicture,
        role: 'customer',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipcode: '',
        googleAuth: true,
        createdAt: new Date().toISOString()
      });
    } else {
      // Update user profile picture if available
      if (googlePicture && !user.profilePicture) {
        Database.update(USERS_COLLECTION, user.id, { profilePicture: googlePicture });
      }
    }

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      message: 'Google authentication successful',
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error in Google authentication',
      error: error.message
    });
  }
};

/**
 * Helper function to decode Google JWT token
 * Note: This is a simple decode without verification
 * In production, use google-auth-library for proper verification
 */
function decodeGoogleToken(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString('utf8')
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding Google token:', error);
    return null;
  }
}

exports.logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful'
  });
};

exports.getCurrentUser = (req, res) => {
  try {
    const userId = req.user.id;
    const user = Database.read(USERS_COLLECTION, userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        state: user.state,
        zipcode: user.zipcode
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};
