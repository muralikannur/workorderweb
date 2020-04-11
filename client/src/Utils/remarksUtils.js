
import { notify_error }  from './commonUtls';
import { getEBThickness }  from '../Utils/woUtils';
import { PATTERN_TYPE} from '../constants';

export const setDoubleThick = (dblThkSides, item, newItem1, newItem2, doubleThickWidth) => {

    var A = dblThkSides.includes("A")|| false;
    var B = dblThkSides.includes("B")|| false;
    var C = dblThkSides.includes("C")|| false;
    var D = dblThkSides.includes("D")|| false;

    let requiredWidth = 0
    if(A & C){
      requiredWidth = parseInt(doubleThickWidth)*2;
    } else if(A || C){
      requiredWidth = parseInt(doubleThickWidth);
    }

    if(item.width - requiredWidth < 1 ){
      notify_error('Item width ' + item.width + ' not enough for the Double Thick Width ' + doubleThickWidth);
      return false;
    }

    //Default (ABCD)
    newItem1.height = item.height;
    newItem1.width = doubleThickWidth;
    newItem2.width = doubleThickWidth;
    newItem2.height = item.width - (parseInt(doubleThickWidth)*2);

    //get Width sides (BD) quantity
    if(B || D){
      newItem2.quantity = item.quantity;
    } 
    if(B && D){
      newItem2.quantity = item.quantity * 2;
    } 

    //get Height sides (AC) quantity
    if(A || C){
      newItem1.quantity = item.quantity;

      if(A && C){
        newItem1.quantity = item.quantity * 2;
      } else {
        newItem2.height = item.width - parseInt(doubleThickWidth)
      } 
    } else {
      newItem2.height = item.width;
    }



    return true;

  }

  export const getPatternBoardSize = (item,edgebands) => {
    let itemHeight =parseInt(item.height);
    let itemWidth = parseInt(item.width);

    let eb_a = getEBThickness(item.eb_a,edgebands);
    let eb_b = getEBThickness(item.eb_b,edgebands);
    let eb_c = getEBThickness(item.eb_c,edgebands);
    let eb_d = getEBThickness(item.eb_d,edgebands);

    let heightEB = 0;
    let widthEB = 0;

    widthEB += Math.round(eb_a);
    widthEB += Math.round(eb_c);
    heightEB += Math.round(eb_b);
    heightEB += Math.round(eb_d);

    let height = itemHeight + 10; // - heightEB;
    let width = itemWidth + 10; // - widthEB;

    return {height, width}
  }

  export const getPatternLaminateSize = (item,edgebands,currentSplit, splitCount, patternType, patternBoard) => {


    const isFirst = currentSplit.id == 1;
    const isLast = currentSplit.id == splitCount ;

    let height = patternType == PATTERN_TYPE.HORIZONTAL ? currentSplit.height : patternBoard.height;
    let width  = patternType == PATTERN_TYPE.VERTICAL ? currentSplit.height : patternBoard.width;

    if (!isFirst && !isLast){
      return {height, width};
    }

    let eb_a = getEBThickness(item.eb_a,edgebands);
    let eb_b = getEBThickness(item.eb_b,edgebands);
    let eb_c = getEBThickness(item.eb_c,edgebands);
    let eb_d = getEBThickness(item.eb_d,edgebands);


    if(patternType == PATTERN_TYPE.HORIZONTAL){
      height = Math.ceil(currentSplit.height + 5 );  //- (isFirst?eb_b:eb_d)
    }

    if(patternType == PATTERN_TYPE.VERTICAL){
      width = Math.ceil(currentSplit.height + 5); // - (isFirst?eb_a:eb_c)
    }

    return {height, width};

  }
  