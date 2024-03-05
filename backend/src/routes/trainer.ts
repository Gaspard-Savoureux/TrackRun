import express from 'express';
import { body } from 'express-validator';
import { createTrainer, authenticateTrainer, getTrainer, updateTrainer, deleteTrainer, addUserToTrainer, removeUserFromTrainer } from '../controllers/TrainerController';
import { checkAccessCode } from '../middlewares/checkAccessTrainer'; 
import { expressValidator } from '../middlewares/validation';
import { verifyTrainerToken } from '../middlewares/authentication';

const router = express.Router();

router.post('/',
  [
    body('username').isString(),
    body('password').isString().isLength({min: 1, max: 72}),
    body('email').isString().isEmail(),
    body('name').isString(),
  ],
  expressValidator,
  checkAccessCode,
  createTrainer
);

router.get('/', verifyTrainerToken, getTrainer);

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
    body('description').optional().isString().isLength({ min: 1, max: 1024 }),
    body('users').optional().isString().isLength({ min: 1, max: 1024 })
  ],
  expressValidator,
  verifyTrainerToken,
  updateTrainer
);

router.delete('/', verifyTrainerToken, deleteTrainer);

router.put('/users/:username', addUserToTrainer);
router.delete('/users/:username', removeUserFromTrainer);


export default router;
