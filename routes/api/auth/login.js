const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../../middleware/auth');
const logger = require('../../../logger')(module);

// User Model
const User = require('../../../models/User');

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
        logger.error("Email not verified. " + email);
        return res.status(400).json({ msg: 'Email not verified. Check your email for the verification link' });
      }
       
      if(!user.account_activated){
        logger.error("Account not activated. Email:" + email);
        return res.status(400).json({ msg: 'Account not activated. Please contact WoW Team.' });
      } 

      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

          if((user.ip_address != '' && user.ip_address != req.ip.trim())){
            let firstDate = new Date(user.last_timestamp),
                secondDate = new Date(Date.now()),
            timeDifference = Math.abs(secondDate .getTime() - firstDate.getTime());
            console.log(timeDifference);
            if(timeDifference < 3600000){
              logger.error("User already logged in from another device." );
              return res.status(400).json({ msg: 'User already logged in from another location. Please try again after some time.' });
            }
          }

          User.updateOne({_id:user.id},{ip_address:req.ip.trim(), last_timestamp:Date.now()},(err,raw) => {
            if(err){
              logger.error("Error while setting timestamp during log in. " + err);
              return res.status(400).json({ msg: 'Error while login. Please try again.' });
            }

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
    })
});

router.get('/user', auth, (req, res) => {
  User.findById(req.user.id)
    .select('-password')
    .then(user => res.json(user));
});

module.exports = router;
