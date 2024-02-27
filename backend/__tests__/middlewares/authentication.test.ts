import request from 'supertest';
import app from '../../src/app';
import { verifyUserToken } from '../../src/middlewares/authentication';
import { Request, Response } from 'express';
import { User } from '../../src/models/users';
import bcrypt from 'bcrypt';
import * as actions from '../../src/services/user.services';

const user = {username: 'test-user', password: '1234'};
const route : string = '/protected-route';

// the value returned by the mocked functions getUserByUsername and getUserById
let returnedUser: User;

// Example of protected route
app.use(route, verifyUserToken, (req: Request, res: Response) => {
  return res.json({
    msg: `Access to protected route granted. Your id is ${req.user?.userId}`});
});

jest.mock('../../src/services/user.services');

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  returnedUser = {id: 1, username: user.username, password: hashedPassword};
});

describe('Tests of protected route', () => {
  jest.spyOn(actions, 'getUserByUsername').mockImplementation(() => Promise.resolve(returnedUser));
  test('Succesfully authenticate a user', async () => {
    // Get the token
    const getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');
    expect(getToken.statusCode).toEqual(200);

    const { token } =  getToken.body;

    // Test protected route
    const res = await request(app)
      .get(route)
      .set('Authorization', `Bearer ${token}`);
    
    expect(res.statusCode).toEqual(200);
  
  });

  test('Sould send an unauthorize response', async () => {
    const res = await request(app)
      .get(route)
      .set('Authorization', 'Inadequate token');
    
    expect(res.statusCode).toEqual(401);
  });
  
});

