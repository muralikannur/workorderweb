const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const logger = require('../../logger')(module);


//Get specific Profile by UserId
router.get('/:id',auth, (req, res) => {
  const id = req.params.id;
  if(id != req.user.id){
    res.json({"error":"User Authentication failed while updating Profile"})
  }
  Profile.findOne({userid:req.user.id})
    .then(p => {
      res.json(p)
    })
    .catch(err => { res.json(err)})
});

//Create or Update Profile
router.post('/', auth, (req,  res) => {

  let { userid, contactperson, phone, whatsapp, billing_address, shipping_address } = req.body;
  if(userid != req.user.id){
    res.json({"error":"User Authentication failed while updating Profile"})
  }

  Profile.findOneAndUpdate({userid},{ userid, contactperson, phone, whatsapp, billing_address, shipping_address },{upsert:true},(err,data) => {
    if(err){
      console.log(err); res.json(err);
    }else{
    }
    res.json(data);
  })


});


module.exports = router;
