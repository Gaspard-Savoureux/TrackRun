/**** uploadUserPic ****/
import multer from 'multer';
import crypto from 'crypto';
import { userPayload } from '../types';

export const storagePicture = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const userId = (req.user as userPayload).userId;
    const fileExtension = file.originalname.split('.').pop();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileName = `${userId}-${randomString}.${fileExtension}`;
    cb(null, fileName);
  }
});

export const uploadUserPic = multer({ storage: storagePicture }).single('picture');
