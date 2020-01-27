const jwt = require('jsonwebtoken');
const config = require('../config');

const handleRegister = (req, res, db, bcrypt) => {
  const {name, email, password} = req.body;
  // add validations for name, email and password
  if (typeof name !== 'string' || name.length >= 100) {
    return res.status(400).json({err: 'invalid name'});
  }
  if (typeof email !== 'string' || email.length >= 100 || email.length < 5) {
    return res.status(400).json({err: 'invalid email'});
  }
  if (typeof password !== 'string' || password.length > 30 || password.length < 3) {
    return res.status(400).json({err: 'password length should be between 3 and 30'});
  }

  return db.transaction(trx => {
    return trx('login').insert({
      email: email,
      hash: bcrypt.hashSync(password, 10)
    }).returning('email')
      .then(loginEmail => {
        return trx('users').insert({
          name: name,
          email: loginEmail[0],
          joined_date: new Date(),
          updated_at: new Date()
        })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  }).then(() => {
    //get the user id from users table only after transaction commit succeeds
    return db('users').where({
      email: email
    }).select('*')
      .then(user => {
        const decryptedUserId = {userId : user[0].id };
        const accessToken = jwt.sign(decryptedUserId, config.accessTokenSecret, { expiresIn: config.accessTokenLife });
        const refreshToken = jwt.sign(decryptedUserId, config.refreshTokenSecret, { expiresIn: config.refreshTokenLife });
        const accessTokenExpiry = new Date();
        accessTokenExpiry.setMinutes(new Date().getMinutes() + 15);
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(new Date().getDate() + 30);
        res.status(200)
          .cookie("access_token", accessToken, {expires: accessTokenExpiry})
          .cookie("refresh_token", refreshToken, {expires: refreshTokenExpiry})
          .json(user[0]);
      })
      .catch(err => res.status(403).json({success: false, 'err' : 'cookie token could not be generated'}));
  })
    .catch(err => {
      console.log('error while registering the user', err);
      return res.status(500).json({err: 'unable to register'});
    });
};


module.exports = handleRegister;
