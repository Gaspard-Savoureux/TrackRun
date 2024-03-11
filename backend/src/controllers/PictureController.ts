import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users';
import { getUserById} from '../services/user.services';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
      




const uploadDir = path.resolve(__dirname, '../../uploads/'); 

// Picture controller
export const uploadPicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user || !user.username) {
      return res.status(404).json({ message: 'No corresponding user' });
    }


    const storagePicture = multer.diskStorage({
      destination: (req, file, callback) => {
        callback(null, uploadDir);
      },
      filename: (req, file, callback) => {
        const uniqueFilename = `${user.username}`;
        callback(null, uniqueFilename);
      }
    });

    const upload = multer({ storage: storagePicture }).any();

    upload(req, res, function (err: any) {
      if (err) {
        return res.status(400).json({ message: 'Failed to upload picture', error: err.message });
      }
      return res.status(200).json({ message: 'Picture uploaded successfully' });
    });

  } catch (error) {
    next(error);
  }
};


export const getPicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user || !user.username) {
      return res.status(404).json({ message: 'No corresponding user' });
    }

    const picturePath = path.join(uploadDir, user.username); 

    if (fs.existsSync(picturePath)) {
      return res.status(200).sendFile(picturePath);
    } else {
      return res.status(404).json({ message: 'Picture does not exist' });
    }

  } catch (error) {
    next(error);
  }
};


export const deletePicture = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId as number;
    const user: User | undefined = await getUserById(userId);

    if (!user || !user.username) {
      return res.status(404).json({ message: 'No corresponding user' });
    }

    const picturePath = path.join(uploadDir, user.username); 

    if (fs.existsSync(picturePath)) {
      fs.unlinkSync(picturePath);
      return res.status(200).json({ message: 'Picture successfully deleted' });
    } else {
      return res.status(404).json({ message: 'Picture does not exist' });
    }

  } catch (error) {
    next(error);
  }
};