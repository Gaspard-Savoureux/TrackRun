import express  from 'express';
import { body } from 'express-validator';
import { authenticateUser } from '../controllers/UserController';
// import { authenticateTrainer } from '../controllers/TrainerController';
import { expressValidator } from '../middlewares/validation';

const router = express.Router();


/**
 * @swagger
 * /auth:
 *  post:
 *    tags:
 *    - Authentification
 *    summary: Authenticate user
 *    description: Route to authenticate user
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
 *      200:
 *        description: Succesfull Login
 *      400:
 *        description: Bad Request
 *      401:
 *        description: Wrong Credentials
 *      500:
 *        description: Server Error
 */
router.post('/auth', 
  [
    body('username').isString(),
    body('password').isString()
  ],
  expressValidator,
  authenticateUser
);

// TODO À valider plus tard, mauvaise branche
// router.post('/trainer/auth',
//   [
//     body('username').isString(),
//     body('password').isString()
//   ],
//   expressValidator,
//   authenticateTrainer
// );

export default router;
