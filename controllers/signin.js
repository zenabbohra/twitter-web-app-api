const handleSignIn = (req, res, db, bcrypt) => {
  const {email, password} = req.body;
  return db('login').where({
    email: email
  }).select('*')
    .then(data => {
      if (data.length > 0 && bcrypt.compareSync(password, data[0].hash)) {
        res.status(200);
      } else {
        res.status(403);
      }
    })
};

module.exports = handleSignIn;