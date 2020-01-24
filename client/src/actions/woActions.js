import axios from 'axios';
import { GET_WO, SAVE_MAIN, GET_WO_LIST, SAVE_MATERIAL, SAVE_ITEMS, CREATE_WO, ADD_WO_TO_LIST } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { getMaterial } from './materialActions';
import { notify_error, notify_success } from '../util';

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
          date:res.data.date
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
      //dispatch(returnErrors(err.response.data, err.response.status))
      }
    );
};

export const saveWorkOrder = wo => (dispatch, getState) => {
  const {status} = wo;
  axios
    .post('/api/wo', wo, tokenConfig(getState))
    .then(res =>{
      if(res.status == 200){
        dispatch({
          type: SAVE_MAIN,
          status
        });


        notify_success('Saved successfully...');
      } else {
        notify_error('ERROR while saving...');
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