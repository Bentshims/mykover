/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return { hello: 'world' }
})

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

router.group(() => {
  // Routes publiques
  router.post('/signup', '#controllers/auth_controller.signup')
  router.post('/login', '#controllers/auth_controller.login')
  router.post('/forgot-password', '#controllers/auth_controller.forgotPassword')
  
  // Google OAuth routes
  router.get('/google', '#controllers/auth_controller.googleAuth')
  router.get('/google/callback', '#controllers/auth_controller.googleCallback')
  
  // Routes protégées (nécessitent un access token)
  router
    .group(() => {
      router.post('/logout', '#controllers/auth_controller.logout')
      router.get('/me', '#controllers/auth_controller.me')
    })
    .use(middleware.auth())
  
}).prefix('/api/auth')
