/**
 * Paystack Service
 * Handles all Paystack payment operations
 */

import { authService } from './authService';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const paystackService = {
  /**
   * Initialize payment with Paystack
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment initialization response
   */
  async initializePayment(paymentData) {
    try {
      const token = await authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in first.');
      }
      
      const response = await fetch(`${API_BASE_URL}/payments/paystack/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to initialize payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment initialization error:', error);
      throw error;
    }
  },

  /**
   * Verify payment after Paystack redirect
   * @param {string} reference - Paystack payment reference
   * @returns {Promise<Object>} Verification response
   */
  async verifyPayment(reference) {
    try {
      const token = await authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in first.');
      }
      
      const response = await fetch(`${API_BASE_URL}/payments/paystack/verify/${reference}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  },

  /**
   * Get user payment history
   * @returns {Promise<Array>} List of user payments
   */
  async getPaymentHistory() {
    try {
      const token = await authService.getToken();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in first.');
      }
      
      const response = await fetch(`${API_BASE_URL}/payments/history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment history error:', error);
      throw error;
    }
  },

  /**
   * Load Paystack script
   * @returns {Promise<void>}
   */
  async loadPaystackScript() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Paystack'));
      document.body.appendChild(script);
    });
  },

  /**
   * Open Paystack payment popup
   * @param {Object} options - Paystack options
   * @returns {Promise<Object>} Payment result
   */
  async openPaystackPopup(options) {
    try {
      // Ensure Paystack is loaded
      if (!window.PaystackPop) {
        await this.loadPaystackScript();
      }

      return new Promise((resolve, reject) => {
        const handler = window.PaystackPop.setup({
          ...options,
          onClose: () => {
            reject(new Error('Payment window closed'));
          },
          onSuccess: (response) => {
            resolve(response);
          },
        });
        handler.openIframe();
      });
    } catch (error) {
      console.error('Paystack popup error:', error);
      throw error;
    }
  },
};
