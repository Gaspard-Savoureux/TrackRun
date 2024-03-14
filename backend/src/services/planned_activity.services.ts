import { planned_activities } from '../models/planned_activities';
import { db } from '../db/db';
import { User, users } from '../models/users';
import { eq, and } from 'drizzle-orm';

export const deletePlannedActivityById = async (activityId: number, userId: number) => {
  return await db.delete(planned_activities)
    .where(
      and(
        eq(planned_activities.id, activityId),
        eq(planned_activities.user_id, userId)
      )
    );
};


export const selectPlannedActivityById = async (activityId: number, userId: number) => {
  return await db.select()
    .from(planned_activities)
    .where(
      and(
        eq(planned_activities.id, activityId),
        eq(planned_activities.user_id, userId)
      )
    )
    .limit(1);
};