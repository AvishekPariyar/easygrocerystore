import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import axios from '../config/axios';

const Checkout = () => {
  const { cart, user, clearCart } = useAppContext();
  const navigate = useNavigate();
  
  // Form state management
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const paymentOptions = [
    { value: 'Cash on Delivery', label: 'Cash on Delivery - Pay when you receive your order' },
    { value: 'Khalti', label: 'Khalti - Pay securely using Khalti wallet, mobile banking, or card' }
  ];
  
  // Loading state
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Calculate cart totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  // Ensure total is rounded to 2 decimal places to match backend expectations
  const roundedTotal = Math.round(total * 100) / 100;

  // Redirect if cart is empty or user is not logged in
  useEffect(() => {
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/');
    }
    if (!user) {
      toast.error('Please login to checkout');
      navigate('/login');
    }
  }, [cart, user, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.zipCode) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Calculate order total
      const orderTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      // Prepare order data
      const orderData = {
        user: user?.id || null, // Send user ID as string, server will handle conversion
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0] || ''
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: 'Nepal'
        },
        paymentMethod,
        taxPrice: 0,
        shippingPrice: deliveryFee,
        totalPrice: roundedTotal, // Use rounded total to match backend expectations
        isPaid: false,
        status: 'pending'
      };
      
      console.log('Submitting order data:', orderData);
      
      // Create order
      const response = await axios.post('/api/orders', orderData);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create order');
      }
      
      const order = response.data.order;
      setOrderId(order._id);
      clearCart();
      
      // Handle payment based on method
      if (paymentMethod === 'Cash on Delivery') {
        toast.success('Order placed successfully! You will pay on delivery.');
        navigate('/order-success', { state: { orderId: order._id } });
      } else if (paymentMethod === 'Khalti') {
        // Initialize Khalti payment
        const script = document.createElement('script');
        script.src = 'https://khalti.s3.ap-south-1.amazonaws.com/KPG/dist/2020.12.22.0.0.0/khalti-checkout.iffe.js';
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
          window.KPG.init({
            publicKey: process.env.REACT_APP_KHALTI_PUBLIC_KEY,
            productIdentity: order._id,
            productName: 'Grocery Store Order',
            productUrl: window.location.origin,
            eventHandler: {
              onSuccess: async (payload) => {
                await axios.put(`/api/orders/${order._id}/payment`, {
                  paymentId: payload.idx,
                  status: 'paid'
                });
                toast.success('Payment successful! Order confirmed.');
                navigate('/order-success', { state: { orderId: order._id } });
              },
              onError: (error) => {
                console.error('Khalti payment failed:', error);
                toast.error('Payment failed. Please try again.');
              },
              onClose: () => {
                toast.error('Payment cancelled.');
              }
            }
          }).start();
        };
      }
    } catch (error) {
      console.error('Error processing order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shipping Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
            <div className="space-y-4">
              {paymentOptions.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="radio"
                    id={option.value}
                    name="paymentMethod"
                    value={option.value}
                    checked={paymentMethod === option.value}
                    onChange={handlePaymentMethodChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={option.value}
                    className="ml-3 text-sm font-medium text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>Rs. {deliveryFee}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
