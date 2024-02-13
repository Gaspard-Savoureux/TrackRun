import { Request, Response } from 'express';
import { User, users } from '../models/users';
import { validationResult } from 'express-validator';
import { db } from '../db/db';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user in the db
    await db.insert(users).values([{ username, password: hashedPassword }]);
    return res.status(201).json({ message: 'user added succesfully'});
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// TODO add userExist to check if username is taken before the user has to submit is request to create a new user

export const authenticateUser = async (req: Request, res: Response) => {
  // TODO à mettre dans middleware
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array()});
  }

  try {
    // Le mot de passe doit être hasher ceci est juste un exemple
    const { username, password } = req.body;
    const [ user ]: User[] = await db.select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    // User does not exist
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {userId: user.id};
    const secret: jwt.Secret = process.env.SECRET as string;
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
