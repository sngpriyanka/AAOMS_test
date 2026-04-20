const Database = require('../models/Database');

// Get user addresses
exports.getUserAddresses = (req, res) => {
  try {
    const userId = req.user.id;
    const allAddresses = Database.readData('addresses');
    const userAddresses = allAddresses.filter(addr => addr.userId === userId);

    res.json({
      success: true,
      data: userAddresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching addresses'
    });
  }
};

// Add address
exports.addAddress = (req, res) => {
  try {
    const userId = req.user.id;
    const { name, address, city, state, pincode, phone, isDefault } = req.body;

    if (!name || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const allAddresses = Database.readData('addresses');

    if (isDefault) {
      allAddresses.forEach(addr => {
        if (addr.userId === userId) addr.isDefault = false;
      });
    }

    const newAddress = Database.create('addresses', {
      userId,
      name,
      address,
      city,
      state,
      pincode,
      phone: phone || '',
      isDefault: isDefault || false
    });

    const userAddresses = Database.readData('addresses').filter(addr => addr.userId === userId);

    res.json({
      success: true,
      data: userAddresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding address'
    });
  }
};

// Delete address
exports.deleteAddress = (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const allAddresses = Database.readData('addresses');
    const addressIndex = allAddresses.findIndex(addr => addr.id === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (allAddresses[addressIndex].userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    allAddresses.splice(addressIndex, 1);
    Database.writeData('addresses', allAddresses);

    const userAddresses = allAddresses.filter(addr => addr.userId === userId);

    res.json({
      success: true,
      data: userAddresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting address'
    });
  }
};

// Update address
exports.updateAddress = (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { name, address, city, state, pincode, phone, isDefault } = req.body;

    if (!name || !address || !city || !state || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const allAddresses = Database.readData('addresses');
    const addressIndex = allAddresses.findIndex(addr => addr.id === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (allAddresses[addressIndex].userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Update address fields
    allAddresses[addressIndex] = {
      ...allAddresses[addressIndex],
      name,
      address,
      city,
      state,
      pincode,
      phone,
      updatedAt: new Date().toISOString()
    };

    // Handle default address if needed
    if (isDefault) {
      allAddresses.forEach(addr => {
        if (addr.userId === userId) addr.isDefault = false;
      });
      allAddresses[addressIndex].isDefault = true;
    }

    Database.writeData('addresses', allAddresses);

    const userAddresses = allAddresses.filter(addr => addr.userId === userId);

    res.json({
      success: true,
      data: userAddresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address'
    });
  }
};

// Set default address
exports.setDefaultAddress = (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.params;

    const allAddresses = Database.readData('addresses');
    const addressIndex = allAddresses.findIndex(addr => addr.id === addressId);

    if (addressIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    if (allAddresses[addressIndex].userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    allAddresses.forEach(addr => {
      if (addr.userId === userId) addr.isDefault = false;
    });

    allAddresses[addressIndex].isDefault = true;
    Database.writeData('addresses', allAddresses);

    const userAddresses = allAddresses.filter(addr => addr.userId === userId);

    res.json({
      success: true,
      data: userAddresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error setting default'
    });
  }
};
