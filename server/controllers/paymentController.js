const axios = require('axios');

const initiateKhaltiPayment = async (req, res) => {
  try {
    const { amount, orderId, customerInfo } = req.body;
    
    const payload = {
      return_url: "http://localhost:3000/payment/verify", // Frontend callback URL
      website_url: "http://localhost:3000",
      amount: amount * 100, // Convert to paisa
      purchase_order_id: orderId,
      purchase_order_name: `Order #${orderId}`,
      customer_info: customerInfo
    };

    const response = await axios.post(
      `${process.env.KHALTI_API_URL}/epayment/initiate/`,
      payload,
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Khalti payment initiation error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.response?.data || error.message
    });
  }
};

const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx } = req.body;
    
    const response = await axios.post(
      `${process.env.KHALTI_API_URL}/epayment/lookup/`,
      { pidx },
      {
        headers: {
          'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Khalti payment verification error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.response?.data || error.message
    });
  }
};

module.exports = {
  initiateKhaltiPayment,
  verifyKhaltiPayment
};