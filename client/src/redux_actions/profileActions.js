import app from 'firebase/app';
import 'firebase/database';
import { SET_AVATAR } from "./types";

/**
 * @param {string} key
 * @param {string} dataUrl
 */
const setAvatar = (key, dataUrl) => ({
  type: SET_AVATAR,
  payload: { key, dataUrl }
});

/**
 * @param {string} userKey
 */
export const getAvatar = (userKey) => (dispatch) => {
  app.database().ref('profile-photos').child(userKey).child('avatar')
    .once("value", (avatarSnapShot) => {
      dispatch(setAvatar("avatar", avatarSnapShot.val()));
    });
};

/**
 * @param {string} userKey
 * @param {string} key
 * @param {string} dataUrl
 */
export const updateProfilePic = (userKey, key, dataUrl) => (dispatch) => {
  app.database().ref('profile-photos').child(userKey).child('avatar')
    .set(dataUrl, (err) => {
      if (err) return console.log(err);

      dispatch(setAvatar(key, dataUrl));
    });
}