import { combineReducers } from 'redux';
import itemReducer from './itemReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import woReducer from './woReducer';
import woListReducer from './woListReducer';
import configReducer from './configReducer';
import profileReducer from './profileReducer';
import materialReducer from './materialReducer';
import customerReducer from './customerReducer';
import customerListReducer from './customerListReducer';


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
