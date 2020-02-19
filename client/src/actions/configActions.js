import { SET_CURRENT_ITEM,  SET_CURRENT_REMARK, SET_CURRENT_CUSTOMER, SET_CURRENT_MATERIAL_TAB } from './types';

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

// SET CURRENT CUSTOMER
export const setCurrentCustomer = (customer) => {
  return {
    type: SET_CURRENT_CUSTOMER,
    payload: customer
  };
};

// SET CURRENT CUSTOMER
export const setMaterialTab = (matTab) => {
  return {
    type: SET_CURRENT_MATERIAL_TAB,
    payload: matTab
  };
};
