const Product = require('../models/Product');

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, category, sortBy } = req.query;
    
    // Build filter object
    const filter = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category.toLowerCase();
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case 'price_asc':
          sort.price = 1;
          break;
        case 'price_desc':
          sort.price = -1;
          break;
        case 'name_asc':
          sort.name = 1;
          break;
        case 'name_desc':
          sort.name = -1;
          break;
        default:
          sort.createdAt = -1;
      }
    }

    const products = await Product.find(filter).sort(sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products', error: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ 
      category: category.toLowerCase()
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error: error.message });
  }
};

// Get discounted products
exports.getDiscountedProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      discount: { $gt: 0 }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discounted products', error: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  console.log('Fetching product with ID:', req.params.id);
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(req.params.id);
    console.log('Found product:', product);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error in getProduct:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID format' });
    }
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    // Get the image filename from multer
    const image = req.file ? req.file.filename : null;
    
    // Create product object
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      discount: parseFloat(req.body.discount || 0),
      imageUrl: image
    };

    // Create and save the product
    const product = new Product(productData);
    await product.save();

    // Add the full image URL to the response
    const productResponse = product.toObject();
    if (product.imageUrl) {
      productResponse.imageUrl = `/uploads/${product.imageUrl}`;
    }
    
    res.status(201).json(productResponse);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle image upload
    let image = req.file ? req.file.filename : product.imageUrl;
    
    // Update product data
    const updateData = { 
      ...req.body, 
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      discount: parseFloat(req.body.discount || 0),
      imageUrl: image 
    };

    // Update and save the product
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Add the full image URL to the response
    const productResponse = updatedProduct.toObject();
    if (updatedProduct.imageUrl) {
      productResponse.imageUrl = `/uploads/${updatedProduct.imageUrl}`;
    }

    res.json(productResponse);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};