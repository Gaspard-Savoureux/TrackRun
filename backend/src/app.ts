// https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd
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
