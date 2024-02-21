import express from 'express';
import { body } from 'express-validator';
import { createActivity } from '../controllers/activitiesController';
import { expressValidator } from '../middlewares/validation';

const router = express.Router();

/**
 * @swagger
 * /activity:
 *  post:
 *   tags:
 *    - name: Activity
 *   summary: Create activity
 *   description: Create activity
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       type: object
 *       required:
 *        - name
 *        - type
 *        - date
 *       properties:
 *        name:
 *         type: string
 *         description: The name of the activity
 *        city:
 *         type: string
 *         description: The city of the activity
 *        type:
 *         type: string
 *         description: The type of workout
 *        date:
 *         type: string
 *         description: The activity date
 *        totalDuration:
 *         type: number
 *         description: Time in second
 *        totalDistance:
 *         type: number
 *         description: Distance in kilometer
 *        comment:
 *         type: string
 *         description: Comment
 *        segment:
 *         type: string
 *         description: Data of workout
 *   responses:
 *    200:
 *     description: Success
 *    400:
 *     description: Error
 */
router.post('/activity',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('city').isString().withMessage('City, optional'),
    body('type').isString().notEmpty().withMessage('Type of workout is required'),
    body('date').isDate().notEmpty().withMessage('Date is required'),
    body('totalDuration').isNumeric().withMessage('Time in second'),
    body('totalDistance').isNumeric().withMessage('Distance in kilometer'),
    body('comment').isString().withMessage('Comment is optional'),
    body('segment').isString().withMessage('Data of workout is optional')
  ],
  expressValidator,
  createActivity
);

export default router;
