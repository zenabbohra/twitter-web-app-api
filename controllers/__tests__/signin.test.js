const {handleSignIn} = require('../signin');
const bcrypt = require('bcrypt');
const knex = require('knex');
const db = knex({client: 'sqlite3', connection: ':memory:'});

describe('handleSignIn()', () => {

  beforeAll(() => {
    return db.schema.createTable('login', function (table) {
      table.increments();
      table.string('email');
      table.string('hash');
      table.timestamps();
    }).then(() => {
      return db.insert({email: 'correct-email@gmail.com', hash: bcrypt.hashSync('correct-password', 10)}).into('login');
    });
  });

  test("sign in fails when a user does not exist", (done) => {
    const req = {
      body: {
        email: 'incorrect-email@gmail.com',
        password: 'password',
      }
    };
    const res = {
      status: (statusCode) => {
        expect(statusCode).toEqual(403);
        done();
      }
    };
    handleSignIn(req, res, db, bcrypt);
  });

  test("sign in fails when the user exists but the password is incorrect", (done) => {
    const req = {
      body: {
        email: 'correct-email@gmail.com',
        password: 'incorrect-password',
      }
    };
    const res = {
      status: (statusCode) => {
        expect(statusCode).toEqual(403);
        done();
      }
    };
    handleSignIn(req, res, db, bcrypt);
  });

  test("sign in succeeds when the user exists and the password is correct", (done) => {
    const req = {
      body: {
        email: 'correct-email@gmail.com',
        password: 'correct-password',
      }
    };
    const res = {
      status: (statusCode) => {
        expect(statusCode).toEqual(200);
        done();
      }
    };
    handleSignIn(req, res, db, bcrypt);
  });
});