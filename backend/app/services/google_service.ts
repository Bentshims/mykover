import env from '#start/env'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'

interface GoogleUserInfo {
  id: string
  email: string
  given_name: string
  family_name: string
  picture?: string
}

export default class GoogleService {
  static getAuthUrl(): string {
    const clientId = env.get('GOOGLE_CLIENT_ID')
    const redirectUri = env.get('GOOGLE_REDIRECT_URI')
    const scope = 'email profile'
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope,
      access_type: 'offline'
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  static async exchangeCodeForToken(code: string): Promise<string | null> {
    try {
      // Mock implementation - remplacer par vraie intégration Google OAuth2
      console.log(`[GOOGLE] Exchange code: ${code}`)
      
      // Simulation d'un token Google
      return 'mock_google_access_token'
    } catch (error) {
      console.error('Erreur échange code Google:', error)
      return null
    }
  }

  static async getUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
    try {
      // Mock implementation - remplacer par vraie API Google
      console.log(`[GOOGLE] Get user info avec token: ${accessToken}`)
      
      // Simulation des données utilisateur Google
      return {
        id: 'google_user_123',
        email: 'user@gmail.com',
        given_name: 'John',
        family_name: 'Doe'
      }
    } catch (error) {
      console.error('Erreur récupération info Google:', error)
      return null
    }
  }

  static async findOrCreateUser(googleUser: GoogleUserInfo): Promise<User> {
    // Chercher utilisateur existant par google_id
    let user = await User.query().where('google_id', googleUser.id).first()
    
    if (user) {
      return user
    }

    // Chercher utilisateur existant par email
    user = await User.query().where('email', googleUser.email).first()
    
    if (user) {
      // Lier le compte Google au compte existant
      user.google_id = googleUser.id
      user.email_verified = true
      await user.save()
      return user
    }

    // Créer nouveau utilisateur
    user = await User.create({
      id: uuidv4(),
      fullname: `${googleUser.given_name} ${googleUser.family_name}`,
      email: googleUser.email,
      google_id: googleUser.id,
      email_verified: true,
      // Valeurs par défaut pour les champs requis
      phone: '', // À compléter par l'utilisateur
      birth_date: DateTime.now().minus({ years: 18 }), // Âge par défaut
      password: '' // Mot de passe vide pour OAuth
    })

    return user
  }
}
