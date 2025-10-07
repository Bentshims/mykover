import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'payments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary().defaultTo(this.raw('gen_random_uuid()'))
      table.uuid('family_id').notNullable().references('id').inTable('families').onDelete('CASCADE')
      table.decimal('amount', 10, 2).notNullable()
      table.string('transaction_ref').notNullable().unique()
      table.enum('method', ['mobile_money', 'bank_card']).defaultTo('mobile_money')
      table.enum('status', ['pending', 'success', 'failed']).defaultTo('pending')
      table.text('raw_response').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}

