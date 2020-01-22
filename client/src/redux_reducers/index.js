import { combineReducers } from 'redux';
import authReducer from './authReducer';
import friendReducer from './friendReducer';
import chatReducer from './chatReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  auth: authReducer,
  friends: friendReducer,
  chats: chatReducer,
  profile: profileReducer
});