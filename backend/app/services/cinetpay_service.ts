import env from '#start/env'
import axios from 'axios'
import crypto from 'node:crypto'

interface CinetPayInitiateParams {
  amount: number
  transactionId: string
  description: string
  customerName: string
  customerSurname: string
  customerEmail: string
  customerPhone?: string
  returnUrl: string
  notifyUrl: string
}

interface CinetPayResponse {
  code: string
  message: string
  data?: {
    payment_url: string
    payment_token: string
  }
}

export default class CinetPayService {
  private static SITE_ID = env.get('CINETPAY_SITE_ID')
  private static API_KEY = env.get('CINETPAY_API_KEY')
  private static SECRET_KEY = env.get('CINETPAY_SECRET_KEY')
  private static BASE_URL = 'https://api-checkout.cinetpay.com/v2'

  /**
   * Initie un paiement CinetPay
   */
  static async initiatePayment(params: CinetPayInitiateParams) {
    try {
      const payload = {
        apikey: this.API_KEY,
        site_id: this.SITE_ID,
        transaction_id: params.transactionId,
        amount: params.amount,
        currency: 'USD',
        description: params.description,
        customer_name: params.customerName,
        customer_surname: params.customerSurname,
        customer_email: params.customerEmail,
        customer_phone_number: params.customerPhone || '',
        notify_url: params.notifyUrl,
        return_url: params.returnUrl,
        channels: 'ALL', // Mobile Money + Cartes
        lang: 'fr',
      }

      const response = await axios.post<CinetPayResponse>(
        `${this.BASE_URL}/payment`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 30000,
        }
      )

      if (response.data.code === '201' && response.data.data) {
        return {
          success: true,
          paymentUrl: response.data.data.payment_url,
          paymentToken: response.data.data.payment_token,
        }
      }

      return {
        success: false,
        message: response.data.message || 'Erreur initiation paiement',
      }
    } catch (error: any) {
      console.error('[CinetPay] Erreur initiation:', error.response?.data || error.message)
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion à CinetPay',
      }
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  static async verifyPayment(transactionId: string) {
    try {
      const payload = {
        apikey: this.API_KEY,
        site_id: this.SITE_ID,
        transaction_id: transactionId,
      }

      const response = await axios.post(
        `${this.BASE_URL}/payment/check`,
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 15000,
        }
      )

      return {
        success: response.data.code === '00',
        status: response.data.data?.status || 'PENDING',
        data: response.data.data,
      }
    } catch (error: any) {
      console.error('[CinetPay] Erreur vérification:', error.response?.data || error.message)
      return {
        success: false,
        status: 'ERROR',
        message: error.message,
      }
    }
  }

  /**
   * Valide la signature du callback CinetPay
   */
  static validateSignature(data: Record<string, any>): boolean {
    try {
      const receivedSignature = data.signature
      if (!receivedSignature) return false

      // Construction de la signature selon la doc CinetPay
      const signatureData = `${this.SITE_ID}${data.cpm_trans_id}${data.cpm_amount}${data.cpm_currency}${this.SECRET_KEY}`
      const computedSignature = crypto.createHash('sha256').update(signatureData).digest('hex')

      return computedSignature === receivedSignature
    } catch (error) {
      console.error('[CinetPay] Erreur validation signature:', error)
      return false
    }
  }

  /**
   * Mock pour les tests (si CINETPAY_MOCK=true)
   */
  static async mockPayment(transactionId: string) {
    return {
      success: true,
      paymentUrl: `http://localhost:3333/mock-payment?transaction_id=${transactionId}`,
      paymentToken: `MOCK_${transactionId}`,
    }
  }
}

