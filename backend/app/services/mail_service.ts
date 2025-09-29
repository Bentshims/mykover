import env from '#start/env'

export default class MailService {
  static async sendOtp(email: string, code: string, fullname: string): Promise<boolean> {
    try {
      // Mock implementation - remplacer par vraie intégration SMTP
      console.log(`[EMAIL] Envoi OTP à ${email}`)
      console.log(`Bonjour ${fullname}, votre code de vérification est: ${code}`)
      console.log(`Configuration SMTP: ${env.get('SMTP_HOST')}:${env.get('SMTP_PORT')}`)
      
      // Simulation du délai d'envoi
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      return true
    } catch (error) {
      console.error('Erreur envoi email:', error)
      return false
    }
  }

  static async sendPasswordReset(email: string, code: string, fullname: string): Promise<boolean> {
    try {
      // Mock implementation - remplacer par vraie intégration SMTP
      console.log(`[EMAIL] Envoi reset password à ${email}`)
      console.log(`Bonjour ${fullname}, votre code de réinitialisation est: ${code}`)
      
      await new Promise((resolve) => setTimeout(resolve, 100))
      
      return true
    } catch (error) {
      console.error('Erreur envoi email reset:', error)
      return false
    }
  }
}
