import axios from 'axios';
import { GET_CUSTOMER, SAVE_CUSTOMER, GET_CUSTOMER_LIST, ADD_CUSTOMER_TO_LIST, UPDATE_CUSTOMER_LIST, UPDATE_CUSTOMER_STATUS } from '../../actions/types';
import { tokenConfig } from '../../actions/authActions';
import { returnErrors } from '../../actions/errorActions';
import { notify_error, notify_success } from '../../Utils/commonUtls';

export const saveCustomer = (customer,id) => (dispatch, getState) => {
  if(id == 0) 
    customer.action = 'create'
  else
    customer.action = 'update'

  axios
    .post('/api/customer', customer, tokenConfig(getState))
    .then(res =>{
      if(res.status == 200){
        if(res.data.error && res.data.error != ''){
          notify_error(res.data.error);
        }
        else {
          dispatch({
            type: SAVE_CUSTOMER,
            payload: res.data
          });
          if(customer.action == 'create'){
            dispatch({
              type: ADD_CUSTOMER_TO_LIST,
              payload: res.data
            });   
          } else {
            dispatch({
              type: UPDATE_CUSTOMER_LIST,
              payload: res.data
            });   
          }
       
          notify_success('Saved successfully...');
        }
      }

    }
    )
    .catch(err =>
      {
        notify_error('ERROR while saving...');
      //dispatch(returnErrors(err.response.data, err.response.status))
      }
    );
};

// export const getCustomer = id => (dispatch, getState) => {
//   axios
//     .get('/api/customer/' + id, tokenConfig(getState))
//     .then(res =>
//       dispatch({
//         type: GET_CUSTOMER,
//         payload: res.data
//       })
//     )
//     .catch(err =>
//       dispatch(returnErrors(err.response.data, err.response.status))
//     );
// };


export const getCustomerCode = code => (dispatch, getState) => {
  axios
    .get('/api/customer/' + code, tokenConfig(getState))
    .then(res =>{
      if(res.data && res.data.companyname && res.data.status != 'Removed'){
        notify_error("Customer Code already exists for " + res.data.companyname);
        return res.data.companyname;
      } 
    }
    )
    .catch(err =>
      {
        dispatch(returnErrors(err.response.data, err.response.status))
      }
    );
};

export const setCustomer = customer => (dispatch) => {
  dispatch({
    type: GET_CUSTOMER,
    payload: customer
  })
};


export const getAllCustomers = () => (dispatch, getState) => {
  axios
    .get('/api/customer/' , tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_CUSTOMER_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};


export const updateCustomerStatus = (id, customercode, status) => (dispatch, getState) => {
  axios
    .post('/api/customer/' + id, {status, customercode}, tokenConfig(getState))
    .then(res =>
      {
        dispatch({
          type: UPDATE_CUSTOMER_STATUS,
          customercode, 
          status
        })
        notify_success('Customer ' + customercode + ' is ' + status);
      }
    )
    .catch(err => {
     // console.log(err);
      notify_error(err.response.data)
    }
    );
};

