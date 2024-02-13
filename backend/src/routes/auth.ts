import express  from 'express';
import { body } from 'express-validator';
import { authenticateUser } from '../controllers/UserController';

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
 *            $ref: '#/components/schemas/User'
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
  authenticateUser
);

export default router;
