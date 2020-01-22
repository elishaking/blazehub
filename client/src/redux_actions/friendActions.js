import axios from 'axios';
import app from 'firebase/app';
import 'firebase/database';
import { SET_FRIENDS, ADD_FRIEND } from './types';

// ===ACTIONS===

export const setFriends = (friendsData) => ({
  type: SET_FRIENDS,
  payload: friendsData
});

export const setFriend = (friendData) => ({
  type: ADD_FRIEND,
  payload: friendData
});


// ===ACTION CREATORS===

// @action-type SET_FRIENDS
// @description get user friends
export const getFriends = (userKey) => (dispatch) => {
  axios.post('/api/users/friends', { userKey })
    .then((res) => {
      const friends = res.data.friends;
      dispatch(setFriends(friends));

      const friendsWithAvatars = {};
      const avatarPromises = Object.keys(friends).map((friendKey) => app.database().ref("profile-photos").child(friendKey)
        .child("avatar-small").once("value"));

      Promise.all(avatarPromises).then((avatarSnapShots) => {
        avatarSnapShots.forEach((avatarSnapShot) => {
          const friendKey = avatarSnapShot.ref.parent.key;
          friendsWithAvatars[friendKey] = {
            name: friends[friendKey].name,
            avatar: avatarSnapShot.exists() ? avatarSnapShot.val() : ""
          };
        });

        dispatch(setFriends(friendsWithAvatars));
      });
    })
    .catch((err) => console.error(err));
};

// @action-type ADD_FRIEND
// @description add new friend
export const addFriend = (userKey, friendKey, friendData) => (dispatch) => {
  axios.post('/api/users/friends/add', {
    userKey,
    friendKey,
    friend: friendData
  }).then((res) => dispatch(setFriend(res.data.friend)))
    .catch((err) => console.error(err));
};


