/**
 * Extension des types pour l'authentification
 */

import User from '#models/user'

declare module '@adonisjs/core/http' {
  export interface HttpContext {
    auth: {
      user: User
    }
  }
}



