import express, { NextFunction, Request, Response } from 'express';
import { getUser } from '../controllers/UserController';
import { param } from 'express-validator';
import { expressValidator } from '../middlewares/validation';
import { verifyTrainerToken } from '../middlewares/authentication';
import { addUserToTrainer, removeUserFromTrainer, getUsersOfTrainer, searchUsers } from '../controllers/TrainerController';
import { getTrainerAssignedUsers, getAllAssignedUsersExceptRequestingTrainer } from '../controllers/TrainerController';

const router = express.Router();

/**
 * @swagger
 * /trainer/user/{userId}:
 *   get:
 *     tags:
 *       - trainer
 *     summary: Trainer get user data
 *     security:
 *       - BearerAuth: []
 *     description: Route to get the data of a user from a trainer account.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *           required: true
 *           description: the id of a selected user
 *     responses:
 *       200:
 *         description: Information obtained successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: jean-papa
 *                 password:
 *                   type: string
 *                   description: The password of a user
 *                   example: voici mon mot de passe
 *                 age:
 *                   type: integer
 *                   description: The age of a user
 *                   example: 30
 *                 height:
 *                   type: number
 *                   format: float
 *                   description: The height of a user in cm
 *                   example: 180.5
 *                 weight:
 *                   type: number
 *                   format: float
 *                   description: The weight of a user in kg
 *                   example: 75.5
 *                 sex:
 *                   type: string
 *                   description: The sex of a user
 *                   example: male
 *                 description:
 *                   type: string
 *                   description: Description of a user
 *                   example: Timothé le 6e du nom, aime les oranges
 *       404:
 *         description: No corresponding user found
 *       500:
 *         description: Server Error
 */
router.get('/user/:userId',
  verifyTrainerToken,
  [param('userId').notEmpty().isNumeric().withMessage('userId must be given and numeric')],
  expressValidator,
  async (req: Request, res: Response, next: NextFunction) => {
    req.user = { userId: Number(req.params.userId) };
    next();
  },
  getUser
);

/**
 * @swagger
 * /trainer/user/{userId}:
 *   post:
 *     tags:
 *       - trainer
 *     summary: Trainer create association with user
 *     security:
 *       - BearerAuth: []
 *     description: Route to associate a trainer with a user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *           required: true
 *           description: the id of a selected user
 *     responses:
 *       200:
 *         description: Association created
 *       404:
 *         description: No corresponding user|trainer found
 *       409:
 *         description: relation already exist
 *       500:
 *         description: Server Error
 */
router.post('/user/:userId',
  verifyTrainerToken,
  [param('userId').notEmpty().isNumeric().withMessage('userId must be given and numeric')],
  addUserToTrainer
);

/**
 * @swagger
 * /trainer/user/{userId}:
 *   delete:
 *     tags:
 *       - trainer
 *     summary: Trainer delete association with user
 *     security:
 *       - BearerAuth: []
 *     description: Route to delete an association of a trainer and a user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *           required: true
 *           description: the id of a selected user
 *     responses:
 *       200:
 *         description: Association successfully deleted
 *       404:
 *         description: No corresponding user|trainer|relation found
 *       500:
 *         description: Server Error
 */
router.delete('/user/:userId',
  verifyTrainerToken,
  [param('userId').notEmpty().isNumeric().withMessage('userId must be given and numeric')],
  removeUserFromTrainer
);

/**
 * @swagger
 * /trainer/users:
 *   get:
 *     tags:
 *       - trainer
 *     summary: Trainer get the user data of his users depending on a string
 *     security:
 *       - BearerAuth: []
 *     description: Route to get the data of a user containing a certain string associated to a trainer
 *     parameters:
 *       - in: query
 *         name: searchString
 *         schema:
 *           type: string
 *         required: false
 *         description: String to search for in user data
 *     responses:
 *      200:
 *        description: User successfully acquired
 *      405:
 *        description: No corresponding trainer found
 */
router.get('/users',
  verifyTrainerToken,
  getUsersOfTrainer
);

/**
 * @swagger
 * /trainer/search/users:
 *   get:
 *     tags:
 *       - trainer
 *     summary: Trainer find users corresponding to searchString
 *     security:
 *       - BearerAuth: []
 *     description: Route to get the data of a user containing a certain string 
 *     parameters:
 *       - in: query
 *         name: searchString
 *         schema:
 *           type: string
 *         required: false
 *         description: String to search for in user data
 *     responses:
 *      200:
 *        description: User successfully acquired
 *      405:
 *        description: No corresponding trainer found
 */
router.get('/search/users',
  verifyTrainerToken,
  searchUsers
);

/**
 * @swagger
 * /trainer/users/assigned:
 *   get:
 *     tags:
 *       - trainer
 *     summary: Trainer get all assigned users
 *     security:
 *       - BearerAuth: []
 *     description: Route to get all users assigned to a trainer
 *     responses:
 *       200:
 *         description: Users successfully acquired
 *       405:
 *         description: No corresponding trainer found
 */
router.get('/users/assigned', 
  verifyTrainerToken,  
  getTrainerAssignedUsers
);


router.get('/users/assigned/other', 
  verifyTrainerToken, 
  getAllAssignedUsersExceptRequestingTrainer
);

export default router;
