import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Family from './family.js'

export default class FamilyMember extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare familyId: string

  @column()
  declare firstName: string

  @column()
  declare lastName: string

  @column.date()
  declare birthDate: DateTime

  @column()
  declare isSick: boolean

  @column()
  declare photoPublicId: string | null

  @column()
  declare photoUrl: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Family, { foreignKey: 'familyId' })
  declare family: BelongsTo<typeof Family>
}

