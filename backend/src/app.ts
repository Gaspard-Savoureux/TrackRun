import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

/***  Routers ***/
import user from './routes/user';
import stub from './routes/stub';
import auth from './routes/auth';
import activity from './routes/activity';
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
app.use(auth);
app.use('/user', user);
app.use('/', stub);
app.use('/activity', activity);


// Needs to be last
app.use(ErrorHandler);
/****************/

export default app;
