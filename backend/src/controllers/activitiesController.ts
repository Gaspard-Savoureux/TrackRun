import { NextFunction, Request, Response}  from 'express';
import { activities } from '../models/activities';
import { db } from '../db/db';
import { User } from '../models/users';
import { getUserById } from '../services/user.services';
import { getUserActivities } from '../services/activity.services';
import { gpxParser } from './gpxParser';


export const createActivityManual = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, city, type, date, durationTotal, distanceTotal, comment} = req.body;

    // Validation de `name`
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 256) {
      return res.status(400).json({ message: 'Name is required and must be between 3 and 256 characters' });
    }

    // Validation de `city`
    if (city == null) {
      city = '';
    } else if (city && (typeof city !== 'string' || city.length > 100)) {
      return res.status(400).json({ message: 'City must be a string with a maximum length of 100 characters' });
    }

    // Validation de `type`
    const validTypes = ['Running', 'Biking', 'Walking'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: `Type is required and must be one of the following: ${validTypes.join(', ')}` });
    }

    // Validation de `durationTotal` et `distanceTotal`
    if (durationTotal == null) {
      durationTotal = 0;
    } else if (typeof durationTotal !== 'number' || durationTotal < 0) {
      return res.status(400).json({ message: 'DurationTotal is required and must be a non-negative number' });
    }

    if (distanceTotal == null) {
      distanceTotal = 0;
    } else if (typeof distanceTotal !== 'number' || distanceTotal < 0) {
      return res.status(400).json({ message: 'DistanceTotal is required and must be a non-negative number' });
    }

    // Validation de `comment` 
    if (comment == null) {
      comment = '';
    } else if (comment && typeof comment !== 'string') {
      return res.status(400).json({ message: 'Comment must be a string' });
    }


    // Validation date
    if (!date)
      date = new Date();
    else
      date = new Date(date);

    const segments = '{}';

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

export const createActivityGPX = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { name, type, comment } = req.body;

    // Validation for `name`
    if (!name || typeof name !== 'string' || name.length < 3 || name.length > 256) {
      return res.status(400).json({ message: 'Name is required and must be between 3 and 256 characters' });
    }
    // Validation for `type`
    const validTypes = ['Running', 'Biking', 'Walking'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ message: `Type is required and must be one of the following: ${validTypes.join(', ')}` });
    }

    // Validation for `comment`
    if (comment == null) {
      comment = ' ';
    } else if (comment && typeof comment !== 'string') {
      return res.status(400).json({ message: 'Comment must be a string' });
    }

    let segments; let metadata;

    if (req.file) {
      const gpxConverter = new gpxParser();
      const conversionResult = await gpxConverter.parseGpxFile(req.file.path);
      segments = conversionResult.segments;
      console.log(segments);
      metadata = conversionResult.metadata;
      console.log(metadata);
    } else {
      return res.status(400).send('No GPX file uploaded.');
    }

    const city = null; // Assuming city is not determined from the GPX file
    let { date: date, durationTotal, distanceTotal } = metadata;

    if (!date)
      date = new Date();
    else
      date = new Date(date);

    const userId = req.user?.userId as number;

    console.log(date);
    console.log('en route');
    const result = await db.insert(activities).values([{
      user_id: userId,
      name,
      city,
      type,
      date,
      durationTotal,
      distanceTotal,
      comment,
      segments // Assuming your DB can store JSON or stringified JSON
    }]);

    console.log('work');
    if (!result) {
      // handle the error or throw an error
      throw new Error('Database insertion failed.');
    }

    res.status(200).send('GPX file processed successfully.');
  } catch (error) {
    console.log('fail');
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
