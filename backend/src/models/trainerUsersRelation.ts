import { int, mysqlTable } from 'drizzle-orm/mysql-core';
import { users } from './users';
import { trainers } from './trainers';

export const trainerUserAssociation = mysqlTable('trainer_user_associations', {
  trainerId: int('trainerId').notNull().references(() => trainers.id),
  userId: int('userId').notNull().references(() => users.id),
});

export type TrainerUserAssociation = typeof trainerUserAssociation.$inferInsert;
