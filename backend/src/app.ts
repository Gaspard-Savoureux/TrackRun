import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import basicAuth from 'express-basic-auth';

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

/**** Routes ****/
app.use('/admin', basicAuth({
  users: { 
    [process.env.ADMIN_NAME as string]: process.env.ADMIN_PASSWORD ?? 'defaultPassword', 
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
