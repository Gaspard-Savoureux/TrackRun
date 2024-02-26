import request from 'supertest';
import app from '../../src/app';
import { verifyUserToken } from '../../src/middlewares/authentication';
import { Request, Response } from 'express';

const user = {username: 'test-user', password: '1234'};
const route : string = '/auth';

jest.mock('../../src/models/users', () => ({
  getUserByUsername: jest.fn()
    .mockImplementation(() => ({id: 1, username: user.username, password: '$2a$12$ikGtdR2h5m/9z5k6eonOLOu/1Uu6RGiOtoX1d2DQ7Tt/CRZAidTX.'})),
  insertUser: jest.fn().mockReturnValue(''),
}));

// Example of protected route
app.use('/protected-route', verifyUserToken, (req: Request, res: Response) => {
  return res.json({
    msg: `Access to protected route granted. Your id is ${req.user?.userId}`});
});

beforeAll(async () => {
});

afterAll(async () => {
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

