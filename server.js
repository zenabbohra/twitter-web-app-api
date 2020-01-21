const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const handleSignIn = require('./controllers/signin');
const handleRegister = require('./controllers/register');

const app = express();
app.use(bodyParser.json());

// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'zenab',
//     password : '',
//     database : 'twitter-web-app-db'
//   }
// });

const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  }
});

app.get('/', (req, res) => res.send('it is working'));

app.post('/signin', (req, res) => { handleSignIn (req, res, db, bcrypt)});

app.post('/register', (req, res) => { handleRegister(req, res, db, bcrypt) });

app.listen(process.env.PORT, () => console.log(`app is listening on port ${process.env.PORT}`));

