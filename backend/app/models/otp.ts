import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

export default class Otp extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare user_id: string

  @column({ serializeAs: null })
  declare otp_hash: string

  @column()
  declare channel: 'email' | 'sms'

  @column()
  declare used: boolean

  @column.dateTime()
  declare expires_at: DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  declare user: BelongsTo<typeof User>

  public isExpired(): boolean {
    return this.expires_at < DateTime.now()
  }

  public isValid(): boolean {
    return !this.used && !this.isExpired()
  }
}
