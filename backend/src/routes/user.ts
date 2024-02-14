
import express  from 'express';
import { body } from 'express-validator';
import { createUser } from '../controllers/UserController';
import { expressValidator } from '../middlewares/validation';

const router = express.Router();

/**
 * @swagger
 * /user/create:
 *  post:
 *    tags:
 *    - user
 *    summary: Create user
 *    description: Route to create a new user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                description: The username of a user
 *                example: jean-papa
 *              password:
 *                type: string
 *                description: The password of a user
 *                example: 1234
 *    responses:
 *      201:
 *        description: New user created
 *      400:
 *        description: Bad Request
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */
router.post('/create', 
  [
    body('username').isString(),
    body('password').isString()
  ],
  expressValidator,
  createUser
);

export default router;
