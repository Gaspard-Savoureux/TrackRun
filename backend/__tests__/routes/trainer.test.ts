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

// describe('Trainer routes', () => {
// });
