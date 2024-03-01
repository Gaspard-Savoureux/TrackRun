import { NextFunction, Request, Response } from 'express';
import { User, users } from '../models/users';
import { deleteUserById, getUserById, getUserByUsername, getUserByEmail, insertUser, updateUserById } from '../services/user.services';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (req: Request, res: Response, next: NextFunction) => {

  try {
  // Le mot de passe doit être hasher ceci est juste un exemple
    const { username, password, email, name} = req.body;

    const userExist: User | undefined = await getUserByUsername(username);
    const emailExist : User | undefined = await getUserByEmail(email);

    // Check if username already taken
    if (userExist) {
      return res.status(409).json({ error: 'A user already has that name' });
    }

    // Check if email is already used
    if (emailExist){
      return res.status(409).json({error: 'A user already has that email'})
    }


    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user in the db
    insertUser({ username, password: hashedPassword, email, name });

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

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'No corresponding user' });
    }

    const { username, password, age, height, weight, sex, description } = req.body;

    let updateData: Partial<User> = {};

    if (username) updateData.username = username;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (age) updateData.age = age;
    if (height) updateData.height = height;
    if (weight) updateData.weight = weight;
    if (sex) updateData.sex = sex;
    if (description) updateData.description = description;

    await updateUserById(userId, updateData);
    
    return res.status(201).json({ message: 'User successfully updated' });

  } catch (error) {
    next(error);
  }
}


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: 'Nothing to delete' });
    }

    await deleteUserById(userId);

    return res.status(200).json({ message: 'User successfully deleted' });

  } catch (error) {
    next(error);
  }
};

