import env from '#start/env'
import { defineConfig } from '@adonisjs/cors'

/**
 * Configuration options to tweak the CORS policy. The following
 * options are documented on the official documentation website.
 *
 * https://docs.adonisjs.com/guides/security/cors
 */
const corsConfig = defineConfig({
  enabled: true,
  // En production, restreindre aux origines autorisées
  origin: env.get('NODE_ENV') === 'production' 
    ? (origin) => {
        // Liste blanche des origines autorisées
        const allowed = [
          'https://mykover-production.up.railway.app',
          'mykover://', // Deep linking
        ]
        // Permettre Expo en développement
        if (origin?.startsWith('exp://') || origin?.startsWith('mykover://')) {
          return true
        }
        return allowed.some(url => origin?.includes(url))
      }
    : true, // Développement: autoriser toutes les origines
  methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE'],
  headers: true,
  exposeHeaders: ['Authorization'],
  credentials: true,
  maxAge: 90,
})

export default corsConfig
