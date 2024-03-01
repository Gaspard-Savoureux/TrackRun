import { db } from '../db/db';
import { User, users } from '../models/users';
import { eq } from 'drizzle-orm';

export const getUserByUsername = async ( username: string) : Promise<User | undefined> => {
  const [ user ] = await db.select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user;
};

export const getUserById = async (id: number) : Promise<User | undefined> => {
  const [ user ] = await db.select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user;
};

export const getUserByEmail = async (email: string) : Promise<User | undefined> =>{
  const [ user ] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
}


export const insertUser = async (user: User) => {
  return await db.insert(users).values([{...user}]);
};

export const updateUserById = async (id: number, user: Partial<User>) => {
  return await db.update(users)
    .set(user)
    .where(eq(users.id, id));
};

export const deleteUserById = async (id: number) => {
  return await db.delete(users)
    .where(eq(users.id, id));
};
