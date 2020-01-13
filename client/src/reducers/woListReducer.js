import {
  GET_WO_LIST,
} from '../actions/types';


export default function(state = [], action) {
  switch (action.type) {
    case  GET_WO_LIST:
      return action.payload;
    default:
      return state;
  }
}
