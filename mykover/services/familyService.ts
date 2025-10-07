import api from './api'

export interface MemberData {
  firstName: string
  lastName: string
  birthDate: string // ISO format
  isSick: boolean
  photoUrl: string
  photoPublicId?: string
}

export interface CreateFamilyData {
  planType: 'basique' | 'libota' | 'libota_plus'
  members: MemberData[]
}

export interface FamilyResponse {
  success: boolean
  message?: string
  data?: {
    family: {
      id: string
      code: string
      planType: string
      paymentStatus: string
    }
    members: Array<{
      id: string
      firstName: string
      lastName: string
      birthDate: string
      isSick: boolean
      photoUrl: string
    }>
  }
  error?: string
}

export interface InitiatePaymentResponse {
  success: boolean
  message?: string
  data?: {
    transactionId: string
    paymentUrl: string
    amount: number
    currency: string
  }
  error?: string
}

export interface VerifyPaymentResponse {
  success: boolean
  data?: {
    status: 'pending' | 'success' | 'failed'
    transactionId: string
    familyCode: string
  }
  error?: string
}

class FamilyService {
  async createFamily(data: CreateFamilyData): Promise<FamilyResponse> {
    try {
      const response = await api.post('/api/families', data)
      return response.data
    } catch (error: any) {
      console.error('Create family error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur création famille',
      }
    }
  }

  async initiatePayment(familyId: string): Promise<InitiatePaymentResponse> {
    try {
      const response = await api.post('/api/payments/initiate', { familyId })
      return response.data
    } catch (error: any) {
      console.error('Initiate payment error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur initiation paiement',
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<VerifyPaymentResponse> {
    try {
      const response = await api.post('/api/payments/verify', { transaction_id: transactionId })
      return response.data
    } catch (error: any) {
      console.error('Verify payment error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur vérification paiement',
      }
    }
  }

  async getFamilyByCode(code: string) {
    try {
      const response = await api.get(`/api/families/${code}`)
      return response.data
    } catch (error: any) {
      console.error('Get family error:', error)
      return {
        success: false,
        error: error.response?.data?.message || 'Famille introuvable',
      }
    }
  }
}

export const familyService = new FamilyService()

