import { Request, Response } from 'express';
import { activities } from '../models/activities';
import { validationResult } from 'express-validator';
import { db } from '../db/db';

// TODO faire de plus ample vérification sur les données d'un activité
export const createActivity = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { userId, name, city, type, date, durationTotal, distanceTotal, comment, segments } = req.body;

    await db.insert(activities).values([{
      user_id: userId, name, city, type, date, durationTotal, distanceTotal, comment, segments
    }]);


    return res.status(201).json({ message: 'Activity added successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
