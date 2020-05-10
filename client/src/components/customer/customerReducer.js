import {
  GET_CUSTOMER
} from '../../actions/types';

const initialState = {
  customercode:'',
  companyname:'',
  contactperson:'',
  phone:'',
  email:'',
  whatsapp:'',
  address1:'',
  address2:'',
  pin:'',
  gst:''

};

export default function(state = initialState, action) {
  switch (action.type) {
    case  GET_CUSTOMER:
      return action.payload.customercode ? action.payload : initialState;
    default:
      return state;
  }
}
