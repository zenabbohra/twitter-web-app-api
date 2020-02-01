var express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const cookieParser = require('cookie-parser');
const handleRefreshAccessToken = require('../controllers/refreshAccessToken');

const app = express();
app.use(cookieParser());

module.exports = (req, res, next) => {
  console.log(req.cookie.access_token);
  const accessToken = req.cookie.access_token;
  try {
    const decodedToken = jwt.verify(accessToken, config.accessTokenSecret);
    const userId = decodedToken.id;
    req.user = {id: userId, authorized: true};
  } catch {
    try {
      const { newAccessToken, user }= handleRefreshAccessToken(refreshToken); //fix handleRefreshAccessToken to return user_id and refreshed access token
      res.cookie('access_token', newAccessToken );
      req.user = {id: user.id, authorized: true}
    } catch {
      req.user = {authorized: false};
    }
  } finally {
    next();
  }
};