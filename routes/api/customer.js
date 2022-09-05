const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Customer = require('../../models/Customer');
const WorkOrder = require('../../models/WorkOrder');
const logger = require('../../logger')(module);

//Get list of all Customers
router.get('/', auth, (req, res) => {
  let search = { user_id: req.user.id, status: {$ne: 'Removed'} };
  if (req.user.name == "ADMIN") {
      search = {};
  }
  Customer.find(search,{_id:1,customercode:1,companyname:1,contactperson:1,phone:1,whatsapp:1,email:1,address1:1,address2:1,pin:1,gst:1, status:1})
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

    //if customercode
    if(id.length == 3){
      search = { customercode: id };
    }

    
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


//Update Cusotmer Status
router.post('/:id',auth, (req, res) => {
  const id = req.params.id;
  

  let {status, customercode } = req.body;

  if(status == 'Deleted'){

    let wosearch = { user_id: req.user.id, status: {$ne: 'REMOVED'}, customer_id:id };
    WorkOrder.find(wosearch,{wonumber:1})
      .then(wo => {
        if(wo && wo.length > 0){
          logger.error('Can not delete the customer - ' + customercode); 
          res.status(400).json('Please remove Work Orders before deleting the Customer.');
        } else {

          Customer.updateOne({_id:id},{$set:{ status}},(err,data) => {
            if(err){
              logger.error(err); 
              res.status(400).json('error');
            }else{
                res.status(200).json('success');
            }
          })

        }

      })
  } 

  if(status == 'Active'){
    Customer.updateOne({_id:id},{$set:{status}},(err,data) => {
      if(err){
        logger.error(err); 
        res.status(400).json('error');
      }else{
          res.status(200).json('success');
      }
    })

  }

  if(status == 'Removed'){
    Customer.deleteOne({_id:id},(err,data) => {
      if(err){
        logger.error(err); 
        res.status(400).json('error');
      }else{
          res.status(200).json('success');
      }
    })

  }


});



//Create Customer
router.post('/', auth, (req,  res) => {

    let { action, customercode, companyname,contactperson,phone,whatsapp,email,address1,address2,pin,gst } = req.body;
    let customersearch = { customercode, user_id: req.user.id, status: {$ne: 'Removed'}};
    if(action == 'create'){
      
      Customer.findOne({customersearch})
      .then(customer => {
        if(customer){
          logger.error('Customer Code ' + customercode + ' already exists.');
          res.status(200).json({error:'Customer Code ' + customercode + ' already exists.'})
        } else {
          const user_id = req.user.id;
          console.log(user_id);
          
          const newCustomer = new Customer({ customercode,companyname,contactperson,phone,whatsapp,email,address1,address2,pin,gst, user_id});
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
      Customer.updateOne({customersearch},{$set:{ companyname,contactperson,phone,whatsapp,email,address1,address2,pin,gst}},(err,data) => {
        if(err){
          logger.error(err); res.status(400).json(err);
        }else{
          Customer.findOne({customersearch})
          .then(customer => {
            res.status(200).json(customer);
          })
          
        }
      })
    }


});

module.exports = router;
