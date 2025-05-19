const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  // Fruits & Vegetables
  {
    name: 'Fresh Bananas',
    description: 'Sweet and ripe bananas, perfect for snacking or baking',
    price: 120,
    category: 'fruits',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 150,
    unit: 'dozen',
    featured: true,
    discount: 0
  },
  {
    name: 'Organic Tomatoes',
    description: 'Locally grown organic tomatoes, perfect for salads and cooking',
    price: 80,
    category: 'vegetables',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 200,
    unit: 'kg',
    featured: false,
    discount: 10
  },
  {
    name: 'Green Spinach',
    description: 'Fresh and crispy spinach leaves, rich in iron and vitamins',
    price: 60,
    category: 'vegetables',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 100,
    unit: 'bundle',
    featured: false,
    discount: 0
  },

  // Dairy & Eggs
  {
    name: 'Fresh Milk',
    description: 'Farm-fresh whole milk, pasteurized and rich in calcium',
    price: 110,
    category: 'dairy',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 50,
    unit: 'liter',
    featured: true,
    discount: 0
  },
  {
    name: 'Farm Eggs',
    description: 'Free-range eggs from local farms',
    price: 180,
    category: 'dairy',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 100,
    unit: 'dozen',
    featured: false,
    discount: 5
  },
  {
    name: 'Cheese Block',
    description: 'Premium cheddar cheese, perfect for sandwiches and cooking',
    price: 350,
    category: 'dairy',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 30,
    unit: 'piece',
    featured: true,
    discount: 0
  },

  // Bakery
  {
    name: 'Whole Wheat Bread',
    description: 'Freshly baked whole wheat bread, healthy and delicious',
    price: 85,
    category: 'bakery',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 40,
    unit: 'loaf',
    featured: false,
    discount: 0
  },
  {
    name: 'Chocolate Muffins',
    description: 'Soft and moist chocolate muffins, perfect for breakfast or snack',
    price: 150,
    category: 'bakery',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 24,
    unit: 'pack',
    featured: true,
    discount: 15
  },

  // Beverages
  {
    name: 'Orange Juice',
    description: 'Fresh-squeezed orange juice, no added sugar',
    price: 160,
    category: 'beverages',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 30,
    unit: 'liter',
    featured: false,
    discount: 0
  },
  {
    name: 'Green Tea',
    description: 'Premium green tea bags, rich in antioxidants',
    price: 220,
    category: 'beverages',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 45,
    unit: 'box',
    featured: false,
    discount: 8
  },

  // Snacks & Sweets
  {
    name: 'Mixed Nuts',
    description: 'Premium selection of roasted nuts, perfect for healthy snacking',
    price: 450,
    category: 'snacks',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 25,
    unit: 'pack',
    featured: true,
    discount: 0
  },
  {
    name: 'Dark Chocolate',
    description: '70% dark chocolate bar, rich and smooth',
    price: 180,
    category: 'snacks',
    imageUrl: '/images/products/placeholder.jpg',
    stock: 50,
    unit: 'bar',
    featured: false,
    discount: 0
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const insertedProducts = await Product.insertMany(products);
    console.log(`Added ${insertedProducts.length} products successfully`);

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();
