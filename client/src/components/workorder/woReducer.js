import {
  GET_WO,
  SAVE_MAIN,
  SAVE_ITEMS,
  CREATE_WO,
  CLEAR_WO
} from '../../actions/types';

const initialState = {
  wonumber:'',
  wodate:Date.now,
  userid:0,
  billing_address:'',
  shipping_address:'',  
  woitems: [],
  status:''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case  GET_WO:
      return action.payload;
    case  CREATE_WO:
      return action.payload;
    case  SAVE_ITEMS:
      let woWithNewItems = {...state,woitems:action.payload}
      return woWithNewItems;  
    case  SAVE_MAIN:
      let woWithMainModified = {...state,status:action.status}
      return woWithMainModified;      
    case  CLEAR_WO:
      return initialState; 
    default:
      return state;
  }
}
