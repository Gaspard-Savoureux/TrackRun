import request from 'supertest';
import app from '../../src/app';
import bcrypt from 'bcrypt';
import * as actions from '../../src/services/trainer.services';
import { beforeEach, describe } from 'node:test';
import { Trainer } from '../../src/models/trainers';

const trainer1 = { username: 'superTrainer', password: 'weak-password', email: 'trainer@hardcore.com', name: 'Mr. trainer' };
const trainer2 = { username: 'superTrainer', password: 'weird-password', email: 'weirdo@excel.com', name: 'Mr. weird' };
const trainer3 = { username: 'alienTrainer', password: 'strong-password', email: 'weirdo@excel.com', name: 'Mr. alien' };

let returnedTrainer1: Trainer;
let returnedTrainer2: Trainer;
let returnedTrainer3: Trainer;

jest.mock('../../src/services/trainer.services');

beforeAll(async () => {
    const hashedPassword1 = await bcrypt.hash(trainer1.password, 10);
    returnedTrainer1 = { id: 1, username: trainer1.username, password: hashedPassword1, email: trainer1.email, name: trainer1.name };

    const hashedPassword2 = await bcrypt.hash(trainer2.password, 10);
    returnedTrainer2 = { id: 2, username: trainer2.username, password: hashedPassword2, email: trainer2.email, name: trainer2.name };

    const hashedPassword3 = await bcrypt.hash(trainer3.password, 10);
    returnedTrainer3 = { id: 3, username: trainer3.username, password: hashedPassword3, email: trainer3.email, name: trainer3.name };
});


beforeEach(() => {
    // clean up before each test
    jest.restoreAllMocks();
});

describe('Trainer routes', () => {

    describe('POST /trainer', () => {
        const route: string = '/trainer';

        test('#1: should create a new trainer', async () => {
            jest.spyOn(actions, 'getTrainerByUsername')
                .mockImplementationOnce(() => Promise.resolve(undefined));

            const trainerWithAccessCode = { ...trainer1, 'access-code': 'onlyTrainer' };

            const res = await request(app)
                .post(route)
                .send(trainerWithAccessCode)
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(201);
        });

        test('#2: should not create a new trainer, no access-code', async () => {
            jest.spyOn(actions, 'getTrainerByUsername')
                .mockImplementationOnce(() => Promise.resolve(undefined));

            const res = await request(app)
                .post(route)
                .send(trainer1)
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(403);
        });

        test('#3: should not create a new trainer, access-code is invalid', async () => {
            jest.spyOn(actions, 'getTrainerByUsername')
                .mockImplementationOnce(() => Promise.resolve(undefined));

            const trainerWithInvalidAccessCode = { ...trainer1, 'access-code': 'invalid' };

            const res = await request(app)
                .post(route)
                .send(trainerWithInvalidAccessCode)
                .set('Content-Type', 'application/json');

            expect(res.status).toBe(403);
        });


        // Conflict errors : Sharing same unique ressource (email) 
        test('#4: should send back a conflict error', async () => {
            jest.spyOn(actions, 'getTrainerByEmail').mockImplementationOnce(() => Promise.resolve(returnedTrainer2));

            const trainerWithAccessCode = { ...trainer3, 'access-code': 'onlyTrainer' };

            const res = await request(app)
                .post(route)
                .send(trainerWithAccessCode)
                .set('Content-Type', 'application/json');
            expect(res.statusCode).toEqual(409);
        });


        // Conflict errors : Sharing same unique ressource (username) 
        test('#5: should send back a conflict error', async () => {
            jest.spyOn(actions, 'getTrainerByEmail').mockImplementationOnce(() => Promise.resolve(returnedTrainer1));

            const trainerWithAccessCode = { ...trainer2, 'access-code': 'onlyTrainer' };

            const res = await request(app)
                .post(route)
                .send(trainerWithAccessCode)
                .set('Content-Type', 'application/json');
            expect(res.statusCode).toEqual(409);
        });


        test('#6: should send back a bad request error', async () => {
            const badUser = { username: 1234, password: 1234 };

            const trainerWithAccessCode = { ...badUser, 'access-code': 'onlyTrainer' };

            const res = await request(app)
                .post(route)
                .send(trainerWithAccessCode)
                .set('Content-Type', 'application/json');
            expect(res.statusCode).toEqual(400);
        });


    });



    describe('GET /trainer', () => {
        const route: string = '/trainer';

        test('#7: should obtain informations successfully', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));

            const getToken = await request(app)
                .post('/trainer/auth')
                .send(trainer1)
                .set('Content-Type', 'application/json');

            const { token } = getToken.body;
            const validToken = `Bearer ${token}`;

            const res = await request(app)
                .get(route)
                .set('Authorization', validToken);

            expect(res.statusCode).toEqual(200);
        });

        test('#8: should not have the permissions to access data', async () => {

            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(undefined));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(undefined));

            const invalidToken = 'Bearer invalid';

            const res = await request(app)
                .get(route)
                .set('Authorization', invalidToken);
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('DELETE /trainer', () => {
        const route: string = '/trainer';
        const authRoute: string = '/trainer/auth';

        test('#9: should delete trainer successfully', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));

            actions.getTrainerByUsername('string');
            actions.getTrainerById(1);

            const getToken = await request(app)
                .post(authRoute)
                .send(trainer1)
                .set('Content-Type', 'application/json');

            const { token } = getToken.body;
            const validToken = `Bearer ${token}`;

            const res = await request(app)
                .delete(route)
                .set('Authorization', validToken);

            expect(res.statusCode).toEqual(200);
        });
    });


    describe('PUT trainer/', () => {
        const route: string = '/trainer';
        const authRoute: string = '/trainer/auth';
        test('#10: should update trainer successfully', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));

            const getToken = await request(app)
                .post(authRoute)
                .send(trainer1)
                .set('Content-Type', 'application/json');

            const { token } = getToken.body;
            const validToken = `Bearer ${token}`;

            const res = await request(app)
                .put(route)
                .send({ username: 'new-username' })
                .set('Authorization', validToken);

            expect(res.statusCode).toEqual(200);
        });

        test('#11: should not be able to update trainer', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(undefined));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(undefined));

            const invalidToken = 'Bearer invalid';

            const res = await request(app)
                .put(route)
                .send({ username: 'new-username' })
                .set('Authorization', invalidToken);
            expect(res.statusCode).toEqual(401);
        });

        test('#12: should not be able to update user', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));

            const getToken = await request(app)
                .post(authRoute)
                .send(trainer1)
                .set('Content-Type', 'application/json');

            const { token } = getToken.body;
            const validToken = `Bearer ${token}`;

            const res = await request(app)
                .put(route)
                .send({ username: 'new-username' })
                .set('Authorization', validToken);
            expect(res.statusCode).toEqual(401);
        });
    });


    //   router.delete('/users/:id', removeUserFromTrainer);


    //   router.put('/users/:id', addUserToTrainer);
    describe('POST /trainer/users/:id', () => {
        const route: string = '/trainer/users/1';
        const authRoute: string = '/trainer/auth';
        test.skip('#13: should add user to trainer successfully', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));

            const getToken = await request(app)
                .post(authRoute)
                .send(trainer1)
                .set('Content-Type', 'application/json');

            const { token } = getToken.body;
            const validToken = `Bearer ${token}`;

            const res = await request(app)
                .post(route)
                .set('Authorization', validToken);
            expect(res.statusCode).toEqual(200);
        });

        test.skip('#14: should not be able to add user to trainer', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(undefined));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(undefined));

            const invalidToken = 'Bearer invalid';

            const res = await request(app)
                .post(route)
                .set('Authorization', invalidToken);
            expect(res.statusCode).toEqual(401);
        });

        test.skip('#15: should not be able to add user to trainer', async () => {
            jest.spyOn(actions, 'getTrainerByUsername').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));
            jest.spyOn(actions, 'getTrainerById').mockImplementationOnce(() => Promise.resolve(JSON.parse(JSON.stringify(returnedTrainer1))));

            actions.getTrainerByUsername('string');
            actions.getTrainerById(1);

            const getToken = await request(app)
                .post(authRoute)
                .send(trainer1)
                .set('Content-Type', 'application/json');

            const { token } = getToken.body;
            const validToken = `Bearer ${token}`;

            const res = await request(app)
                .post(route)
                .set('Authorization', validToken);
            expect(res.statusCode).toEqual(401);
        });

    });


});
