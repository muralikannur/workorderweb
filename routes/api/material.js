const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Material = require('../../models/Material');
const logger = require('../../logger')(module);

//Get Materials of a Work Order
router.get('/:id',auth, (req, res) => {
    const id = req.params.id;
    let search = { wo_id: id };
    Material.findOne(search)
      .then(material => {
        res.json(material)
      })
      .catch(err => { 
        logger.error(err);
        res.json(err)
      })
});

//Update Material
router.post('/', auth, (req,  res) => {

  if(req.body.MatFromWO && req.body.MatToWO && req.body.MatToId){  // Copy Material Definition from other Work Order
    let search = { wo_id: req.body.MatFromWO };
    Material.findOne(search)
    .then(material => {
      let { boards, laminates, materialCodes, profiles, edgebands } = material;
      Material.updateOne({wo_id:req.body.MatToWO},{$set:{ boards, laminates, materialCodes, profiles, edgebands}},(err,data) => {
        if(err){
          logger.error(err); res.json(err);
        }else{
          search = { wo_id: req.body.MatToWO };
          Material.findOne(search)
          .then(material => {
            res.json(material)
          })
          .catch(err => { 
            logger.error(err);
            res.json(err)
          })
        }
      })
    })
    .catch(err => { 
      logger.error(err);
      res.json(err)
    })
  } else {

    let { wo_id, boards, laminates, materialCodes, profiles, edgebands } = req.body;

    Material.updateOne({wo_id},{$set:{ boards, laminates, materialCodes, profiles, edgebands}},(err,data) => {
      if(err){
        logger.error(err); res.json(err);
      }else{
        res.json(data);
      }
    })
  }


});



module.exports = router;
