import { closeDbConnection, db } from '../../src/db/db';
import { users } from '../../src/models/users';
import { planned_activities } from '../../src/models/planned_activities';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import app from '../../src/app';


const user = {
  username: 'test-user',
  password: 'Testuser1234',
  email: 'test@test.com',
  name: 'Test'
};

let auth_token: string;

beforeAll(async () => {
  // Cleans DB
  await db.delete(planned_activities);
  await db.delete(users);
  // Create user
  const createRes = await request(app).post('/user').send(user);
  const userRes = (await db.select().from(users).where(eq(users.username, user.username)))[0].id;

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
  const route: string = '/plannedactivities';
  const fromDate = '2024-02-12'; // February 12th
  test('Should return 401: Unauthorized', async () => {
    const res = await request(app)
      .get(route);
    expect(res.status).toBe(401);
  });

  test('Should return empty set', async () => {
    const res = await request(app)
      .get(route)
      .query({
        from: fromDate,
      })
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.body).toMatchObject({ plannedActivities: [] });
  });

  test('Should return set with one element', async () => {

    const pActivity = {
      type: 'Running',
      date: `${fromDate} 16:30:00`,
      duration: 3600,
      name: 'A run in the park',
      comment: 'Remember to focus on your breath the entire time!'
    };

    await request(app)
      .post(route)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const res = await request(app)
      .get(route)
      .query({
        from: fromDate,
      })
      .set('Authorization', 'Bearer ' + auth_token);

    expect(res.body).toEqual({
      plannedActivities: [expect.objectContaining({
        //Dates might fail depending on timezones
        type: 'Running',
        duration: 3600,
        name: 'A run in the park',
        comment: 'Remember to focus on your breath the entire time!'
      })]
    });
  });
});


describe('PUT PlannedActivities', () => {
  const route: string = '/plannedactivities';

  beforeAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  afterAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  test('Should return 401: Unauthorized', async () => {

    const res = await request(app)
      .put(route + '/1');
    expect(res.status).toBe(401);
  });

  test('Should return success message', async () => {
    const pActivity = {
      type: 'Running',
      date: '2024-02-26 16:30:00',
      duration: 1823,
      name: 'A run in the park',
      comment: 'Remember to focus on your breath the entire time!',
    };

    const resPost = await request(app)
      .post(route)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const pActivityId = resPost.body.id;

    pActivity.name = 'A run in the field';
    pActivity.duration = 666;

    const resPut = await request(app)
      .put(route + '/' + pActivityId)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const resGet = await request(app)
      .get(route + '/' + pActivityId)
      .set('Authorization', 'Bearer ' + auth_token);

    expect(resGet.body).toEqual({
      plannedActivity: expect.objectContaining({
        name: 'A run in the field',
        duration: 666
      })
    });
  });
});


describe('POST PlannedActivities', () => {
  const route: string = '/plannedactivities';
  beforeAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  afterAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  test('Should return 401: Unauthorized', async () => {
    const pActivity = {
      type: 'Running',
      date: '2024-02-26 16:30:00',
      duration: 1823,
      name: 'A run in the park',
      comment: 'Remember to focus on your breath the entire time!'
    };

    const res = await request(app)
      .post(route)
      .send(pActivity);
    expect(res.status).toBe(401);
  });


  test('Should return transformed undefined name and comment', async () => {

    const pActivity = {
      type: 'Running',
      date: '2024-02-26 16:30:00',
      duration: 1823,
      name: undefined,
      comment: undefined
    };

    await request(app)
      .post(route)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const res = await request(app)
      .get(route)
      .query({
        from: '2024-02-26',
      })
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.body).toEqual({
      plannedActivities: [expect.objectContaining({
        type: 'Running',
        duration: 1823,
        name: 'Running',
        comment: ''
      })]
    });
  });

});

describe('Get planned activity with id', () => {
  const route: string = '/plannedactivities';
  beforeAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  afterAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  test('Should return 401: Unauthorized', async () => {

    const res = await request(app)
      .get(route + '/1');
    expect(res.status).toBe(401);
  });

  test('Should return created activity', async () => {
    const pActivity = {
      type: 'Running',
      date: '2024-02-26 16:30:00',
      duration: 1823,
      name: 'A run in the park',
      comment: 'Remember to focus on your breath the entire time!'
    };

    const resPost = await request(app)
      .post(route)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const pActivityId = resPost.body.id;

    const resGet = await request(app)
      .get(route + '/' + pActivityId)
      .set('Authorization', 'Bearer ' + auth_token);


    expect(resGet.body).toEqual({
      plannedActivity: expect.objectContaining({
        id: pActivityId,
      })
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
        type: 'Running',
        date: new Date(2024, 1, 3), // February 3rd
        duration: 3600,
      },
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
  });

  test('Filter by date', async () => {
    const fromDate = '2024-02-4'; // February 12th
    const resFromDate = await request(app).get(route).query({
      from: fromDate,
    }).set('Authorization', 'Bearer ' + auth_token);
    expect(resFromDate.status).toBe(200);
    expect(resFromDate.body.plannedActivities.length).toBe(1);
    expect(resFromDate.body.plannedActivities[0].type).toBe('Walking');
  });

  test('Filter by activity type', async () => {
    const fromDate = '2024-02-10'; // February 10th
    const resFromDate = await request(app).get(route).query({
      type: 'Walking',
      from: fromDate,
    }).set('Authorization', 'Bearer ' + auth_token);
    expect(resFromDate.status).toBe(200);
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
    expect(resFromDate.status).toBe(200);
    expect(resFromDate.body.plannedActivities.length).toBe(1);
    expect(resFromDate.body.plannedActivities[0].type).toBe('Walking');
  });

  test('Missing from query', async () => {
    const res = await request(app)
      .get(route)
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.status).toBe(400);
  });

  test('Invalid from query', async () => {
    const res = await request(app)
      .get(route)
      .query({ from: '2024/15/05' }) // invalid date
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.status).toBe(400);
  });

  test('Invalid type query', async () => {
    const res = await request(app)
      .get(route)
      .query({ type: 'Swimming' }) // invalid activity type
      .set('Authorization', 'Bearer ' + auth_token);
    expect(res.status).toBe(400);
  });
});


describe('DELETE PlannedActivities', () => {
  const routePOST: string = '/plannedactivities';
  const routeGET: string = '/plannedactivities';
  const routeDELETE: string = '/plannedactivities';
  let createdActivityId;

  beforeAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  afterAll(async () => {
    // Cleans DB
    await db.delete(planned_activities);
  });

  test('should create and then delete a planned activity', async () => {

    const pActivity = {
      type: 'Running',
      date: '2024-02-26 16:30:00',
      duration: 1823,
      name: 'Run Forest Run',
      comment: undefined
    };

    let res = await request(app)
      .post(routePOST)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const createdActivityId = res.body.id;

    res = await request(app)
      .delete(routeDELETE + '/' + createdActivityId)
      .set('Authorization', 'Bearer ' + auth_token);


    expect(res.status).toBe(200);

    res = await request(app)
      .get(routeGET)
      .query({
        from: '2024-02-26',
      })
      .set('Authorization', 'Bearer ' + auth_token);

    expect(res.body).toEqual({ plannedActivities: [] });
  });

  test('Delete wrong activityId ', async () => {

    const pActivity = {
      type: 'Running',
      date: '2024-04-01 16:30:00',
      duration: 1234,
      name: 'April Fool Run',
      comment: undefined
    };

    let res = await request(app)
      .post(routePOST)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token);

    const createdActivityId = -1;

    res = await request(app)
      .delete(routeDELETE + '/' + createdActivityId)
      .set('Authorization', 'Bearer ' + auth_token);

    expect(res.status).toBe(404);

    res = await request(app)
      .get(routeGET)
      .query({
        from: '2024-04-01',
      })
      .set('Authorization', 'Bearer ' + auth_token);

    expect(res.body).toEqual({
      plannedActivities: [expect.objectContaining({
        type: 'Running',
        duration: 1234,
        name: 'April Fool Run',
        comment: ''
      })]
    });
  });

  test('Delete activity of another user', async () => {
    const user2 = { username: 'test-user2', password: '1234', email: 'test2@test.com', name: 'Test2' };
    // Create second user
    await request(app).post('/user').send(user2);
    // Get auth token
    const auth_token2 = (await request(app).post('/auth').send(user)).body['token'];

    const pActivity = {
      type: 'Running',
      date: '2024-03-15 16:30:00',
      duration: 1234,
      name: 'St Patrick strikers',
      comment: undefined
    };

    let res = await request(app)
      .post(routePOST)
      .send(pActivity)
      .set('Authorization', 'Bearer ' + auth_token2);

    const createdActivityId = res.body.id;

    res = await request(app)
      .delete(routeDELETE + '/' + createdActivityId)
      .set('Authorization', 'Bearer ' + auth_token2);

    expect(res.status).toBe(200);

    res = await request(app)
      .get(routeGET)
      .query({
        from: '2024-04-01',
      })
      .set('Authorization', 'Bearer ' + auth_token);

    expect(res.body).toEqual({
      plannedActivities: [expect.objectContaining({
        type: 'Running',
        duration: 1234,
        name: 'April Fool Run',
        comment: ''
      })]
    });
  });

});
