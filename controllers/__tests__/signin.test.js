const handleSignIn = require('../signin');
const httpMocks = require('node-mocks-http');
const knex = require('knex');
const db = knex({client: 'sqlite3', connection: ':memory:', useNullAsDefault: true});
const bcrypt = require('bcrypt');

beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  res.status = jest.fn().mockReturnValue(res);
});

describe('handleSignIn()', () => {
  beforeAll(() => {
    //Creating tables users & login in sqlite3 db and inserting values in them
    return db.schema.createTable('login', (table) => {
      table.increments();
      table.string('email');
      table.string('hash');
    })
      .then(() => {
        return db.insert({
          email: 'correct_email@gmail.com', hash: bcrypt.hashSync('correct_password', 10)
        }).into('login')
      })
      .then(() => {
        return db.schema.createTable('users', (table) => {
          table.increments();
          table.string('name');
          table.string('email');
          table.timestamp('joined_date');
          table.timestamp('updated_at');
        })
      })
      .then(() => {
        return db.insert({
          email: 'correct_email@gmail.com'
        }).into('users')
      })
  });

  test('sign in fails when email is incorrect', async () => {
    req.body.email = 'incorrect_email@gmail.com';
    req.body.password = 'correct_password';
    await handleSignIn(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res._getJSONData()).toEqual({success: false, err: 'invalid password or email'});
  });

  test('sign in fails when password is incorrect', async () => {
    req.body.email = 'correct_email@gmail.com';
    req.body.password = 'incorrect_password';
    await handleSignIn(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res._getJSONData()).toEqual({success: false, err: 'invalid password or email'});
  });

  test('sign in succeeds with correct email and correct password', async () => {
    req.body.email = 'correct_email@gmail.com';
    req.body.password = 'correct_password';
    await handleSignIn(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res._getJSONData()).toEqual({
      id: 1,
      name: null,
      email: 'correct_email@gmail.com',
      "joined_date": null,
      "updated_at": null
    })
  })
});