/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return { 
    message: 'Mykover API',
    version: '1.0.0',
    status: 'running'
  }
})

// Health check endpoint pour Railway
router.get('/api/health', async ({ response }) => {
  return response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  })
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

/*
|--------------------------------------------------------------------------
| Families Routes
|--------------------------------------------------------------------------
*/
router.group(() => {
  router.post('/', '#controllers/families_controller.create')
  router.get('/', '#controllers/families_controller.index')
  router.get('/:code', '#controllers/families_controller.show')
}).prefix('/api/families').use(middleware.auth())

/*
|--------------------------------------------------------------------------
| Payments Routes
|--------------------------------------------------------------------------
*/
router.group(() => {
  router.post('/initiate', '#controllers/payments_controller.initiate')
  router.post('/verify', '#controllers/payments_controller.verify')
}).prefix('/api/payments').use(middleware.auth())

// Callback CinetPay (webhook public)
router.post('/api/payments/callback', '#controllers/payments_controller.callback')
