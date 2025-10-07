import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Family from './family.js'

export default class Payment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare familyId: string

  @column()
  declare amount: number

  @column()
  declare transactionRef: string

  @column()
  declare method: 'mobile_money' | 'bank_card'

  @column()
  declare status: 'pending' | 'success' | 'failed'

  @column()
  declare rawResponse: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Family, { foreignKey: 'familyId' })
  declare family: BelongsTo<typeof Family>
}

