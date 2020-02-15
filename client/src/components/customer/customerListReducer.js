import {
  GET_CUSTOMER_LIST, ADD_CUSTOMER_TO_LIST,UPDATE_CUSTOMER_LIST
} from '../../actions/types';

const initialState = [];

export default function(state = initialState, action) {
  switch (action.type) {
    case  GET_CUSTOMER_LIST:
      return action.payload;
    case  ADD_CUSTOMER_TO_LIST:
      return [...state, action.payload];
    case  UPDATE_CUSTOMER_LIST:
      let list = state.filter(s => s.customercode != action.payload.customercode)
      return [...list, action.payload];
    default:
      return state;
  }
}
