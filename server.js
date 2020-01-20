const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
import handleSignIn from './controllers/signin';

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

app.post('/signin', (req, res) => { handleSignIn (req, res, db, bcrypt)});
