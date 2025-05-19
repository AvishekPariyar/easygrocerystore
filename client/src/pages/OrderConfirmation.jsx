import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import KhaltiCheckout from '../components/KhaltiCheckout';

const OrderConfirmation = () => {
  const location = useLocation();
  const { user } = useAppContext();
  const order = location.state?.order;

  // Redirect if no order data or user is not logged in
  if (!order || !user) {
    return <Navigate to="/" />;
  }

  // Format date
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Confirmation</h1>
            <p className="text-gray-600">Thank you for your order!</p>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Order Details</h2>
            <p className="text-gray-600">Order ID: {order._id}</p>
            <p className="text-gray-600">Date: {orderDate}</p>
            <p className="text-gray-600">Status: {order.status}</p>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-b pb-4 mb-4">
            <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
            <p className="text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.address}</p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-600">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">₹{order.shippingCost}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
          </div>

          <div className="space-y-4">
            <KhaltiCheckout orderDetails={order} />
            <Link
              to="/profile/orders"
              className="block w-full px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md text-center hover:bg-gray-300"
            >
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
