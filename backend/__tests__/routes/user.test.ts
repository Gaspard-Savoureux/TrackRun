import request from 'supertest';
import app from '../../src/app';
import { db, closeDbConnection } from '../../src/db/db';
import { users } from '../../src/models/users';
import { eq } from 'drizzle-orm/sql';

const user = {username: 'test-user', password: '1234'};

beforeAll(() => {
  return db.delete(users).where(eq(users.username, 'test-user'));
});

afterAll(async () => {
  await db.delete(users).where(eq(users.username, 'test-user'));
  return closeDbConnection();
});

describe('User routes', () => {

  describe('POST /user/create', () => {
    const route : string = '/user/create';

    test('should create a new user', async () => {
      const res = await request(app).post(route).send(user);
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
