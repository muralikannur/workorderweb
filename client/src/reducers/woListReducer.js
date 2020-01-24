import {
  GET_WO_LIST, ADD_WO_TO_LIST
} from '../actions/types';


export default function(state = [], action) {
  switch (action.type) {
    case  GET_WO_LIST:
      return action.payload;
    case  ADD_WO_TO_LIST:
      return [...state,action.payload];
      
    default:
      return state;
  }
}
