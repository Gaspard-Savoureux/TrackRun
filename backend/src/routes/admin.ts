
import express  from 'express';
import { body } from 'express-validator';
import { expressValidator } from '../middlewares/validation';

import { createTrainer } from '../controllers/TrainerController';


const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     basicAuth: # Name of the security scheme, can be anything
 *       type: http
 *       scheme: basic
 */

/**
 *
 * @swagger
 * /admin/trainer:
 *   post:
 *     tags:
 *       - admin
 *     summary: Create new trainer
 *     description: Route to create a new trainer
 *     security:
 *       - basicAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the trainer
 *                 example: momo
 *               password:
 *                 type: string
 *                 description: The password of the trainer
 *                 example: mésopotamie
 *               email:
 *                 type: string
 *                 description: The email of the trainer
 *                 example: maurice@gmail.com
 *               name:
 *                 type: string
 *                 description: The name of a user
 *                 example: Maurice Du Plat Lisse
 *     responses:
 *       201:
 *         description: New user created
 *       400:
 *         description: Bad Request
 *       409:
 *         description: Conflict
 *       500:
 *         description: Server Error
 */
router.post('/trainer', 
  [
    body('username').isString(),
    body('password').isString().isLength({min: 1, max: 72}),
    body('email').isString().isEmail(),
    body('name').isString(),
  ],
  expressValidator,
  createTrainer
);

export default router;
