const handleRegister = require('../register');
const bcrypt = require('bcrypt');
const knex = require('knex');
const db = knex({client: 'sqlite3', connection: ':memory:'});
const { mockResponse } = require('../../lib/testUtils');

describe('handleRegister()', () => {

  beforeAll(() =>
    db.schema.createTable('login', function (table) {
      table.increments();
      table.string('email');
      table.string('hash');
      table.timestamps();
      table.unique(['email']);
    }).then(() =>
      db.schema.createTable('users', function (table) {
        table.increments();
        table.string('name');
        table.string('email');
        table.dateTime('joined_date');
        table.timestamps();
        table.unique(['email']);
      }))
  );


  test('name is invalid', async () => {
    const req = {
      body: {
        name: 123,
      }
    };
    const res = mockResponse();
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({err: 'invalid name'});
  });

  test('email is invalid', async () => {
    const req = {
      body: {
        name: 'johnny',
        email: 123,
      }
    };
    const res = mockResponse();
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({err: 'invalid email'});
  });

  test('password is invalid', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@gmail.com',
        password: 12
      }
    };

    const res = mockResponse();

    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({err: 'password length should be between 4 and 30'});
  });

  test('successfully registers a user', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@gmail.com',
        password: 'john'
      }
    };
    const res = mockResponse();

    await handleRegister(req, res, db, bcrypt);
    expect(res.json).toHaveBeenCalledWith({name: req.body.name, email: req.body.email});
  });

  test('email already exists in the database', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@gmail.com',
        password: 'john'
      }
    };
    const res = mockResponse();

    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({err: 'unable to register'});
  });

});