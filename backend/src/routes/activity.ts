import express from 'express';
import { body } from 'express-validator';
import {createActivity, getActivity, getSpecifiedActivities} from '../controllers/activitiesController';
import { expressValidator } from '../middlewares/validation';
import {verifyUserToken} from '../middlewares/authentication';

const router = express.Router();

//TODO complété les erreurs 401 et 500
/**
 * @swagger
 * /activity/manual:
 *  post:
 *   tags:
 *    - name: Activity
 *   summary: Create activity
 *   description: Create activity
 *   security:
 *      - BearerAuth: []
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Activity'
 *   responses:
 *    201:
 *     description: Success
 *    400:
 *     description: Error
 *    401:
 *     description: Error
 *    500:
 *     description: Error server
 */
router.post('/manual',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('city').isString().withMessage('City, optional'),
    body('type').isString().notEmpty().withMessage('Type of workout is required'),
    body('date').isISO8601().withMessage('Date is required'),
    body('durationTotal').isFloat().withMessage('Time in second'),
    body('distanceTotal').isFloat().withMessage('Distance in kilometer'),
    body('comment').isString().withMessage('Comment is optional'),
    body('segments').isJSON().withMessage('Data of workout is optional')
  ],

  expressValidator,
  verifyUserToken,
  createActivity
);


/**
 * @swagger
 * /activity/getActivity:
 *  get:
 *    tags:
 *    - name: Activity
 *    summary: Get activity
 *    description: Route to get activities of a user using its token
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/getActivity',
  verifyUserToken,
  getActivity
);


/**
 * @swagger
 * /activity/getSpecifiedActivities:
 *  get:
 *    tags:
 *    - name: Activity
 *    summary: Get Specified activity
 *    description: Get Specified activity
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: query
 *        name: search
 *        required: true
 *        description: The search information required
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/getSpecifiedActivities',
  verifyUserToken,
  getSpecifiedActivities
);

export default router;
