
import express  from 'express';
import { body } from 'express-validator';
import { createUser, deleteUser, getUser } from '../controllers/UserController';
import { expressValidator } from '../middlewares/validation';
import { verifyUserToken } from '../middlewares/authentication';

const router = express.Router();

/**
 * @swagger
 * /user/create:
 *  post:
 *    tags:
 *    - user
 *    summary: Create user
 *    description: Route to create a new user
 *    security: []
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


// TODO add response body for 200
/**
 * @swagger
 * /user:
 *  get:
 *    tags:
 *    - user
 *    summary: Get user data
 *    description: Route to get the data of a user using its token
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
router.get('/', verifyUserToken, getUser);

/**
 * @swagger
 * /user:
 *  delete:
 *    tags:
 *    - user
 *    summary: Delete a user
 *    description: Delete a user based on its token.
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User successfully deleted
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                message:
 *                  type: string
 *                  example: User successfully deleted
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.delete('/', verifyUserToken, deleteUser);

export default router;
