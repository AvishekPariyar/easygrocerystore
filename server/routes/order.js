const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Middleware to parse token if present
const parseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      console.error('Invalid token:', error);
    }
  }
  next();
};

// Create a new order
router.post('/', async (req, res) => {
  console.log('Creating new order with data:', req.body);
  console.log('Order items:', req.body.orderItems);
  console.log('Shipping address:', req.body.shippingAddress);
  console.log('Payment method:', req.body.paymentMethod);

  try {
    // Create order with proper user handling
    const order = new Order({
      ...req.body,
      user: req.body.user || mongoose.Types.ObjectId(), // Use provided user ID or create new ID for guest
      isPaid: false,
      isDelivered: false,
      status: 'pending'
    });

    // Calculate total price to verify
    const orderTotal = order.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    if (orderTotal !== order.totalPrice) {
      return res.status(400).json({
        success: false,
        message: `Invalid total price. Expected: ${orderTotal}, Received: ${order.totalPrice}`
      });
    }

    // Save order
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);

    // Return response
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: {
        _id: savedOrder._id,
        user: savedOrder.user,
        orderItems: savedOrder.orderItems,
        shippingAddress: savedOrder.shippingAddress,
        paymentMethod: savedOrder.paymentMethod,
        paymentStatus: savedOrder.paymentStatus,
        taxPrice: savedOrder.taxPrice,
        shippingPrice: savedOrder.shippingPrice,
        totalPrice: savedOrder.totalPrice,
        isPaid: savedOrder.isPaid,
        isDelivered: savedOrder.isDelivered,
        status: savedOrder.status,
        createdAt: savedOrder.createdAt,
        updatedAt: savedOrder.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in order creation:', {
      error: error,
      stack: error.stack,
      message: error.message
    });
    res.status(500).json({ 
      success: false,
      message: error.message, // Show error message in development
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get order by ID
router.get('/:id', async (req, res) => {
  console.log(`Fetching order ${req.params.id}`);
  
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    console.log('Order found:', order);
    res.json({ 
      success: true, 
      order 
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update order status
router.put('/:id', async (req, res) => {
  console.log(`Updating order ${req.params.id} with:`, req.body);
  
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!order) {
      console.log('Order not found for update');
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    console.log('Order updated:', order);
    res.json({ 
      success: true, 
      message: 'Order updated successfully',
      order 
    });
    
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error updating order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
