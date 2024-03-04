import { int, mysqlTable, uniqueIndex, varchar, float } from 'drizzle-orm/mysql-core';

/**
 * @swagger
 * components:
 *   schemas:
 *     Trainer:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of a trainer
 *           example: trainer-john
 *         password:
 *           type: string
 *           description: The password of a trainer
 *           example: mysecurepassword
 *         email:
 *           type: string
 *           description: The email of a trainer
 *           example: trainer@email.com
 *         name:
 *           type: string
 *           description: The name of a trainer
 *           example: John Doe
 *         age:
 *           type: integer
 *           description: The age of a trainer
 *           example: 35
 *         height:
 *           type: number
 *           format: float
 *           description: The height of a trainer in cm
 *           example: 185.5
 *         weight:
 *           type: number
 *           format: float
 *           description: The weight of a trainer in kg
 *           example: 80.5
 *         sex:
 *           type: string
 *           description: The sex of a trainer
 *           example: male
 *         description:
 *           type: string
 *           description: The description of a trainer
 *           example: A brief description about the trainer
 *         users:
 *           type: string
 *           description: A comma-separated string of user IDs that the trainer is responsible for
 *           example: "1,2,3,4"
 */
export const trainers = mysqlTable('trainers', {
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
  // This will be a comma-separated string of user IDs
  users: varchar('users', { length: 1024 }),
}, (trainers) => ({
  nameIndex: uniqueIndex('username_idx').on(trainers.username),
}));

export type Trainer = typeof trainers.$inferInsert;