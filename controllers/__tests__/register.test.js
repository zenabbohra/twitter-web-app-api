const {handleRegister} = require('../register');
const bcrypt = require('bcrypt');
const knex = require('knex');
const db = knex({client: 'sqlite3', connection: ':memory:'});

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
        table.string('user_name');
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

    let statusCode;
    let responseJson;
    const res = {};
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.json = (json) => responseJson = json;

    await handleRegister(req, res, db, bcrypt);
    expect(statusCode).toEqual(400);
    expect(responseJson).toEqual({err: 'invalid name'});
  });


  test('email is invalid', async () => {
    const req = {
      body: {
        name: 'johnny',
        email: 123,
      }
    };

    let statusCode;
    let responseJson;
    const res = {};
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.json = (json) => responseJson = json;

    await handleRegister(req, res, db, bcrypt);
    expect(statusCode).toEqual(400);
    expect(responseJson).toEqual({err: 'invalid email'});
  });

  test('password is invalid', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@gmail.com',
        password: 12
      }
    };

    let statusCode;
    let responseJson;
    const res = {};
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.json = (json) => responseJson = json;

    await handleRegister(req, res, db, bcrypt);
    expect(statusCode).toEqual(400);
    expect(responseJson).toEqual({err: 'password length should be between 4 and 30'});
  });




  test('successfully registers a user', async () => {
    const req = {
      body: {
        name: 'John',
        email: 'john@gmail.com',
        password: 'john'
      }
    };
    let statusCode;
    let responseJson;
    const res = {};
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.json = (json) => responseJson = json;

    await handleRegister(req, res, db, bcrypt);
    expect(responseJson).toEqual({name: req.body.name, email: req.body.email});
  });


  test('email already exists in the database', async () => {

    const req = {
      body: {
        name: 'John',
        email: 'john@gmail.com',
        password: 'john'
      }
    };
    let statusCode;
    let responseJson;
    const res = {};
    res.status = (code) => {
      statusCode = code;
      return res;
    };
    res.json = (json) => responseJson = json;

    await handleRegister(req, res, db, bcrypt);
    expect(statusCode).toEqual(500);
    expect(responseJson).toEqual({err: 'unable to register'});

  });

});