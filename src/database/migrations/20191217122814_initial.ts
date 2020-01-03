import * as Knex from 'knex';

export async function up(knex: Knex) {
  await knex.schema.createTable('user', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('name');
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.enum('status', ['pending', 'active', 'disabled']).notNullable().defaultTo('pending');
  });

  await knex.schema.createTable('note', (table) => {
    table.uuid('id').primary().notNullable();
    table.string('title').notNullable();
    table.text('content').notNullable();
    table.uuid('authorId').references('id').inTable('user');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex) {
  await knex.schema.dropTable('note');
  await knex.schema.dropTable('user');
}
