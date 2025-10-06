import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator, forgotPasswordValidator } from '#validators/auth'
import { DateTime } from 'luxon'
import GoogleService from '#services/google_service'

export default class AuthController {
  /**
   * SIGNUP - Inscription d'un nouvel utilisateur
   */
  async signup({ request, response }: HttpContext) {
    console.log('[SIGNUP] Début inscription')
    
    try {
      // 1. Validation des données
      const data = await request.validateUsing(registerValidator)
      console.log('[SIGNUP] Données validées:', { 
        phone: data.phone, 
        email: data.email,
        fullname: data.fullname 
      })

      // 2. Créer l'utilisateur (le hook @beforeSave hashera automatiquement le password)
      const user = await User.create({
        fullname: data.fullname,
        phone: data.phone,
        email: data.email,
        birth_date: DateTime.fromJSDate(data.birth_date),
        password: data.password, // Le password sera hashé automatiquement par @beforeSave
        email_verified: false,
        google_id: null
      })
      console.log('[SIGNUP] Utilisateur créé:', user.id)

      // 3. Créer un access token
      const token = await User.accessTokens.create(user)
      console.log('[SIGNUP] Access token créé')

      return response.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: {
          user: {
            id: user.id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            email_verified: user.email_verified
          },
          token: token.value!.release()
        }
      })
    } catch (error) {
      console.error('[SIGNUP] Erreur:', error)
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de l\'inscription',
        errors: error.messages || error.message
      })
    }
  }

  /**
   * LOGIN - Connexion avec téléphone et mot de passe
   */
  async login({ request, response }: HttpContext) {
    console.log('[LOGIN] Début connexion')
    
    try {
      // 1. Validation
      const { phone, password } = await request.validateUsing(loginValidator)
      console.log('[LOGIN] Données validées:', { phone })

      // 2. Chercher l'utilisateur par téléphone
      const user = await User.query().where('phone', phone).first()
      console.log('[LOGIN] Utilisateur trouvé:', user ? user.id : 'non trouvé')
      
      if (!user) {
        console.log('[LOGIN] Échec - utilisateur inexistant')
        return response.status(401).json({
          success: false,
          message: 'Numéro de téléphone ou mot de passe incorrect'
        })
      }

      // 3. Vérifier le mot de passe (comparaison directe - SANS HACHAGE)
      console.log('[LOGIN] Vérification du mot de passe...')
      if (user.password !== password) {
        console.log('[LOGIN] Échec - mot de passe incorrect')
        return response.status(401).json({
          success: false,
          message: 'Numéro de téléphone ou mot de passe incorrect'
        })
      }
      console.log('[LOGIN] Mot de passe correct')

      // 4. Créer un access token
      const token = await User.accessTokens.create(user)
      console.log('[LOGIN] Access token créé')

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
          token: token.value!.release()
        }
      })
    } catch (error) {
      console.error('[LOGIN] Erreur:', error)
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de la connexion',
        errors: error.messages || error.message
      })
    }
  }

  /**
   * LOGOUT - Déconnexion (révoque le token)
   */
  async logout({ auth, response }: HttpContext) {
    console.log('[LOGOUT] Début déconnexion')
    
    try {
      const user = auth.getUserOrFail()
      console.log('[LOGOUT] Utilisateur:', user.id)
      
      // Révoquer le token actuel
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
      console.log('[LOGOUT] Token révoqué')

      return response.json({
        success: true,
        message: 'Déconnexion réussie'
      })
    } catch (error) {
      console.error('[LOGOUT] Erreur:', error)
      return response.status(401).json({
        success: false,
        message: 'Non autorisé'
      })
    }
  }

  /**
   * ME - Obtenir les infos de l'utilisateur connecté
   */
  async me({ auth, response }: HttpContext) {
    console.log('[ME] Récupération infos utilisateur')
    
    try {
      const user = auth.getUserOrFail()
      console.log('[ME] Utilisateur:', user.id)

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
      console.error('[ME] Erreur:', error)
      return response.status(401).json({
        success: false,
        message: 'Non autorisé'
      })
    }
  }

  /**
   * FORGOT PASSWORD - Envoyer un email de réinitialisation
   */
  async forgotPassword({ request, response }: HttpContext) {
    console.log('[FORGOT] Début forgot password')
    
    try {
      const { email } = await request.validateUsing(forgotPasswordValidator)
      console.log('[FORGOT] Email:', email)

      const user = await User.query().where('email', email).first()
      
      if (!user) {
        console.log('[FORGOT] Utilisateur non trouvé')
        // Pour des raisons de sécurité, on renvoie toujours succès
        return response.json({
          success: true,
          message: 'Si cet email existe, un lien de réinitialisation a été envoyé'
        })
      }

      console.log('[FORGOT] Utilisateur trouvé:', user.id)

      // Générer un token de réinitialisation (access token temporaire)
      const resetToken = await User.accessTokens.create(user, ['reset:password'], {
        expiresIn: '1 hour'
      })
      console.log('[FORGOT] Token de reset créé:', resetToken.value!.release())

      // TODO: Envoyer l'email (Gmail configuration nécessaire)
      // Pour l'instant, on retourne juste le token dans la réponse (DEV ONLY)
      console.log('[FORGOT] Email non configuré - retour du token en dev mode')

      return response.json({
        success: true,
        message: 'Si cet email existe, un lien de réinitialisation a été envoyé',
        // DEV ONLY - À retirer en production
        resetToken: resetToken.value!.release()
      })
    } catch (error) {
      console.error('[FORGOT] Erreur:', error)
      return response.status(400).json({
        success: false,
        message: 'Erreur lors de la demande',
        errors: error.messages || error.message
      })
    }
  }

  /**
   * GOOGLE AUTH - Rediriger vers Google OAuth
   */
  async googleAuth({ response }: HttpContext) {
    console.log('[GOOGLE_AUTH] Début authentification Google')
    
    try {
      const authUrl = GoogleService.getAuthUrl()
      console.log('[GOOGLE_AUTH] URL générée:', authUrl)
      
      return response.redirect(authUrl)
    } catch (error) {
      console.error('[GOOGLE_AUTH] Erreur:', error)
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de la redirection vers Google'
      })
    }
  }

  /**
   * GOOGLE CALLBACK - Traiter le retour de Google OAuth
   */
  async googleCallback({ request, response }: HttpContext) {
    console.log('[GOOGLE_CALLBACK] Début callback Google')
    
    try {
      const { code, error } = request.qs()
      
      if (error) {
        console.error('[GOOGLE_CALLBACK] Erreur OAuth:', error)
        return response.status(400).json({
          success: false,
          message: 'Authentification Google annulée ou échouée'
        })
      }

      if (!code) {
        console.error('[GOOGLE_CALLBACK] Code manquant')
        return response.status(400).json({
          success: false,
          message: 'Code d\'autorisation manquant'
        })
      }

      console.log('[GOOGLE_CALLBACK] Code reçu')

      // 1. Échanger le code contre un access token
      const accessToken = await GoogleService.exchangeCodeForToken(code)
      if (!accessToken) {
        console.error('[GOOGLE_CALLBACK] Échec échange token')
        return response.status(400).json({
          success: false,
          message: 'Impossible d\'obtenir le token d\'accès'
        })
      }

      // 2. Récupérer les infos utilisateur
      const googleUser = await GoogleService.getUserInfo(accessToken)
      if (!googleUser) {
        console.error('[GOOGLE_CALLBACK] Échec récupération infos utilisateur')
        return response.status(400).json({
          success: false,
          message: 'Impossible de récupérer les informations utilisateur'
        })
      }

      console.log('[GOOGLE_CALLBACK] Infos utilisateur récupérées:', googleUser.email)

      // 3. Trouver ou créer l'utilisateur
      const user = await GoogleService.findOrCreateUser(googleUser)
      console.log('[GOOGLE_CALLBACK] Utilisateur trouvé/créé:', user.id)

      // 4. Créer un access token pour l'app
      const token = await User.accessTokens.create(user)
      console.log('[GOOGLE_CALLBACK] Access token créé')

      // 5. Rediriger vers le frontend avec le token
      // Use the same host as the request to ensure mobile compatibility
      const host = request.header('host') || 'localhost:3333'
      const protocol = request.header('x-forwarded-proto') || 'http'
      const frontendUrl = `${protocol}://${host.replace('3333', '8081')}/auth/google/success?token=${token.value!.release()}`
      return response.redirect(frontendUrl)
      
    } catch (error) {
      console.error('[GOOGLE_CALLBACK] Erreur:', error)
      return response.status(500).json({
        success: false,
        message: 'Erreur lors de l\'authentification Google',
        errors: error.message
      })
    }
  }
}

