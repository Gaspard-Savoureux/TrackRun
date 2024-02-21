import { int, varchar, double, datetime, text, json, mysqlTable } from 'drizzle-orm/mysql-core';
import {users} from './users';

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - id
 *         - user_id
 *         - name
 *         - city
 *         - type
 *         - date
 *         - durationTotal
 *         - distanceTotal
 *         - comment
 *         - segments
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the activity
 *         user_id:
 *           type: integer
 *           description: The id of the user who proposed the activity
 *         name:
 *           type: string
 *           description: The name of the activity
 *         city:
 *           type: string
 *           description: The city where activity will happen
 *         type:
 *           type: string
 *           description: The type of the activity
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date and time of the activity
 *         durationTotal:
 *           type: number
 *           format: float
 *           description: The total duration of the activity
 *         distanceTotal:
 *           type: number
 *           format: float
 *           description: The total distance of the activity
 *         comment:
 *           type: string
 *           description: The comment of the activity
 *         segments:
 *           type: object
 *           description: The segments of the activity
 */
export const activities = mysqlTable('activities', {
  id: int('id').primaryKey().autoincrement(),
  user_id: int('user_id').references(() => users.id),
  name: varchar('name', { length: 256 }),
  city: varchar('city', { length: 100 }),
  type: varchar('type', { length: 50 }),
  date: datetime('date'),
  durationTotal: double('durationTotal'),
  distanceTotal: double('distanceTotal'),
  comment: text('comment'),
  segments: json('segments')
});
