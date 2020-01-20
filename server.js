const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const signin = require('./controllers/signin');
const register = require('./controllers/register');

const app = express();
app.use(bodyParser.json());

const db = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'zenab',
    password : '',
    database : 'twitter-web-app-db'
  }
});

app.get('/', (req, res) => res.send('it is working'));

app.post('/signin', (req, res) => { signin.handleSignIn (req, res, db, bcrypt)});

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

// app.listen(3000);

