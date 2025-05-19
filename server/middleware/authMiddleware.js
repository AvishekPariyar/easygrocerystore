const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to check if user is authenticated
exports.authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Received token:', token ? 'Yes' : 'No');
    
    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token verified, decoded:', decoded);
      
      // Find user by id
      const user = await User.findById(decoded.userId);
      console.log('Found user:', user ? 'Yes' : 'No');
      
      if (!user) {
        console.log('User not found for token');
        return res.status(401).json({ message: 'User not found' });
      }

      // Add user to request object
      req.user = user;
      console.log('User authenticated:', user.email, 'Role:', user.role);
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError.message);
      return res.status(401).json({ message: 'Token is not valid' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check if user is admin
exports.adminMiddleware = (req, res, next) => {
  console.log('Checking admin role for user:', req.user?.email);
  console.log('User role:', req.user?.role);
  
  if (req.user && req.user.role === 'admin') {
    console.log('Admin access granted');
    next();
  } else {
    console.log('Admin access denied');
    res.status(403).json({ message: 'Access denied. Admin role required' });
  }
};

// Middleware to check if user is the owner or admin
exports.ownerOrAdminMiddleware = (req, res, next) => {
  if (req.user && (req.user._id.toString() === req.params.userId || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Not authorized' });
  }
};
