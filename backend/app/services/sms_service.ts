import env from '#start/env'

export default class SmsService {
  static async sendOtp(phone: string, code: string, fullname: string): Promise<boolean> {
    try {
      // Mock implementation - remplacer par vraie intégration SMS (Twilio, etc.)
      console.log(`[SMS] Envoi OTP au ${phone}`)
      console.log(`Bonjour ${fullname}, votre code de vérification est: ${code}`)
      console.log(`API Key: ${env.get('SMS_PROVIDER_API_KEY')}`)
      
      // Validation format phone RDC
      if (!phone.match(/^\+243[89][0-9]{8}$/)) {
        throw new Error('Format phone invalide pour RDC')
      }
      
      // Simulation du délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 150))
      
      return true
    } catch (error) {
      console.error('Erreur envoi SMS:', error)
      return false
    }
  }

  static async sendPasswordReset(phone: string, code: string, fullname: string): Promise<boolean> {
    try {
      // Mock implementation - remplacer par vraie intégration SMS
      console.log(`[SMS] Envoi reset password au ${phone}`)
      console.log(`Bonjour ${fullname}, votre code de réinitialisation est: ${code}`)
      
      if (!phone.match(/^\+243[89][0-9]{8}$/)) {
        throw new Error('Format phone invalide pour RDC')
      }
      
      await new Promise((resolve) => setTimeout(resolve, 150))
      
      return true
    } catch (error) {
      console.error('Erreur envoi SMS reset:', error)
      return false
    }
  }
}
