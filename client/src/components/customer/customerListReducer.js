import {
  GET_CUSTOMER_LIST, ADD_CUSTOMER_TO_LIST,UPDATE_CUSTOMER_LIST, UPDATE_CUSTOMER_STATUS
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
    case  UPDATE_CUSTOMER_STATUS:
      let clist = state.filter(s => s.customercode != action.customercode)
      let customer = state.find(s => s.customercode == action.customercode)
      return [...clist, {...customer, status:action.status}];

    default:
      return state;
  }
}
