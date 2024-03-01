import express from 'express';
import { getPlannedActivities } from '../controllers/plannedActivitiesController';
import { verifyUserToken } from '../middlewares/authentication';

const router = express.Router();


/**
 * @swagger
 * /{userId}/plannedactivities:
 *  get:
 *    tags:
 *    - planned_activities
 *    summary: Get planned activities of user
 *    description: Route to get the planned activities of a user using its ID
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The ID of the user from which to get the planned activities
 *    responses:
 *      200:
 *        description: Information obtained successfully
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/:userId/plannedactivities', verifyUserToken, getPlannedActivities);



export default router;
