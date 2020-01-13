import {
  GET_CUSTOMER,
  SAVE_CUSTOMER
} from '../actions/types';

const initialState = {
  customercode:'',
  companyname:'',
  contactperson:'',
  phone:'',
  whatsapp:'',
  billing_address:'',
  shipping_address:''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case  GET_CUSTOMER:
      return action.payload;
    default:
      return state;
  }
}
