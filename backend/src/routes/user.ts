import express from 'express';
import { body } from 'express-validator';
import { createUser, getUser, deleteUser, updateUser } from '../controllers/UserController';
import { expressValidator } from '../middlewares/validation';
import { verifyUserToken } from '../middlewares/authentication';
import { evTypes, isGivenTypeOrNull } from '../utils/expressValidatorUtils';

const router = express.Router();

/**
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
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *               username:
 *                 type: string
 *                 example: jean-papa
 *               password:
 *                 type: string
 *                 description: The password of a user
 *                 example: voici mon mot de passe
 *               age:
 *                 type: integer
 *                 description: The age of a user
 *                 example: 30
 *               height:
 *                 type: number
 *                 format: float
 *                 description: The height of a user in cm
 *                 example: 180.5
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: The weight of a user in kg
 *                 example: 75.5
 *               sex:
 *                 type: string
 *                 description: The sex of a user
 *                 example: male
 *               description:
 *                 type: string
 *                 description: Description of a user
 *                 example: Timothé le 6e du nom, aime les oranges
 *      404:
 *        description: No corresponding user found
 *      500:
 *        description: Server Error
 */
router.get('/', verifyUserToken, getUser);

/**
 * @swagger
 * /user:
 *   put:
 *     tags:
 *       - user
 *     summary: Update user data
 *     description: Route to update the data of a user using its ID. If you wish to update password use the `PATCH` method instead.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of a user
 *                 example: Jean Paternelle
 *               username:
 *                 type: string
 *                 description: The username of a user
 *                 example: jean-papa
 *               email:
 *                 type: string
 *                 description: The username of a user
 *                 example: jean-papa@yahoo.ca
 *               age:
 *                 type: integer
 *                 description: The age of a user
 *                 example: 30
 *               sex:
 *                 type: string
 *                 enum:
 *                   - Homme
 *                   - Femme
 *                   - Autre
 *                 description: The sex of a user
 *                 example: Homme
 *               height:
 *                 type: number
 *                 format: float
 *                 description: The height of a user in cm
 *                 example: 180.5
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: The weight of a user in kg
 *                 example: 75.5
 *               description:
 *                 type: string
 *                 description: the description of a user.
 *                 example: "Empereur incontesté de l'uqam"
 *             required:
 *               - name
 *               - username
 *               - email
 *               - age
 *               - sex
 *               - height
 *               - weight
 *               - description
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: No corresponding user found
 */
router.put('/',
  [
    body('username').custom(isGivenTypeOrNull(evTypes.STRING)).isLength({min: 1}).withMessage('Required, must be a string and cannot be null'),
    body('email').custom(isGivenTypeOrNull(evTypes.EMAIL)).withMessage('Required, must be a valid email'),
    body('name').custom(isGivenTypeOrNull(evTypes.STRING)).withMessage('Required, must be a string'),
    body('age').custom(isGivenTypeOrNull(evTypes.INT)).withMessage('Required, must be numerical value'),
    body('height').custom(isGivenTypeOrNull(evTypes.FLOAT)).withMessage('Required, must be numerical. The value is in cm'),
    body('weight').custom(isGivenTypeOrNull(evTypes.FLOAT)).withMessage('Required. Must be numerical. The value is in kg'),
    body('sex').isString().matches(/\b(?:Homme|Femme|Autre)\b/).withMessage('Required, must be either Homme, Femme or Autre'),
    body('description').custom(isGivenTypeOrNull(evTypes.STRING)).isLength({ min: 0, max: 1024 }).withMessage('Required, string with max length of 1024')
  ],
  expressValidator,
  verifyUserToken,
  updateUser
);

/**
 * @swagger
 * /user:
 *   patch:
 *     tags:
 *       - user
 *     summary: Update partially user data
 *     description: Route to update `partially` the data of a user using it's ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of a user
 *                 example: Jean Paternelle
 *               username:
 *                 type: string
 *                 description: The username of a user
 *                 example: jean-papa
 *               password:
 *                 type: string
 *                 description: The password of a user
 *                 example: 1234
 *               email:
 *                 type: string
 *                 description: The username of a user
 *                 example: jean-papa@yahoo.ca
 *               age:
 *                 type: integer
 *                 description: The age of a user
 *                 example: 30
 *               sex:
 *                 type: string
 *                 enum:
 *                   - Homme
 *                   - Femme
 *                   - Autre
 *                 description: The sex of a user
 *                 example: Homme
 *               height:
 *                 type: number
 *                 format: float
 *                 description: The height of a user in cm
 *                 example: 180.5
 *               weight:
 *                 type: number
 *                 format: float
 *                 description: The weight of a user in kg
 *                 example: 75.5
 *               description:
 *                 type: string
 *                 description: the description of a user.
 *                 example: "Empereur incontesté de l'uqam"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: No corresponding user found
 */
router.patch('/',
  [
    body('username').optional().isString().isLength({min: 1}).withMessage('Must be a string and cannot be null'),
    body('password').optional().isString().isLength({ min: 1, max: 72 }).withMessage('Must be a string'),
    body('email').optional().isString().isEmail().withMessage('Must be a valid email'),
    body('name').optional().isString().withMessage('Must be a string'),
    body('age').optional().isInt().withMessage('Must be numerical value'),
    body('height').optional().isFloat().withMessage('Must be numerical. The value is in cm'),
    body('weight').optional().isFloat().withMessage('Must be numerical. The value is in kg'),
    body('sex').optional().isString().matches(/\b(?:Homme|Femme|Autre)\b/).withMessage('Must be either Homme, Femme or Autre'),
    body('description').optional().isString().withMessage('String with max length of 1024').isLength({ min: 1, max: 1024 }),
  ],
  expressValidator,
  verifyUserToken,
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
