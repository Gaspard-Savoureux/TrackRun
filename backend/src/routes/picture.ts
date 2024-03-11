import express from 'express';
import { body } from 'express-validator';
import { uploadPicture, getPicture, deletePicture} from '../controllers/PictureController';
import { expressValidator } from '../middlewares/validation';
import { verifyUserToken } from '../middlewares/authentication';

const router = express.Router();

/**
 * @swagger
 * /picture:
 *  post:
 *    tags:
 *    - picture
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
 *      404:
 *        description: User not found
 */
router.post('/',
  expressValidator,
  verifyUserToken,
  uploadPicture
);


/**
 * @swagger
 * /picture:
 *  delete:
 *    tags:
 *    - picture
 *    summary: Deletes the picture of user
 *    description: Delete the picture of a user based on its token.
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
 *        description: User not found
 *      405:
 *        description: Picture does not exist
 */
router.delete('/', verifyUserToken, deletePicture);


/**
 * @swagger
 * /picture:
 *  get:
 *    tags:
 *    - picture
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
router.get('/', verifyUserToken, getPicture);


export default router;