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
export const getProfilePic = (userKey, key) => async (dispatch) => {
  await app.database().ref('profile-photos')
    .child(userKey).child(key).once("value")
    .then((picSnapShot) => {
      dispatch(setProfilePic(key, picSnapShot.val()));
    });
};

/**
 * @param {string} userKey
 * @param {string} key
 * @param {string} dataUrl
 */
export const updateProfilePic = (userKey, key, dataUrl, dataUrlSmall = "") => async (dispatch) => {
  const profileRef = app.database().ref('profile-photos').child(userKey);

  await profileRef.child(key)
    .set(dataUrl)
    .then(async () => {
      if (dataUrlSmall) {
        await profileRef.child("avatar-small")
          .set(dataUrlSmall)
          .then(() => dispatch(setProfilePic(key, dataUrl)))
          .catch((err) => console.log(err));
      } else {
        dispatch(setProfilePic(key, dataUrl));
      }
    })
    .catch((err) => console.log(err));
}