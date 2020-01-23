const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const handleSignIn = require('./controllers/signin');
const handleRegister = require('./controllers/register');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// const db = require('knex')({
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'zenab',
//     password : '',
//     database : 'twitter-web-app-db'
//   }
// });

console.log('NODE_ENV', process.env.NODE_ENV);
const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL || 'postgresql://zenab@127.0.0.1/twitter-web-app-db',
    ssl: process.env.NODE_ENV === "production",
  }
});

app.get('/', (req, res) => res.send('it is working'));

app.post('/signin', (req, res) => {
  handleSignIn(req, res, db, bcrypt)
});

app.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt)
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is listening on port ${port}`));

