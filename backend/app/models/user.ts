import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare fullname: string

  @column()
  declare phone: string

  @column()
  declare email: string

  @column.date()
  declare birth_date: DateTime

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare google_id: string | null

  @column()
  declare email_verified: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static accessTokens = DbAccessTokensProvider.forModel(User)
}

