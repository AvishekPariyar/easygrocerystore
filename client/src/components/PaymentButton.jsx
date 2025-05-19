import React, { useState } from 'react';
import { initKhaltiPayment } from '../utils/khalti';
import { toast } from 'react-hot-toast';

const PaymentButton = ({ 
  amount, 
  orderId, 
  orderName, 
  customer, 
  onSuccess, 
  onError, 
  buttonText = 'Pay with Khalti',
  disabled = false,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async (e) => {
    if (e) e.preventDefault();
    if (isLoading || disabled) return;

    setIsLoading(true);
    
    try {
      if (!amount || amount < 10) {
        throw new Error('Invalid amount. Minimum amount is Rs. 10');
      }
      
      if (!orderId || !orderName) {
        throw new Error('Order information is missing');
      }
      
      if (!customer?.name || !customer?.email || !customer?.phone) {
        throw new Error('Customer information is incomplete');
      }
      
      // Convert amount to paisa (1 Rupee = 100 Paisa)
      const amountInPaisa = Math.round(Number(amount) * 100);
      
      await initKhaltiPayment(
        {
          amount: amountInPaisa,
          purchaseOrderId: orderId,
          purchaseOrderName: orderName,
          customer: {
            name: customer.name.trim(),
            email: customer.email.trim(),
            phone: customer.phone.trim(),
          },
        },
        (response) => {
          console.log('Payment initiated:', response);
          if (onSuccess) onSuccess(response);
        },
        (error) => {
          console.error('Payment error:', error);
          toast.error(error.message || 'Failed to initiate payment');
          if (onError) onError(error);
        }
      );
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'An error occurred');
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading || disabled}
      className={`flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-md font-medium 
        hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </>
      ) : (
        <>
          <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" rx="8" fill="currentColor"/>
            <path d="M24 14C18.48 14 14 18.48 14 24C14 29.52 18.48 34 24 34C29.52 34 34 29.52 34 24C34 18.48 29.52 14 24 14ZM24 32C19.58 32 16 28.42 16 24C16 19.58 19.58 16 24 16C28.42 16 32 19.58 32 24C32 28.42 28.42 32 24 32Z" fill="white"/>
            <path d="M25 19H23V25H29V23H25V19Z" fill="white"/>
          </svg>
          {buttonText}
        </>
      )}
    </button>
  );
};

export default PaymentButton;
