import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'otps'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('user_id').notNullable()
      table.string('otp_hash').notNullable()
      table.enum('channel', ['email', 'sms']).notNullable()
      table.boolean('used').defaultTo(false)
      table.timestamp('expires_at').notNullable()
      table.timestamp('created_at').notNullable()

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.index(['user_id', 'channel'])
      table.index(['expires_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}