/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import '#controllers/auth_controller'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
|
| Routes pour l'authentification avec JWT et Google OAuth2
|
*/

router.group(() => {
  // Inscription et connexion
  router.post('/register', '#controllers/auth_controller.register')
  router.post('/login', '#controllers/auth_controller.login')
  
  // Google OAuth2
  router.get('/google', '#controllers/auth_controller.googleAuth')
  router.get('/google/callback', '#controllers/auth_controller.googleCallback')
  
  // Réinitialisation mot de passe
  router.post('/forgot', '#controllers/auth_controller.forgotPassword')
  router.post('/reset', '#controllers/auth_controller.resetPassword')
  
  // Routes protégées
  router.group(() => {
    router.post('/logout', '#controllers/auth_controller.logout')
    router.get('/me', '#controllers/auth_controller.me')
  }).middleware(async () => {
    const { default: JwtAuthMiddleware } = await import('#middleware/jwt_auth_middleware')
    return new JwtAuthMiddleware()
  })
  
}).prefix('/api/auth')
