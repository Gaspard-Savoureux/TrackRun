import express from 'express';

/***  Routers ***/
import user from './routes/user';
import stub from './routes/stub';
import auth from './routes/auth';
/****************/

const app = express();

app.use(express.json());

/**** Routes ****/
app.use(auth);
app.use('/user', user);
app.use('/', stub);
/****************/

export default app;
