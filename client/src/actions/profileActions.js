import axios from 'axios';
import { GET_PROFILE, SAVE_PROFILE } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';
import { notify_error, notify_success } from '../Utils/commonUtls';

export const saveProfile = profile => (dispatch, getState) => {
  axios
    .post('/api/profile', profile, tokenConfig(getState))
    .then(res =>{
      if(res.status == 200){
        dispatch({
          type: SAVE_PROFILE,
          payload: res.data
        })
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

export const getProfile = id => (dispatch, getState) => {
  axios
    .get('/api/profile/' + id, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};
