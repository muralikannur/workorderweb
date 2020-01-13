import axios from 'axios';
import { SAVE_EDGEBANDS,  SAVE_BOARDS,  SAVE_LAMINATES,  SAVE_MATERIALCODES,  SAVE_PROFILES, GET_MATERIAL } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { notify_error, notify_success } from '../util';

export const saveMaterial = material => (dispatch, getState) => {
  axios
    .post('/api/material', material, tokenConfig(getState))
    .then(res =>{
      if(res.status == 200){
        //alert('Saved successfully...');
      } else {
        notify_error('ERROR while saving...');
      }
    }
    )
    .catch(err =>
      {
        notify_error('ERROR while saving...');
      dispatch(returnErrors(err.response.data, err.response.status))
      }
    );
};

export const getMaterial = id => (dispatch, getState) => {
  axios
    .get('/api/material/' + id, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_MATERIAL,
        payload: res.data
      })
    )
    .catch(err =>{
     // dispatch(returnErrors(err.response.data, err.response.status))
    }
    );
};


export const saveBoards = (boards) => dispatch => {
  dispatch({
    type: SAVE_BOARDS,
    payload: boards
  })
};

export const saveLaminates = (laminates) => dispatch => {
  dispatch({
    type: SAVE_LAMINATES,
    payload: laminates
  })
};

export const saveMaterialCodes = (codes) => dispatch => {
  dispatch({
    type: SAVE_MATERIALCODES,
    payload: codes
  })
};

export const saveProfiles = (profiles) => dispatch => {
  dispatch({
    type: SAVE_PROFILES,
    payload: profiles
  })
};

export const saveMaterialEdgeBands = (edgebands) => dispatch => {
  dispatch({
    type: SAVE_EDGEBANDS,
    payload: edgebands
  })
};