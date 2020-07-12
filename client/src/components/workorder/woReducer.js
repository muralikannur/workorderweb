import {
  GET_WO,
  SAVE_MAIN,
  SAVE_ITEMS,
  CREATE_WO,
  CLEAR_WO,
  SAVE_ITEM,
  SAVE_CHILD_ITEMS
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
    case  SAVE_ITEM:
      let items = state.woitems.filter(i => i.itemnumber != action.payload.itemnumber)
      let woWithNewItem = {...state,woitems:[...items, action.payload]}
      return woWithNewItem;  
    case  SAVE_CHILD_ITEMS:
      let cItems = state.woitems.filter(i => i.parentId != action.parentId)
      let woWithNewCItem = {...state,woitems:[...cItems, ...action.childItems]}
      return woWithNewCItem;        
    case  SAVE_MAIN:
      let woWithMainModified = {...state,status:action.status}
      return woWithMainModified;      
    case  CLEAR_WO:
      return initialState; 
    default:
      return state;
  }
}
