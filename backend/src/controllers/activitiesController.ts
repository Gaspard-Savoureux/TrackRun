import { NextFunction, Request, Response}  from 'express';
import { activities, Activity } from '../models/activities';
import { db } from '../db/db';
import { User } from '../models/users';
import { getUserById } from '../services/user.services';
import {
  deleteActivityById,
  getActivityById,
  getUserActivities,
  updateActivityById
} from '../services/activity.services';
import { gpxParser } from '../middlewares/gpxParser';
import * as fs from 'node:fs';
import {deletefile} from '../middlewares/fileTreatment';
import {and, eq} from 'drizzle-orm';


/**
 * Create a new activity manually.
 *
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {Response} The response object.
 * @throws {Error} If database insertion fails.
 */
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
    } else if (typeof durationTotal !== 'number' || durationTotal <= 0) {
      return res.status(400).json({ message: 'DurationTotal is required and must be a non-negative number' });
    }

    if (distanceTotal == null) {
      distanceTotal = 0;
    } else if (typeof distanceTotal !== 'number' || distanceTotal <= 0) {
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

/**
 * Create an activity from a GPX file and store it in the database.
 *
 * @async
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @throws {Error} If the database insertion fails.
 * @returns {Promise<void>}
 */
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
      if (!conversionResult.segments || !conversionResult.metadata) {
        return res.status(400).send('The GPX format isn\'t right');
      }
      await deletefile(req.file.path);
      segments = conversionResult.segments;
      metadata = conversionResult.metadata;
    } else {
      return res.status(400).send('No GPX file uploaded or wrong format');
    }

    const city = null; // Assuming city is not determined from the GPX file
    let { date: date, durationTotal, distanceTotal } = metadata;

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
      segments // Assuming your DB can store JSON or stringified JSON
    }]);

    if (!result) {
      throw new Error('Database insertion failed.');
    }

    res.status(200).send('GPX file processed successfully.');
  } catch (error) {
    next(error);
  }
};

/**
 * Gets the activities of a user
 *
 * @async
 * @param {Request} req - The HTTP request object
 * @param {Response} res - The HTTP response object
 * @param {NextFunction} next - The next function in the middleware stack
 * @returns {Promise<void>} - Promise that resolves when the activities are retrieved
 * @throws {Error} - If there's an error while retrieving the activities
 */
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
/**
 * Retrieves activities based on the specified search criteria.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves to void.
 */
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

/**
 * Retrieve GPX data by activity ID
 *
 * @param {Object} req - The request object containing user and activity ID.
 * @param {Object} res - The response object to send back the GPX data.
 * @param {Function} next - The next middleware function.
 * @returns {Promise} - A promise with the API response.
 * @throws {Error} - If an error occurs while retrieving the GPX data.
 */
export const getGPXDataByID = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const activityId = parseInt(req.params.activityId);

    if (isNaN(activityId) || !activityId) {
      return res.status(400).json({ error: 'Invalid activityId' });
    }

    const activityRequest = await getActivityById(activityId, userId);

    if (activityRequest.length !== 1) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    return res.status(201).json({activityRequest});
  } catch (error) {
    next(error);
  }
};

/**
 * Performs suppression of an activity.
 *
 * @param {Request} req - The HTTP request.
 * @param {Response} res - The HTTP response.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>} - Resolves after the suppression is complete.
 * @throws {Error} - If there is an error during the suppression process.
 */
export const suppressionActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const activityId = parseInt(req.params.activityId);

    if (isNaN(activityId) || !activityId) {
      return res.status(400).json({ error: 'Invalid activityId' });
    }

    const activityRequest = await getActivityById(activityId, userId);

    if (activityRequest.length !== 1) {
      return res.status(200).json({ error: 'There where no activity' });
    }

    const result = deleteActivityById(activityId, userId);

    if (!result) {
      throw new Error('Database deletion failed.');
    }

    return res.status(200).json({ message: 'Activity deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Modify activity.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next function.
 * @returns {Promise<void>} - A Promise that resolves with nothing.
 */
export const modifyActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const activityId = parseInt(req.params.activityId);

    if (isNaN(activityId) || !activityId) {
      return res.status(400).json({ error: 'Invalid activityId' });
    }

    const activityRequest = await getActivityById(activityId, userId);

    const updateData: Partial<Activity> = {};

    if (activityRequest.length !== 1) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    const { name, city, type, date, durationTotal, distanceTotal, comment} = req.body;

    if (name && typeof name === 'string' && name.length >= 3 && name.length <= 256) updateData.name = name;
    if (city && typeof city === 'string' && city.length <= 100) updateData.city = city; //TODO à changer quand la recup de la ville est fait dans le GPX
    const activityOptions = ['Running', 'Biking', 'Walking'];
    if (type && activityOptions.includes(type)) updateData.type = type;
    if (typeof comment === 'string' && comment) updateData.comment = comment;
    if (activityRequest[0].segments === '{}') {
      if (date) updateData.date = new Date(date);
      if (durationTotal && typeof durationTotal === 'number' && durationTotal > 0) updateData.durationTotal = durationTotal;
      if (distanceTotal && typeof distanceTotal === 'number' && distanceTotal > 0) updateData.distanceTotal = distanceTotal;
    }

    await updateActivityById(activityId, userId, updateData);

    return res.status(200).json({ message: 'Activity updated successfully' });
  } catch (error) {
    next(error);
  }
};
