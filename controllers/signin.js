const jwt = require('jsonwebtoken');
const config = require('../config');

const handleSignIn = (req, res, db, bcrypt) => {
  const {email, password} = req.body;
  return db('login').where({
    email: email
  }).select('*')
    .then(data => {
      if (data.length > 0 && bcrypt.compareSync(password, data[0].hash)) {
        return db('users').where({
          email: email
        }).select('*')
          .then(user => {
            const decryptedUserId = {sub: user[0].id};
            const accessToken = jwt.sign(decryptedUserId, config.accessTokenSecret, {expiresIn: config.accessTokenLife});
            const refreshToken = jwt.sign(decryptedUserId, config.refreshTokenSecret, {expiresIn: config.refreshTokenLife});
            const accessTokenExpiry = new Date();
            accessTokenExpiry.setMinutes(new Date().getMinutes() + 15);
            const refreshTokenExpiry = new Date();
            refreshTokenExpiry.setDate(new Date().getDate() + 30);
            res.status(200)
              .cookie("access_token", accessToken, {expires: accessTokenExpiry})
              .cookie("refresh_token", refreshToken, {expires: refreshTokenExpiry})
              .json(user[0]);
          });
      } else {
        res.status(403).json({success: false, err: 'invalid password or email'});
      }
    })
    .catch(err => {
      console.log('error while signing in the user', err);
      return res.status(500).json({err: 'unable to sign in'});
    });
};

module.exports = handleSignIn;