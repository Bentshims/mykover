import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.string('fullname').notNullable()
      table.string('phone').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.date('birth_date').notNullable()
      table.string('password').notNullable()
      table.string('google_id').nullable().unique()
      table.boolean('email_verified').defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}