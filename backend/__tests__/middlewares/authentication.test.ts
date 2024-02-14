import request from 'supertest';
import app from '../../src/app';
import { db, closeDbConnection } from '../../src/db/db';
import { users } from '../../src/models/users';
import { eq } from 'drizzle-orm/sql';
import { verifyUserToken } from '../../src/middlewares/authentication';
import { Request, Response } from 'express';

const user = {username: 'test-user', password: '1234'};
const route : string = '/auth';

// Example of protected route
app.use('/protected-route', verifyUserToken, (req: Request, res: Response) => {
  return res.json({
    msg: `Access to protected route granted. Your id is ${req.user?.userId}`});
});

beforeAll(async () => {
  await db.delete(users).where(eq(users.username, 'test-user'));
  return request(app).post('/user/create').send(user); // TODO à modifier, moins qu'idéal
});

afterAll(async () => {
  await db.delete(users).where(eq(users.username, 'test-user'));
  return closeDbConnection();
});

describe('POST /auth', () => {

  test('Succesfully authenticate a user', async () => {
    // Get the token
    const getToken = await request(app)
      .post(route)
      .send(user)
      .set('Content-Type', 'application/json');
    expect(getToken.statusCode).toEqual(200);

    const { token } =  getToken.body;

    // Test protected route
    const res = await request(app)
      .get('/protected-route')
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
  
  });

  test('Sould send an unauthorize response', async () => {
    const res = await request(app)
      .get('/protected-route')
      .set('Authorization', 'Inadequate token');
    
    expect(res.statusCode).toEqual(401);
  });
  
});

