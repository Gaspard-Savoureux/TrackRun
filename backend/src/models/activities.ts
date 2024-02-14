import { int, varchar, double, datetime, text, json, mysqlTable } from 'drizzle-orm/mysql-core';

export const activities = mysqlTable('activities', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id'),
  name: varchar('name', { length: 256 }),
  city: varchar('city', { length: 100 }),
  type: varchar('type', { length: 50 }),
  date: datetime('date'),
  durationTotal: double('durationTotal'),
  distanceTotal: double('distanceTotal'),
  comment: text('comment'),
  segments: json('segments')
}, (activities) => ({
  userIndex: activities.user_id,
}));
