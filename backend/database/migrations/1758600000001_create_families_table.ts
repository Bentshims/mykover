import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'families'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('owner_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.string('code', 20).notNullable().unique()
      table.enum('plan_type', ['basique', 'libota', 'libota_plus']).notNullable()
      table.enum('payment_status', ['pending', 'paid', 'failed']).defaultTo('pending')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

