import { SAVE_ITEM, SET_CURRENT_ITEM, SAVE_CHILD_ITEMS } from "../../actions/types";
import { REMARKS } from "../../constants";
import { setDoubleThick , getPatternLaminateSize}  from '../../Utils/remarksUtils';
import { getNewWoItem }  from '../../Utils/woUtils';

const updateCurrentItem = (dispatch, newItem) => {
  dispatch({
    type: SAVE_ITEM,
    payload: newItem
  });

  dispatch({
    type: SET_CURRENT_ITEM,
    payload: newItem
  });
}

const getNewItem = (getState,currentRemark) => {
  let item = getState().config.currentItem;
  let newItem = JSON.parse(JSON.stringify(item));
  let remarks = newItem.remarks;
  if(remarks.length == 0 || !remarks.includes(currentRemark)){
    remarks.push(currentRemark);
  }
  return newItem;
}

export const updateShape = (shapeDetails) => (dispatch, getState) => {
  let newItem = getNewItem(getState,REMARKS.SHAPE);
  newItem.shapeDetails = shapeDetails;
  updateCurrentItem(dispatch, newItem);
};

export const updateLedge = (ledgeType) => (dispatch, getState) => {
  let newItem = getNewItem(getState,REMARKS.LEDGE);
  newItem.ledgeType = ledgeType;
  updateCurrentItem(dispatch, newItem);
};

export const updateGlass = (glassWidth) => (dispatch, getState) => {
  let newItem = getNewItem(getState,REMARKS.GLASS);
  newItem.glassWidth = glassWidth;
  updateCurrentItem(dispatch, newItem);
};



export const updateProfile = (profileNumber, profileSide) => (dispatch, getState) => {
  let newItem = getNewItem(getState,REMARKS.PROFILE);
  newItem = { ...newItem, profileNumber, profileSide}
  if(profileSide == 'H'){
    newItem.eb_c = 0; 
    newItem.eb_d = newItem.eb_a;
  }
  if(profileSide == 'W'){
    newItem.eb_d = 0; 
    newItem.eb_c = newItem.eb_a;
  }
  updateCurrentItem(dispatch, newItem);
}


export const updateDoubleThick = (doubleThickWidth, dblSides, doubleThickCode) => (dispatch, getState) => {
  let newItem = getNewItem(getState,REMARKS.DBLTHICK);
  newItem = { ...newItem, doubleThickWidth, dblSides}


  let newItem1 = getNewWoItem() //JSON.parse(JSON.stringify(newItem));
  const {eb_a, eb_b, eb_c, eb_d, height, width, quantity} = newItem;
  newItem1 = {...newItem1, 
    itemnumber:0, 
    childNumber:1,
    code:doubleThickCode,
    parentId:newItem.itemnumber,
    eb_a, eb_b, eb_c, eb_d, height, width, quantity

  };

  let newItem2 = JSON.parse(JSON.stringify(newItem1));
  newItem2 = {...newItem2, 
    childNumber:2
  };

  if(!setDoubleThick(dblSides, newItem, newItem1, newItem2, doubleThickWidth)){
    return;
  }

  updateCurrentItem(dispatch, newItem);

  let childItems = [];
  if(newItem1.quantity != 0){
    childItems.push(newItem1);
  }
  if(newItem2.quantity != 0){
    childItems.push(newItem2);
  }

  if(childItems.length > 0){
    dispatch({
      type: SAVE_CHILD_ITEMS,
      parentId: newItem.itemnumber,
      childItems: [newItem1, newItem2]
    });
  }

}


export const updatePattern = (patternBoardCode, patternType, patternSplits, boardHeight, boardWidth) => (dispatch, getState) => {
  let newItem = getNewItem(getState,REMARKS.PATTERN);
  newItem = { ...newItem, patternBoardCode, patternType, patternSplits}


  let patternBoard = getNewWoItem(); 

  patternBoard = {...patternBoard,
    itemnumber:0,
    parentId:newItem.itemnumber,
    height:boardHeight,
    width:boardWidth,
    quantity:newItem.quantity,
    code:patternBoardCode,
    childNumber:1,
    comments:'Pattern Board for Item #' + newItem.itemnumber
  }

  let splitItems = [];
  patternSplits.map((p,index) => {

    let  {height, width} = getPatternLaminateSize(
      newItem,
      getState().material.edgebands, 
      p,
      patternSplits.length, 
      patternType, 
      patternBoard)

    let splitItem = JSON.parse(JSON.stringify(patternBoard));

    splitItem = {
      ...splitItem,
      code:p.code, 
      height, 
      width, 
      childNumber: index+2, 
      comments: 'Pattern Laminate - ' + (parseInt(index) + 1) + ' for Item #' + newItem.itemnumber
    } ;

    splitItems.push(splitItem);
  })
  
  updateCurrentItem(dispatch, newItem);

  dispatch({
    type: SAVE_CHILD_ITEMS,
    parentId: newItem.itemnumber,
    childItems: [patternBoard, ...splitItems]
  });

}


