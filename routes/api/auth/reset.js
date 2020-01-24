const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../../../logger')(module);

// User Model
const User = require('../../../models/User');


// Reset Password
router.post('/', (req, res) => {
  const { uid, code, email, password } = req.body;
  let isValid = true;

  const validateEmail = (email) => {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Simple validation
  if(!code || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if(!validateEmail(email)){
    return res.status(400).json({ msg: 'Incorrect Email Address' });
  }


  User.findOne({ email })
    .then(user => {
      console.log(user);
      if(!user || user._id != uid.uid) return res.status(400).json({ msg: 'Invalid User' });

      if(user.verification_code != code){
        logger.error("Invalid Verification Code. : " +email);
        return res.status(400).json({ msg: 'Invalid Verification Code' });
      } 
    })


  // Create salt & hash
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if(err) {
        logger.error("Error while creating new password. " + err);
        return res.status(400).json({ msg: 'Error while resetting the password' });
      }
      
      User.updateOne({email},{password:hash},(err,raw) => {
        if(err) {
          logger.error("Error while resetting password. " + err);
          return res.status(400).json({ msg: 'Error while resetting the password' });
        }
      })
    })
  })

  return res.status(200).json({ msg: 'Password reset successfully. Login with the new password' });

});

module.exports = router;
