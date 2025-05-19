import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { verifyKhaltiPayment } from '../utils/khalti';

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useAppContext();
  const [status, setStatus] = useState({
    loading: true,
    message: 'Verifying payment...',
    error: null
  });

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const pidx = searchParams.get('pidx');
        const orderId = sessionStorage.getItem('pendingOrderId');

        if (!pidx || !orderId) {
          throw new Error('Missing payment or order information');
        }

        setStatus({
          loading: true,
          message: 'Verifying payment with Khalti...',
          error: null
        });

        // In test mode, we'll simulate a successful verification after a short delay
        if (import.meta.env.VITE_KHALTI_PUBLIC_KEY?.startsWith('test_')) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Simulate successful verification for test mode
          clearCart();
          sessionStorage.removeItem('pendingOrderId');
          
          setStatus({
            loading: false,
            message: 'Payment verified successfully!',
            error: null
          });
          
          toast.success('Payment successful!');
          setTimeout(() => navigate('/profile/orders'), 2000);
          return;
        }


        // For production, use the actual Khalti verification
        const verification = await verifyKhaltiPayment(pidx);

        if (verification.status === 'Completed') {
          clearCart();
          sessionStorage.removeItem('pendingOrderId');
          
          // Here you would typically update your backend about the successful payment
          // await updateOrderStatus(orderId, 'paid', pidx);
          
          setStatus({
            loading: false,
            message: 'Payment verified successfully!',
            error: null
          });
          
          toast.success('Payment successful!');
          setTimeout(() => navigate('/profile/orders'), 2000);
        } else {
          throw new Error('Payment not completed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setStatus({
          loading: false,
          message: 'Payment verification failed',
          error: error.message || 'An error occurred during payment verification'
        });
        toast.error('Payment verification failed');
        setTimeout(() => navigate('/checkout'), 3000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center">
          {status.loading ? (
            <>
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-800">Processing Payment</h2>
              <p className="mt-2 text-gray-600">{status.message}</p>
              <p className="mt-4 text-sm text-gray-500">Please wait while we verify your payment...</p>
            </>
          ) : status.error ? (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Payment Failed</h2>
              <p className="mt-2 text-red-600">{status.error}</p>
              <p className="mt-4 text-sm text-gray-500">You will be redirected back to checkout shortly.</p>
            </>
          ) : (
            <>
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-xl font-semibold text-gray-800">Payment Successful!</h2>
              <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
              <p className="mt-4 text-sm text-gray-500">Redirecting to your orders...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;