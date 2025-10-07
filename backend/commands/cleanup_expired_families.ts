import { BaseCommand } from '@adonisjs/core/ace'
import { CommandOptions } from '@adonisjs/core/types/ace'
import Family from '#models/family'
import { DateTime } from 'luxon'

export default class CleanupExpiredFamilies extends BaseCommand {
  static commandName = 'cleanup:expired-families'
  static description = 'Supprime les familles avec paiement échoué ou expirées (>1 an)'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('🧹 Démarrage du nettoyage des familles expirées...')

    const oneYearAgo = DateTime.now().minus({ years: 1 })

    try {
      // Familles avec paiement échoué
      const failedFamilies = await Family.query()
        .where('paymentStatus', 'failed')
        .preload('members')

      // Familles expirées (créées il y a plus d'1 an avec paiement réussi)
      const expiredFamilies = await Family.query()
        .where('createdAt', '<', oneYearAgo.toSQL())
        .where('paymentStatus', 'paid')
        .preload('members')

      const totalToDelete = failedFamilies.length + expiredFamilies.length

      if (totalToDelete === 0) {
        this.logger.info('✅ Aucune famille à supprimer')
        return
      }

      // Suppression (cascade sur members et payments via FK)
      for (const family of [...failedFamilies, ...expiredFamilies]) {
        await family.delete()
        this.logger.info(`🗑️  Famille ${family.code} supprimée (${family.paymentStatus})`)
      }

      this.logger.success(`✅ ${totalToDelete} famille(s) supprimée(s)`)
    } catch (error) {
      this.logger.error('❌ Erreur lors du nettoyage:', error)
      this.exitCode = 1
    }
  }
}

