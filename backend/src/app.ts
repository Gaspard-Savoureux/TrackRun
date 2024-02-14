import express from 'express';

/***  Routers ***/
import user from './routes/user';
import stub from './routes/stub';
import auth from './routes/auth';
/****************/

/*** Middlewares ***/
import ErrorHandler  from './middlewares/errorHandling';
/******************/

const app = express();

app.use(express.json());

/**** Routes ****/
app.use(auth);
app.use('/user', user);
app.use('/', stub);

// Needs to be last
app.use(ErrorHandler);
/****************/

export default app;
