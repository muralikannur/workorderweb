import { SET_CURRENT_ITEM,  SET_CURRENT_REMARK } from './types';

// SET CURRENT ITEM
export const setCurrentItem = (i) => {
  return {
    type: SET_CURRENT_ITEM,
    payload: i
  };
};

// SET CURRENT REMARK
export const setCurrentRemark = (i) => {
  return {
    type: SET_CURRENT_REMARK,
    payload: i
  };
};