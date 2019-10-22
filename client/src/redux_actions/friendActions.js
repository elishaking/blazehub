import axios from 'axios';
import { SET_FRIENDS } from './types';

// ===ACTIONS===

export const setFriends = (friendsData) => ({
  type: SET_FRIENDS,
  payload: friendsData
});


// ===ACTION CREATORS===

// @action-type SET_FRIENDS
// @description get user friends
export const getFriends = (userKey) => (dispatch) => {
  axios.post('/api/users/friends', { userKey })
    .then((res) => dispatch(setFriends(res.data.friends)))
    .catch((err) => console.error(err));
};

