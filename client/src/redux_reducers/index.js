import { combineReducers } from 'redux';
import authReducer from './authReducer';
import friendReducer from './friendReducer';

export default combineReducers({
  auth: authReducer,
  friends: friendReducer
});