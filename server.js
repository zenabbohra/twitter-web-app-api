const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('it is working'));

app.post('/signin', (req, res) => {
  if(req.body.email === db.users[0].email &&
    req.body.password === db.users[0].hash) {
    res.json(db.users[0]);
  } else {
    res.json('user not found');
  }
});