const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const WorkOrder = require('../../models/WorkOrder');
const Material = require('../../models/Material');
const nodemailer = require('nodemailer');
const { parse } = require('json2csv');
const logger = require('../../logger')(module);


//Get list of all Work Orders
router.get('/', auth, (req, res) => {
    let search = { user_id: req.user.id, status: {$ne: 'REMOVED'} };
    if (req.user.name == "ADMIN") {
        search = {};
    }
    WorkOrder.find(search,{_id:1,customer_id:1,wonumber:1,status:1, date:1, client:1})
        .then(wo => {
            res.json(wo)
        })
        .catch(err => { res.json(err)})
});

//Get specific Work Order by Id or WO-number
router.get('/:id',auth, (req, res) => {
    const id = req.params.id;
    let search = { _id: id };
    if (id.length == 10) {
        search = { wonumber: id };
    }

    WorkOrder.findOne(search)
      .then(wo => {
      if(req.user.name == 'ADMIN' ||  wo.user_id == req.user.id)
        res.json(wo)
      else
        res.json('Work Order not matching with the Userid');
      })
      .catch(err => { res.json(err)})
});

//Update workorder details 
router.post('/:id',auth, (req, res) => {

  let { user_id,client,billing_address1,billing_address2,billing_pin,billing_phone,billing_gst,shipping_address1,shipping_address2,shipping_pin,shipping_phone,shipping_gst, status} = req.body;
  if(user_id != req.user.id){
    logger.error("User Authentication failed while creating new Work Order");
    res.json({"error":"User Authentication failed while creating new Work Order"})
  }
  const id = req.params.id;
  let search = { _id: id };
  let updateQuery = {};
  if(status){
    updateQuery = {status};
  } else if(billing_address1){
    updateQuery = {client,billing_address1,billing_address2,billing_pin,billing_phone,billing_gst,shipping_address1,shipping_address2,shipping_pin,shipping_phone,shipping_gst};
  } else {
    let err = {'err':'Required parameters missing (status/address).'}
    logger.error(); res.json(err);
  }

  WorkOrder.updateOne(search,{$set:updateQuery},(err,data) => {
    if(err){
      logger.error(err); res.json(err);
    }else{
      res.json(data);
    }
  }
  )

});



//Create or Update Work Order
router.post('/', auth, (req,  res) => {

  logger.info(req.body);

  let { 
    wonumber, 
    user_id, 
    customer_id, 
    materialWoId,
    client,
    billing_address1,
    billing_address2,
    billing_pin,
    billing_phone,
    billing_gst,
    shipping_address1,
    shipping_address2,
    shipping_pin,
    shipping_phone,
    shipping_gst
  } = req.body;

  if(user_id != req.user.id){
    logger.error("User Authentication failed while creating new Work Order");
    res.json({"error":"User Authentication failed while creating new Work Order"})
  }

  if(req.body.woitems){
    //UPDATING EXISTING WO
    let { woitems, status } = req.body;

    WorkOrder.updateOne({wonumber},{$set: { woitems, status}},(err,data) => {
      if(err){
        logger.error(err); res.json(err);
      }else{

        // const fieldsItems = ['itemnumber',	'code',	'height',	'width',	'quantity',	'itemtype',	'remarks',	'eb_a',	'eb_b',	'eb_c',	'eb_d' ];
        // const csvItems = parse(woitems, { fieldsItems });

        // const fieldsMat = ['code',	'material',	'shade',	'thickness',	'grains'];
        // const csvMat = parse(materialDef, { fieldsMat });

        //   //send email with work order details
        //   const transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //       user: 'wow.email.communication@gmail.com',
        //       pass: 'wow@1234'
        //     }
        //   });

          // const mailOptions = {
          //   from: 'wow.email.communication@gmail.com',
          //   to: 'muralikannur@gmail.com',
          //   subject: 'Work Order - ' + wonumber,
          //   attachments: [
          //     {   
          //       filename: 'items.csv',
          //       content: csvItems,
          //       contentType: 'text/csv'
          //     },
          //     {   
          //       filename: 'materials.csv',
          //       content: csvMat,
          //       contentType: 'text/csv'
          //     }            
            
          //   ],
          //   html: '<h1>' + wonumber + '</h1><p>Please find the attached work order with this mail.<br/><br/>Sincerely, <br /> WoW Team.</p>'
          // };

          // transporter.sendMail(mailOptions, function(error, info){
          //   if (error) {
          //     console.log(error);
          //   } else {
          //     console.log('Email sent: ' + info.response);
          //   }
          // });

        res.json(data);
      }
    })

  } else {
    
    //CREATE NEW WO


    const letterArray = 'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',');

    WorkOrder.find({wonumber: {$regex: "^" + wonumber }},{wonumber:1, _id:0})
    .then(wo => {
      let suffix = letterArray[wo.length];
      const newWN = wonumber + suffix;
      console.log(newWN);
      const newWO = new WorkOrder({ 
        wonumber:newWN, 
        user_id, 
        customer_id, 
        client,
        billing_address1,
        billing_address2,
        billing_pin,
        billing_phone,
        billing_gst,
        shipping_address1,
        shipping_address2,
        shipping_pin,
        shipping_phone,
        shipping_gst
      });
      newWO.save().then(item => {
        let materialDef = { wo_id:item._id }
        const newMaterial = new Material(materialDef);

        newMaterial.save().then(() => {

          if(materialWoId != 0 ){
            Material.findOne({wo_id:materialWoId}).then(mat => {
              if(mat){
                let {boards, laminates, materialCodes, profiles, edgebands} = mat;

                Material.updateOne({wo_id:item._id},{$set:{ boards, laminates, materialCodes, profiles, edgebands}},(err,data) => {
                  if(err){
                    logger.error(err); 
                  }
                })
              }
            })
          }
          
          res.json(item);
        })
      });
    })
    .catch(err => { 
      console.log(err);
      logger.error(err);
      res.json(err);
    })
  }

});


function ConvertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';
  for (var i = 0; i < array.length; i++) {
      var line = '';
      for (var index in array[i]) {
          if (line != '') line += ','

          line += array[i][index];
      }
      str += line + '\r\n';
  }
  return str;
}


module.exports = router;
