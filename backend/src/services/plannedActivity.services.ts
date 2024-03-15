import { db } from '../db/db';
import { PlannedActivity, planned_activities } from '../models/planned_activities';
import { eq, and } from 'drizzle-orm';


export const updatePlannedActivityById = async (userId: number, activityId: number, plannedActivity: Partial<PlannedActivity>) => {
  return await db.update(planned_activities)
    .set(plannedActivity)
    .where(and(
      eq(planned_activities.user_id, userId),
      eq(planned_activities.activity_id, activityId)
    ));

}
