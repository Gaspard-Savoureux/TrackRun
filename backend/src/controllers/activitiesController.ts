import {NextFunction, Request, Response} from 'express';
import { activities } from '../models/activities';
import { db } from '../db/db';

export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, city, type, date, durationTotal, distanceTotal, comment, segments } = req.body;

    // Validation de `name`
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 256) {
      return res.status(400).json({ message: 'Name is required and must be between 3 and 256 characters' });
    }

    // Validation de `city`
    if (city && (typeof city !== 'string' || city.length > 100)) {
      return res.status(400).json({ message: 'City must be a string with a maximum length of 100 characters' });
    }

    // Validation de `type`
    const validTypes = ['Running', 'Biking', 'Walking'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: `Type is required and must be one of the following: ${validTypes.join(', ')}` });
    }

    // Validation de `durationTotal` et `distanceTotal`
    if (typeof durationTotal !== 'number' || durationTotal < 0) {
      return res.status(400).json({ message: 'DurationTotal is required and must be a non-negative number' });
    }
    if (typeof distanceTotal !== 'number' || distanceTotal < 0) {
      return res.status(400).json({ message: 'DistanceTotal is required and must be a non-negative number' });
    }

    // Validation de `comment` 
    if (comment && typeof comment !== 'string') {
      return res.status(400).json({ message: 'Comment must be a string' });
    }

  
    // Validation de `segments` 
    if (!segments || segments.trim() === '') {
      segments = [];
    } else {
      for (const segment of segments) {
        if (!segment.points || segment.points.length === 0) {
          break;
        }
        for (const point of segments.points) {
          if (!point.lat || !point.lon || !point.ele || !point.time) {
            return res.status(400).json({ message: 'The value of a point are invalide' });
          } 
        }
      }
    }

    // Validation date
    if (!date)
      date = new Date();
    else
      date = new Date(date);

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