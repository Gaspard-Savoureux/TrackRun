import { Request, Response } from 'express';
import { users } from '../models/users';
import { validationResult } from 'express-validator';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';

export const createUser = async (req: Request, res: Response) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  try {
    // Le mot de passe doit être hasher ceci est juste un exemple
    const { username, password } = req.body;
    const userExist = await db.select()
      .from(users)
      .where(eq(users.username, username));
        
    // Check if username already taken
    if (userExist.length !== 0) {
      return res.status(409).json({ error: 'A user already has that name' });
    }

    // Insert the new user in the db
    const user = await db.insert(users).values([{ username, password }]);
    return res.status(201).json({ message: 'user added succesfully', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// TODO add userExist to check if username is taken before the user has to submit is request to create a new user
