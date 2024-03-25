import { planned_activities, PlannedActivity } from '../models/planned_activities';
import { db } from '../db/db';
import {eq, and, SQL} from 'drizzle-orm';

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

export const updatePlannedActivityById = async (userId: number, pActivityId: number, plannedActivity: Partial<PlannedActivity>) => {
  return await db.update(planned_activities)
    .set(plannedActivity)
    .where(and(
      eq(planned_activities.user_id, userId),
      eq(planned_activities.id, pActivityId)
    ));
};

export const insertPlannedActivity = async (plannedActivity: PlannedActivity) => {
  return await db.insert(planned_activities).values([{...plannedActivity}]);
};

export const getPlannedActivitiesFromConditions = async (conditions:  SQL<unknown>[]) => {
  return await db.select()
    .from(planned_activities)
    .where(and(...conditions));
};
