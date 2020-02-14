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
export const getFriends = (userKey) => async (dispatch) => {
  await axios.post('/api/friends', { userKey })
    .then(async (res) => {
      const friends = res.data.data;
      dispatch(setFriends(friends));

      const friendsWithAvatars = {};
      const avatarPromises = Object.keys(friends)
        .map(
          (friendKey) => app.database().ref("profile-photos")
            .child(friendKey)
            .child("avatar-small")
            .once("value")
        );

      await Promise.all(avatarPromises)
        .then((avatarSnapShots) => {
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
export const addFriend = (userKey, friendKey, friendData) => async (dispatch) => {
  await axios.post('/api/friends/add', {
    userKey,
    friendKey,
    friend: friendData
  }).then((res) => dispatch(setFriend(res.data.data)))
    .catch((err) => console.error(err));
};


