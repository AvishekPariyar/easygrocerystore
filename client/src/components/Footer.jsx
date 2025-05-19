import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EasyGrocery</h3>
            <p className="text-gray-400">Your one-stop shop for fresh groceries and daily essentials.</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white">Cart</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              <li><Link to="/products?category=fruits" className="text-gray-400 hover:text-white">Fruits</Link></li>
              <li><Link to="/products?category=vegetables" className="text-gray-400 hover:text-white">Vegetables</Link></li>
              <li><Link to="/products?category=dairy" className="text-gray-400 hover:text-white">Dairy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@easygrocery.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Grocery St, Food City</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} EasyGrocery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;