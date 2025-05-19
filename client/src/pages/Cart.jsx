import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import CartItem from '../components/CartItem';

const Cart = () => {
  const { cart, clearCart } = useAppContext();

  // Calculate total
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-4 py-6 sm:px-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <div className="mt-8">
                  {cart.map((item) => (
                    <CartItem key={item._id} item={item} />
                  ))}
                </div>
                <div className="mt-6">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-500"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-white shadow-sm rounded-lg">
              <div className="px-4 py-6 sm:px-6">
                <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                <div className="mt-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Subtotal</div>
                    <div className="text-sm font-medium text-gray-900">₹{total.toFixed(2)}</div>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="text-sm text-gray-600">Shipping</div>
                    <div className="text-sm font-medium text-gray-900">Free</div>
                  </div>
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-medium text-gray-900">Order total</div>
                      <div className="text-base font-medium text-gray-900">₹{total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/checkout"
                    className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Proceed to Checkout
                  </Link>
                </div>

                <div className="mt-4">
                  <Link
                    to="/products"
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;