import request from 'supertest';
import app from '../../src/app';
import {User} from '../../src/models/users';
import bcrypt from 'bcrypt';
import { verifyUserToken } from '../../src/middlewares/authentication';
import {Request, Response} from 'express';
import * as actions from '../../src/services/user.services';

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
  const hashedPassword = await bcrypt.hash(user.password, 10);
  returnedUser = {id: 1, username: user.username, password: hashedPassword};
});



describe.skip('activity creation', () => {
  jest.spyOn(actions, 'getUserByUsername').mockImplementation(() => Promise.resolve(returnedUser));

  const route_creation : string = '/activity/manual';


  test('should create a new activity in the database', async () => {
    getToken = await request(app)
      .post('/auth')
      .send(user)
      .set('Content-Type', 'application/json');

    const { token } =  getToken.body;


    const res = await request(app)
      .post(route_creation)
      .set('Authorization', `Bearer ${token}`)
      .send(activity);

    console.log(res.error); // Log the exact error message
    expect(res.statusCode).toBe(201);
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
