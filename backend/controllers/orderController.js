const Database = require('../models/Database');
const { validateOrderData } = require('../utils/validators');
const { ORDER_STATUS, PAYMENT_STATUS } = require('../utils/constants');

const ORDERS_COLLECTION = 'orders';
const CARTS_COLLECTION = 'carts';

// Get all user's orders
exports.getUserOrders = (req, res) => {
  try {
    const userId = req.user.id;
    const orders = Database.filterBy(ORDERS_COLLECTION, 'userId', userId);

    // Sort by date, most recent first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get specific order
exports.getOrderById = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = Database.read(ORDERS_COLLECTION, orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (order.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Create order from cart
exports.createOrder = (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, notes } = req.body;

    // Get user's cart
    const cart = Database.findBy(CARTS_COLLECTION, 'userId', userId);
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Create order
    const newOrder = Database.create(ORDERS_COLLECTION, {
      userId,
      items: cart.items,
      shippingAddress,
      paymentMethod: paymentMethod || 'card',
      notes: notes || '',
      total: cart.total,
      status: ORDER_STATUS.PENDING,
      paymentStatus: PAYMENT_STATUS.PENDING,
      trackingNumber: `BT${Date.now()}${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    // Clear cart
    cart.items = [];
    cart.total = 0;
    Database.update(CARTS_COLLECTION, cart.id, cart);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: newOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Update order status (admin only)
exports.updateOrderStatus = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update order status'
      });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    const updated = Database.update(ORDERS_COLLECTION, orderId, {
      status,
      updatedAt: new Date().toISOString()
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order',
      error: error.message
    });
  }
};

// Track order
exports.trackOrder = (req, res) => {
  try {
    const { trackingNumber } = req.params;
    const orders = Database.readAll(ORDERS_COLLECTION);
    
    const order = orders.find(o => o.trackingNumber === trackingNumber);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Timeline based on status
    const timeline = {
      [ORDER_STATUS.PENDING]: [{ status: 'Pending', date: order.createdAt }],
      [ORDER_STATUS.CONFIRMED]: [
        { status: 'Pending', date: order.createdAt },
        { status: 'Confirmed', date: order.updatedAt }
      ],
      [ORDER_STATUS.PROCESSING]: [
        { status: 'Pending', date: order.createdAt },
        { status: 'Confirmed', date: order.updatedAt },
        { status: 'Processing', date: order.updatedAt }
      ],
      [ORDER_STATUS.SHIPPED]: [
        { status: 'Pending', date: order.createdAt },
        { status: 'Confirmed', date: order.updatedAt },
        { status: 'Processing', date: order.updatedAt },
        { status: 'Shipped', date: order.updatedAt }
      ],
      [ORDER_STATUS.DELIVERED]: [
        { status: 'Pending', date: order.createdAt },
        { status: 'Confirmed', date: order.updatedAt },
        { status: 'Processing', date: order.updatedAt },
        { status: 'Shipped', date: order.updatedAt },
        { status: 'Delivered', date: order.updatedAt }
      ]
    };

    res.json({
      success: true,
      data: {
        order,
        timeline: timeline[order.status] || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
};

// Get all orders (admin only)
exports.getAllOrders = (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can view all orders'
      });
    }

    const { status, page = 1, limit = 10 } = req.query;
    let orders = Database.readAll(ORDERS_COLLECTION);

    // Filter by status
    if (status) {
      orders = orders.filter(o => o.status === status);
    }

    // Sort by date, most recent first
    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100);
    const skip = (pageNum - 1) * limitNum;
    const paginatedOrders = orders.slice(skip, skip + limitNum);

    res.json({
      success: true,
      data: paginatedOrders,
      pagination: {
        total: orders.length,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(orders.length / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = (req, res) => {
  try {
    const { orderId } = req.params;
    const order = Database.read(ORDERS_COLLECTION, orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (order.userId !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending or confirmed orders
    if (![ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    const updated = Database.update(ORDERS_COLLECTION, orderId, {
      status: ORDER_STATUS.CANCELLED,
      updatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  }
};
