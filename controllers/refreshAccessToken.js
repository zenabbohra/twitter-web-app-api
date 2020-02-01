var express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

// When user signs in or registers, then an access token & refresh token will be generated, which will be stored in
// the cookie in front-end and can be accessed in the req.cookie for authentication purposes.
// Whenever the access token expires, the API './refreshToken' will be called from
// front-end with req.body.id and refresh Token in req.cookie
// This API will verify the id encrypted in req.cookie.refreshToken with the req.body.id
// And if verification succeeds, API will regenerate an access token and send it in the cookie
const handleRefreshAccessToken = (req, res) => {
  const refreshToken = req.cookie;
  const decodedRefreshToken = jwt.verify(refreshToken, config.refreshTokenSecret);
  const userId = decodedRefreshToken.id;
  // Generate a new access token if refresh Token user id matches the req.body.id
  if (userId && req.body.id === userId) {
    const accessToken = jwt.sign({user_id: userId}, config.accessTokenSecret, {expiresIn: config.accessTokenLife});
    res.status(200)
      .cookie('access_token', accessToken)
      .json({success : true});
  } else {
    res.status(404).json({err: 'Invalid request'})
  }
};

module.exports = handleRefreshAccessToken;