import app from 'firebase/app';
import 'firebase/database';
import { SET_AVATAR } from "./types";

const setAvatar = (avatarDataUrl) => ({
  type: SET_AVATAR,
  payload: avatarDataUrl
});

export const getAvatar = (userKey) => (dispatch) => {
  app.database().ref('profile-photos').child(userKey).child('avatar')
    .once("value", (avatarSnapShot) => {
      dispatch(setAvatar(avatarSnapShot.val()));
    });
};

export const updateAvatar = (userKey, newAvatar) => (dispatch) => {
  app.database().ref('profile-photos').child(userKey).child('avatar')
    .set(newAvatar, (err) => {
      if (err) return console.log(err);

      dispatch(setAvatar(newAvatar));
    });
}