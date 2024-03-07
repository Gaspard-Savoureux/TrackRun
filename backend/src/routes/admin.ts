
import express  from 'express';
import { body, param } from 'express-validator';
import { expressValidator } from '../middlewares/validation';

import { createTrainer, deleteTrainer } from '../controllers/TrainerController';


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

/**
 * 
 * @swagger
 * /admin/trainer/{trainerId}:
 *   delete:
 *     tags:
 *       - admin
 *     security:
 *       - basicAuth: []
 *     summary: delete a trainer
 *     description: delete a trainer based on his/her id
 *     parameters:
 *       - in: path
 *         name: trainerId
 *         schema:
 *           type: integer
 *           required: true
 *           description: the id of a trainer
 *     responses:
 *       200:
 *         description: Trainer successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Trainer successfully deleted
 *       400:
 *         description: Bad Request
 *       404:
 *         description: No corresponding trainerfound
 *       500:
 *         description: Server Internal Error
 */
router.delete('/trainer/:trainerId',
  [
    param('trainerId').exists().toInt(),
  ],
  expressValidator,
  deleteTrainer
);

// ROUTES A ADD
// router.put('/trainers', )
// router.get('/trainers', );

export default router;
