import { JwtPayload } from 'jsonwebtoken';
import 'express';


/**
 * @swagger
 * components:
 *   schemas:
 *     UserPayload:
 *       type: object
 *       properties:
 *         userId:
 *           type: integer
 *           example: 1
 * 
 */
export type userPayload = {
  userId: number; 
  [key: string]: JwtPayload | string;

}; 
// declare module 'express-serve-static-core' {
//   interface Request {
//     user?: userPayload;
//   }
// }

declare global {
  namespace Express {
    export interface Request {
      user?: userPayload;
    }
  }
}
