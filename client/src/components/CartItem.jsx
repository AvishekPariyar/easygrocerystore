import React from 'react';
import { useAppContext } from '../context/AppContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useAppContext();

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-16 h-16 object-cover rounded-md"
        />
        <div>
          <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-600">₹{item.price} per {item.unit}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-md">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            -
          </button>
          <span className="px-3 py-1 text-gray-800">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
          >
            +
          </button>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-medium text-gray-800">
            ₹{(item.price * item.quantity).toFixed(2)}
          </p>
          <button
            onClick={() => removeFromCart(item._id)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;