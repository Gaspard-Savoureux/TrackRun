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
import {deleteFile} from '../middlewares/fileTreatment';
import {
  validateCity, validateComment, validateDate,
  validateDistance,
  validateDuration,
  validateName,
  validateType
} from '../middlewares/activityValidation';


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
    if (validateName(name)) {
      return res.status(400).json({ message: 'Name is required and must be between 3 and 256 characters' });
    }

    // Validation de `city`
    if (city == null) {
      city = '';
    } else if (validateCity(city)) {
      return res.status(400).json({ message: 'City must be a string with a maximum length of 100 characters' });
    }

    // Validation de `type`
    if (validateType(type)) {
      return res.status(400).json({ message: 'Type is required and must be one of the following: Running, Biking, Walking' });
    }

    // Validation de `durationTotal` et `distanceTotal`
    if (durationTotal == null) {
      durationTotal = 0;
    } else if (validateDuration(durationTotal)) {
      return res.status(400).json({ message: 'DurationTotal must be a non-negative and non-null number' });
    }

    if (distanceTotal == null) {
      distanceTotal = 0;
    } else if (validateDistance(distanceTotal)) {
      return res.status(400).json({ message: 'DistanceTotal must be a non-negative and non-null number' });
    }

    // Validation de `comment` 
    if (comment == null) {
      comment = '';
    } else if (validateComment(comment)) {
      return res.status(400).json({ message: 'Comment must be a string' });
    }


    // Validation date
    if (!date)
      date = new Date();
    else if (validateDate(date))
      return res.status(400).json({ message: 'The date must be past'});
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
    let segments; let metadata;

    if (req.file) {
      const gpxConverter = new gpxParser();
      const conversionResult = await gpxConverter.parseGpxFile(req.file.path);
      if (!conversionResult.segments || !conversionResult.metadata) {
        await deleteFile(req.file.path);
        return res.status(400).send('The GPX format isn\'t right');
      }
      await deleteFile(req.file.path);
      segments = conversionResult.segments;
      metadata = conversionResult.metadata;
    } else {
      return res.status(400).send('No GPX file uploaded or wrong format');
    }

    let { name, type, comment } = req.body;
    // Validation for `name`
    if (validateName(name)) {
      return res.status(400).json({ message: 'Name is required and must be between 3 and 256 characters' });
    }
    // Validation for `type`
    if (validateType(type)) {
      return res.status(400).json({ message: 'Type is required and must be one of the following: Running, Biking, Walking'});
    }

    // Validation for `comment`
    if (comment == null) {
      comment = '';
    } else if (validateComment(comment)) {
      return res.status(400).json({ message: 'Comment must be a string' });
    }

    const city = null; //TODO get city in the GPX file from the coordinate
    let { date: date, durationTotal, distanceTotal } = metadata;

    // Validation date
    if (!date)
      date = new Date();
    else if (validateDate(date))
      return res.status(400).json({ message: 'The date must be past\nThe GPX file isn\'t right'});
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
    next(error);
  }
};

function researchString(informationString: string, activity : any): boolean {
  return ((activity.name.toLowerCase().includes(informationString.toLowerCase()) ||
    activity.type.toLowerCase().includes(informationString.toLowerCase()) ||
    (activity.comment && activity.comment.toLowerCase().includes(informationString.toLowerCase())) ||
    (activity.city && activity.city.toLowerCase().includes(informationString.toLowerCase()))));
}

function researchInterval(informationStart: any, informationEnd: any, Compare: any, activity : any): boolean {
  return Compare >= informationStart &&
    Compare <= informationEnd;
}


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
    const informationString = req.query.search as string;
    const informationStartDate = req.query.startDate as string;
    const informationEndDate = req.query.endDate as string;
    const informationSpecificDate = req.query.specificDate as string;
    const informationSpecificDistance = req.query.specificDistance !== undefined ? Number(req.query.specificDistance) : undefined;
    const informationStartDistance = req.query.startDistance !== undefined ? Number(req.query.startDistance) : undefined;
    const informationEndDistance = req.query.endDistance !== undefined ? Number(req.query.endDistance) : undefined;
    const informationSpecificDuration = req.query.specificDuration !== undefined ? Number(req.query.specificDuration) : undefined;
    const informationStartDuration = req.query.startDuration !== undefined ? Number(req.query.startDuration) : undefined;
    const informationEndDuration = req.query.endDuration !== undefined ? Number(req.query.endDuration) : undefined;

    let checkAllFilledBox = true;

    const userActivities = await getUserActivities(userId);
    const manageActivities : { findCommonActivities : any[] } = {
      findCommonActivities: []
    }
    const searchedString: { activities: any[] } = {
      activities: []
    };
    const searchedSpecificDate: { activities: any[] } = {
      activities: []
    };
    const searchedDateIntevarl: { activities: any[] } = {
      activities: []
    };
    const searchedSpecificDistance: { activities: any[] } = {
      activities: []
    };
    const searchedDistanceInterval: { activities: any[] } = {
      activities: []
    };
    const searchedSpecificDuration: { activities: any[] } = {
      activities: []
    };
    const searchedDurationInterval: { activities: any[] } = {
      activities: []
    };
    const searchedActivities: { activities: any[] } = {
      activities: []
    };
    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }
    if (userActivities) {
        for (const activity of userActivities) {

          if(informationString) {
            if (researchString(informationString, activity)) {
              searchedString.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedString);
            }
          }
          if(informationSpecificDate) {
            if (new Date(activity.date).getTime() == new Date(informationSpecificDate).getTime()) {
              searchedSpecificDate.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedSpecificDate);
            }
          }
          else if(informationStartDate && informationEndDate){
            if (researchInterval(new Date(informationStartDate), new Date(informationEndDate), new Date(activity.date), activity)) {
              searchedDateIntevarl.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedDateIntevarl);
            }
          }
          if(informationSpecificDistance) {
            if (activity.distanceTotal == informationSpecificDistance) {
              searchedSpecificDistance.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedSpecificDistance);
            }
          }
          else if (informationStartDistance && informationEndDistance) {
            if (researchInterval(informationStartDistance, informationEndDistance, activity.distanceTotal , activity)) {
              searchedDistanceInterval.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedDistanceInterval);
            }
          }

          if(informationSpecificDuration) {
            if (activity.durationTotal == informationSpecificDuration) {
              searchedSpecificDuration.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedSpecificDuration);
            }
          }
          else if (informationStartDuration && informationEndDuration) {
            if (researchInterval(informationStartDuration, informationEndDuration, activity.durationTotal , activity)) {
              searchedDurationInterval.activities.push(activity);
            }
            if (checkAllFilledBox) {
              manageActivities.findCommonActivities.push(searchedDurationInterval);
            }
          }

          checkAllFilledBox = false;
        }

        if (manageActivities.findCommonActivities.length == 1) {
          console.log(manageActivities.findCommonActivities[0].activities);
          for (const activity1 of manageActivities.findCommonActivities[0].activities) {
              searchedActivities.activities.push(activity1);
          }
        }
        else if (manageActivities.findCommonActivities.length == 2) {
          for (const activity1 of manageActivities.findCommonActivities[0].activities) {
            for (const activity2 of manageActivities.findCommonActivities[1].activities) {
                if (activity1.id == activity2.id) {
                  searchedActivities.activities.push(activity1);
                }
            }
          }
        }
        else if (manageActivities.findCommonActivities.length == 3) {
          for (const activity1 of manageActivities.findCommonActivities[0].activities) {
            for (const activity2 of manageActivities.findCommonActivities[1].activities) {
              for (const activity3 of manageActivities.findCommonActivities[2].activities) {
                if (activity1.id == activity2.id && activity1.id == activity3.id) {
                  searchedActivities.activities.push(activity1);
                }
              }
            }
          }
        }
        else if (manageActivities.findCommonActivities.length == 4) {
          for (const activity1 of manageActivities.findCommonActivities[0].activities) {
            for (const activity2 of manageActivities.findCommonActivities[1].activities) {
              for (const activity3 of manageActivities.findCommonActivities[2].activities) {
                for (const activity4 of manageActivities.findCommonActivities[3].activities) {
                  if (activity1.id == activity2.id && activity1.id == activity3.id && activity1.id == activity4.id) {
                    searchedActivities.activities.push(activity1);
                  }
                }
              }
            }
          }
        }

    }
    return res.status(200).json(searchedActivities);
  } catch (error) {
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

    if (!validateName(name)) updateData.name = name;
    if (!validateCity(city)) updateData.city = city; //TODO à changer quand la recup de la ville est fait dans le GPX
    if (!validateType(type)) updateData.type = type;
    if (!validateComment(comment)) updateData.comment = comment;
    if (activityRequest[0].segments === '{}') {
      if (!validateDate(date)) updateData.date = new Date(date);
      if (!validateDuration(durationTotal)) updateData.durationTotal = durationTotal;
      if (!validateDistance(distanceTotal)) updateData.distanceTotal = distanceTotal;
    }

    await updateActivityById(activityId, userId, updateData);

    return res.status(200).json({ message: 'Activity updated successfully' });
  } catch (error) {
    next(error);
  }
};
