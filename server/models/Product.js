const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['fruits', 'vegetables', 'dairy', 'bakery', 'beverages', 'snacks', 'household', 'personal care']
  },
  imageUrl: {
    type: String,
    required: true,
    get: function(v) {
      // If the URL is already absolute, return it as is
      if (v.startsWith('http://') || v.startsWith('https://')) {
        return v;
      }
      // If it's a relative path, prepend /uploads/
      if (!v.startsWith('/')) {
        return `/uploads/${v}`;
      }
      return v;
    }
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'l', 'ml', 'pcs', 'dozen']
  },
  featured: {
    type: Boolean,
    default: false
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }
});

// Add virtual field for discounted price
productSchema.virtual('discountedPrice').get(function() {
  if (!this.discount) return this.price;
  const discountAmount = (this.price * this.discount) / 100;
  return this.price - discountAmount;
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;