// https://dev.to/nathan_sheryak/how-to-test-a-typescript-express-api-with-jest-for-dummies-like-me-4epd
import express from 'express';

/***  Routers ***/
import user from './routes/user';
/****************/

const app = express();

app.use(express.json());

/**** Routes ****/
app.use('/user', user);
/****************/

export default app;
