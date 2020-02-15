import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import woReducer from '../components/workorder/woReducer';
import woListReducer from '../components/workorder/woListReducer';
import configReducer from './configReducer';
import profileReducer from './profileReducer';
import materialReducer from '../components/materials/materialReducer';
import customerReducer from '../components/customer/customerReducer';
import customerListReducer from '../components/customer/customerListReducer';


export default combineReducers({
  item: itemReducer,
  error: errorReducer,
  auth: authReducer,
  wo: woReducer,
  wolist: woListReducer,
  config: configReducer,
  profile: profileReducer,
  material:materialReducer,
  customer:customerReducer,
  customerlist:customerListReducer
});
