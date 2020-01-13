import {
  GET_CUSTOMER_LIST, ADD_CUSTOMER_TO_LIST
} from '../actions/types';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case  GET_CUSTOMER_LIST:
      return action.payload;
    case  ADD_CUSTOMER_TO_LIST:
      return [...state, action.payload];
    default:
      return state;
  }
}
