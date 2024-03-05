import { db } from '../db/db';
import { Trainer, trainers } from '../models/trainers';
import { eq } from 'drizzle-orm';

export const getTrainerByUsername = async (username: string) : Promise<Trainer | undefined> => {
  const [ trainer ] = await db.select()
    .from(trainers)
    .where(eq(trainers.username, username))
    .limit(1);
  return trainer;
};

export const getTrainerByEmail = async (email: string) : Promise<Trainer | undefined> => {
  const [ trainer ] = await db.select()
    .from(trainers)
    .where(eq(trainers.email, email))
    .limit(1);
  return trainer;
};

export const getTrainerById = async (id: number) : Promise<Trainer | undefined> => {
  const [ trainer ] = await db.select()
    .from(trainers)
    .where(eq(trainers.id, id))
    .limit(1);
  return trainer;
};

export const insertTrainer = async (trainer: Trainer) => {
  return await db.insert(trainers).values([{...trainer}]);
};

export const updateTrainerById = async (id: number, trainer: Partial<Trainer>) => {
  return await db.update(trainers)
    .set(trainer)
    .where(eq(trainers.id, id));
};

export const deleteTrainerById = async (id: number) => {
  return await db.delete(trainers)
    .where(eq(trainers.id, id));
};

