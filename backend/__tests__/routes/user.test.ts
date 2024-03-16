import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcrypt';
import * as actions from '../../src/services/user.services';
import { beforeEach, describe } from 'node:test';
import { User } from '../../src/models/users';


// Base user should always work
const user = {username: 'test-user', password: '1234', email: 'testing@gmail.com', name: 'Test User'};

// this user as the same name
const user1 = {username: 'test-user', password: '4567', email: 'usertesting@gmail.com', name: 'Test User the 2nd'};

// this user has the same email
const user2 = {username: 'testing user', password: '4567',email: 'testing@gmail.com', name: 'Test User the 3nd'};


let returnedUser: User;
let returnedUser1: User;
let returnedUser2: User;


jest.mock('../../src/services/user.services');

beforeAll(async () => {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  returnedUser = {id: 1, username: user.username, password: hashedPassword, };

  const hashedPassword1 = await bcrypt.hash(user1.password, 10);
  returnedUser1 = {id: 2, username: user1.username, password: hashedPassword1, email: user1.email, name: user1.name};

  const hashedPassword2 = await bcrypt.hash(user2.password, 10);
  returnedUser2 = {id: 3, username: user2.username, password: hashedPassword2, email: user2.email, name: user2.name};
});


beforeEach(() => {
  jest.restoreAllMocks();
});

describe('User routes', () => {

  describe('POST /user', () => {
    const route : string = '/user';

    test('#1: should create a new user', async () => {
      jest.spyOn(actions, 'getUserByUsername')
        .mockImplementationOnce(() => Promise.resolve(undefined));

      const res = await request(app)
        .post(route)
        .send(user)
        .set('Content-Type', 'application/json');
        
      expect(res.status).toBe(201);
    });



    // Conflict errors : Sharing same unique ressource (email and name) 
    test('#2: should send back a conflict error', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(returnedUser));

      const res = await request(app)
        .post(route)
        .send(user)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(409);
    });


    // Conflict errors : Sharing same unique ressource (name) 
    test('#3: should send back a conflict error', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(returnedUser));

      const res = await request(app)
        .post(route)
        .send(user1)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(409);
    });


    // Conflict errors : Sharing same unique ressource (email) 
    test('#4: should send back a conflict error', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(returnedUser));

      const res = await request(app)
        .post(route)
        .send(user2)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(409);
    });



    test('#5: should send back a bad request error', async () => {
      const badUser = { username: 1234, password: 1234 } ;
      const res = await request(app)
        .post(route)
        .send(badUser)
        .set('Content-Type', 'application/json');
      expect(res.statusCode).toEqual(400);
    });


  });





  describe('GET /user', () => {

    test('#4: should obtain informations successfully', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));
      jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));

      const getToken = await request(app)
        .post('/auth')
        .send(user)
        .set('Content-Type', 'application/json');

      const { token } = getToken.body;
      const validToken = `Bearer ${token}`;

      const res = await request(app)
        .get('/user')
        .set('Authorization', validToken);

      expect(res.statusCode).toEqual(200);
    });

    // Techniquement pas sensé être possible, mais je garde de côté au cas où j'ai pas penser à une scénario
    // test('#5: should not be able to find a corresponding user', async () => {

    //   // Example the user has been deleted and you still possess a existing token 
    //   jest.spyOn(actions, 'getUserByUsername')
    //     .mockImplementationOnce(() => Promise.resolve(returnedUser))
    //     .mockImplementationOnce(() => Promise.resolve(undefined));
    //   jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(undefined));

    //   const getToken = await request(app)
    //     .post('/auth')
    //     .send(user)
    //     .set('Content-Type', 'application/json');

    //   const { token } = getToken.body;
    //   const invalidToken = `Bearer ${token}`;
    //   // Token does have an id but no user have the id.
    //   // const invalidToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMzLCJpYXQiOjE3MDkwNTA5OTB9.06MlfRValeODxFKUrNKNXiYaZMtlZD1I5nry4O8Lh-Y';

    //   const res = await request(app)
    //     .get('/user')
    //     .set('Authorization', invalidToken);
    //   console.log(res.error);
    //   expect(res.statusCode).toEqual(404);
    // });

    test('#5: should not have the permissions to access data', async () => {

      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(undefined));
      jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(undefined));

      const invalidToken = 'Bearer invalid';

      const res = await request(app)
        .get('/user')
        .set('Authorization', invalidToken);
      expect(res.statusCode).toEqual(401);
    });
  });

  describe('DELETE /user', () => {
    test('#6: should delete user successfully', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));
      jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));

      // No clue why I need to call these before in order to work.
      actions.getUserByUsername('string');
      actions.getUserById(1);

      const getToken = await request(app)
        .post('/auth')
        .send(user)
        .set('Content-Type', 'application/json');

      const { token } = getToken.body;
      const validToken = `Bearer ${token}`;

      const res = await request(app)
        .delete('/user')
        .set('Authorization', validToken);

      expect(res.statusCode).toEqual(200);
    });
  });


  describe('PUT /userId', () => {
    test('#7: should update user successfully', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));
      jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));

      const getToken = await request(app)
        .post('/auth')
        .send(user)
        .set('Content-Type', 'application/json');

      const { token } = getToken.body;
      const validToken = `Bearer ${token}`;

      const res = await request(app)
        .put('/user')
        .send({ username: 'new-username' })
        .set('Authorization', validToken);

      expect(res.statusCode).toEqual(200);
    });

    test('#8: should not be able to update user', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(undefined));
      jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(undefined));

      const invalidToken = 'Bearer invalid';

      const res = await request(app)
        .put('/user')
        .send({ username: 'new-username' })
        .set('Authorization', invalidToken);
      expect(res.statusCode).toEqual(401);
    });

    test('#9: should not be able to update user', async () => {
      jest.spyOn(actions, 'getUserByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));
      jest.spyOn(actions, 'getUserById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedUser))));

      const getToken = await request(app)
        .post('/auth')
        .send(user)
        .set('Content-Type', 'application/json');

      const { token } = getToken.body;
      const validToken = `Bearer ${token}`;

      const res = await request(app)
        .put('/user')
        .send({ username: 'new-username' })
        .set('Authorization', validToken);
      expect(res.statusCode).toEqual(401);
    });
  });



});
