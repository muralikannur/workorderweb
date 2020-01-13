const express = require('express');

const logger = require('../../logger')(module);

const router = express.Router();

const User = require('../../models/User');

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
    if(user.email_verified){
      logger.error("Account is already activated. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Account is already activated.' });
    }

    if(user.code != code){
      logger.error("Invalid Activation Code. UID: " + uid.uid);
      return res.status(400).json({ msg: 'Invalid Activation Code' });
    } 
    User.updateOne({_id:uid.uid},{email_verified:true},(err,raw) => {
      if(err){
        logger.error("Error while activating the account. UID: " + uid.uid + ". " + err);
        return res.status(400).json({ msg: 'Error while activating the account' });
      }
      logger.info("User is Activated successfully. UID: " + uid.uid);
      return res.status(400).json({ msg: 'User is Activated successfully!' });
    });
  })
});

module.exports = router;
