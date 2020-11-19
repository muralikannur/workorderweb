
import { notify_error }  from './commonUtls';
import { getEBThickness }  from '../Utils/woUtils';
import { PATTERN_TYPE} from '../constants';

export const setDoubleThick = (dblThkSides, item, newItem1, newItem2, newItem3, newItem4, doubleThickData) => {

    var A = dblThkSides.includes("A")|| false;
    var B = dblThkSides.includes("B")|| false;
    var C = dblThkSides.includes("C")|| false;
    var D = dblThkSides.includes("D")|| false;

    let requiredWidth = 0
    let itemWidth = item.width;
    let itemHeight = item.height;

    if(A){
      newItem1.quantity = item.quantity;
      newItem1.height = item.height;
      newItem1.width = doubleThickData.A.thick;
      newItem1.code = doubleThickData.A.code;
      itemWidth -= doubleThickData.A.thick;
    }
    if(C){
      newItem3.quantity = item.quantity;
      newItem3.height = item.height;
      newItem3.width = doubleThickData.C.thick;
      newItem3.code = doubleThickData.C.code;
      itemWidth -= doubleThickData.C.thick;
    }



    if(B){
      newItem2.quantity = item.quantity;
      newItem2.height = itemWidth;
      newItem2.width = doubleThickData.B.thick;
      newItem2.code = doubleThickData.B.code;
      itemHeight -= doubleThickData.B.thick;
    }
    if(D){
      newItem4.quantity = item.quantity;
      newItem4.height = itemWidth;
      newItem4.width = doubleThickData.D.thick;
      newItem4.code = doubleThickData.D.code;
      itemHeight -= doubleThickData.D.thick;
    }



    if(itemWidth < 1 ){
      notify_error('Item width ' + item.width + ' not enough for the Double Thick Width ' );
      return false;
    }
    if(itemHeight < 1 ){
      notify_error('Item Height ' + item.height + ' not enough for the Double Thick Width ' );
      return false;
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
  