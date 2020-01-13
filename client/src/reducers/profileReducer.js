import {
  GET_PROFILE,
  SAVE_PROFILE
} from '../actions/types';

const initialState = {
  userid:'',
  contactperson:'', 
  phone:'', 
  whatsapp:'', 
  billing_address:'', 
  shipping_address:''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case  GET_PROFILE:
      return action.payload;
    default:
      return state;
  }
}
