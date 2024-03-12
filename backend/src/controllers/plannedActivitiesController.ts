import { NextFunction, Request, Response } from 'express';
import { planned_activities } from '../models/planned_activities';
import { User } from '../models/users';
import { getUserById } from '../services/user.services';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import { deletePlannedActivityById, selectPlannedActivityById } from '../services/planned_activity.services';

export const getPlannedActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user) {
      // Can only happen in very tight race condition OR if token was forged
      // Maybe it should be removed, confusing
      return res.status(404).json({ error: 'No corresponding user' });
    }

    const plannedActivities = await db.select()
      .from(planned_activities)
      .where(eq(planned_activities.user_id, <number>user.id));

    return res.status(200).json({ plannedActivities });

  } catch (error) {
    next(error);
  }
};


export const deletePlannedActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const activityId = parseInt(req.params.activityId);

    // check if the activityId is a number
    if (isNaN(activityId) || !activityId) {
      return res.status(400).json({ error: "Invalid activityId" });
    }
    const activitiesToDelete = await selectPlannedActivityById(activityId, userId);
    // log to delete
    console.log(activitiesToDelete);
    if (activitiesToDelete.length !== 1) {
      return res.status(404).json({ error: "No corresponding activity" });
    }

    await deletePlannedActivityById(activityId, userId);
    res.status(200).json({ message: "Activity deleted successfully" });

  } catch (error) {
    next(error);
  }
};

