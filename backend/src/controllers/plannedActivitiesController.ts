import {NextFunction, Request, Response} from 'express';
import { planned_activities } from '../models/planned_activities';
import { User } from '../models/users';
import {getUserById} from '../services/user.services';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';

export const getPlannedActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }

    const pActivities = await db.select()
      .from(planned_activities)
      .where(eq(user.id,planned_activities.user_id));

    return res.status(200).json({ pActivities });

  } catch (error) {
    next(error);
  }
};
