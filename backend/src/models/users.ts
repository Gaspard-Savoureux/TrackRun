import { int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of a user
 *           example: jean-papa
 *         password:
 *           type: string
 *           description: The password of a user
 *           example: voici mon mot de passe
 *         email:
 *           type: string
 *           description: The email of a user
 *           example: jeanpapa@gmail.com
 *         name: 
 *           type: string
 *           description: The name of a user
 *           example: jean-papa Juanpadre 
 * 
 */
// https://orm.drizzle.team/docs/sql-schema-declaration
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 256 }),
  password: varchar('password', { length: 72 }),    // Bcrypt limitation
  email: varchar('email', { length: 256 }),
  name: varchar('name', { length: 256 })

}, (users) => ({
  nameIndex: uniqueIndex('username_idx').on(users.username),
}));

export type User = typeof users.$inferInsert;
