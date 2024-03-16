import express from 'express';
import { body } from 'express-validator';
import { createUser, getUser, deleteUser, updateUser, uploadPicture, getPicture } from '../controllers/UserController';
import { expressValidator } from '../middlewares/validation';
import { verifyUserToken } from '../middlewares/authentication';

const router = express.Router();

/**f
 * @swagger
 * /user:
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
 *              age:
 *                required: true
 *                type: integer
 *                description: The age of a user
 *                example: 30
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
router.post('/',
  [
    body('username').isString(),
    body('password').isString().isLength({min: 1, max: 72}),
    body('email').isString().isEmail(),
    body('name').isString()
  ],
  expressValidator,
  createUser
);


/**
 * @swagger
 * /user:
 *   get:
 *     tags:
 *       - user
 *     summary: Get user data
 *     description: Route to get the data of a user using its token
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Information obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   required: true
 *                   type: string
 *                   example: jean-papa
 *                 password:
 *                   required: true
 *                   type: string
 *                   description: The password of a user
 *                   example: 1234
 *                 email:
 *                   required: true
 *                   type: string
 *                   description: The email of a user
 *                   example: jeanpapa@gmail.com
 *                 name:
 *                   required: true
 *                   type: string
 *                   description: The name of a user
 *                   example: jean-papa Juanpadre
 *                 age:
 *                   required: true
 *                   type: integer
 *                   description: The age of a user
 *                   example: 30
 *                 height:
 *                   required: false
 *                   type: number
 *                   format: float
 *                   description: The height of a user in cm
 *                   example: 180.5
 *                 weight:
 *                   required: false  
 *                   type: number
 *                   format: float
 *                   description: The weight of a user in kg
 *                   example: 75.5
 *                 sex:
 *                   required: false
 *                   type: string
 *                   description: The sex of a user
 *                   example: male
 *                 description:
 *                   required: false
 *                   type: string
 *                   description: Description of a user
 *                   example: Timothé le 6e du nom, aime les oranges
 *       404:
 *         description: No corresponding user found
 *       500:
 *         description: Server Error
 */
router.get('/', verifyUserToken, getUser);


/**
 * @swagger
 * /user:
 *  put:
 *    tags:
 *    - user
 *    summary: Update user data
 *    description: Route to update the data of a user using its ID
 *    security:
 *      - BearerAuth: []
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
 *              age:
 *                type: integer
 *                description: The age of a user
 *                example: 30
 *              height:
 *                type: number
 *                format: float
 *                description: The height of a user in cm
 *                example: 180.5
 *              weight:
 *                type: number
 *                format: float
 *                description: The weight of a user in kg
 *                example: 75.5
 *              sex:
 *                type: string
 *                description: The sex of a user
 *                example: male
 *              description:
 *                type: string
 *                description: Description of a user
 *                example: Timothé le 6e du nom, aime les oranges
 *    responses:
 *      200:
 *        description: User updated successfully
 *      404:
 *        description: No corresponding user found
 */
router.put('/',
  [
    body('username').optional().isString(),
    body('password').optional().isString().isLength({ min: 1, max: 72 }),
    body('email').optional().isString().isEmail(),
    body('name').optional().isString(),
    body('age').optional().isInt(),
    body('height').optional().isFloat(),
    body('weight').optional().isFloat(),
    body('sex').optional().isString().isLength({ min: 1, max: 6 }),
    body('description').optional().isString().isLength({ min: 1, max: 1024 })
  ],
  expressValidator,
  verifyUserToken,
  updateUser,
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


/**
 * @swagger
 * /user/picture:
 *  put:
 *    tags:
 *    - user
 *    summary: Upload user picture
 *    description: Upload the picture of a user
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              picture:
 *                type: string
 *                format: binary
 *                description: The picture of a user
 *    responses:
 *      200:
 *        description: User picture updated successfully
 *      400:
 *        description: Failed to upload the picture
 *      402:
 *        description: No picture uploaded
 *      404:
 *        description: User not found
 */
router.put('/picture',
  expressValidator,
  verifyUserToken,
  uploadPicture,
);


/**
 * @swagger
 * /user/picture:
 *  get:
 *    tags:
 *    - user
 *    summary: Get user picture
 *    description: Retrieve the picture of a user
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User picture retrieved successfully
 *      404:
 *        description: User not found
 *      405:
 *        description: Picture does not exist
 */
router.get('/picture', verifyUserToken, getPicture);

export default router;