const Database = require('../models/Database');

const WISHLISTS_COLLECTION = 'wishlists';

// Get user's wishlist
exports.getWishlist = (req, res) => {
  try {
    const userId = req.user.id;
    let wishlist = Database.findBy(WISHLISTS_COLLECTION, 'userId', userId);

    if (!wishlist) {
      // Create new wishlist if doesn't exist
      wishlist = Database.create(WISHLISTS_COLLECTION, {
        userId,
        items: [],
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching wishlist',
      error: error.message
    });
  }
};

// Add item to wishlist
exports.addToWishlist = (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, name, price, image } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    let wishlist = Database.findBy(WISHLISTS_COLLECTION, 'userId', userId);

    if (!wishlist) {
      // Create new wishlist if doesn't exist
      wishlist = Database.create(WISHLISTS_COLLECTION, {
        userId,
        items: [],
        createdAt: new Date().toISOString()
      });
    }

    // Check if item already in wishlist
    const itemExists = wishlist.items.some(item => item.productId === productId);
    if (itemExists) {
      return res.status(400).json({
        success: false,
        message: 'Item already in wishlist'
      });
    }

    // Add item to wishlist with product data from request
    const newItem = {
      id: `${productId}_${Date.now()}`,
      productId,
      name: name || 'Product',
      price: price || 0,
      image: image || '',
      addedAt: new Date().toISOString()
    };

    wishlist.items.push(newItem);
    Database.update(WISHLISTS_COLLECTION, wishlist.id, wishlist);

    res.status(201).json({
      success: true,
      message: 'Item added to wishlist',
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to wishlist',
      error: error.message
    });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    let wishlist = Database.findBy(WISHLISTS_COLLECTION, 'userId', userId);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    // Find and remove item
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter(item => item.id !== itemId);

    if (wishlist.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in wishlist'
      });
    }

    wishlist.updatedAt = new Date().toISOString();
    Database.update(WISHLISTS_COLLECTION, wishlist.id, wishlist);

    res.json({
      success: true,
      message: 'Item removed from wishlist',
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from wishlist',
      error: error.message
    });
  }
};

// Check if product is in wishlist
exports.isInWishlist = (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = Database.findBy(WISHLISTS_COLLECTION, 'userId', userId);

    if (!wishlist) {
      return res.json({
        success: true,
        inWishlist: false
      });
    }

    const inWishlist = wishlist.items.some(item => item.productId === productId);

    res.json({
      success: true,
      inWishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error checking wishlist',
      error: error.message
    });
  }
};

// Clear wishlist
exports.clearWishlist = (req, res) => {
  try {
    const userId = req.user.id;

    let wishlist = Database.findBy(WISHLISTS_COLLECTION, 'userId', userId);

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found'
      });
    }

    wishlist.items = [];
    wishlist.updatedAt = new Date().toISOString();

    Database.update(WISHLISTS_COLLECTION, wishlist.id, wishlist);

    res.json({
      success: true,
      message: 'Wishlist cleared',
      data: wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing wishlist',
      error: error.message
    });
  }
};
