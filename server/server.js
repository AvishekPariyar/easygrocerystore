const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const adminRoutes = require('./routes/admin');
const orderRoutes = require('./routes/order');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create required directories
const createDirectory = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
};

// Create uploads directory
createDirectory('uploads');

// Serve static files
app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path, stat) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(() => mongoose.connect(process.env.MONGODB_URI), 5000);
  });

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Grocery Store API is running');
});

// Serve React build in production - MUST BE LAST ROUTE
if (process.env.NODE_ENV === 'production') {
  // Serve static files from React app
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n=== Server running on port ${PORT} ===`);
  console.log('Available endpoints:');

  console.log('- POST /api/orders     - Create new order');
  console.log('- GET  /api/orders/:id - Get order by ID');
  console.log('- PUT  /api/orders/:id - Update order status');
  console.log('\nStatic files being served from:');
  console.log('- /uploads -> uploads/');
  console.log('\nTry these URLs in your browser:');
  console.log(`- http://localhost:${PORT}/`);
  console.log(`- http://localhost:${PORT}/api/health\n`);
});