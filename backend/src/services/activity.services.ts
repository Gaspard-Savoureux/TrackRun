import { db } from '../db/db';
import {and, eq} from 'drizzle-orm';
import {activities} from '../models/activities';


export const getActivityById = async (activityId: number, userId: number) => {
  return await db.select()
    .from(activities)
    .where(
      and(
        eq(activities.id, activityId),
        eq(activities.user_id, userId)
      )
    )
    .limit(1);
};

export const getUserActivities = async (userId: number) => {
  return await db.select()
    .from(activities)
    .where(eq(activities.user_id, userId));
};
