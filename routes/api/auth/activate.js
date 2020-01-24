const express = require('express');

const logger = require('../../../logger')(module);

const router = express.Router();

const User = require('../../../models/User');

router.post('/', (req, res) => {
  const { uid, code } = req.body;

  if(!uid || !code) {
    return res.status(400).json({ msg: 'Please enter activation code' });
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
    if(user.account_activated){
      logger.error("Account is already activated. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Account is already activated.' });
    }

    if(user.activation_code != code){
      logger.error("Invalid Activation Code. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Invalid Activation Code' });
    } 
    User.updateOne({_id:uid.uid},{account_activated:true},(err,raw) => {
      if(err){
        logger.error("Error while activating the account. UID: " + uid.uid + ". " + err);
        return res.status(400).json({ msg: 'Error while activating the account' });
      }
      logger.info("User is Activated successfully. UID: " + uid.uid);


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
          subject: 'Work Order Web - Account activated',
          html: '<h1>Congratulations!!</h1><p>Your Work Order Web account is activated now.<br/> <br/> Click the below link to login.<br/><br/> <a href="https://workorderweb.com/login">http://workorderweb.com</a><br/>Sincerely, <br /> WoW Team.</p>'
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            logger.error(error);
          } else {
            logger.info('Email sent: ' + info.response);
          }
        });


      }



      return res.status(400).json({ msg: 'User is Activated successfully!' });
    });
  })
});

module.exports = router;
