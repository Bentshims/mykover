import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from './user.js'
import FamilyMember from './family_member.js'
import Payment from './payment.js'

export default class Family extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare ownerId: string

  @column()
  declare code: string

  @column()
  declare planType: 'basique' | 'libota' | 'libota_plus'

  @column()
  declare paymentStatus: 'pending' | 'paid' | 'failed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => FamilyMember, { foreignKey: 'familyId' })
  declare members: HasMany<typeof FamilyMember>

  @hasMany(() => Payment, { foreignKey: 'familyId' })
  declare payments: HasMany<typeof Payment>

  // Génération du code famille unique
  static generateCode(): string {
    const year = DateTime.now().year
    const random = Math.floor(100000 + Math.random() * 900000)
    return `LIB-${year}-${random}`
  }

  // Limites de membres par plan
  static PLAN_LIMITS = {
    basique: { min: 1, max: 1 },
    libota: { min: 2, max: 3 },
    libota_plus: { min: 2, max: 5 }
  }

  // Prix par plan
  static PLAN_PRICES = {
    basique: 15,
    libota: 30,
    libota_plus: 50
  }
}

