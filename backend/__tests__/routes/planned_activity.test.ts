import {closeDbConnection, db} from '../../src/db/db';
import {users} from '../../src/models/users';
import {planned_activities} from '../../src/models/planned_activities';
import {eq} from 'drizzle-orm';
import request from 'supertest';
import app from '../../src/app';
import {except} from 'drizzle-orm/mysql-core';

const user = {username: 'test-user', password: '1234', email: 'test@test.com', name: 'Test'};
var auth_token: string;

beforeAll(async () => {
  // Cleans DB
  await db.delete(planned_activities);
  await db.delete(users);
  // Create user
  await request(app).post('/user').send(user);
  // Get auth token
  auth_token = (await request(app).post('/auth').send(user)).body['token'];
  console.log("Auth token: " + auth_token);
});

afterAll(async () => {
  // Cleans DB
  await db.delete(planned_activities);
  await db.delete(users);
  return closeDbConnection();
});

describe('GET PlannedActivities', () => {
  const route: string = '/plannedactivities';
  test('Should return 401: Unauthorized', async () => {
    const res = await request(app)
      .get(route);
    expect(res.status).toBe(401);
  });

  test('Should return empty set', async () => {
    const res = await request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.body).toMatchObject({plannedActivities: []});
  });

  test('Should return set with one element', async () => {
    // TEMPORARY: Create some planned_activities until route is available
    const userid = (await db.select().from(users).where(eq(users.username, user.username)))[0].id;

    await db.insert(planned_activities).values({
      user_id: userid,
      type: 'Running',
      date: new Date(2024, 1, 12),
      duration: 3600
    });
    const res = await request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + auth_token);

    expect(res.body).toEqual({
      'plannedActivities': [expect.objectContaining({
        //Dates might fail depending on timezones
        "type": "Running",
        "duration": 3600,
      })]
    });
  });
});

describe('Filter PlannedActivities', () => {
  const route: string = '/plannedactivities';
  beforeAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
    // Create a user
    const userid = (await db.select().from(users).where(eq(users.username, user.username)))[0].id;
    await db.insert(planned_activities).values([
      {
        user_id: userid,
        type: 'Walking',
        date: new Date(2024, 1, 10), // February 10th
        duration: 3600,
      },
      {
        user_id: userid,
        type: 'Walking',
        date: new Date(2024, 1, 12), // February 12th
        duration: 1000,
      },
      {
        user_id: userid,
        type: 'Biking',
        date: new Date(2024, 1, 15), // February 15th
        duration: 1800,
      },
    ]);
  })

  test('Filter by date', async () => {
    const fromDate = '2024-02-12'; // February 12th
    const resFromDate = await request(app).get(route).query({
      from: fromDate,
    }).set('Authorization', 'Bearer ' + auth_token);
    console.log(resFromDate.body.plannedActivities);
    expect(resFromDate.body.plannedActivities.length).toBe(2);
    expect(resFromDate.body.plannedActivities[0].type).toBe('Walking');
    expect(resFromDate.body.plannedActivities[1].type).toBe('Biking');
  });

  test('Filter by activity type', async () => {
    const resFromDate = await request(app).get(route).query({
      type: 'Walking',
    }).set('Authorization', 'Bearer ' + auth_token);
    expect(resFromDate.body.plannedActivities.length).toBe(2);
    expect(resFromDate.body.plannedActivities[0].type).toBe('Walking');
    expect(resFromDate.body.plannedActivities[1].type).toBe('Walking');
  });

  test('Filter by date and activity type', async () => {
    const fromDate = '2024-02-12'; // February 12th
    const resFromDate = await request(app).get(route).query({
      type: 'Walking',
      from: fromDate
    }).set('Authorization', 'Bearer ' + auth_token);
    expect(resFromDate.body.plannedActivities.length).toBe(1);
    expect(resFromDate.body.plannedActivities[0].type).toBe('Walking');
  });

  test('Invalid from query', async () => {
    const res = await request(app)
      .get(route)
      .query({from: "2024/15/05"}) // invalid date
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.status).toBe(400);
  });

  test('Invalid type query', async () => {
    const res = await request(app)
      .get(route)
      .query({type: "Swimming"}) // invalid activity type
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.status).toBe(400);
  });
})
