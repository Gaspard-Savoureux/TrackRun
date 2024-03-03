import express from 'express';
import { getPlannedActivities } from '../controllers/plannedActivitiesController';
import { verifyUserToken } from '../middlewares/authentication';

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
 *        description: Information obtained successfully
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/', verifyUserToken, getPlannedActivities);



export default router;
