const Database = require('../models/Database');
const bcrypt = require('bcryptjs');

const USERS_COLLECTION = 'users';

// Get all users (admin only)
exports.getAllUsers = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all users'
      });
    }

    const { search, role, page = 1, limit = 10 } = req.query;
    let users = Database.readAll(USERS_COLLECTION);

    // Filter by role
    if (role) {
      users = users.filter(u => u.role === role);
    }

    // Search by name or email
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }

    // Remove passwords from response
    users = users.map(({ password, ...user }) => user);

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;
    const paginatedUsers = users.slice(skip, skip + limitNum);

    res.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        total: users.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(users.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get user by ID
exports.getUserById = (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user'
      });
    }

    const user = Database.read(USERS_COLLECTION, userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Update user profile
exports.updateUserProfile = (req, res) => {
  try {
    const { userId } = req.params;
    const { name, phone, address, city, state, zipcode } = req.body;

    // Check authorization
    if (userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }

    const updates = {};
    if (name) updates.name = name;
    if (phone) updates.phone = phone;
    if (address) updates.address = address;
    if (city) updates.city = city;
    if (state) updates.state = state;
    if (zipcode) updates.zipcode = zipcode;

    const updated = Database.update(USERS_COLLECTION, userId, updates);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { password, ...userWithoutPassword } = updated;
    res.json({
      success: true,
      message: 'User profile updated successfully',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Check authorization
    if (userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to change this user password'
      });
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = Database.read(USERS_COLLECTION, userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const passwordMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    Database.update(USERS_COLLECTION, userId, { password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
};

// Delete user (admin only)
exports.deleteUser = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete users'
      });
    }

    const { userId } = req.params;

    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    Database.delete(USERS_COLLECTION, userId);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Promote user to admin (super admin only)
exports.promoteToAdmin = (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can promote users'
      });
    }

    const { userId } = req.params;
    const user = Database.read(USERS_COLLECTION, userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updated = Database.update(USERS_COLLECTION, userId, { role: 'admin' });

    const { password, ...userWithoutPassword } = updated;
    res.json({
      success: true,
      message: 'User promoted to admin',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error promoting user',
      error: error.message
    });
  }
};

// Demote admin to user (super admin only)
exports.demoteAdmin = (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can demote admins'
      });
    }

    const { userId } = req.params;
    const user = Database.read(USERS_COLLECTION, userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-demotion
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot demote yourself'
      });
    }

    const updated = Database.update(USERS_COLLECTION, userId, { role: 'customer' });

    const { password, ...userWithoutPassword } = updated;
    res.json({
      success: true,
      message: 'User demoted to customer',
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error demoting admin',
      error: error.message
    });
  }
};

// Toggle user active status (admin only)
exports.toggleUserStatus = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can toggle user status'
      });
    }

    const { userId } = req.params;
    const user = Database.read(USERS_COLLECTION, userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent self-deactivation
    if (userId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot deactivate your own account'
      });
    }

    const newStatus = !user.isActive;
    const updated = Database.update(USERS_COLLECTION, userId, { isActive: newStatus });

    const { password, ...userWithoutPassword } = updated;
    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
      data: userWithoutPassword
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
};

// Get activity logs (super admin only)
exports.getActivityLogs = (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super admins can view activity logs'
      });
    }

    const { startDate, endDate, action, page = 1, limit = 50 } = req.query;
    const LOGS_COLLECTION = 'activity_logs';
    
    let logs = Database.readAll(LOGS_COLLECTION) || [];

    // Filter by date range
    if (startDate || endDate) {
      logs = logs.filter(log => {
        const logDate = new Date(log.timestamp);
        if (startDate && logDate < new Date(startDate)) return false;
        if (endDate && logDate > new Date(endDate)) return false;
        return true;
      });
    }

    // Filter by action
    if (action) {
      logs = logs.filter(log => log.action.includes(action));
    }

    // Sort by timestamp descending
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;
    const paginatedLogs = logs.slice(skip, skip + limitNum);

    res.json({
      success: true,
      data: paginatedLogs,
      pagination: {
        total: logs.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(logs.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs',
      error: error.message
    });
  }
};
