import request from 'supertest';
import app from '../../src/app';

const user = {username: 'test-user', password: '1234'};
const route : string = '/auth';
  
jest.mock('../../src/models/users', () => ({
  getUserByUsername: jest.fn()
    .mockImplementationOnce(() => ({id: 1, username: user.username, password: '$2a$12$ikGtdR2h5m/9z5k6eonOLOu/1Uu6RGiOtoX1d2DQ7Tt/CRZAidTX.'}))
    .mockImplementationOnce(() => {}),
  insertUser: jest.fn().mockReturnValue(''),
}));

beforeAll(async () => {
});

afterAll(async () => {
});

describe('POST /auth', () => {

  test('Succesfully returns a token', async () => {
    const res = await request(app)
      .post(route)
      .send(user)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toEqual(200);
  });
  
  test('credentials error when invalid name', async () => {
    const res = await request(app)
      .post(route)
      .send({username: 'invalid-name', password: user.password})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toEqual(401);
  });

  test('credentials error when invalid password', async () => {
    const res = await request(app)
      .post(route)
      .send({username: user.username, password: '4321'})
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toEqual(401);
  });

  test('should send back a bad request error', async () => {
    const badUser = { username: 1234, password: 1234 } ;
    const res = await request(app)
      .post(route)
      .send(badUser)
      .set('Content-Type', 'application/json');
    expect(res.statusCode).toEqual(400);
  });
});

