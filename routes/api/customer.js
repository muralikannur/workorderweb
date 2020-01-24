const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Customer = require('../../models/Customer');
const logger = require('../../logger')(module);

//Get list of all Customers
router.get('/', auth, (req, res) => {
  let search = { user_id: req.user.id };
  if (req.user.name == "ADMIN") {
      search = {};
  }
  Customer.find(search,{_id:1,customercode:1,companyname:1,contactperson:1,phone:1,whatsapp:1,email:1,billing_address:1,shipping_address:1})
      .then(c => {
          res.status(200).json(c)
      })
      .catch(err => { 
        logger.error(err);
        res.status(400).json(err)
      })
});

//Get Customer Details
router.get('/:id',auth, (req, res) => {
    const id = req.params.id;
    let search = { _id: id };
    Customer.findOne(search)
      .then(customer => {
        if(req.user.name == 'ADMIN' ||  customer.user_id == req.user.id)
          res.status(200).json(customer)
        else
          res.json('Customer not linked to the Userid');
      })
      .catch(err => { 
        logger.error(err);
        res.status(400).json(err)
      })
});

//Create Customer
router.post('/', auth, (req,  res) => {

    let { action, customercode, companyname,contactperson,phone,whatsapp,email,billing_address,shipping_address } = req.body;

    if(action == 'create'){
      Customer.findOne({customercode})
      .then(customer => {
        if(customer && customer.user_id == req.user.id){
          logger.error('Customer Code ' + customercode + ' already exists.');
          res.status(200).json({error:'Customer Code ' + customercode + ' already exists.'})
        } else {
          const user_id = req.user.id;
          const newCustomer = new Customer({ customercode,companyname,contactperson,phone,whatsapp,email,billing_address,shipping_address, user_id});
          newCustomer.save().then(c => {
              res.status(200).json(c);
          }).catch(err => { 
            logger.error(err);
            res.status(400).json(err)
          })
        }
      })
    }

    if(action == 'update'){
      Customer.updateOne({customercode},{$set:{ companyname,contactperson,phone,whatsapp,email,billing_address,shipping_address}},(err,data) => {
        if(err){
          logger.error(err); res.status(400).json(err);
        }else{
          res.status(200).json(data);
        }
      })
    }


});

module.exports = router;
