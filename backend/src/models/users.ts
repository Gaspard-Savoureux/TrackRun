import { int, mysqlTable, uniqueIndex, varchar } from 'drizzle-orm/mysql-core';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';

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
 * 
 */
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

export const getUserByUsername = async (username: string) : Promise<User> => {
  const [ user ] = await db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user;
};

export const getUserById = async (id: number) : Promise<User> => {
  const [ user ] = await db.select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user;
};

export const insertUser = async (user: User) => {
  return await db.insert(users).values([{...user}]);
};

// Ajouter sans m'en rendre compte
// export const deleteUserById = async (id: number) => {
//   return await db.delete(users)
//     .where(eq(users.id, id));
// };
