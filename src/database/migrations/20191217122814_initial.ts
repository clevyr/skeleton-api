import * as Knex from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('username').unique();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.enum('status', ['pending', 'active', 'disabled']).notNullable();
  });

  await knex.schema.createTable('note', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('user');
  await knex.schema.dropTable('note');
}
