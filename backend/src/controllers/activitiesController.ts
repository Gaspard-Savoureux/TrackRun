import {NextFunction, Request, Response} from 'express';
import { activities } from '../models/activities';
import { db } from '../db/db';
import {User} from '../models/users';
import {getUserActivities, getUserById} from '../services/user.services';

// TODO faire de plus ample vérification sur les données d'un activité
export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, city, type, date, durationTotal, distanceTotal, comment, segments } = req.body;


    if (!date)
      date = new Date();
    else
      date = new Date(date);

    if (!segments || segments.trim() === '')
      segments = {};

    const userId = req.user?.userId as number;

    const result = await db.insert(activities).values([{
      user_id: userId,
      name,
      city,
      type,
      date,
      durationTotal,
      distanceTotal,
      comment,
      segments
    }]);

    if (!result) {
      // handle the error or throw an error
      throw new Error('Database insertion failed.');
    }


    return res.status(201).json({ message: 'Activity added successfully' });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);
    const userActivities = await getUserActivities(userId);
    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }

    return res.status(200).json({ userActivities });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// TODO do a research for the distance range, duration range, and date range
export const getSpecifiedActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);
    const searchedInformation = req.query.search as string;
    const userActivities = await getUserActivities(userId);
    const searchedActivities: { activities: any[] } = {
      activities: []
    };
    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }
    if (userActivities) {
      for (const activity of userActivities) {
        if (activity.name.includes(searchedInformation) || activity.type.includes(searchedInformation)
          || activity.comment && activity.comment.includes(searchedInformation)
          || activity.city && activity.city.includes(searchedInformation)) {
          searchedActivities.activities.push(activity);

        }
      }
    }

    return res.status(200).json(searchedActivities);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
