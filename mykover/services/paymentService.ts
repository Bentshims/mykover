import api from './api';

export interface PaymentInitiationData {
  amount: number;
  currency?: string;
  description?: string;
  customer_id?: string;
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number?: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  customer_state?: string;
  customer_zip_code?: string;
  metadata?: string;
  channels?: string;
  lang?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_id: string;
    payment_url: string;
    payment_token: string;
    amount: number;
    currency: string;
    description: string;
  };
  error?: string;
  code?: string;
}

export interface PaymentVerificationResponse {
  success: boolean;
  message: string;
  data?: {
    transaction_id: string;
    status: string;
    amount: number;
    currency: string;
    operator_id?: string;
    payment_method?: string;
    payment_date?: string;
    description?: string;
  };
  error?: string;
}

class PaymentService {
  /**
   * Initiate a new payment with CinetPay
   */
  async initiatePayment(paymentData: PaymentInitiationData): Promise<PaymentInitiationResponse> {
    try {
      const response = await api.post('/api/payments/initiate', paymentData);
      return response.data;
    } catch (error: any) {
      console.error('Payment initiation error:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Failed to initiate payment',
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Verify payment status
   */
  async verifyPayment(transactionId: string): Promise<PaymentVerificationResponse> {
    try {
      const response = await api.post('/api/payments/verify', {
        transaction_id: transactionId
      });
      return response.data;
    } catch (error: any) {
      console.error('Payment verification error:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Failed to verify payment',
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(): Promise<any> {
    try {
      const response = await api.get('/api/payments/history');
      return response.data;
    } catch (error: any) {
      console.error('Payment history error:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Failed to get payment history',
        error: error.message || 'Network error'
      };
    }
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId: string): Promise<any> {
    try {
      const response = await api.get(`/api/payments/transaction/${transactionId}`);
      return response.data;
    } catch (error: any) {
      console.error('Get transaction error:', error);
      
      if (error.response?.data) {
        return error.response.data;
      }
      
      return {
        success: false,
        message: 'Failed to get transaction details',
        error: error.message || 'Network error'
      };
    }
  }
}

export const paymentService = new PaymentService();
