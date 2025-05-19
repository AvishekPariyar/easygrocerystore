const axios = require('axios');

class KhaltiService {
  constructor() {
    this.apiUrl = process.env.KHALTI_API_URL;
    this.secretKey = process.env.KHALTI_SECRET_KEY;
  }

  async initiatePayment(orderDetails) {
    try {
      const payload = {
        return_url: "http://localhost:3000/payment/verify",
        website_url: "http://localhost:3000",
        amount: orderDetails.amount * 100, // Convert to paisa
        purchase_order_id: orderDetails.orderId,
        purchase_order_name: `Order #${orderDetails.orderId}`,
        customer_info: {
          name: orderDetails.customerInfo.name,
          email: orderDetails.customerInfo.email,
          phone: orderDetails.customerInfo.phone
        },
        amount_breakdown: [
          {
            label: "Order Amount",
            amount: orderDetails.amount * 100
          }
        ],
        product_details: orderDetails.items.map(item => ({
          identity: item._id,
          name: item.name,
          total_price: item.price * item.quantity * 100,
          quantity: item.quantity,
          unit_price: item.price * 100
        }))
      };

      const response = await axios.post(
        `${this.apiUrl}/epayment/initiate/`,
        payload,
        {
          headers: {
            'Authorization': `Key ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Khalti payment initiation error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  async verifyPayment(pidx) {
    try {
      const response = await axios.post(
        `${this.apiUrl}/epayment/lookup/`,
        { pidx },
        {
          headers: {
            'Authorization': `Key ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Khalti payment verification error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data || error.message
      };
    }
  }

  // Helper method to validate payment status
  isPaymentComplete(paymentDetails) {
    return paymentDetails.status === 'Completed';
  }
}

module.exports = new KhaltiService();