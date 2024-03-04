import { int, mysqlTable, uniqueIndex, varchar, float } from 'drizzle-orm/mysql-core';

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
 *        email:
 *          type: string
 *          description: The email of a user
 *          example: email@email.com
 *        name:
 *          type: string
 *          description: The name of a user
 *          example: jean-papa Juanpadre
 *         age:
 *           type: integer
 *           description: The age of a user
 *           example: 30
 *         height:
 *           type: number
 *           format: float
 *           description: The height of a user in cm
 *           example: 180.5
 *         weight:
 *           type: number
 *           format: float
 *           description: The weight of a user in kg
 *           example: 75.5
 *         sex:
 *           type: string
 *           description: The sex of a user
 *           example: male
 *         description:
 *           type: string
 *           description: The description of a user
 *           example: A brief description about the user
 */
export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 256 }),
  password: varchar('password', { length: 72 }),
  email: varchar('email', { length: 256 }),
  name: varchar('name', { length: 256 }),

  age: int('age'),
  height: float('height'),
  weight: float('weight'),
  sex: varchar('sex', { length: 6 }),
  description: varchar('description', { length: 1024 }),

  trainerId: int('trainerId'),
}, (users) => ({
  nameIndex: uniqueIndex('username_idx').on(users.username),
}));

export type User = typeof users.$inferInsert;