const handleSignIn = (req, res, db, bcrypt) => {
  const {email, password} = req.body;
  return db('login').where({
    email: email
  }).select('*')
    .then(data => {
      if (data.length > 0 && bcrypt.compareSync(password, data[0].hash)) {
        res.status(200).json({email, success: true});
      } else {
        res.status(403).json({success: false, err: 'invalid password'});
      }
    })
    .catch(err => {
      console.log('error while signing in the user', err);
      return res.status(500).json({err: 'unable to sign in'});
    });
};

module.exports = handleSignIn;