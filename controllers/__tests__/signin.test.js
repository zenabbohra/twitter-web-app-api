const handleSignIn = require('../signin');
const bcrypt = require('bcrypt');
const knex = require('knex');
const db = knex({client: 'sqlite3', connection: ':memory:'});
const { mockResponse } = require('../../lib/testUtils');

describe('handleSignIn()', () => {

  beforeAll(() => {
    return db.schema.createTable('login', function (table) {
      table.increments();
      table.string('email');
      table.string('hash');
      table.timestamps();
    }).then(() => {
      return db.insert({email: 'correct-email@gmail.com', hash: bcrypt.hashSync('correct-password', 10)}).into('login');
    })
      .then(() =>
        db.schema.createTable('users', function (table) {
          table.increments();
          table.string('name');
          table.string('email');
          table.dateTime('joined_date');
          table.timestamps();
          table.unique(['email']);
        }));
  });

  test("sign in fails when a user does not exist", async () => {
    const req = {
      body: {
        email: 'incorrect-email@gmail.com',
        password: 'password',
      }
    };

    const res = mockResponse();
    await handleSignIn(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("sign in fails when the user exists but the password is incorrect", async () => {
    const req = {
      body: {
        email: 'correct-email@gmail.com',
        password: 'incorrect-password',
      }
    };
    const res = mockResponse();
    await handleSignIn(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test("sign in succeeds when the user exists and the password is correct", async () => {
    const req = {
      body: {
        email: 'correct-email@gmail.com',
        password: 'correct-password',
      }
    };
    const res = mockResponse();
    await handleSignIn(req, res, db, bcrypt);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});