import express from 'express';
import { getPlannedActivities } from '../controllers/plannedActivitiesController';
import { verifyUserToken } from '../middlewares/authentication';
import { deletePlannedActivity } from '../controllers/plannedActivitiesController';

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
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/', verifyUserToken, getPlannedActivities);


/**
 * @swagger
 * /plannedactivities/delete/{activityId}:
 *  delete:
 *    tags:
 *    - planned_activities
 *    summary: Delete planned activity
 *    description: Route to delete a planned activity of a logged user
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: activityId
 *        required: true
 *        description: The id of the activity to delete
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Activity deleted successfully
 *      400:
 *        description: Invalid activityId
 *      500:
 *        description: Server Error
 */
router.delete("/delete/:activityId", verifyUserToken, deletePlannedActivity);


export default router;
