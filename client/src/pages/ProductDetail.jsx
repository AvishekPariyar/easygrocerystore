import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { productAPI } from '../config/api';
import toast from 'react-hot-toast';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductDetail = () => {
  console.log('ProductDetail mounted with layout');
  console.log('ProductDetail component mounted');
  const { id } = useParams();
  const { addToCart } = useAppContext();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!id) {
          throw new Error('Product ID is missing');
        }

        console.log('Fetching product with ID:', id);
        const response = await productAPI.getById(id);
        console.log('API Response:', response);

        if (!response?.data) {
          console.error('No data in response:', response);
          throw new Error('Product not found');
        }

        setProduct(response.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Error loading product details';
        console.error('Error message:', errorMessage);
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (!id) {
      console.error('No product ID provided');
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Product not found'}
          </h2>
          <Link
            to="/products"
            className="text-green-600 hover:text-green-500"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          {/* Product Image */}
          <div>
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-8 lg:mt-0">
            <h1 className="text-3xl font-extrabold text-gray-900">{product.name}</h1>
            <div className="mt-4">
              <p className="text-xl text-gray-900">₹{product.price} per {product.unit}</p>
              <p className={`mt-2 text-sm ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <div className="mt-2 prose prose-sm text-gray-500">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <label htmlFor="quantity" className="mr-4 text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border-gray-300 py-1.5 text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  disabled={product.stock === 0}
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-8 flex flex-col space-y-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`w-full flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    product.stock > 0
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>

                <Link
                  to="/products"
                  className="text-center text-sm text-green-600 hover:text-green-500"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;