const Database = require('../models/Database');
const { validateCartItem } = require('../utils/validators');

const CARTS_COLLECTION = 'carts';
const USERS_COLLECTION = 'users';

// Get user's cart
exports.getCart = (req, res) => {
  try {
    const userId = req.user.id;
    let cart = Database.findBy(CARTS_COLLECTION, 'userId', userId);

    if (!cart) {
      // Create new cart if doesn't exist
      cart = Database.create(CARTS_COLLECTION, {
        userId,
        items: [],
        total: 0,
        createdAt: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addToCart = (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, customization, size, color, price } = req.body;

    const validation = validateCartItem({ productId, quantity });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    let cart = Database.findBy(CARTS_COLLECTION, 'userId', userId);
    if (!cart) {
      cart = Database.create(CARTS_COLLECTION, {
        userId,
        items: [],
        total: 0
      });
    }

    // Check if item already in cart
    const existingItem = cart.items.find(
      item => item.productId === productId && 
      JSON.stringify(item.customization) === JSON.stringify(customization) &&
      item.size === size &&
      item.color === color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        id: `${productId}_${Date.now()}`,
        productId,
        name: req.body.name || 'Product',
        image: req.body.image || '',
        quantity,
        size,
        color,
        price,
        customization,
        addedAt: new Date().toISOString()
      });
    }

    // Calculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    Database.update(CARTS_COLLECTION, cart.id, cart);

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message
    });
  }
};

// Update cart item
exports.updateCartItem = (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    let cart = Database.findBy(CARTS_COLLECTION, 'userId', userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.find(i => i.id === itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    item.quantity = quantity;
    cart.total = cart.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    Database.update(CARTS_COLLECTION, cart.id, cart);

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating cart item',
      error: error.message
    });
  }
};

// Remove item from cart
exports.removeFromCart = (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    let cart = Database.findBy(CARTS_COLLECTION, 'userId', userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(i => i.id !== itemId);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    Database.update(CARTS_COLLECTION, cart.id, cart);

    res.json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing from cart',
      error: error.message
    });
  }
};

// Clear entire cart
exports.clearCart = (req, res) => {
  try {
    const userId = req.user.id;

    let cart = Database.findBy(CARTS_COLLECTION, 'userId', userId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = [];
    cart.total = 0;

    Database.update(CARTS_COLLECTION, cart.id, cart);

    res.json({
      success: true,
      message: 'Cart cleared',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing cart',
      error: error.message
    });
  }
};
