import express from 'express';
import { body } from 'express-validator';
import { createActivityManual, getActivity, getSpecifiedActivities, createActivityGPX } from '../controllers/activitiesController';
import { expressValidator } from '../middlewares/validation';
import { verifyUserToken } from '../middlewares/authentication';
import { upload } from '../middlewares/uploadActivity';

const router = express.Router();

//TODO complété les erreurs 401 et 500
/**
 * @swagger
 * /activity/manual:
 *  post:
 *   tags:
 *    - Activity
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
    body('city').custom((value) => value === null || (typeof value === 'string' && value.trim().length > 0)).withMessage('City, optional'),
    body('type').isString().notEmpty().withMessage('Type of workout is required'),
    body('date').isISO8601().notEmpty().withMessage('Date is required'),
    body('durationTotal').custom((value) => value === null || (typeof value === 'number')).withMessage('Time in second'),
    body('distanceTotal').custom((value) => value === null || (typeof value === 'number')).withMessage('Distance in kilometer'),
    body('comment').custom((value) => value === null || (typeof value === 'string' && value.trim().length > 0)).withMessage('Comment is optional'),
  ],
  expressValidator,
  verifyUserToken,
  createActivityManual
);

/**
 * @swagger
 * /activity/gpxForm:
 *  post:
 *   tags:
 *    - Activity
 *   summary: Create activity using GPX file
 *   description: Create new activity using a GPX file upload
 *   security:
 *      - BearerAuth: []
 *   requestBody:
 *    content:
 *     multipart/form-data:
 *      schema:
 *       type: object
 *       properties:
 *        name:
 *         type: string
 *         description: The name of the activity
 *        type:
 *         type: string
 *         enum: [Running, Biking, Walking]
 *         description: The type of the activity
 *        comment:
 *         type: string
 *         description: Comment on the activity
 *        file:
 *         type: string
 *         format: binary
 *         description: The GPX file for the activity
 *   responses:
 *    201:
 *     description: Success
 *    400:
 *     description: Bad Request
 *    401:
 *     description: Unauthorized
 *    500:
 *     description: Server Error
 */
router.post('/gpxForm',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('type').isString().notEmpty().withMessage('Type of workout is required'),
    body('comment').isString().withMessage('Comment is optional'),
  ],

  verifyUserToken,
  upload.single('file'),
  createActivityGPX
);

/**
 * @swagger
 * /activity/getActivity:
 *  get:
 *    tags:
 *    - Activity
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
 *    - Activity
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
