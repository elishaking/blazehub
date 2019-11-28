import app from 'firebase/app';
import 'firebase/database';
import { SET_PROFILE_PIC } from "./types";

/**
 * @param {string} key
 * @param {string} dataUrl
 */
const setProfilePic = (key, dataUrl) => ({
  type: SET_PROFILE_PIC,
  payload: { key, dataUrl }
});

/**
 * @param {string} userKey
 * @param {string} key
 */
export const getProfilePic = (userKey, key) => (dispatch) => {
  app.database().ref('profile-photos').child(userKey).child(key)
    .once("value", (picSnapShot) => {
      dispatch(setProfilePic(key, picSnapShot.val()));
    });
};

/**
 * @param {string} userKey
 * @param {string} key
 * @param {string} dataUrl
 */
export const updateProfilePic = (userKey, key, dataUrl) => (dispatch) => {
  app.database().ref('profile-photos').child(userKey).child(key)
    .set(dataUrl, (err) => {
      if (err) return console.log(err);

      dispatch(setProfilePic(key, dataUrl));
    });
}