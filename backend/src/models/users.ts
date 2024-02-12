import { int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

// https://orm.drizzle.team/docs/sql-schema-declaration
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 256 }),
  password: varchar('password', { length: 256 })
  // TODO complete
}, (users) => ({
  nameIndex: uniqueIndex('username_idx').on(users.username),
}));

export type User = typeof users.$inferInsert;
