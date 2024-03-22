import request from 'supertest';
import app from '../../src/app';
import { trainers } from '../../src/models/trainers';
import { closeDbConnection, db } from '../../src/db/db';
import { eq } from 'drizzle-orm';
import { users } from '../../src/models/users';
import { trainerUserAssociation } from '../../src/models/trainerUsersRelation';
import { getUserByUsername } from '../../src/services/user.services';

const user = {username: 'test-user', password: '1234', email: 'test.user@gmail.com', name: 'test user' };
const trainer = { username: 'superTrainer', password: 'weak-password', email: 'trainer@hardcore.com', name: 'Mr. trainer' };

const basicAuthCredentials = Buffer.from(`${process.env.ADMIN_NAME ?? 'admin'}:${process.env.ADMIN_PASSWORD || 'defaultPassword'}`).toString('base64');

beforeAll(async () => {
  await db.delete(trainers).where(eq(trainers.username, trainer.username));
  await db.delete(users).where(eq(users.username, user.username));
  await db.delete(trainerUserAssociation);
});

afterAll(async () => {
  await db.delete(trainers).where(eq(trainers.username, trainer.username));
  await db.delete(users).where(eq(users.username, user.username));
  await db.delete(trainerUserAssociation);
  return closeDbConnection();
});

describe('Tests route POST /trainer/user/{userId}', () => {
  const route = '/trainer/user/';

  test('Should return 401 | Unauthorized', async () => {
    const res = await request(app)
      .get(route + 1);
    expect(res.status).toBe(401);
  });

  test('Should return 404 | User not found', async () => {
    // CREATE TRAINER
    await request(app)
      .post('/admin/trainer')
      .send(trainer)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Basic ${basicAuthCredentials}`);

    const getToken = await request(app)
      .post('/auth/trainer')
      .send({username: trainer.username, password: trainer.password})
      .set('Content-Type', 'application/json');
    
    const { token } = getToken.body;
    const validToken = `Bearer ${token}`;

    const res = await request(app)
      .post(route + 1)
      .set('Authorization', validToken);

    expect(res.status).toBe(404);
    expect(res.text).toBe('{"error":"User not found"}');
  });

  test('Should return 404 | Trainer not found', async () => {
    // CREATE User
    await request(app)
      .post('/user')
      .send(user)
      .set('Content-Type', 'application/json');

      
    const getToken = await request(app)
      .post('/auth/trainer')
      .send({username: trainer.username, password: trainer.password})
      .set('Content-Type', 'application/json');
      
    await db.delete(trainers).where(eq(trainers.username, trainer.username));
      
    const { token } = getToken.body;
    const validToken = `Bearer ${token}`;
      
    const createdUser = await getUserByUsername(user.username);
    const res = await request(app)
      .post(route + createdUser?.id)
      .set('Authorization', validToken);

    expect(res.status).toBe(404);
    expect(res.text).toBe('{"error":"Trainer not found"}');
  });

  test('Should create association between user and trainer successfully', async () => {
    // Bring back deleted trainer
    await request(app)
      .post('/admin/trainer')
      .send(trainer)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Basic ${basicAuthCredentials}`);

    const getToken = await request(app)
      .post('/auth/trainer')
      .send({username: trainer.username, password: trainer.password})
      .set('Content-Type', 'application/json');
    
    const { token } = getToken.body;
    const validToken = `Bearer ${token}`;

    const createdUser = await getUserByUsername(user.username);

    const res = await request(app)
      .post(route + createdUser?.id)
      .set('Authorization', validToken);

    expect(res.status).toBe(200);
  });

  test('Should return a conflict relation already exist', async () => {
    const getToken = await request(app)
      .post('/auth/trainer')
      .send({username: trainer.username, password: trainer.password})
      .set('Content-Type', 'application/json');
    
    const { token } = getToken.body;
    const validToken = `Bearer ${token}`;

    const createdUser = await getUserByUsername(user.username);

    const res = await request(app)
      .post(route + createdUser?.id)
      .set('Authorization', validToken);

    expect(res.status).toBe(409);
  });
});
