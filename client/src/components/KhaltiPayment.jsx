import React from 'react';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const KhaltiPayment = ({ amount, onSuccess, onError }) => {
  const { user } = useAppContext();
  
  const handlePayment = () => {
    // Check if Khalti is loaded
    if (!window.KhaltiCheckout) {
      toast.error('Khalti payment gateway is not loaded. Please try again later.');
      if (onError) onError('Khalti not loaded');
      return;
    }

    // Convert amount to paisa (Khalti uses paisa)
    const amountInPaisa = amount * 100;
    
    // Khalti configuration
    const config = {
      // Replace with your actual Khalti public key
      publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
      productIdentity: "grocery-store-items",
      productName: "EasyGroceryStore Items",
      productUrl: "http://localhost:3000",
      eventHandler: {
        onSuccess(payload) {
          // Handle successful payment
          console.log('Khalti payment successful:', payload);
          toast.success('Payment successful!');
          if (onSuccess) onSuccess(payload);
        },
        onError(error) {
          // Handle payment error
          console.error('Khalti payment error:', error);
          toast.error('Payment failed. Please try again.');
          if (onError) onError(error);
        },
        onClose() {
          console.log('Khalti payment widget closed');
        }
      },
      paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"],
    };

    // Initialize Khalti checkout
    const checkout = new window.KhaltiCheckout(config);
    
    // Open Khalti checkout popup
    checkout.show({ amount: amountInPaisa });
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Pay with Khalti
    </button>
  );
};

export default KhaltiPayment;
