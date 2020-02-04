const handleRegister = require('../register');
const httpMocks = require('node-mocks-http');
const bcrypt = require('bcrypt');
const knex = require('knex');
const db = knex({client: 'sqlite3', connection: ':memory:', useNullAsDefault: true});

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  res.status = jest.fn().mockReturnValue(res);
});

describe('handleRegister()', () => {
  beforeAll(() => {
    return db.schema.createTable('login', (table) => {
      table.increments();
      table.string('email');
      table.string('hash');
      table.unique(['email']);
    })
      .then(() => {
        return db.schema.createTable('users', (table) => {
          table.increments();
          table.string('name');
          table.string('email');
          table.timestamp('joined_date');
          table.timestamp('updated_at');
          table.unique(['email']);
        })
      })
  });

  test('invalid name', async () => {
    req.body.name = 123;
    req.body.email = 'correct_email@gmail.com';
    req.body.password = 'correct_password';
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res._getJSONData()).toEqual({err: 'invalid name'});
  });

  test('invalid email', async () => {
    req.body.name = 'John';
    req.body.email = 123;
    req.body.password = 'correct_password';
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res._getJSONData()).toEqual({err: 'invalid email'});
  });

  test('invalid password', async () => {
    req.body.name = 'John';
    req.body.email = 'correct_email@gmail.com';
    req.body.password = 123;
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res._getJSONData()).toEqual({err: 'password length should be between 3 and 30'});
  });

  test('Registration is successful', async () => {
    req.body.name = 'John';
    req.body.email = 'john@gmail.com';
    req.body.password = 'john';
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res._getJSONData()).toEqual({
      name: req.body.name,
      email: req.body.email
    })
  });

  test('Registration is unsuccessful', async () => {
    req.body.name = 'John';
    req.body.email = 'john@gmail.com';
    req.body.password = 'john';
    await handleRegister(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res._getJSONData()).toEqual({err: 'unable to register'});
  })
});

