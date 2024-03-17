import { NextFunction, Request, Response } from 'express';
import { planned_activities } from '../models/planned_activities';
import { User } from '../models/users';
import { getUserById } from '../services/user.services';
import { db } from '../db/db';
import { and, eq, gte } from 'drizzle-orm';
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

    // check for from in query param and validate
    let fromDate: Date | null = null;
    if (req.query.from) {
      fromDate = new Date(req.query.from.toString());
      if (isNaN(fromDate.getTime()))
        return res.status(400).json({ error: 'Invalid from date format. Please use YYYY-MM-DD.' });
    }

    // check for activity type in query param and validate
    let activityType: 'Running' | 'Walking' | 'Biking' | null = null;
    if (req.query.type) {
      const possibleTypes: string[] = ['Running', 'Walking', 'Biking'];
      if (!possibleTypes.includes(req.query.type as string))
        return res.status(400).json({ error: 'Invalid activity type. Please use a type that is either Running, Walking or Biking' });
      activityType = req.query.type as 'Running' | 'Walking' | 'Biking';
    }

    // conditions will be added in the where clause in the sql query
    const conditions = [eq(planned_activities.user_id, <number>user.id)];

    // add filters if present
    if (fromDate) {
      conditions.push(gte(planned_activities.date, fromDate));
    }
    if (activityType) {
      conditions.push(eq(planned_activities.type, activityType));
    }

    const plannedActivities = await db.select()
      .from(planned_activities)
      .where(and(...conditions));

    return res.status(200).json({ plannedActivities });

  } catch (error) {
    next(error);
  }
};

export const getPlannedActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);
    const pActivityId = Number(req.params?.pActivityId);

    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }

    const [plannedActivity] = await db.select()
      .from(planned_activities)
      .where(and(eq(planned_activities.user_id, userId), eq(planned_activities.id, pActivityId)))
      .limit(1);

    if (!plannedActivity) {
      return res.status(404).json({ message: 'No corresponding planned activity found' });
    }

    return res.status(200).json({ plannedActivity });

  } catch (error) {
    next(error);
  }
}

export const createPlannedActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { type, date, duration, name, comment } = req.body;

    // Type validation
    const validTypes = ['Running', 'Biking', 'Walking'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: `Type must be one of the following: ${validTypes.join(', ')}` });
    }

    // Name dafault value
    if (!name || name.length == 0) {
      name = type.toString();
    }

    // Comment default value
    if (!comment) {
      comment = '';
    }

    date = new Date(date);

    const userId = req.user?.userId as number;

    const result = await db.insert(planned_activities).values([{
      user_id: userId,
      type,
      date,
      duration,
      name,
      comment,
    }]);

    if (!result) {
      // handle the error or throw an error
      throw new Error('Database insertion failed.');
    }

    const insertedId = result[0].insertId as number;

    return res.status(201).json({
      message: 'Planned Activity added successfully',
      id: insertedId
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const deletePlannedActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const activityId = parseInt(req.params.activityId);

    // check if the activityId is a number
    if (!activityId || isNaN(activityId)) {
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
