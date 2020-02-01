const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const handleSignIn = require('./controllers/signin');
const handleRegister = require('./controllers/register');
const handleRefreshAccessToken = require('./controllers/refreshAccessToken');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

console.log('NODE_ENV', process.env.NODE_ENV);
const db = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL || 'postgresql://zenab@127.0.0.1/twitter-web-app-db',
    ssl: process.env.NODE_ENV === "production",
  }
});

const router = express.Router();

router.get('/health', (req, res) => res.send('it is working'));

// router.use(auth()); //this uses auth.js to authenticate before calling the below APIs

router.post('/signin', (req, res) => {
  handleSignIn(req, res, db, bcrypt)
});

router.post('/register', (req, res) => {
  handleRegister(req, res, db, bcrypt)
});

router.post('/refreshToken', (req,res) => {
  handleRefreshAccessToken(req, res)
});

const port = process.env.PORT || 3000;
app.use('/api', router);
app.listen(port, () => console.log(`app is listening on port ${port}`));

