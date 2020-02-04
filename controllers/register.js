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
    }).select('email')
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
  }).then(() => res.status(200).json({name: name, email: email}))
    .catch(err => {
      console.log('error while registering the user', err);
      return res.status(500).json({err: 'unable to register'});
    });
};


module.exports = handleRegister;
