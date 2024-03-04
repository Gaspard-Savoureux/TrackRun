import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import {activities} from '../models/activities';



export const getUserActivities = async (userId: number) => {
  return await db.select()
    .from(activities)
    .where(eq(activities.user_id, userId));
};
