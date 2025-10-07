/*
|--------------------------------------------------------------------------
| Scheduler
|--------------------------------------------------------------------------
|
| Configuration du scheduler pour les tâches cron automatiques
|
*/

import scheduler from 'adonisjs-scheduler/services/scheduler'
import CleanupExpiredFamilies from '#commands/cleanup_expired_families'

// Nettoyage quotidien des familles expirées (tous les jours à minuit)
scheduler
  .command(CleanupExpiredFamilies)
  .everyDayAt('00:00')
  .onError((error) => {
    console.error('Erreur scheduler cleanup:', error)
  })

