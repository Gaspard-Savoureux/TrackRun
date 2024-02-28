import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users';
import { getUserById, getUserByUsername, insertUser } from '../services/user.services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

  try {
  // Le mot de passe doit être hasher ceci est juste un exemple
    const { username, password } = req.body;

    const userExist: User | undefined = await getUserByUsername(username);

    // Check if username already taken
    if (userExist) {
      return res.status(409).json({ error: 'A user already has that name' });
    }

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user in the db
    insertUser({ username, password: hashedPassword });

    return res.status(201).json({ message: 'user added succesfully'});
  } catch (error) {
    next(error);
  }
};


export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {

  try {
    // Le mot de passe doit être hasher ceci est juste un exemple
    const { username, password } = req.body;
    const user: User | undefined = await getUserByUsername(username);

    // User does not exist
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {userId: user.id};
    const secret: jwt.Secret = process.env.SECRET as string || 'petit_secret';
    const token = jwt.sign(payload, secret, { expiresIn: '1h'});

    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }

    delete user.password;
    delete user.id;

    return res.status(200).json({ user });

  } catch (error) {
    next(error);
  }
};


// Je l'ai fait par accident
// export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const userId = req.user?.userId as number;
//     const user: User = await getUserById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'Nothing to delete' });
//     }

//     await deleteUserById(userId);

//     return res.status(200).json({ message: 'User successfully deleted' });

//   } catch (error) {
//     next(error);
//   }
// };

