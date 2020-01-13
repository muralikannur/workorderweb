const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const logger = require('../../logger')(module);

// User Model
const User = require('../../models/User');

router.post('/', (req, res) => {
  const { email, password } = req.body;

  console.log(req.ip);

  // Simple validation
  if(!email || !password) {
    logger.error("Please enter all fields");
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
  
  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if(!user){
        logger.error("User Does not exist. Email:" + email);
        return res.status(400).json({ msg: 'User Does not exist' });
      } 
      if(!user.email_verified){
        logger.error("Account not activated. Email:" + email);
        return res.status(400).json({ msg: 'Account not activated' });
      } 

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          jwt.sign(
            { id: user.id },
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if(err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          )
        })
    })
});

router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

module.exports = router;
