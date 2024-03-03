import {closeDbConnection, db} from '../../src/db/db';
import {users} from '../../src/models/users';
import {planned_activities} from '../../src/models/planned_activities';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import app from '../../src/app';
import { except } from 'drizzle-orm/mysql-core';

const user = {username: 'test-user', password: '1234', email: 'test@test.com', name: 'Test'};
var auth_token:string;

beforeAll(async () => {
  // Cleans DB
  await db.delete(planned_activities);
  await db.delete(users);
  // Create user
  await request(app).post('/user').send(user);
  // Get auth token
  auth_token = (await request(app).post('/auth').send(user)).body['token'];
});

afterAll(async () => {
  // Cleans DB
  await db.delete(planned_activities);
  await db.delete(users);
  return closeDbConnection();
});

describe('GET PlannedActivities', () => {
  const route : string = '/plannedactivities';
  test('Should return 401: Unauthorized', async () => {
    const res = await request(app)
      .get(route);
    expect(res.status).toBe(401);
  });
  test('Should return empty set', async () => {
    const res = await request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.body).toMatchObject({'plannedActivities': []});
  });
  
  test('Should return set with one element', async () => {
    // TEMPORARY: Create some planned_activities until route is available
    const userid = (await db.select().
      from(users).
      where(eq(users.username, user.username)))[0].id;

    await db.insert(planned_activities).values({user_id: userid, 
                                                type: 'Running', 
                                                date: new Date(2024, 1, 12), 
                                                duration: 3600});
    const res = await request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + auth_token);
      //expect(res.body).toMatchObject({'plannedActivities': []});
      expect(res.body).toEqual({
        'plannedActivities': [expect.objectContaining({
          //Dates might fail depending on timezones
          "type": "Running",
          "duration": 3600,
        })]
      });
  })
});