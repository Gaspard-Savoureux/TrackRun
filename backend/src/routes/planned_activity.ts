import express from 'express';
import { createPlannedActivity, getPlannedActivities, modifyPlannedActivity } from '../controllers/plannedActivitiesController';
import { verifyUserToken } from '../middlewares/authentication';
import { body } from 'express-validator';
import { expressValidator } from '../middlewares/validation';

const router = express.Router();


/**
 * @swagger
 * /plannedactivities:
 *  get:
 *    tags:
 *    - planned_activities
 *    summary: Get planned activities of current user
 *    description: Route to get the planned activities of a logged user
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: query
 *        name: from
 *        schema:
 *          type: string
 *        description: Filter results that are after the given date in format YYYY-MM-DD
 *      - in: query
 *        name: type
 *        schema:
 *          type: string
 *        description: Filter results by the given activity type (Walking, Running, Biking)
 *    responses:
 *      200:
 *        description: List of planned activities
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                  type:
 *                    type: string  
 *                  date:
 *                    type: string
 *                    format: date-time
 *                    example: 2024-02-26 16:30:00
 *                  duration:
 *                    type: integer
 *                  name:
 *                    type: string
 *                  comment:
 *                    type: string
 *                  activity_id:
 *                    type: integer  
 *      401:
 *        description: User is not logged in         
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/', verifyUserToken, getPlannedActivities);

/**
 * @swagger
 * /plannedactivities:
 *  put:
 *    tags:
 *     - planned_activities
 *    summary: update planned activity
 *    description: update planned activity of the currently logged-in user
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *                description: Type of the planned activity
 *                example: Running
 *              date:
 *                type: string($date-time)
 *                description: The date and time of the activity
 *                example: 2024-02-26 16:30:00
 *              duration:
 *                type: integer
 *                description: The total duration of the activity in seconds
 *                example: 1823
 *              name:
 *                type: string
 *                description: The name of the activity
 *                example: A run in the park
 *              comment:
 *                type: string
 *                description: The comment of the activity
 *                example: Remember to focus on your breath the entire time!
 *              activity_id:
 *                type: integer
 *                example: 1
 *    responses:
 *     201:
 *      description: Planned activity updated successfully
 *     400:
 *      description: Bad request
 *     401:
 *      description: User is not logged in
 *     500:
 *      description: Server error
 */
router.put('/',
  [
    body('type').optional({ values: 'null' }).isString().isLength({ max: 64 }),
    body('date').optional().isISO8601(),
    body('duration').optional().isInt({ min: 0, max: 1024 }),
    body('name').optional({ values: 'null' }).isString().isLength({ max: 64 }),
    body('comment').optional({ values: 'null' }).isString().isLength({ max: 256 }),
    body('pActivityId').isInt(),
  ],
  verifyUserToken, modifyPlannedActivity);

/**
 * @swagger
 * /plannedactivities:
 *  post:
 *    tags:
 *     - planned_activities
 *    summary: Create planned activity
 *    description: Create planned activity of the currently logged-in user
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              type:
 *                type: string
 *                description: Type of the planned activity
 *                example: Running
 *              date:
 *                type: string($date-time)
 *                description: The date and time of the activity
 *                example: 2024-02-26 16:30:00
 *              duration:
 *                type: integer
 *                description: The total duration of the activity in seconds
 *                example: 1823
 *              name:
 *                type: string
 *                description: The name of the activity
 *                example: A run in the park
 *              comment:
 *                type: string
 *                description: The comment of the activity
 *                example: Remember to focus on your breath the entire time!
 *    responses:
 *     201:
 *      description: Planned activity created
 *     400:
 *      description: Bad request
 *     401:
 *      description: User is not logged in
 *     500:
 *      description: Server error
 */
router.post('/',
  [
    body('type').isString(),
    body('date').isISO8601(),
    body('duration').isInt({ min: 0 }),
    body('name').optional({ values: 'null' }).isString().isLength({ max: 256 }),
    body('comment').optional({ values: 'null' }).isString()
  ],
  expressValidator,
  verifyUserToken,
  createPlannedActivity);


export default router;
