import {NextFunction, Request, Response} from 'express';
import { activities } from '../models/activities';
import { db } from '../db/db';

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
