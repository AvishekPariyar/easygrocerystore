const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');


// Dashboard stats
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments();
    
    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Calculate total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Get recent orders
    const recentOrders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'orderItems.product',
        select: 'name image'
      })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Calculate top products based on order items
    const orderItems = orders.flatMap(order => order.orderItems);
    const productSales = {};
    
    orderItems.forEach(item => {
      const productId = item.product.toString();
      if (!productSales[productId]) {
        productSales[productId] = {
          quantity: 0,
          revenue: 0
        };
      }
      productSales[productId].quantity += item.quantity;
      productSales[productId].revenue += item.price * item.quantity;
    });
    
    const topProductIds = Object.keys(productSales)
      .sort((a, b) => productSales[b].quantity - productSales[a].quantity)
      .slice(0, 5);
    
    const topProducts = await Product.find({ _id: { $in: topProductIds } });
    
    const formattedTopProducts = topProducts.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      totalSold: productSales[product._id.toString()].quantity,
      totalRevenue: productSales[product._id.toString()].revenue,
      image: product.imageUrl
    }));
    
    // Generate sales data for the last 6 months
    const salesData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      
      const monthlyOrders = await Order.find({
        createdAt: { $gte: month, $lt: nextMonth }
      });
      
      const monthlySales = monthlyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      salesData.push({
        month: months[month.getMonth()],
        sales: monthlySales
      });
    }
    
    const stats = {
      totalProducts,
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts: formattedTopProducts,
      salesData
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// Recent orders
exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'orderItems.product',
        select: 'name image'
      })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json(recentOrders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent orders', error: error.message });
  }
};

// Analytics
exports.getSalesAnalytics = async (req, res) => {
  try {
    // Calculate daily sales for the last 7 days
    const dailySales = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);
      
      const dailyOrders = await Order.find({
        createdAt: { $gte: date, $lt: nextDate }
      });
      
      const dailySalesAmount = dailyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      dailySales.push({
        date: date.toISOString().split('T')[0],
        sales: dailySalesAmount
      });
    }
    
    // Calculate monthly sales for the last 6 months
    const monthlySales = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      
      const monthlyOrders = await Order.find({
        createdAt: { $gte: month, $lt: nextMonth }
      });
      
      const monthlySalesAmount = monthlyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      monthlySales.push({
        month: months[month.getMonth()],
        sales: monthlySalesAmount
      });
    }
    
    // Calculate revenue statistics
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Monthly revenue (current month)
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const monthlyOrders = await Order.find({
      createdAt: { $gte: currentMonth, $lt: nextMonth }
    });
    const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Weekly revenue (current week)
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() - today.getDay());
    currentWeekStart.setHours(0, 0, 0, 0);
    const weeklyOrders = await Order.find({
      createdAt: { $gte: currentWeekStart }
    });
    const weeklyRevenue = weeklyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Daily revenue (today)
    const dayStart = new Date(today);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(today);
    dayEnd.setHours(23, 59, 59, 999);
    const dailyOrders = await Order.find({
      createdAt: { $gte: dayStart, $lte: dayEnd }
    });
    const dailyRevenue = dailyOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Calculate order statistics
    const totalOrders = await Order.countDocuments();
    const monthlyOrdersCount = await Order.countDocuments({
      createdAt: { $gte: currentMonth, $lt: nextMonth }
    });
    const weeklyOrdersCount = await Order.countDocuments({
      createdAt: { $gte: currentWeekStart }
    });
    const dailyOrdersCount = await Order.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd }
    });
    
    // Calculate user statistics
    const totalUsers = await User.countDocuments();
    const monthlyUsers = await User.countDocuments({
      createdAt: { $gte: currentMonth, $lt: nextMonth }
    });
    const weeklyUsers = await User.countDocuments({
      createdAt: { $gte: currentWeekStart }
    });
    const dailyUsers = await User.countDocuments({
      createdAt: { $gte: dayStart, $lte: dayEnd }
    });
    
    const salesAnalytics = {
      dailySales,
      monthlySales,
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue,
        weekly: weeklyRevenue,
        daily: dailyRevenue
      },
      orders: {
        total: totalOrders,
        monthly: monthlyOrdersCount,
        weekly: weeklyOrdersCount,
        daily: dailyOrdersCount
      },
      users: {
        total: totalUsers,
        monthly: monthlyUsers,
        weekly: weeklyUsers,
        daily: dailyUsers
      },
    };

    res.json(salesAnalytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sales analytics', error: error.message });
  }
};

exports.getProductAnalytics = async (req, res) => {
  try {
    // Get all products
    const products = await Product.find();

    // Get all orders to calculate sales
    const orders = await Order.find().populate('orderItems.product');

    // Calculate product sales and revenue
    const productSales = {};

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        const productId = item.product._id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            name: item.product.name,
            sales: 0,
            revenue: 0,
            category: item.product.category
          };
        }
        productSales[productId].sales += item.quantity;
        productSales[productId].revenue += item.price * item.quantity;
      });
    });

    // Get top products by sales
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Calculate category sales
    const categorySalesMap = {};
    Object.values(productSales).forEach(product => {
      const category = product.category;
      if (!categorySalesMap[category]) {
        categorySalesMap[category] = 0;
      }
      categorySalesMap[category] += product.revenue;
    });

    const categorySales = Object.entries(categorySalesMap).map(([category, sales]) => ({
      category,
      sales
    })).sort((a, b) => b.sales - a.sales);

    // Calculate stock status
    const inStock = products.filter(p => p.stock > 10).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    // Calculate product counts
    const total = products.length;
    const active = products.filter(p => p.stock > 0).length;
    const featured = products.filter(p => p.featured).length;

    const productAnalytics = {
      topProducts,
      categorySales,
      stockStatus: {
        inStock,
        lowStock,
        outOfStock
      },
      productCount: {
        total,
        active,
        featured
      }
    };

    res.json(productAnalytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product analytics', error: error.message });
  }
};

exports.getUserAnalytics = async (req, res) => {
  try {
    // Get all users
    const users = await User.find();

    // Get all orders
    const orders = await Order.find().populate('user');

    // Calculate user growth over the last 6 months
    const userGrowth = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);

      const monthlyUsers = await User.countDocuments({
        createdAt: { $gte: month, $lt: nextMonth }
      });

      userGrowth.push({
        month: months[month.getMonth()],
        users: monthlyUsers
      });
    }

    // Calculate user status
    // Since isActive might not be in the original model, we'll count all users as active for now
    // In a real application, you would filter by isActive field
    const active = users.length;
    const inactive = 0;

    // Calculate top customers
    const userSpending = {};

    orders.forEach(order => {
      const userId = order.user._id.toString();
      if (!userSpending[userId]) {
        userSpending[userId] = {
          name: order.user.name,
          orders: 0,
          spent: 0
        };
      }
      userSpending[userId].orders += 1;
      userSpending[userId].spent += order.totalPrice;
    });

    const topCustomers = Object.values(userSpending)
      .sort((a, b) => b.spent - a.spent)
      .slice(0, 5);

    // Calculate user roles
    const admin = users.filter(user => user.role === 'admin').length;
    const user = users.filter(user => user.role === 'user').length;

    const userAnalytics = {
      userGrowth,
      userStatus: {
        active,
        inactive
      },
      topCustomers,
      userRoles: {
        admin,
        user
      }
    };

    res.json(userAnalytics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user analytics', error: error.message });
  }
};

// Product management
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log('Received files:', req.file);
    console.log('Received body:', req.body);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const { name, description, price, category, stock, unit } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !stock || !unit) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        required: ['name', 'description', 'price', 'category', 'stock', 'unit'],
        received: { name, description, price, category, stock, unit }
      });
    }

    // Set image URL from uploaded file
    const imageUrl = `/uploads/${req.file.filename}`;

    // Create new product with validated data
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.toLowerCase(),
      stock: Number(stock),
      unit,
      imageUrl
    });

    // Validate the product before saving
    const validationError = newProduct.validateSync();
    if (validationError) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationError.errors 
      });
    }

    const savedProduct = await newProduct.save();
    console.log('Product saved successfully:', savedProduct);
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message,
      details: error.errors || {}
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, unit, featured, discount } = req.body;
    
    // Find the product to update
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? Number(price) : product.price;
    product.category = category ? category.toLowerCase() : product.category;
    product.stock = stock ? Number(stock) : product.stock;
    product.unit = unit || product.unit;
    product.featured = featured !== undefined ? featured : product.featured;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    
    // Handle file upload if it exists
    if (req.file) {
      // In a production environment, you would upload to a cloud storage
      // For now, we'll just use the file path
      product.imageUrl = `/uploads/${req.file.filename}`;
    }
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the product to delete
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete the product
    await Product.findByIdAndDelete(id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

// Order management
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'orderItems.product',
        select: 'name price imageUrl'
      })
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate({
        path: 'user',
        select: 'name email'
      })
      .populate({
        path: 'orderItems.product',
        select: 'name price imageUrl description'
      });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Find and update the order
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Update status and related fields
    order.status = status;
    
    // If status is delivered, update isDelivered and deliveredAt
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    // Save the updated order
    const updatedOrder = await order.save();
    
    res.json({
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};

// User management
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    
    // Calculate order statistics for each user
    const usersWithStats = await Promise.all(users.map(async (user) => {
      // Get all orders for this user
      const userOrders = await Order.find({ user: user._id });
      
      // Calculate total spent and order count
      const orderCount = userOrders.length;
      const totalSpent = userOrders.reduce((sum, order) => sum + order.totalPrice, 0);
      
      // Return user with additional stats
      return {
        ...user.toObject(),
        orderCount,
        totalSpent
      };
    }));
    
    res.json(usersWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get all orders for this user
    const userOrders = await Order.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Calculate order statistics
    const orderCount = await Order.countDocuments({ user: user._id });
    const totalSpent = userOrders.reduce((sum, order) => sum + order.totalPrice, 0);
    
    // Return user with additional stats and recent orders
    const userWithStats = {
      ...user.toObject(),
      orderCount,
      totalSpent,
      recentOrders: userOrders
    };

    res.json(userWithStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate role
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }
    
    // Find the user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update the user role
    user.role = role;
    await user.save();
    
    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    // Find the user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user active status (we need to add this field to the User model)
    // Since it's not in the original model, we'll use findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: Boolean(isActive) },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'User status updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};
