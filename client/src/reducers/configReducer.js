import {
  SET_CURRENT_ITEM, SET_CURRENT_REMARK
} from '../actions/types';

const initValue = {
  currentItem:{},
  currentRemark:0
}

export default function(state = initValue, action) {
  switch (action.type) {
    case  SET_CURRENT_ITEM:
      return {...state, currentItem : action.payload};
      case  SET_CURRENT_REMARK:
        return {...state, currentRemark : action.payload};     
    default:
      return state;
  }
}
