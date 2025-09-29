import type { HttpContext } from '@adonisjs/core/http'
import AuthService from '#services/auth_service'
import GoogleService from '#services/google_service'
import { registerValidator } from '#validators/register_validator'
import { loginValidator } from '#validators/login_validator'
import { forgotPasswordValidator, resetPasswordValidator } from '#validators/reset_validator'

export default class AuthController {
  async register({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(registerValidator)
      const { user, token } = await AuthService.register(payload)

      return response.status(201).json({
        success: true,
        message: 'Inscription réussie. Vérifiez vos OTP par email et SMS.',
        data: {
          user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            email_verified: user.email_verified
          },
          token
        }
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de l\'inscription',
        errors: error.messages || error.message
      })
    }
  }

  async login({ request, response }: HttpContext) {
    try {
      const { identifier, password } = await request.validateUsing(loginValidator)
      const result = await AuthService.login(identifier, password)

      if (!result) {
        return response.status(401).json({
          success: false,
          message: 'Identifiants incorrects'
        })
      }

      const { user, token } = result

      return response.json({
        success: true,
        message: 'Connexion réussie',
        data: {
          user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            email_verified: user.email_verified
          },
          token
        }
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de la connexion',
        errors: error.messages || error.message
      })
    }
  }

  async googleAuth({ response }: HttpContext) {
    const authUrl = GoogleService.getAuthUrl()
    return response.redirect(authUrl)
  }

  async googleCallback({ request, response }: HttpContext) {
    try {
      const { code } = request.qs()
      
      if (!code) {
        return response.status(400).json({
          success: false,
          message: 'Code d\'autorisation manquant'
        })
      }

      const accessToken = await GoogleService.exchangeCodeForToken(code)
      if (!accessToken) {
        return response.status(400).json({
          success: false,
          message: 'Erreur lors de l\'échange du code'
        })
      }

      const googleUser = await GoogleService.getUserInfo(accessToken)
      if (!googleUser) {
        return response.status(400).json({
          success: false,
          message: 'Erreur lors de la récupération des informations utilisateur'
        })
      }

      const user = await GoogleService.findOrCreateUser(googleUser)
      const token = AuthService.generateJwtToken(user)

      return response.json({
        success: true,
        message: 'Connexion Google réussie',
        data: {
          user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            email_verified: user.email_verified
          },
          token
        }
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de l\'authentification Google',
        error: error.message
      })
    }
  }

  async forgotPassword({ request, response }: HttpContext) {
    try {
      const { identifier } = await request.validateUsing(forgotPasswordValidator)
      const success = await AuthService.forgotPassword(identifier)

      if (!success) {
        return response.status(404).json({
          success: false,
          message: 'Utilisateur non trouvé'
        })
      }

      return response.json({
        success: true,
        message: 'Codes de réinitialisation envoyés par email et SMS'
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de la demande de réinitialisation',
        errors: error.messages || error.message
      })
    }
  }

  async resetPassword({ request, response }: HttpContext) {
    try {
      const { identifier, otp, new_password } = await request.validateUsing(resetPasswordValidator)
      const result = await AuthService.resetPassword(identifier, otp, new_password)

      if (!result.success) {
        return response.status(400).json({
          success: false,
          message: 'Code OTP invalide ou expiré'
        })
      }

      const token = AuthService.generateJwtToken(result.user!)

      return response.json({
        success: true,
        message: 'Mot de passe réinitialisé avec succès',
        data: {
          token
        }
      })
    } catch (error) {
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de la réinitialisation',
        errors: error.messages || error.message
      })
    }
  }

  async logout({ response }: HttpContext) {
    // Avec JWT stateless, la déconnexion se fait côté client
    // Pour une sécurité renforcée, implémenter une blacklist de tokens
    return response.json({
      success: true,
      message: 'Déconnexion réussie'
    })
  }

  async me({ auth, response }: HttpContext) {
    try {
      const user = auth.user!
      return response.json({
        success: true,
        data: {
          user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            email_verified: user.email_verified,
            birth_date: user.birth_date
          }
        }
      })
    } catch (error) {
      return response.status(401).json({
        success: false,
        message: 'Non autorisé'
      })
    }
  }
}
