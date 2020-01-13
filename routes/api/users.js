const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const logger = require('../../logger')(module);

// User Model
const User = require('../../models/User');

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

          //send email with confirmation link
          const transporter = nodemailer.createTransport({
            host: 'smtp.mailgun.org',
            port: 587,
            secure: false,
            auth: {
              user: 'postmaster@mg.workorderweb.com',
              pass: 'be77fe2f6c394ebaa486472b63a70210-713d4f73-ce718c57'
            }
          });

          const mailOptions = {
            from: 'postmaster@workorderweb.com',
            to: 'muralikannur@gmail.com,jaijack@gmail.com,compworld@gmail.com,priyeshnidumbram@gmail.com',
            subject: 'WoW Activation - ' + user.email,
            html: '<h1>Work Order Web Activation</h1><p>Hello Admin, <br/> <br/> Click the below link to activate the user ' +  user.email  + '.<br/><br/> <a href="https://workorderweb.com/activation?uid=' + user._id + '">Activation Link </a><br/><br/>Activation Code : <b>' + user.code + '</b><br/><br/>Sincerely, <br /> WoW Team.</p>'
          };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              logger.error(error);
            } else {
              logger.info('Email sent: ' + info.response);
            }
          });

          res.json({msg:'Activation link sent to the admin.' });

        });
    })
  })

});

module.exports = router;
