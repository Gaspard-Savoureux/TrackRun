
import request from 'supertest';
import app from '../../src/app';
import { db, closeDbConnection } from '../../src/db/db';
import { users } from '../../src/models/users';
import { eq } from 'drizzle-orm/sql';

const user = {username: 'test-user', password: '1234'};
const route : string = '/auth';
  
beforeAll(async () => {
  await db.delete(users).where(eq(users.username, 'test-user'));
  return request(app).post('/user/create').send(user); // TODO à modifier, moins qu'idéal
});

afterAll(async () => {
  await db.delete(users).where(eq(users.username, 'test-user'));
  return closeDbConnection();
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

