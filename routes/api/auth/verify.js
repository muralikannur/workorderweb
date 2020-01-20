const express = require('express');
const nodemailer = require('nodemailer');

const logger = require('../../../logger')(module);

const router = express.Router();

const User = require('../../../models/User');

router.post('/', (req, res) => {
  const { uid, code } = req.body;

  if(!uid || !code) {
    return res.status(400).json({ msg: 'Please enter verification code' });
  }

  // Check for existing user
  User.findById(uid.uid,(err,user) => {
    if(err){
      logger.error("Error while getting the user details. . UID: " + uid.uid + ". " + err);
      return res.status(400).json({ msg: 'Error while getting the user details' });
    }
    if(!user) {
      logger.error("User Does not exist. UID: " + uid.uid);
      return res.status(400).json({ msg: 'User Does not exist' });
    }
    if(user.email_verified){
      logger.error("Email already verified. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Email already verified' });
    }

    if(user.verification_code != code){
      logger.error("Invalid Verification Code. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Invalid Verification Code' });
    } 
    User.updateOne({_id:uid.uid},{email_verified:true},(err,raw) => {
      if(err){
        logger.error("Error while email verification. UID: " + uid.uid + ". " + err);
        return res.status(400).json({ msg: 'Error while email verification' });
      }

      if (process.env.NODE_ENV != 'development') {
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
          to: 'muralikannur@gmail.com,jaijack@gmail.com,compworld@gmail.com,priyeshnidumbram@gmail.com',
          subject: 'WoW Activation - ' + user.email,
          html: '<h1>Work Order Web Activation</h1><p>Hello Admin, <br/> <br/> Click the below link to activate the user ' +  user.email  + '.<br/><br/> <a href="https://workorderweb.com/activation?uid=' + user._id + '">Activation Link </a><br/><br/>Activation Code : <b>' + user.activation_code + '</b><br/><br/>Sincerely, <br /> WoW Team.</p>'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            logger.error(error);
          } else {
            logger.info('Email sent: ' + info.response);
          }
        });
      }

      logger.info("Email verified successfully. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Email verified successfully!' });
    });
  })
});

module.exports = router;
