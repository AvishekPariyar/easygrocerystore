// Khalti Payment Integration

/**
 * Initialize Khalti payment
 * @param {Object} config - Payment configuration
 * @param {number} config.amount - Amount in paisa (e.g., 1000 for Rs. 10)
 * @param {string} config.purchaseOrderId - Unique order ID
 * @param {string} config.purchaseOrderName - Order description
 * @param {Object} config.customer - Customer information
 * @param {string} config.customer.name - Customer name
 * @param {string} config.customer.email - Customer email
 * @param {string} config.customer.phone - Customer phone
 * @param {Function} onSuccess - Callback on successful payment
 * @param {Function} onError - Callback on payment error
 */
const initKhaltiPayment = async (config, onSuccess, onError) => {
  try {
    // Validate required fields
    if (!config.amount || !config.purchaseOrderId || !config.purchaseOrderName || 
        !config.customer?.name || !config.customer?.email || !config.customer?.phone) {
      throw new Error('Missing required payment parameters');
    }

    // Ensure amount is a number and at least 1000 (Rs. 10)
    const amount = Number(config.amount);
    if (isNaN(amount) || amount < 1000) {
      throw new Error('Amount must be at least 1000 (Rs. 10)');
    }

    // Format phone number (remove any non-numeric characters and ensure it starts with 98 or 97)
    const phone = String(config.customer.phone).replace(/\D/g, '');
    if (!/^(98|97)\d{8}$/.test(phone)) {
      throw new Error('Phone number must be a valid Nepali number starting with 98 or 97');
    }

    const payload = {
      return_url: `${window.location.origin}/payment/verify`,
      website_url: window.location.origin,
      amount: amount,
      purchase_order_id: String(config.purchaseOrderId).substring(0, 64), // Max 64 chars
      purchase_order_name: String(config.purchaseOrderName).substring(0, 64), // Max 64 chars
      customer_info: {
        name: String(config.customer.name).substring(0, 100), // Max 100 chars
        email: String(config.customer.email).substring(0, 100), // Max 100 chars
        phone: phone,
      },
    };

    console.log('Initiating Khalti payment with payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://a.khalti.com/api/v2/epayment/initiate/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${import.meta.env.VITE_KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Khalti API response:', data);

    if (!response.ok) {
      const errorMessage = data.detail || 
                         (data.error ? JSON.stringify(data.error) : 'Failed to initialize payment');
      throw new Error(errorMessage);
    }

    if (!data.payment_url) {
      throw new Error('Invalid response from payment gateway');
    }

    // Store the pidx in session storage for verification
    sessionStorage.setItem('khalti_pidx', data.pidx);
    
    // Redirect to Khalti payment page
    window.location.href = data.payment_url;
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error('Payment error:', error);
    const errorMessage = error.message || 'Failed to process payment';
    if (onError) onError(new Error(errorMessage));
  }
};

/**
 * Verify Khalti payment
 * @param {string} pidx - Payment ID received from Khalti
 * @returns {Promise<Object>} - Payment verification result
 */
const verifyKhaltiPayment = async (pidx) => {
  try {
    const response = await fetch('https://a.khalti.com/api/v2/epayment/lookup/', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${import.meta.env.VITE_KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pidx }),
    });

    return await response.json();
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

export { initKhaltiPayment, verifyKhaltiPayment };
