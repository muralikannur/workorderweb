const express = require("express");
const router = express.Router();
const WorkOrder = require("../../models/WorkOrder");
const Material = require("../../models/Material");



const getEBThickness = (id, edgebands) => {
  const eb = edgebands.find(e => e.materialEdgeBandNumber == id);
  if(eb){
    return parseFloat(eb.eb_thickness);
  }
  return 0;
}


const REMARKS = {
  PROFILE:1,
  //E_PROFILE:2,
  GLASS:3,
  DBLTHICK:4,
  LEDGE:5,
  SHAPE:6,
  PATTERN:7
}

 const PROFILE_TYPE = {
  H:'Handle Profile',
  E:'Edge Profile'
}


 const PATTERN_TYPE = {
  HORIZONTAL:1,
  VERTICAL:2,
  SPECIAL_DESIGN:3
}


 const LEDGE_TYPE = {
  NONE:1,
  LEDGE:2,
  C_LEDGE:3
}

 const EB_START_NUMBER = {
  BOARD:100,
  PROFILE:200
}

 const WO_STATUS = {
  NEW:'NEW',
  SUBMITTED:'SUBMITTED',
  DELETED:'DELETED'
}

const PATTERN_CODE = 1000;


//Get specific Work Order by Id or WO-number
router.get("/:id", (req, res) => {
  const id = req.params.id;
  let search = { _id: id };

  let cutting_list = [];

  let materialsearch = { wo_id: id };
  Material.findOne(materialsearch)
    .then((material) => {
      WorkOrder.findOne(search)
        .then((wo) => {

          let wonumber = wo.wonumber;

          let items = wo.woitems;
          console.log(items);

          items.map((i) => {
            let cutting_Height = parseInt(i.height);
            let cutting_Width = parseInt(i.width);

            let qty = parseInt(i.quantity);
            if(i.ledgeType != 0){
              qty *= 2;
            }

            //Adjust Pattern Laminates size
            if (i.parentId != 0) {
              let parentItem = items.find((p) => p.itemnumber == i.parentId);
              if (parentItem.remarks.includes(REMARKS.PATTERN)) {
                let patternType = parentItem.patternType;
                let splitCount = parentItem.patternSplits.length;

                if (i.childNumber == 1) {
                  // if PatternBoard
                  cutting_Width -= getEBThickness(
                    parentItem.eb_a,
                    material.edgebands
                  );
                  cutting_Height -= getEBThickness(
                    parentItem.eb_b,
                    material.edgebands
                  );
                  cutting_Width -= getEBThickness(
                    parentItem.eb_c,
                    material.edgebands
                  );
                  cutting_Height -= getEBThickness(
                    parentItem.eb_d,
                    material.edgebands
                  );
                } else {
                  if (patternType == PATTERN_TYPE.HORIZONTAL) {
                    if (i.childNumber == 2) {
                      cutting_Height -= getEBThickness(
                        parentItem.eb_b,
                        material.edgebands
                      );
                    }
                    if (i.childNumber == splitCount + 1) {
                      cutting_Height -= getEBThickness(
                        parentItem.eb_d,
                        material.edgebands
                      );
                    }
                  }

                  if (patternType == PATTERN_TYPE.VERTICAL) {
                    if (i.childNumber == 2) {
                      cutting_Width -= getEBThickness(
                        parentItem.eb_a,
                        material.edgebands
                      );
                    }
                    if (i.childNumber == splitCount + 1) {
                      cutting_Height -= getEBThickness(
                        parentItem.eb_c,
                        material.edgebands
                      );
                    }
                  }
                }
              }
            }

            // if(i.doubleThickWidth == 0 && i.ledgeType == 0){
            if (material.edgebands && material.edgebands.length > 0) {
              cutting_Width -= getEBThickness(i.eb_a, material.edgebands);
              cutting_Height -= getEBThickness(i.eb_b, material.edgebands);
              cutting_Width -= getEBThickness(i.eb_c, material.edgebands);
              cutting_Height -= getEBThickness(i.eb_d, material.edgebands);
            }
            // }

            if (i.profileNumber != 0) {
              if (material.profiles) {
                let profile = material.profiles.find(
                  (p) => p.profileNumber == i.profileNumber
                );
                if (profile && i.profileSide == "H")
                  cutting_Width -= parseInt(profile.height);
                if (profile && i.profileSide == "W")
                  cutting_Height -= parseInt(profile.height);
              }
            }

            let grains = "";

            if (i.code != PATTERN_CODE) {
              let mCode = material.materialCodes.find(
                (m) => m.materialCodeNumber == i.code
              );
              let board = material.boards.find(
                (b) => b.boardNumber == mCode.board
              );
              let laminate = material.laminates.find(
                (l) => l.laminateNumber == mCode.front_laminate
              );

              if (laminate && laminate.grains != "N") {
                grains = laminate.grains;
              } else if (board) {
                grains = board.grains;
              }
            }

            let refNo = i.parentId == 0 ? i.itemnumber : i.parentId;

            cutting_list.push({
              itemNumber: refNo,
              C_Height: Math.round(cutting_Height),
              C_Width: Math.round(cutting_Width),
              Qty: qty,
              Code: i.code != PATTERN_CODE ? parseInt(i.code) : 0,
              Grains: grains == "H" || grains == "V" ? "yes" : "no",
            });
          });
          


          res.json({wonumber, material, cutting_list});
        })
        .catch((err) => {
          console.log(err);
          res.json(err);
        });
    })
    .catch((err) => {
      logger.error(err);
      res.json(err);
    });
});

module.exports = router;
