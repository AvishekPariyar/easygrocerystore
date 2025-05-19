import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

const KhaltiCheckout = ({ orderDetails }) => {
  const navigate = useNavigate();
  const { clearCart } = useAppContext();

  const initiateKhaltiPayment = async () => {
    try {
      // For testing purposes, using the demo payment URL
      const testPaymentUrl = "https://test-pay.khalti.com/wallet?pidx=2bdmqHTYi42EacyTRnAG2Z";
      
      // Store order ID in session storage for verification
      sessionStorage.setItem('pendingOrderId', orderDetails._id);
      
      // Redirect to Khalti test payment page
      window.location.href = testPaymentUrl;
    } catch (error) {
      console.error('Payment initiation failed:', error);
      toast.error('Failed to initiate payment. Please try again.');
    }
  };

  return (
    <button
      onClick={initiateKhaltiPayment}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiCheckout;