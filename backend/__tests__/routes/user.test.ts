import request from 'supertest';
import app from '../../src/app';

const user = {username: 'test-user', password: '1234'};
const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE3MDkwNTA5OTB9.06MlfRValeODxFKUrNKNXiYaZMtlZD1I5nry4O8Lh-Y';

jest.mock('../../src/models/users', () => ({
  getUserByUsername: jest.fn()
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(() => ({id: 1, ...user})),
  insertUser: jest.fn().mockReturnValue(''),
  getUserById: jest.fn()
    .mockImplementationOnce(() => ({id: 1, ...user}))
    .mockImplementationOnce(() => undefined),
}));

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

  describe('GET /user', () => {
    test('should obtain informations successfully', async () => {
      const res = await request(app)
        .get('/user')
        .set('Authorization', token);
      expect(res.statusCode).toEqual(200);
    });

    test('sould not be able to find a corresponding user', async () => {
      const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE3MDkwNTA5OTB9.06MlfRValeODxFKUrNKNXiYaZMtlZD1I5nry4O8Lh-Y';

      const res = await request(app)
        .get('/user')
        .set('Authorization', invalidToken);
      expect(res.statusCode).toEqual(404);
    });
  });
});
