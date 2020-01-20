const express = require('express');

const logger = require('../../../logger')(module);

const router = express.Router();

const User = require('../../../models/User');

router.post('/', (req, res) => {
  const { email } = req.body;

  if(!email) {
    return res.status(400).json({ msg: 'Please enter email address' });
  }

  // Check for existing user
  User.find({email},(err,user) => {
    if(err){
      logger.error("Error while getting the user details - : " + email + ". " + err);
      return res.status(400).json({ msg: 'Error while getting the user details' });
    }
    if(!user) {
      logger.error("User Does not exist. -  " + email);
      return res.status(200).json({ msg: 'Password reset link will be sent to ' + email + ' if it is registered with us.' });
    }

    var new_code = new mongoose.Types.ObjectId();
    User.updateOne({_id:user.uid},{verification_code:new_code},(err,raw) => {
      
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
          to: email,
          subject: 'Work Order Web - Password Reset Link',
          html: '<h1>Password Reset Link</h1><p>If you have initiated for password reset for your Work Order Web account, click the below link to reset password.<br/><br/> <a href="https://workorderweb.com/resetpassword?uid=' + user.uid +'"></a><br/>Sincerely, <br /> WoW Team.</p>'
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            logger.error(error);
          } else {
            logger.info('Email sent: ' + info.response);
          }
        });
      }
    });

    return res.status(200).json({ msg: 'Password reset link will be sent to ' + email + ' if it is registered with us.' });

  })
});

module.exports = router;
