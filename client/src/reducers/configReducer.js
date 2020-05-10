import {
  SET_CURRENT_ITEM, SET_CURRENT_REMARK, SET_CURRENT_MATERIAL_TAB, SET_EDIT_MODE
} from '../actions/types';

const initValue = {
  currentItem:{},
  currentRemark:0,
  currentCustomer:{},
  materialTab:'',
  editMode:true
}

export default function(state = initValue, action) {
  switch (action.type) {
    case  SET_CURRENT_ITEM:
      return {...state, currentItem : action.payload};
    case  SET_CURRENT_REMARK:
      return {...state, currentRemark : action.payload};     
    case  SET_CURRENT_MATERIAL_TAB:
      return {...state, materialTab : action.payload};        
    case  SET_EDIT_MODE:
      return {...state, editMode : action.payload};              
    default:
      return state;
  }
}
