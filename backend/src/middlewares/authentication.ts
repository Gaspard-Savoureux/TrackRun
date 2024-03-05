import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userPayload, trainerPayload } from '../types';


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 */
export const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized'});
  }

  const token = authHeaders.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string || 'petit_secret') as userPayload;
    req.user = decoded;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token'});
  }
};

export const verifyTrainerToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;

  if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized'});
  }

  const token = authHeaders.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET as string || 'trainer_secret') as trainerPayload;
    req.trainer = decoded;
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token'});
  }
};