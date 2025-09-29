import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import AuthService from '#services/auth_service'
import User from '#models/user'

export default class JwtAuthMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const authHeader = ctx.request.header('authorization')
    
    if (!authHeader) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Token d\'authentification manquant'
      })
    }

    const token = authHeader.replace('Bearer ', '')
    
    if (!token) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Token d\'authentification invalide'
      })
    }

    try {
      const payload = AuthService.verifyJwtToken(token)
      
      if (!payload) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Token expiré ou invalide'
        })
      }

      // Récupérer l'utilisateur depuis la base de données
      const user = await User.find(payload.userId)
      
      if (!user) {
        return ctx.response.status(401).json({
          success: false,
          message: 'Utilisateur non trouvé'
        })
      }

      // Attacher l'utilisateur au contexte
      ;(ctx as any).auth = { user }
      
      await next()
    } catch (error) {
      return ctx.response.status(401).json({
        success: false,
        message: 'Erreur d\'authentification'
      })
    }
  }
}
