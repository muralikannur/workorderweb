import axios from 'axios';
import { GET_WO, SAVE_MAIN, GET_WO_LIST, SAVE_MATERIAL, SAVE_ITEMS, CREATE_WO, ADD_WO_TO_LIST, CLEAR_WO, UPDATE_WO_LIST, SAVE_ITEM } from '../../actions/types';
import { tokenConfig } from '../../actions/authActions';
import { returnErrors } from '../../actions/errorActions';
import { getMaterial } from '../materials/materialActions';
import { notify_error, notify_success } from '../../Utils/commonUtls';
import { data } from 'jquery';

export const createWorkOrder = wo => (dispatch, getState) => {
  axios
    .post('/api/wo', wo, tokenConfig(getState))
    .then(res =>{
      if(res.status == 200){
        dispatch({
          type: CREATE_WO,
          payload: res.data
        });

        let newWO = {
          status:res.data.status,
          _id:res.data._id,
          wonumber:res.data.wonumber,
          customer_id:res.data.customer_id,
          project:res.data.project,
          date:res.data.date,
          client:res.data.client
        }

        dispatch({
          type: ADD_WO_TO_LIST,
          payload: newWO
        })

        dispatch(getMaterial(res.data._id))
      } else {
        notify_error('ERROR while creating Work Order...');
      }
    }
    )
    .catch(err =>
      {
      notify_error('ERROR while saving...');
      console.log(err.response);
      //dispatch(returnErrors(err.response.data, err.response.status))
      }
    );
};

export const saveWorkOrder = (wo, notify=false) => (dispatch, getState) => {
  const {status} = wo;
  axios
    .post('/api/wo', wo, tokenConfig(getState))
    .then(res =>{
      if(res.status == 200){
        if(notify){
          dispatch({
            type: GET_WO,
            payload:wo
          });
          notify_success('Updated successfully...');
        }
        
      } else {
        notify_error('ERROR while saving...');
        
      }
    }
    )
    .catch(err =>
      {
      notify_error('ERROR while saving...');
      console.log(err.response);
      //dispatch(returnErrors(err.response.data, err.response.status))
      }
    );
};

export const updateStatus = (id, wonumber, user_id, status) => (dispatch, getState) => {
  axios
    .post('/api/wo/' + id, {user_id, status}, tokenConfig(getState))
    .then(res =>
      {
        dispatch(updateWorkOrderList(wonumber,status))
        notify_success('Work Order ' + wonumber + ' is ' + (status == 'NEW' ? ' restored.' : ' deleted.'));
      }
    )
    .catch(err =>
      notify_error('ERROR while updating work order.')
    );
};

export const updateAddress = (id, user_id,client,billing_address1,billing_address2,billing_pin,billing_phone,billing_gst,shipping_address1,shipping_address2,shipping_pin,shipping_phone,shipping_gst,ship_to_billing ) => (dispatch, getState) => {
  axios
    .post('/api/wo/' + id, {user_id,client,billing_address1,billing_address2,billing_pin,billing_phone,billing_gst,shipping_address1,shipping_address2,shipping_pin,shipping_phone,shipping_gst,ship_to_billing}, tokenConfig(getState))
    .then(res =>
      {
        notify_success('Address updated successfully.');
      }
    )
    .catch(err =>
      notify_error('ERROR while updating address.')
    );
};


// export const restoreWorkOrder = (id, wonumber, user_id) => (dispatch, getState) => {
//   axios
//     .post('/api/wo/' + id, {user_id}, tokenConfig(getState))
//     .then(res =>
//       {
//         dispatch(updateWorkOrderList(wonumber,'NEW'))
//         notify_success('Work Order ' + wonumber + ' restored.');
//       }
//     )
//     .catch(err =>
//       notify_error('ERROR while restoring work order.')
//     );
// };




export const getWorkOrder = id => (dispatch, getState) => {
  axios
    .get('/api/wo/' + id, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_WO,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const getAllWorkOrders = customer_id => (dispatch, getState) => {
  axios
    .get('/api/wo/', tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_WO_LIST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const updateWorkOrderList = (wonumber, status) => (dispatch) => {
      dispatch({
        type: UPDATE_WO_LIST,
        wonumber, 
        status
      })
};



export const saveMaterial = (matData) => dispatch => {
  dispatch({
    type: SAVE_MATERIAL,
    payload: matData
  })
};

export const saveItems = (items) => dispatch => {
  dispatch({
    type: SAVE_ITEMS,
    payload: items
  })
};

export const saveItem = (item) => dispatch => {
  dispatch({
    type: SAVE_ITEM,
    payload: item
  })
};

export const clearWorkOrder = () => dispatch => {
  dispatch({
    type: CLEAR_WO
  })
};