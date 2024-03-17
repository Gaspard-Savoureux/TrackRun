import { NextFunction, Request, Response } from 'express';
import { Trainer} from '../models/trainers';
import { deleteTrainerById, getTrainerById, getTrainerByUsername, getTrainerByEmail, insertTrainer, updateTrainerById, getAllTrainers } from '../services/trainer.services';
// import { updateUserById, getUserByUsername } from '../services/user.services';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';

export const createTrainer = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { username, password, email, name } = req.body;

    const TrainerExist: Trainer | undefined = await getTrainerByUsername(username);
    const emailExist: Trainer | undefined = await getTrainerByEmail(email);

    if (TrainerExist) {
      return res.status(409).json({ error: 'A Trainer already has that name' });
    }

    if (emailExist) {
      return res.status(409).json({ error: 'A Trainer already has that email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    insertTrainer({ username, password: hashedPassword, email, name });

    return res.status(201).json({ message: 'Trainer added succesfully' });
  } catch (error) {
    next(error);
  }
};

// TODO À valider plus tard, mauvaise branche
// export const authenticateTrainer = async (req: Request, res: Response, next: NextFunction) => {

//   try {
//     const { username, password } = req.body;
//     const trainer: Trainer | undefined = await getTrainerByUsername(username);

//     if (!trainer) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, trainer.password as string);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const payload = { trainerId: trainer.id };
//     const secret: jwt.Secret = process.env.SECRET as string || 'petit_secret';
//     const token = jwt.sign(payload, secret, { expiresIn: '1h' });

//     return res.status(200).json({ token });
//   } catch (error) {
//     next(error);
//   }
// };

export const getTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainerId  = Number(req.params?.trainerId);
    const trainer: Trainer | undefined = await getTrainerById(trainerId);

    if (!trainer) {
      return res.status(404).json({ error: 'No corresponding trainer' });
    }

    delete trainer.password;
    delete trainer.id;

    return res.status(200).json(trainer);

  } catch (error) {
    next(error);
  }
};

export const getTrainers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainer: Trainer[] | undefined = await getAllTrainers();

    if (!trainer) {
      return res.status(404).json({ error: 'No corresponding trainer' });
    }

    return res.status(200).json(trainer);

  } catch (error) {
    next(error);
  }
};



export const updateTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainerId  = Number(req.params?.trainerId);
    const trainer: Trainer | undefined = await getTrainerById(trainerId);

    if (!trainer) {
      return res.status(404).json({ error: 'No corresponding trainer' });
    }

    const { username, password, name, email } = req.body;

    const emailInUse = await getTrainerByEmail(email);
    const usernameInUse = await getTrainerByUsername(username);

    if (emailInUse) return res.status(409).json({ error: 'A trainer already has that name' });
    if (usernameInUse) return res.status(409).json({error: 'A trainer already has that email'});

    const updateData: Partial<Trainer> = {};

    if (username) updateData.username = username;
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    await updateTrainerById(trainerId, updateData);

    return res.status(200).json({ message: 'Trainer successfully updated' });

  } catch (error) {
    next(error);
  }
};


export const deleteTrainer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trainerId  = Number(req.params?.trainerId);
    const trainer: Trainer | undefined = await getTrainerById(trainerId);

    if (!trainer) {
      return res.status(404).json({ error: 'Nothing to delete' });
    }

    await deleteTrainerById(trainerId);

    return res.status(200).json({ message: 'Trainer successfully deleted' });

  } catch (error) {
    next(error);
  }
};


// TODO À valider plus tard, mauvaise branche
// export const addUserToTrainer = async (req: Request, res: Response) => {
//   const { username } = req.body;
//   const trainerId = req.trainer?.trainerId as number;

//   const user = await getUserByUsername(username);
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   const trainer = await getTrainerById(trainerId);
//   if (!trainer) {
//     return res.status(404).json({ error: 'Trainer not found' });
//   }

//   const usersList = trainer.users ? trainer.users.split(',') : [];
//   const id = user.id as number;

//   if (usersList.includes(id.toString())) {
//     return res.status(409).json({ error: 'User already added to trainer' });
//   }

//   usersList.push(id.toString());
//   await updateTrainerById(trainerId, { users: usersList.join(',') });

//   // Update trainerId field in user's record
//   await updateUserById(Number(id), { trainerId });
//   res.status(200).json({ message: 'User added to trainer' });
// };

// export const removeUserFromTrainer = async (req: Request, res: Response) => {
//   const { username } = req.body;
//   const trainerId = req.trainer?.trainerId as number;

//   const user = await getUserByUsername(username);
//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   const trainer = await getTrainerById(trainerId);
//   if (!trainer) {
//     return res.status(404).json({ error: 'Trainer not found' });
//   }

//   const usersList = trainer.users ? trainer.users.split(',') : [];
//   const id = user.id as number;
//   const index = usersList.indexOf(id.toString());
//   if (index === -1) {
//     return res.status(409).json({ error: 'User not found in trainer' });
//   }

//   usersList.splice(index, 1);
//   await updateTrainerById(trainerId, { users: usersList.join(',') });

//   // Update trainerId field in user's record
//   await updateUserById(Number(id), { trainerId: null });

//   res.status(200).json({ message: 'User removed from trainer' });
// };
