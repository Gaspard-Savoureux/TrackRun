
import express from 'express';
import { body } from 'express-validator';
import { createUser, getUser, deleteUser, updateUser } from '../controllers/UserController';
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
 *              email:
 *                type: string
 *                description: The email of a user
 *                example: jeanpapa@gmail.com
 *              name: 
 *                type: string
 *                description: The name of a user
 *                example: jean-papa Juanpadre
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
    body('password').isString().isLength({min: 1, max: 72}),
    body('email').isString().isEmail(),
    body('name').isString()
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
 * /user/{userId}:
 *  put:
 *    tags:
 *    - user
 *    summary: Update user data
 *    description: Route to update the data of a user using its ID
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *        required: true
 *        description: The ID of the user to update
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
 *             age:
 *              type: integer
 *             description: The age of a user
 *            example: 30
 *            height:
 *             type: number
 *            format: float
 *        description: The height of a user in cm
 *       example: 180.5
 *      weight:
 *       type: number
 *     format: float
 *   description: The weight of a user in kg
 * example: 75.5
 * 
 *    responses:
 *      201:
 *        description: User updated successfully
 *      404:
 *        description: No corresponding user found
 */
router.put('/:userId', verifyUserToken,
  [
    body('username').optional().isString(),
    body('password').optional().isString(),
    body('age').optional().isNumeric(),
    body('height').optional().isNumeric(),
    body('weight').optional().isNumeric,
    body('description').optional().isString()
  ],
  expressValidator,
  updateUser
);

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
 */
router.delete('/', verifyUserToken, deleteUser);

export default router;
