import env from '#start/env'
import User from '#models/user'
import { v4 as uuidv4 } from 'uuid'
import { DateTime } from 'luxon'
import { google } from 'googleapis'

interface GoogleUserInfo {
  id: string
  email: string
  given_name: string
  family_name: string
  picture?: string
}

export default class GoogleService {
  private static getOAuth2Client() {
    return new google.auth.OAuth2(
      env.get('GOOGLE_CLIENT_ID'),
      env.get('GOOGLE_CLIENT_SECRET'),
      env.get('GOOGLE_REDIRECT_URI')
    )
  }

  static getAuthUrl(): string {
    const oauth2Client = this.getOAuth2Client()
    
    return oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['email', 'profile'],
      include_granted_scopes: true
    })
  }

  static async exchangeCodeForToken(code: string): Promise<string | null> {
    try {
      console.log(`[GOOGLE] Exchange code: ${code}`)
      
      const oauth2Client = this.getOAuth2Client()
      const { tokens } = await oauth2Client.getToken(code)
      
      if (!tokens.access_token) {
        console.error('[GOOGLE] No access token received')
        return null
      }
      
      console.log('[GOOGLE] Access token obtained successfully')
      return tokens.access_token
    } catch (error) {
      console.error('Erreur échange code Google:', error)
      return null
    }
  }

  static async getUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
    try {
      console.log(`[GOOGLE] Get user info avec token`)
      
      const oauth2Client = this.getOAuth2Client()
      oauth2Client.setCredentials({ access_token: accessToken })
      
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
      const { data } = await oauth2.userinfo.get()
      
      if (!data.id || !data.email) {
        console.error('[GOOGLE] Missing required user data')
        return null
      }
      
      console.log('[GOOGLE] User info retrieved successfully')
      return {
        id: data.id,
        email: data.email,
        given_name: data.given_name || '',
        family_name: data.family_name || '',
        picture: data.picture
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
