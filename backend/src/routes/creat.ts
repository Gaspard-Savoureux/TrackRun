
import express from 'express';
import { body } from 'express-validator';
import { createActivity } from '../controllers/activitiesController';
import { expressValidator } from '../middlewares/validation';

const router = express.Router();


/**
 * @swagger
 * /activity:
 *  post:
 *    tags:
 *    - creationActivity
 *    summary: Creation of a new activity
 *    description: Route for the creation of a new activity
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: Creation of activity successful
 *      400:
 *        description: Wrong data
 *      500:
 *        description: Server Error
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
