import { NextFunction, Request, Response } from 'express';

const validAccessCodes = ['onlyTrainer'];

export const checkAccessCode = (req: Request, res: Response, next: NextFunction) => {
  const accessCode = req.body['access-code'];
  if (!validAccessCodes.includes(accessCode)) {
    return res.status(403).json({ error: 'Invalid access code' });
  }
  next();
};