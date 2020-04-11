import {
  GET_WO_LIST, ADD_WO_TO_LIST, UPDATE_WO_LIST
} from '../../actions/types';


export default function(state = [], action) {
  switch (action.type) {
    case  GET_WO_LIST:
      return action.payload;
    case  ADD_WO_TO_LIST:
      return [...state,action.payload];
    case  UPDATE_WO_LIST:{
      let wo = state.find(w => w.wonumber == action.wonumber)
      wo.status = action.status;
      let wolist = state.filter(w => w.wonumber != action.wonumber)
      return [...wolist,wo];    
    }
      
    default:
      return state;
  }
}
