import request from 'supertest';
import app from '../../src/app';

const user = {username: 'test-user', password: '1234'};

jest.mock('../../src/models/users', () => ({
  getUserByUsername: jest.fn()
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(() => ({id: 1, ...user})),
  insertUser: jest.fn().mockReturnValue(''),
}));

beforeAll(() => {
});

afterAll(async () => {
});

describe('User routes', () => {

  describe('POST /user/create', () => {
    const route : string = '/user/create';

    test('should create a new user', async () => {
      const res = await request(app)
        .post(route)
        .send(user)
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(201);
    });

    test('should send back a conflict error', async () => {
      const res = await request(app)
        .post(route)
        .send(user)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(409);
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

});
