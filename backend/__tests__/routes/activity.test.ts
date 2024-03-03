import request from 'supertest';
import app from '../../src/app';
import {User, users} from '../../src/models/users';
import { verifyUserToken } from '../../src/middlewares/authentication';
import {Request, Response} from 'express';
import * as actions from '../../src/services/user.services';
import {closeDbConnection, db} from '../../src/db/db';
import {activities} from '../../src/models/activities';

const user = {username: 'test-user', password: '1234'};
const activity = {
  name: 'test',
  city: 'San Francisco',
  type: 'Running',
  date: '2024-02-28 15:45:00.123456',
  durationTotal: 30,
  distanceTotal: 7.5,
  comment: 'Felt good!',
  segments: '{}'
};

let token:string;

beforeAll(async () => {
  await db.delete(activities);
  await db.delete(users);

  await request(app).post('/user/create').send(user);
  token = (await request(app).post('/auth').send(user)).body['token'];
});

afterAll(async () => {
  await db.delete(activities);
  await db.delete(users);
  return closeDbConnection();
});

describe('POST activity', () => {
  const route_creation : string = '/activity/manual';

  test('should create a new activity in the database', async () => {
    const res = await request(app)
      .post(route_creation)
      .send(activity)
      /*.set('Authorization', 'Bearer ' + auth_token);*/
      .set('Authorization', `Bearer ${token}`);

    console.log(res.error);
    expect(res.statusCode).toBe(201);
  });

});



/*
describe('get all activities', () => {
  const route_creation : string = '/activity/getActivity';

  test('should recover all activities information in the database', async () => {
    jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(returnedUser));
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .get(route_creation)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });

});

describe('get specified activities', () => {
  const route_creation : string = '/activity/getSpecifiedActivities';


  test('should recover searched activities', async () => {
    jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(returnedUser));

    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;

    const res = await request(app)
      .get(`${route_creation}?search=Morning`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
  });

});
*/
