import {closeDbConnection, db} from '../../src/db/db';
import {users} from '../../src/models/users';
import {activities} from '../../src/models/activities';
import {eq} from 'drizzle-orm/sql';
import request from 'supertest';
import app from '../../src/app';


const user = {username: 'test-user', password: '1234'};
const activity = {name: 'test', type: 'Running', date: new Date()};


beforeAll(async () => {
  await db.delete(activities).where(eq(activities.user_id, users.id));
  await db.delete(users).where(eq(users.username, 'test-user'));
  return request(app).post('/activity').send(activity);
});

afterAll(async () => {
  await db.delete(activities).where(eq(activities.user_id, users.id));
  await db.delete(users).where(eq(users.username, 'test-user'));
  return closeDbConnection();
});

describe.skip('activity creation', () => {
  const route_user : string = '/user/create';
  test('should create a new user', async () => {
    const res = await request(app)
      .post(route_user)
      .send(user)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
  });
  const route_creation : string = '/activity';
  test('should create a new activity in the database', async () => {
    const res = await  request(app).post(route_creation).send(activity);
    expect(res.status).toBe(201);
  });


});
