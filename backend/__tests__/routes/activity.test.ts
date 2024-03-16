import request from 'supertest';
import app from '../../src/app';
import {User, users} from '../../src/models/users';
import bcrypt from 'bcrypt';
import { verifyUserToken } from '../../src/middlewares/authentication';
import {Request, Response} from 'express';
import * as actions from '../../src/services/user.services';
import {activities} from '../../src/models/activities';
import {closeDbConnection, db} from '../../src/db/db';

const user = {username: 'test-user', password: '1234'};
const activity = {
  name: 'test',
  city: 'San Francisco',
  type: 'Running',
  date: '2024-02-28 15:45:00.123456',
  durationTotal: 30,
  distanceTotal: 7.5,
  comment: 'Felt good!',
};

const route : string = '/protected-route';
let getToken;

// the value returned by the mocked functions getUserByUsername and getUserById
let returnedUser: User;

// Example of protected route
app.use(route, verifyUserToken, (req: Request, res: Response) => {
  return res.json({
    msg: `Access to protected route granted. Your id is ${req.user?.userId}`});
});

jest.mock('../../src/services/user.services');

beforeAll(async () => {
  await db.delete(activities);
  await db.delete(users);

  const hashedPassword = await bcrypt.hash(user.password, 10);
  returnedUser = {id: 1, username: user.username, password: hashedPassword};
});

afterAll(async () => {
  await db.delete(activities);
  await db.delete(users);
  return closeDbConnection();
});


describe('POST activity', () => {
  jest.spyOn(actions, 'getUserByUsername').mockImplementation(() => Promise.resolve(returnedUser));
  const route_creation : string = '/activity/manual';

  test('Should create a new activity', async () => {
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .post(route_creation)
      .set('Authorization', `Bearer ${token}`)
      .send(activity);

    expect(res.statusCode).toBe(201);
  });

  test('Should not work because not authenticated', async () => {
    const res = await request(app)
      .post(route_creation)
      .send(activity);

    expect(res.statusCode).toBe(401);
  });

  test('Should not create because of name', async () => {
    const activity = {
      name: 'this is a text of 257 characters: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eget turpis eu ligula ultricies fringilla. Nullam sed varius dui. Curabitur euismod, est ac venenatis eleifend, sapien purus varius justo, eget varius velit elit.',
      city: 'San Francisco',
      type: 'Running',
      date: '2024-02-28 15:45:00.123456',
      durationTotal: 30,
      distanceTotal: 7.5,
      comment: 'Felt good!',
    };
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .post(route_creation)
      .set('Authorization', `Bearer ${token}`)
      .send(activity);
    expect(res.text).toEqual('{"message":"Name is required and must be between 3 and 256 characters"}');
    expect(res.statusCode).toBe(400);
  });

  test('Should not create because of type', async () => {
    const activity = {
      name: 'test',
      city: 'San Francisco',
      type: 'Swimming',
      date: '2024-02-28 15:45:00.123456',
      durationTotal: 30,
      distanceTotal: 7.5,
      comment: 'Felt good!',
    };
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .post(route_creation)
      .set('Authorization', `Bearer ${token}`)
      .send(activity);
    console.log(res.text);
    expect(res.text).toEqual('{"message":"Type is required and must be one of the following: Running, Biking, Walking"}');
    expect(res.statusCode).toBe(400);
  });

  test('Should not create because of date', async () => {
    const activity = {
      name: 'test',
      city: 'San Francisco',
      type: 'Running',
      date: '2024-0-28 15:45:00.123456',
      durationTotal: 30,
      distanceTotal: 7.5,
      comment: 'Felt good!',
    };
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .post(route_creation)
      .set('Authorization', `Bearer ${token}`)
      .send(activity);
    expect(res.statusCode).toBe(400);
  });

  test('Should not create because of durationTotal', async () => {
    const activity = {
      name: 'test',
      city: 'San Francisco',
      type: 'Running',
      date: '2024-02-28 15:45:00.123456',
      durationTotal: -1,
      distanceTotal: 7.5,
      comment: 'Felt good!',
    };
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .post(route_creation)
      .set('Authorization', `Bearer ${token}`)
      .send(activity);
    expect(res.text).toEqual('{"message":"DurationTotal is required and must be a non-negative number"}');
    expect(res.statusCode).toBe(400);
  });

});

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
