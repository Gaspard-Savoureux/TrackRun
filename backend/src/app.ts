import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import basicAuth from 'express-basic-auth';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

/***  Routers ***/
import user from './routes/user';
import trainer from './routes/trainer';
import planned_activities from './routes/planned_activity';
import stub from './routes/stub';
import auth from './routes/auth';
import activity from './routes/activity';
import admin from './routes/admin';
/****************/

/*** Middlewares ***/
import ErrorHandler  from './middlewares/errorHandling';
/******************/



dotenv.config();

const app = express();

app.use(express.json());


// allow different origin for development
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173'
  }));
}

/**** Storage ****/
import { userPayload } from './types';

export const storagePicture = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    const userId = (req.user as userPayload).userId;
    const fileExtension = file.originalname.split('.').pop();
    const randomString = crypto.randomBytes(8).toString('hex');
    const fileName = `${userId}-${randomString}.${fileExtension}`;
    cb(null, fileName);
  }
});
export const uploadPic = multer({ storage: storagePicture }).single('picture');





/**** Routes ****/
app.use('/admin', basicAuth({
  users: { 
    [process.env.ADMIN_NAME ?? 'admin' as string]: process.env.ADMIN_PASSWORD ?? 'defaultPassword', 
  }
}), admin);
app.use(auth);
app.use('/user', user);
app.use('/trainer', trainer);
app.use('/plannedactivities', planned_activities);
app.use('/', stub);
app.use('/activity', activity);


// Needs to be last
app.use(ErrorHandler);
/****************/

export default app;
