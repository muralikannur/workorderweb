const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../../../logger')(module);

// User Model
const User = require('../../../models/User');

const validateEmail = (email) => {
  var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}


// @route   POST api/users
// @desc    Register new user
// @access  Public
router.post('/', (req, res) => {
  const { name, email, password } = req.body;
  let isValid = true;

  // Simple validation
  if(!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  if(name.length > 100 || email.length > 100 || password.length > 100){
    return res.status(400).json({ msg: 'Incorrect Field length' });
  }

  if(!validateEmail(email)){
    return res.status(400).json({ msg: 'Incorrect Email Address' });
  }


  // Check for existing user
  User.findOne({ email })
    .then(user => {
      if(user) return res.status(400).json({ msg: 'User already exists.' });
    })

  const newUser = new User({
    name,
    email,
    password
  });

  // Create salt & hash
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save()
        .then(user => {

          if (process.env.NODE_ENV != 'development') {
            //send email with confirmation link
            const transporter = nodemailer.createTransport({
              host: 'smtp.mailgun.org',
              port: 587,
              secure: false,
              auth: {
                user: 'postmaster@mg.workorderweb.com',
                pass: 'abda5ddf2df141bae37c1d9ae6319cb1-0a4b0c40-50d98dee'
              }
            });

            const mailOptions = {
              from: 'postmaster@workorderweb.com',
              to: user.email,
              subject: 'Work Order Web - Email verification',
              html: '<h1>Welcome!</h1><p>Thank you for registering with Work Order Web.<br/> <br/> Click the below link to verify your email address.<br/><br/> <a href="https://workorderweb.com/verification?uid=' + user._id + '">Verification Link </a><br/><br/>Verification Code : <b>' + user.verification_code + '</b><br/><br/>Sincerely, <br /> WoW Team.</p>'
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                logger.error(error);
              } else {
                logger.info('Email sent: ' + info.response);
              }
            });


          }
          res.json({msg:'Email verification link sent to ' + user.email});



        });
    })
  })

});

module.exports = router;
