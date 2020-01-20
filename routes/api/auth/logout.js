const express = require('express');
const auth = require('../../../middleware/auth');
const logger = require('../../../logger')(module);

const router = express.Router();

const User = require('../../../models/User');

router.post('/', auth,(req, res) => {

  if(req.user && req.user.id){
    User.findById(req.user.id,(err,user) => {
      if(err){
        logger.error("Error while getting the user detail. UID: " + req.user.email + ". " + err);
      }
      if(!user) {
        logger.error("User Data Does not exist. UID: " + req.user.email);
      }
      User.updateOne({_id:req.user.id},{ip_address:''},(err,raw) => {
        if(err){
          logger.error("Error while setting ip address. : " +  req.user.email + ". " + err);
        }
      })
    })
  }


});

module.exports = router;
