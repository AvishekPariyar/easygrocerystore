import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../config/api';
import toast from 'react-hot-toast';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'fruits',
    stock: '',
    unit: 'kg',
    featured: false,
    discount: '0'
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['fruits', 'vegetables', 'dairy', 'bakery', 'beverages', 'snacks', 'household', 'personal care'];
  const units = ['kg', 'g', 'l', 'ml', 'pcs', 'dozen'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Fetching admin products...');
      const response = await adminAPI.getAllProducts();
      console.log('Products response:', response);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error.response || error);
      toast.error(error.response?.data?.message || 'Error fetching products');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/i)) {
        toast.error('Only JPG, PNG, and GIF images are allowed');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      if (selectedImage) {
        formDataToSend.append('image', selectedImage);
      }

      console.log('Creating new product...');
      await adminAPI.createProduct(formDataToSend);

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'fruits',
        stock: '',
        unit: 'kg',
        featured: false,
        discount: '0'
      });
      setSelectedImage(null);
      setImagePreview(null);
      
      toast.success('Product added successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error.response || error);
      toast.error(error.response?.data?.message || 'Error adding product');
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('Deleting product:', productId);
        await adminAPI.deleteProduct(productId);
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error.response || error);
        toast.error(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>
      
      {/* Add Product Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </label>
          </div>
          
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Price
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                min="0"
                step="0.01"
              />
            </label>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Stock
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                min="0"
              />
            </label>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Unit
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Discount (%)
              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                min="0"
                max="100"
              />
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                rows="3"
              />
            </label>
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Image
              <input
                type="file"
                onChange={handleImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                accept="image/jpeg,image/png,image/gif"
                required
              />
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-w-xs h-auto"
              />
            )}
          </div>

          <div className="col-span-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-gray-700 text-sm font-bold">Featured Product</span>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Product
          </button>
        </div>
      </form>

      {/* Product List */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Current Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product._id} className="bg-white shadow-md rounded p-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h4 className="font-bold">{product.name}</h4>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-green-600 font-bold">
                ₹{product.price.toFixed(2)} / {product.unit}
              </p>
              <p className="text-sm text-gray-500">Stock: {product.stock}</p>
              {product.discount > 0 && (
                <p className="text-red-500">Discount: {product.discount}%</p>
              )}
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement; 