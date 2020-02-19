
import { notify_error }  from './commonUtls';
export const setDoubleThick = (dblThkSides, item, newItem1, newItem2, doubleThickWidth) => {

  if(item.width - (parseInt(doubleThickWidth)*2) < 10 ){
    notify_error('Item width ' + item.width + ' not enough for the Double Thick Width ' + doubleThickWidth);
    return false;
  }

    var A = dblThkSides.includes("A")|| false;
    var B = dblThkSides.includes("B")|| false;
    var C = dblThkSides.includes("C")|| false;
    var D = dblThkSides.includes("D")|| false;

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